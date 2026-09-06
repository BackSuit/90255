export const SITE_NAME = "90255.com";
export const SITE_DESCRIPTION =
  "Discover businesses, services, and real estate in Huntington Park, California.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://90255.com";

export const ZIP_CODE = "90255";
export const CITY = "Huntington Park";
export const STATE = "California";
export const STATE_SHORT = "CA";
export const COUNTY = "Los Angeles County";

export const DOMAIN_SALE_URL =
  "https://www.godaddy.com/en-ph/domainsearch/find?domainToCheck=90255";

export const DEFAULT_COORDS = {
  lat: 33.9817,
  lng: -118.2251,
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
export const MAX_GALLERY_IMAGES = 10;

export const BUSINESS_STATUS = {
  PENDING: "pending",
  PUBLISHED: "published",
  REJECTED: "rejected",
  DRAFT: "draft",
} as const;

export const CLAIM_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const LISTING_STATUS = {
  ACTIVE: "active",
  SOLD: "sold",
  PENDING: "pending",
  DRAFT: "draft",
} as const;

export const PROPERTY_TYPES = [
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "apartment", label: "Apartment" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
] as const;

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;
