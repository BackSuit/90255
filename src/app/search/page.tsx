export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BusinessGrid } from "@/components/business/business-grid";
import { SearchBar } from "@/components/business/search-bar";
import { searchBusinesses } from "@/actions/businesses";
import { ZIP_CODE, CITY, STATE_SHORT } from "@/lib/constants";

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const title = q
    ? `Search: "${q}" | ${ZIP_CODE}`
    : `Search Businesses | ${ZIP_CODE}`;
  return { title, description: `Search local businesses in ${CITY}, ${STATE_SHORT} ${ZIP_CODE}` };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, category } = await searchParams;
  const query = q || "";
  const results = query || category ? await searchBusinesses(query, category) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Search" }]} />

      <h1 className="text-3xl font-bold mb-2">Search Businesses</h1>
      <p className="text-muted-foreground mb-6">
        Find businesses and services in {CITY}, {STATE_SHORT} {ZIP_CODE}
      </p>

      <div className="mb-8">
        <SearchBar defaultValue={query} size="large" />
      </div>

      {query && (
        <p className="text-sm text-muted-foreground mb-4">
          {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      <BusinessGrid
        businesses={results}
        emptyMessage={
          query
            ? `No businesses found for "${query}". Try a different search term.`
            : "Enter a search term to find businesses."
        }
      />
    </div>
  );
}
