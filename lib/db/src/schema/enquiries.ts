import { jsonb, pgEnum, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const enquiryType = pgEnum("enquiry_type", [
  "construction",
  "property",
  "subcontractor",
  "partner",
]);

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  type: enquiryType("type").notNull(),
  fields: jsonb("fields").$type<Record<string, string>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
