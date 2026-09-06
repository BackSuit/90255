"use server";

import { db } from "@/lib/db";
import { businessClaims, businesses } from "@/lib/db/schema";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { businessClaimSchema } from "@/lib/validations";
import { eq, desc, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitClaim(formData: FormData) {
  const user = await requireAuth();

  const raw = Object.fromEntries(formData);
  const parsed = businessClaimSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Check if user already has a pending claim for this business
  const existingClaim = await db.query.businessClaims.findFirst({
    where: and(
      eq(businessClaims.businessId, parsed.data.businessId),
      eq(businessClaims.userId, user.id),
      eq(businessClaims.status, "pending")
    ),
  });

  if (existingClaim) {
    return { error: { businessId: ["You already have a pending claim for this business"] } };
  }

  await db.insert(businessClaims).values({
    businessId: parsed.data.businessId,
    userId: user.id,
    message: parsed.data.message,
    status: "pending",
  });

  revalidatePath("/admin/claims");
  redirect("/claim-business?submitted=true");
}

export async function updateClaimStatus(
  claimId: string,
  status: "approved" | "rejected",
  adminNotes?: string
) {
  await requireAdmin();

  const claim = await db.query.businessClaims.findFirst({
    where: eq(businessClaims.id, claimId),
  });

  if (!claim) throw new Error("Claim not found");

  await db
    .update(businessClaims)
    .set({ status, adminNotes: adminNotes || null, updatedAt: new Date() })
    .where(eq(businessClaims.id, claimId));

  // If approved, mark business as claimed
  if (status === "approved") {
    await db
      .update(businesses)
      .set({
        isClaimed: true,
        claimedBy: claim.userId,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, claim.businessId));
  }

  revalidatePath("/admin/claims");
  revalidatePath("/businesses");
}

export async function getPendingClaims() {
  return db
    .select()
    .from(businessClaims)
    .where(eq(businessClaims.status, "pending"))
    .orderBy(desc(businessClaims.createdAt));
}

export async function getAllClaims() {
  return db
    .select()
    .from(businessClaims)
    .orderBy(desc(businessClaims.createdAt));
}

export async function getPendingClaimCount() {
  const result = await db
    .select({ count: count() })
    .from(businessClaims)
    .where(eq(businessClaims.status, "pending"));
  return result[0]?.count ?? 0;
}
