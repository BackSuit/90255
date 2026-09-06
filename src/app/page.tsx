export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, MapPin, Building2, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/business/search-bar";
import { CategoryGrid } from "@/components/business/category-grid";
import { BusinessGrid } from "@/components/business/business-grid";
import { ListingGrid } from "@/components/real-estate/listing-grid";
import { DomainCtaBanner } from "@/components/layout/domain-cta-banner";
import { getRecentBusinesses, getFeaturedBusinesses } from "@/actions/businesses";
import { getActiveListings } from "@/actions/real-estate";
import {
  CITY,
  STATE,
  ZIP_CODE,
  COUNTY,
} from "@/lib/constants";

export default async function HomePage() {
  const [featuredBusinesses, recentBusinesses, listings] = await Promise.all([
    getFeaturedBusinesses(4),
    getRecentBusinesses(8),
    getActiveListings(6),
  ]);

  const displayBusinesses =
    featuredBusinesses.length > 0 ? featuredBusinesses : recentBusinesses;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <MapPin className="h-3.5 w-3.5" />
            {CITY}, {STATE} — {ZIP_CODE}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Everything in{" "}
            <span className="text-primary">90255</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover businesses, services, and real estate in {CITY},{" "}
            {STATE}.
          </p>
          <div className="flex justify-center mb-8">
            <SearchBar size="large" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" />
              Local Businesses
            </Link>
            <span>•</span>
            <Link
              href="/real-estate"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Real Estate
            </Link>
            <span>•</span>
            <Link
              href="/submit-business"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              Add Your Business
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/businesses">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Businesses */}
      {displayBusinesses.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {featuredBusinesses.length > 0
                  ? "Featured Businesses"
                  : "Recent Businesses"}
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/businesses">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <BusinessGrid businesses={displayBusinesses.slice(0, 8)} />
          </div>
        </section>
      )}

      {/* Real Estate */}
      {listings.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Real Estate in {ZIP_CODE}
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/real-estate">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ListingGrid listings={listings} />
          </div>
        </section>
      )}

      {/* About 90255 */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">
            About {ZIP_CODE} — {CITY}, {STATE}
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground">
              ZIP code 90255 covers {CITY}, a vibrant city in{" "}
              {COUNTY}, {STATE}. Known for its diverse community and
              thriving small businesses, {CITY} is home to a rich mix of
              restaurants, shops, and professional services. The city is
              conveniently located in the heart of the Los Angeles metropolitan
              area, with easy access to major freeways and public transit.
            </p>
            <p className="text-muted-foreground">
              90255.com is your local guide to everything happening in{" "}
              {CITY}. Whether you&apos;re looking for a great restaurant,
              need a reliable mechanic, or searching for your next home, we help
              connect residents and visitors with the best local businesses and
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Domain CTA */}
      <DomainCtaBanner />
    </>
  );
}
