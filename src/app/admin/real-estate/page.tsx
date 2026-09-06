export const dynamic = "force-dynamic";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllListings, deleteListing } from "@/actions/real-estate";
import { formatPrice } from "@/lib/utils";
import { PROPERTY_TYPES } from "@/lib/constants";
import { AdminActionButtons } from "@/components/admin/action-buttons";
import { Plus } from "lucide-react";

export default async function AdminRealEstatePage() {
  const listings = await getAllListings();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Real Estate Listings</h1>
        <Button asChild size="sm">
          <Link href="/admin/real-estate/new">
            <Plus className="h-4 w-4 mr-1" />
            Add Listing
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">{listing.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {listing.address}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">
                      {PROPERTY_TYPES.find(
                        (t) => t.value === listing.propertyType
                      )?.label ?? listing.propertyType}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {listing.price
                      ? formatPrice(listing.price)
                      : "—"}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        listing.status === "active"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {listing.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <AdminActionButtons
                      id={listing.id}
                      deleteAction={deleteListing}
                      editHref={`/admin/real-estate/${listing.id}`}
                    />
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No listings yet
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
