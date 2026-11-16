import { Router, type IRouter } from "express";
import { db, enquiriesTable } from "@workspace/db";
import { CreateEnquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();
const recentRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const allowedTypes = new Set(["construction", "property", "subcontractor", "partner"]);
const fieldLimits: Record<string, number> = {
  name: 120,
  phone: 32,
  email: 254,
  location: 160,
  workType: 120,
  projectSize: 100,
  propertyType: 120,
  budget: 100,
  message: 4000,
  specialization: 120,
  experience: 1000,
  company: 160,
  partnershipType: 120,
};
const allowedFields: Record<string, Set<string>> = {
  construction: new Set(["name", "phone", "email", "location", "workType", "projectSize", "message"]),
  property: new Set(["name", "phone", "email", "propertyType", "location", "budget", "message"]),
  subcontractor: new Set(["name", "phone", "email", "specialization", "location", "experience", "message"]),
  partner: new Set(["name", "phone", "email", "company", "partnershipType", "location", "message"]),
};

function isValidPhone(phone: string) {
  return /^\+?[\d\s().-]{8,24}$/.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/enquiries", async (req, res) => {
  if (!req.is("application/json")) {
    res.status(415).json({ error: "Please submit the enquiry using the website form." });
    return;
  }

  const origin = req.get("origin");
  const host = req.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        res.status(403).json({ error: "This enquiry could not be accepted from this site." });
        return;
      }
    } catch {
      res.status(403).json({ error: "This enquiry could not be accepted from this site." });
      return;
    }
  }

  const forwarded = req.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwarded || req.ip || "unknown";
  const now = Date.now();
  const recent = (recentRequests.get(clientKey) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    res.status(429).json({ error: "Too many enquiries were sent. Please try again later." });
    return;
  }

  const parsed = CreateEnquiryBody.safeParse(req.body);
  if (!parsed.success || !allowedTypes.has(parsed.data.type)) {
    res.status(400).json({ error: "Please check the enquiry details and try again." });
    return;
  }

  const { type, fields } = parsed.data;
  const cleanedFields: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!allowedFields[type]?.has(key)) {
      res.status(400).json({ error: "One or more enquiry fields are invalid." });
      return;
    }
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (trimmed.length > (fieldLimits[key] ?? 500)) {
      res.status(400).json({ error: "One or more fields are longer than allowed." });
      return;
    }
    cleanedFields[key] = trimmed;
  }

  if (!cleanedFields.name || !cleanedFields.phone || !cleanedFields.email || !cleanedFields.message) {
    res.status(400).json({ error: "Name, phone, email and message are required." });
    return;
  }
  if (!isValidPhone(cleanedFields.phone)) {
    res.status(400).json({ error: "Enter a valid phone number with at least 10 digits." });
    return;
  }
  if (!isValidEmail(cleanedFields.email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  recentRequests.set(clientKey, [...recent, now]);

  try {
    const [record] = await db
      .insert(enquiriesTable)
      .values({ type: type as "construction" | "property" | "subcontractor" | "partner", fields: cleanedFields })
      .returning({ id: enquiriesTable.id });
    if (!record) {
      res.status(500).json({ error: "The enquiry could not be stored. Please try again." });
      return;
    }
    req.log.info({ enquiryId: record.id, enquiryType: type }, "Website enquiry stored");
    res.status(201).json({ id: record.id, status: "received" });
  } catch (error) {
    req.log.error({ err: error }, "Could not store website enquiry");
    res.status(500).json({ error: "The enquiry could not be stored. Please try again." });
  }
});

export default router;
