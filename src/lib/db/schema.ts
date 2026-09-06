import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  numeric,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── Profiles ──────────────────────────────────────────────────────────────────
export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  fullName: text("full_name"),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Businesses ────────────────────────────────────────────────────────────────
export const businesses = pgTable("businesses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(), // References static category slug
  address: text("address"),
  city: text("city").notNull().default("Huntington Park"),
  state: text("state").notNull().default("CA"),
  zip: text("zip").notNull().default("90255"),
  googlePlaceId: text("google_place_id").unique(),
  phone: text("phone"),
  website: text("website"),
  hours: jsonb("hours").$type<Record<string, string>>(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  coverImage: text("cover_image"),
  logo: text("logo"),
  gallery: text("gallery")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().default("pending"), // pending | published | rejected | draft
  isFeatured: boolean("is_featured").notNull().default(false),
  isClaimed: boolean("is_claimed").notNull().default(false),
  claimedBy: uuid("claimed_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  submittedBy: uuid("submitted_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Business Claims ───────────────────────────────────────────────────────────
export const businessClaims = pgTable("business_claims", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Real Estate Listings ──────────────────────────────────────────────────────
export const realEstateListings = pgTable("real_estate_listings", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  address: text("address").notNull(),
  city: text("city").notNull().default("Huntington Park"),
  state: text("state").notNull().default("CA"),
  zip: text("zip").notNull().default("90255"),
  price: integer("price"), // in cents
  propertyType: text("property_type").notNull(), // house | condo | apartment | townhouse | land | commercial
  bedrooms: integer("bedrooms"),
  bathrooms: numeric("bathrooms", { precision: 3, scale: 1 }),
  sqft: integer("sqft"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  description: text("description"),
  mainImage: text("main_image"),
  gallery: text("gallery")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  externalUrl: text("external_url"), // for affiliate links
  source: text("source"), // 'manual' | 'affiliate' | partner name
  affiliateSource: text("affiliate_source"), // future affiliate provider
  status: text("status").notNull().default("draft"), // active | sold | pending | draft
  createdBy: uuid("created_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Type exports ──────────────────────────────────────────────────────────────
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
export type BusinessClaim = typeof businessClaims.$inferSelect;
export type NewBusinessClaim = typeof businessClaims.$inferInsert;
export type RealEstateListing = typeof realEstateListings.$inferSelect;
export type NewRealEstateListing = typeof realEstateListings.$inferInsert;
