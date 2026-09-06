export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BusinessGrid } from "@/components/business/business-grid";
import { CategoryGrid } from "@/components/business/category-grid";
import { SearchBar } from "@/components/business/search-bar";
import { getBusinesses } from "@/actions/businesses";
import { ZIP_CODE, CITY, STATE_SHORT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Businesses in ${ZIP_CODE} | ${CITY}, ${STATE_SHORT}`,
  description: `Browse local businesses and services in ${ZIP_CODE}, ${CITY}, ${STATE_SHORT}. Find restaurants, auto repair, healthcare, and more.`,
};

export default async function BusinessesPage() {
  const businesses = await getBusinesses({ limit: 50 });

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Businesses" }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Businesses in {ZIP_CODE}
          </h1>
          <p className="text-muted-foreground mt-1">
            {CITY}, {STATE_SHORT} — {businesses.length} businesses listed
          </p>
        </div>
        <div className="flex gap-3">
          <SearchBar />
          <Button asChild>
            <Link href="/submit-business">Add Business</Link>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <CategoryGrid />
      </div>

      <BusinessGrid
        businesses={businesses}
        emptyMessage="No businesses listed yet. Be the first to add your business!"
      />
    </div>
  );
}
