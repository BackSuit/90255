export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ListingGrid } from "@/components/real-estate/listing-grid";
import { getActiveListings } from "@/actions/real-estate";
import { ZIP_CODE, CITY, STATE_SHORT, STATE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Real Estate in ${ZIP_CODE} | ${CITY}, ${STATE_SHORT}`,
  description: `Browse homes, apartments, and properties for sale in ${ZIP_CODE}, ${CITY}, ${STATE}. Find your next home.`,
};

export default async function RealEstatePage() {
  const listings = await getActiveListings(50);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Real Estate" }]} />

      <h1 className="text-3xl font-bold mb-2">
        Real Estate in {ZIP_CODE}
      </h1>
      <p className="text-muted-foreground mb-8">
        Browse homes, apartments, and properties in {CITY}, {STATE_SHORT}
      </p>

      <ListingGrid
        listings={listings}
        emptyMessage="No real estate listings available at the moment. Check back soon!"
      />
    </div>
  );
}
