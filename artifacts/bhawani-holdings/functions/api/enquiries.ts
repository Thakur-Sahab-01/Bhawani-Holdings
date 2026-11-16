type EnquiryType = "construction" | "property" | "subcontractor" | "partner";

type D1Result = {
  success: boolean;
  meta?: { last_row_id?: number };
};

type D1Statement = {
  bind: (...values: unknown[]) => D1Statement;
  run: () => Promise<D1Result>;
};

type EnquiryDatabase = {
  prepare: (query: string) => D1Statement;
};

type PagesContext = {
  request: Request;
  env: { ENQUIRIES_DB?: EnquiryDatabase };
};

const allowedTypes = new Set<EnquiryType>([
  "construction",
  "property",
  "subcontractor",
  "partner",
]);

const limits: Record<string, number> = {
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

const allowedFields: Record<EnquiryType, string[]> = {
  construction: ["name", "phone", "email", "location", "workType", "projectSize", "message"],
  property: ["name", "phone", "email", "propertyType", "location", "budget", "message"],
  subcontractor: ["name", "phone", "email", "specialization", "location", "experience", "message"],
  partner: ["name", "phone", "email", "company", "partnershipType", "location", "message"],
};

function json(data: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function onRequestPost({ request, env }: PagesContext) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ error: "This enquiry could not be accepted from this site." }, 403);
    } catch {
      return json({ error: "This enquiry could not be accepted from this site." }, 403);
    }
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ error: "Please submit the enquiry using the website form." }, 415);
  }
  let rawPayload: string;
  try {
    rawPayload = await request.text();
  } catch {
    return json({ error: "Please check the enquiry details and try again." }, 400);
  }
  if (new TextEncoder().encode(rawPayload).byteLength > 12_000) {
    return json({ error: "The enquiry is too large." }, 413);
  }
  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return json({ error: "Please check the enquiry details and try again." }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ error: "Please check the enquiry details and try again." }, 400);
  }
  const { type, fields } = payload as { type?: unknown; fields?: unknown };
  if (typeof type !== "string" || !allowedTypes.has(type as EnquiryType) ||
      !fields || typeof fields !== "object" || Array.isArray(fields)) {
    return json({ error: "Please check the enquiry details and try again." }, 400);
  }

  const formType = type as EnquiryType;
  const permitted = new Set(allowedFields[formType]);
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields as Record<string, unknown>)) {
    if (!permitted.has(key) || typeof value !== "string") {
      return json({ error: "One or more enquiry fields are invalid." }, 400);
    }
    const trimmed = value.trim();
    if (trimmed.length > (limits[key] ?? 0)) {
      return json({ error: "One or more fields are longer than allowed." }, 400);
    }
    if (trimmed) cleaned[key] = trimmed;
  }

  if (!cleaned.name || !cleaned.phone || !cleaned.email || !cleaned.message) {
    return json({ error: "Name, phone, email and message are required." }, 400);
  }
  if (!/^\+?[\d\s().-]{8,24}$/.test(cleaned.phone) || cleaned.phone.replace(/\D/g, "").length < 10) {
    return json({ error: "Enter a valid phone number with at least 10 digits." }, 400);
  }
  if (cleaned.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
    return json({ error: "Enter a valid email address." }, 400);
  }
  if (!env.ENQUIRIES_DB) {
    return json({ error: "The enquiry service is not configured yet. Please contact us directly." }, 503);
  }

  try {
    const result = await env.ENQUIRIES_DB.prepare(
      "INSERT INTO enquiries (type, fields) VALUES (?1, ?2)",
    ).bind(formType, JSON.stringify(cleaned)).run();
    if (!result.success || !result.meta?.last_row_id) {
      return json({ error: "The enquiry could not be stored. Please try again." }, 500);
    }
    return json({ id: result.meta.last_row_id, status: "received" }, 201);
  } catch {
    return json({ error: "The enquiry could not be stored. Please try again." }, 500);
  }
}
