export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { businesses, realEstateListings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/businesses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/real-estate`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/domain-for-sale`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/submit-business`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/businesses/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Published business pages
  const publishedBusinesses = await db
    .select({ slug: businesses.slug, updatedAt: businesses.updatedAt })
    .from(businesses)
    .where(eq(businesses.status, "published"));

  const businessPages: MetadataRoute.Sitemap = publishedBusinesses.map((biz) => ({
    url: `${baseUrl}/businesses/${biz.slug}`,
    lastModified: biz.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Active real estate listings
  const activeListings = await db
    .select({ slug: realEstateListings.slug, updatedAt: realEstateListings.updatedAt })
    .from(realEstateListings)
    .where(eq(realEstateListings.status, "active"));

  const listingPages: MetadataRoute.Sitemap = activeListings.map((listing) => ({
    url: `${baseUrl}/real-estate/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...businessPages, ...listingPages];
}
