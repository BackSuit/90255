import { ListingCard } from "./listing-card";
import type { RealEstateListing } from "@/lib/db/schema";

interface ListingGridProps {
  listings: RealEstateListing[];
  emptyMessage?: string;
}

export function ListingGrid({
  listings,
  emptyMessage = "No listings available",
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
