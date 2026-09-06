"use server";

import { db } from "@/lib/db";
import { businesses } from "@/lib/db/schema";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { businessSubmissionSchema, businessUpdateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { eq, ilike, or, and, desc, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBusiness(formData: FormData) {
  const user = await requireAuth();

  const raw = Object.fromEntries(formData);
  const parsed = businessSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let slug = slugify(data.name);

  // Ensure unique slug
  const existing = await db.query.businesses.findFirst({
    where: eq(businesses.slug, slug),
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const galleryArray = data.gallery ? data.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];

  await db.insert(businesses).values({
    ...data,
    slug,
    website: data.website || null,
    latitude: data.latitude?.toString() ?? null,
    longitude: data.longitude?.toString() ?? null,
    coverImage: data.coverImage || null,
    logo: data.logo || null,
    gallery: galleryArray,
    status: "pending",
    submittedBy: user.id,
  });

  revalidatePath("/businesses");
  redirect("/businesses?submitted=true");
}

export async function updateBusiness(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = businessUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const galleryArray = data.gallery ? data.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];

  await db
    .update(businesses)
    .set({
      ...data,
      website: data.website || null,
      latitude: data.latitude?.toString() ?? null,
      longitude: data.longitude?.toString() ?? null,
      coverImage: data.coverImage || null,
      logo: data.logo || null,
      gallery: galleryArray,
      updatedAt: new Date(),
    })
    .where(eq(businesses.id, id));

  revalidatePath("/businesses");
  revalidatePath(`/admin/businesses`);
}

export async function updateBusinessStatus(id: string, status: string) {
  await requireAdmin();

  await db
    .update(businesses)
    .set({ status, updatedAt: new Date() })
    .where(eq(businesses.id, id));

  revalidatePath("/businesses");
  revalidatePath("/admin/businesses");
  revalidatePath("/admin/submissions");
}

export async function toggleFeatured(id: string) {
  await requireAdmin();

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.id, id),
  });
  if (!business) throw new Error("Business not found");

  await db
    .update(businesses)
    .set({ isFeatured: !business.isFeatured, updatedAt: new Date() })
    .where(eq(businesses.id, id));

  revalidatePath("/businesses");
  revalidatePath("/admin/businesses");
}

export async function deleteBusiness(id: string) {
  await requireAdmin();

  await db.delete(businesses).where(eq(businesses.id, id));

  revalidatePath("/businesses");
  revalidatePath("/admin/businesses");
}

export async function updateBusinessImages(
  id: string,
  field: "coverImage" | "logo",
  url: string | null
) {
  await requireAdmin();

  await db
    .update(businesses)
    .set({ [field]: url, updatedAt: new Date() })
    .where(eq(businesses.id, id));

  revalidatePath("/businesses");
}

export async function updateBusinessGallery(id: string, gallery: string[]) {
  await requireAdmin();

  await db
    .update(businesses)
    .set({ gallery, updatedAt: new Date() })
    .where(eq(businesses.id, id));

  revalidatePath("/businesses");
}

// ─── Queries (not mutations — no "use server" needed but keeping in same file for simplicity) ──

export async function getBusinesses({
  status = "published",
  category,
  limit = 20,
  offset = 0,
}: {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const conditions = [eq(businesses.status, status)];
  if (category) {
    conditions.push(eq(businesses.category, category));
  }

  const results = await db
    .select()
    .from(businesses)
    .where(and(...conditions))
    .orderBy(desc(businesses.isFeatured), desc(businesses.createdAt))
    .limit(limit)
    .offset(offset);

  return results;
}

export async function getBusinessBySlug(slug: string) {
  return db.query.businesses.findFirst({
    where: eq(businesses.slug, slug),
  });
}

export async function getFeaturedBusinesses(limit = 6) {
  return db
    .select()
    .from(businesses)
    .where(
      and(
        eq(businesses.status, "published"),
        eq(businesses.isFeatured, true)
      )
    )
    .orderBy(desc(businesses.createdAt))
    .limit(limit);
}

export async function getRecentBusinesses(limit = 8) {
  return db
    .select()
    .from(businesses)
    .where(eq(businesses.status, "published"))
    .orderBy(desc(businesses.createdAt))
    .limit(limit);
}

export async function searchBusinesses(query: string, category?: string) {
  const conditions = [eq(businesses.status, "published")];

  if (category) {
    conditions.push(eq(businesses.category, category));
  }

  if (query) {
    conditions.push(
      or(
        ilike(businesses.name, `%${query}%`),
        ilike(businesses.description, `%${query}%`),
        ilike(businesses.category, `%${query}%`),
        ilike(businesses.address, `%${query}%`)
      )!
    );
  }

  return db
    .select()
    .from(businesses)
    .where(and(...conditions))
    .orderBy(desc(businesses.isFeatured), desc(businesses.createdAt))
    .limit(50);
}

export async function getBusinessCount(status?: string) {
  const conditions = status ? [eq(businesses.status, status)] : [];
  const result = await db
    .select({ count: count() })
    .from(businesses)
    .where(conditions.length ? and(...conditions) : undefined);
  return result[0]?.count ?? 0;
}

export async function getRelatedBusinesses(
  category: string,
  excludeSlug: string,
  limit = 4
) {
  return db
    .select()
    .from(businesses)
    .where(
      and(
        eq(businesses.status, "published"),
        eq(businesses.category, category),
        sql`${businesses.slug} != ${excludeSlug}`
      )
    )
    .orderBy(desc(businesses.isFeatured), desc(businesses.createdAt))
    .limit(limit);
}

export async function getAllBusinesses() {
  return db
    .select()
    .from(businesses)
    .orderBy(desc(businesses.createdAt));
}

export async function getPendingBusinesses() {
  return db
    .select()
    .from(businesses)
    .where(eq(businesses.status, "pending"))
    .orderBy(desc(businesses.createdAt));
}
