import { BusinessCard } from "./business-card";
import type { Business } from "@/lib/db/schema";

interface BusinessGridProps {
  businesses: Business[];
  emptyMessage?: string;
  priorityCount?: number;
}

export function BusinessGrid({
  businesses,
  emptyMessage = "No businesses found",
  priorityCount = 4,
}: BusinessGridProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {businesses.map((business, index) => {
        const isAboveFold = index < priorityCount;
        return (
          <BusinessCard
            key={business.id}
            business={business}
            priority={isAboveFold}
            loading="eager"
          />
        );
      })}
    </div>
  );
}
