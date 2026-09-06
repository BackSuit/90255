export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { getPendingBusinesses, updateBusinessStatus } from "@/actions/businesses";
import { getCategoryName } from "@/lib/categories";
import { StatusButtons } from "@/components/admin/status-buttons";

export default async function AdminSubmissionsPage() {
  const submissions = await getPendingBusinesses();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Pending Submissions ({submissions.length})
      </h1>

      {submissions.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No pending submissions
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((biz) => (
            <div key={biz.id} className="rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{biz.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(biz.category)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Submitted{" "}
                      {new Date(biz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {biz.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {biz.description}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {biz.address && <div>📍 {biz.address}, {biz.city}, {biz.state} {biz.zip}</div>}
                    {biz.phone && <div>📞 {biz.phone}</div>}
                    {biz.website && <div>🌐 {biz.website}</div>}
                  </div>
                </div>
                <StatusButtons
                  id={biz.id}
                  updateAction={updateBusinessStatus}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
