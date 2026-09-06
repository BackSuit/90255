export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { getAllClaims, updateClaimStatus } from "@/actions/claims";
import { db } from "@/lib/db";
import { businesses, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ClaimActions } from "@/components/admin/claim-actions";

export default async function AdminClaimsPage() {
  const claims = await getAllClaims();

  // Fetch related data
  const enrichedClaims = await Promise.all(
    claims.map(async (claim) => {
      const business = await db.query.businesses.findFirst({
        where: eq(businesses.id, claim.businessId),
      });
      const user = await db.query.profiles.findFirst({
        where: eq(profiles.id, claim.userId),
      });
      return { ...claim, business, user };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Business Claims ({claims.length})
      </h1>

      {claims.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No claims submitted
        </div>
      ) : (
        <div className="space-y-4">
          {enrichedClaims.map((claim) => (
            <div key={claim.id} className="rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      {claim.business?.name ?? "Unknown Business"}
                    </h3>
                    <Badge
                      variant={
                        claim.status === "pending"
                          ? "secondary"
                          : claim.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {claim.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Claimant:</strong>{" "}
                    {claim.user?.email ?? "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Message:</strong> {claim.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted{" "}
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {claim.status === "pending" && (
                  <ClaimActions
                    claimId={claim.id}
                    updateAction={updateClaimStatus}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
