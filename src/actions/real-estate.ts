"use server";

import { db } from "@/lib/db";
import { realEstateListings } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { realEstateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { eq, desc, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createListing(formData: FormData) {
  const { user } = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = realEstateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let slug = slugify(data.title);

  const existing = await db.query.realEstateListings.findFirst({
    where: eq(realEstateListings.slug, slug),
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const galleryArray = data.gallery ? data.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];

  await db.insert(realEstateListings).values({
    ...data,
    slug,
    price: data.price || null,
    bathrooms: data.bathrooms?.toString() || null,
    latitude: data.latitude?.toString() ?? null,
    longitude: data.longitude?.toString() ?? null,
    mainImage: data.mainImage || null,
    gallery: galleryArray,
    externalUrl: data.externalUrl || null,
    source: data.source || "manual",
    affiliateSource: data.affiliateSource || null,
    createdBy: user.id,
  });

  revalidatePath("/real-estate");
  revalidatePath("/admin/real-estate");
}

export async function updateListing(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = realEstateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const galleryArray = data.gallery ? data.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];

  await db
    .update(realEstateListings)
    .set({
      ...data,
      price: data.price || null,
      bathrooms: data.bathrooms?.toString() || null,
      latitude: data.latitude?.toString() ?? null,
      longitude: data.longitude?.toString() ?? null,
      mainImage: data.mainImage || null,
      gallery: galleryArray,
      externalUrl: data.externalUrl || null,
      source: data.source || "manual",
      affiliateSource: data.affiliateSource || null,
      updatedAt: new Date(),
    })
    .where(eq(realEstateListings.id, id));

  revalidatePath("/real-estate");
  revalidatePath("/admin/real-estate");
}

export async function deleteListing(id: string) {
  await requireAdmin();
  await db.delete(realEstateListings).where(eq(realEstateListings.id, id));
  revalidatePath("/real-estate");
  revalidatePath("/admin/real-estate");
}

export async function updateListingImages(
  id: string,
  field: "mainImage",
  url: string | null
) {
  await requireAdmin();
  await db
    .update(realEstateListings)
    .set({ [field]: url, updatedAt: new Date() })
    .where(eq(realEstateListings.id, id));
  revalidatePath("/real-estate");
}

export async function updateListingGallery(id: string, gallery: string[]) {
  await requireAdmin();
  await db
    .update(realEstateListings)
    .set({ gallery, updatedAt: new Date() })
    .where(eq(realEstateListings.id, id));
  revalidatePath("/real-estate");
}

// ─── Queries ───────────────────────────────────────────────────────────────────

export async function getActiveListings(limit = 20) {
  return db
    .select()
    .from(realEstateListings)
    .where(eq(realEstateListings.status, "active"))
    .orderBy(desc(realEstateListings.createdAt))
    .limit(limit);
}

export async function getListingBySlug(slug: string) {
  return db.query.realEstateListings.findFirst({
    where: eq(realEstateListings.slug, slug),
  });
}

export async function getAllListings() {
  return db
    .select()
    .from(realEstateListings)
    .orderBy(desc(realEstateListings.createdAt));
}

export async function getListingCount(status?: string) {
  const conditions = status
    ? [eq(realEstateListings.status, status)]
    : [];
  const result = await db
    .select({ count: count() })
    .from(realEstateListings)
    .where(conditions.length ? and(...conditions) : undefined);
  return result[0]?.count ?? 0;
}
