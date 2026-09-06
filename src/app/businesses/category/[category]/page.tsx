export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BusinessGrid } from "@/components/business/business-grid";
import { SearchBar } from "@/components/business/search-bar";
import { getBusinesses } from "@/actions/businesses";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { ZIP_CODE, CITY, STATE_SHORT, STATE } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  const title = `${category.name} in ${ZIP_CODE} | ${CITY}, ${STATE}`;
  const description = category.description;

  return {
    title,
    description,
    openGraph: { title, description, url: absoluteUrl(`/businesses/category/${slug}`) },
    alternates: { canonical: absoluteUrl(`/businesses/category/${slug}`) },
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const businesses = await getBusinesses({ category: slug, limit: 50 });
  const CategoryIcon = category.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Businesses", href: "/businesses" },
          { label: category.name },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
            <CategoryIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {category.name} in {ZIP_CODE}
            </h1>
            <p className="text-muted-foreground">
              {CITY}, {STATE_SHORT} — {businesses.length} listed
            </p>
          </div>
        </div>
        <SearchBar />
      </div>

      <BusinessGrid
        businesses={businesses}
        emptyMessage={`No ${category.name.toLowerCase()} businesses listed yet. Know one? Submit it!`}
      />
    </div>
  );
}
