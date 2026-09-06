import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  BUSINESS_STATUS,
  CLAIM_STATUS,
  LISTING_STATUS,
} from "./constants";
import { CATEGORY_SLUGS } from "./categories";

// ─── Business ──────────────────────────────────────────────────────────────────
export const businessSubmissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(CATEGORY_SLUGS),
  address: z.string().max(500).optional(),
  city: z.string().max(100).default("Huntington Park"),
  state: z.string().max(2).default("CA"),
  zip: z.string().max(10).default("90255"),
  phone: z.string().max(20).optional(),
  website: z.string().url("Must be a valid URL").max(500).optional().or(z.literal("")),
  hours: z.record(z.string(), z.string()).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  gallery: z.string().optional(), // We'll accept comma-separated URLs
});

export const businessUpdateSchema = businessSubmissionSchema.extend({
  status: z.enum([
    BUSINESS_STATUS.PENDING,
    BUSINESS_STATUS.PUBLISHED,
    BUSINESS_STATUS.REJECTED,
    BUSINESS_STATUS.DRAFT,
  ]),
  isFeatured: z.boolean().default(false),
});

export type BusinessSubmission = z.infer<typeof businessSubmissionSchema>;
export type BusinessUpdate = z.infer<typeof businessUpdateSchema>;

// ─── Business Claim ────────────────────────────────────────────────────────────
export const businessClaimSchema = z.object({
  businessId: z.string().uuid(),
  message: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(2000),
});

export type BusinessClaimInput = z.infer<typeof businessClaimSchema>;

// ─── Real Estate Listing ───────────────────────────────────────────────────────
export const realEstateSchema = z.object({
  title: z.string().min(5).max(300),
  address: z.string().min(5).max(500),
  city: z.string().max(100).default("Huntington Park"),
  state: z.string().max(2).default("CA"),
  zip: z.string().max(10).default("90255"),
  price: z.coerce.number().int().positive().optional(),
  propertyType: z.enum([
    "house",
    "condo",
    "apartment",
    "townhouse",
    "land",
    "commercial",
  ]),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  sqft: z.coerce.number().int().positive().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  description: z.string().max(5000).optional(),
  mainImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  gallery: z.string().optional(), // Comma-separated URLs
  externalUrl: z.string().url().optional().or(z.literal("")),
  source: z.string().max(100).optional(),
  affiliateSource: z.string().max(100).optional(),
  status: z
    .enum([
      LISTING_STATUS.ACTIVE,
      LISTING_STATUS.SOLD,
      LISTING_STATUS.PENDING,
      LISTING_STATUS.DRAFT,
    ])
    .default(LISTING_STATUS.DRAFT),
});

export type RealEstateInput = z.infer<typeof realEstateSchema>;

// ─── Image Upload ──────────────────────────────────────────────────────────────
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      `File size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Accepted formats: ${ACCEPTED_IMAGE_TYPES.map((t) => t.split("/")[1]).join(", ")}`
    ),
});

// ─── Search ────────────────────────────────────────────────────────────────────
export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
});
