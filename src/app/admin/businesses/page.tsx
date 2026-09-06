export const dynamic = "force-dynamic";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllBusinesses, deleteBusiness, toggleFeatured } from "@/actions/businesses";
import { getCategoryName } from "@/lib/categories";
import { AdminActionButtons } from "@/components/admin/action-buttons";

export default async function AdminBusinessesPage() {
  const businesses = await getAllBusinesses();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Businesses</h1>
        <span className="text-sm text-muted-foreground">
          {businesses.length} total
        </span>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Business</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Featured</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">{biz.name}</div>
                    <div className="text-xs text-muted-foreground">
                      /{biz.slug}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(biz.category)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        biz.status === "published"
                          ? "default"
                          : biz.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {biz.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {biz.isFeatured ? "⭐" : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <AdminActionButtons
                      id={biz.id}
                      slug={biz.slug}
                      isFeatured={biz.isFeatured}
                      toggleFeaturedAction={toggleFeatured}
                      deleteAction={deleteBusiness}
                    />
                  </td>
                </tr>
              ))}
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No businesses yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
