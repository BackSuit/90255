export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Navigation,
  Flag,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BusinessGrid } from "@/components/business/business-grid";
import { getBusinessBySlug, getRelatedBusinesses } from "@/actions/businesses";
import { getCategoryBySlug } from "@/lib/categories";
import { formatPhoneNumber, getDirectionsUrl, absoluteUrl } from "@/lib/utils";
import { CITY, STATE_SHORT, ZIP_CODE } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: "Business Not Found" };

  const category = getCategoryBySlug(business.category);
  const title = `${business.name} | ${category?.name ?? ""} in ${ZIP_CODE}`;
  const description =
    business.description ||
    `${business.name} — ${category?.name ?? "Business"} in ${CITY}, ${STATE_SHORT} ${ZIP_CODE}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/businesses/${slug}`),
      ...(business.coverImage ? { images: [business.coverImage] } : {}),
    },
    alternates: { canonical: absoluteUrl(`/businesses/${slug}`) },
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business || business.status !== "published") {
    notFound();
  }

  const category = getCategoryBySlug(business.category);
  const related = await getRelatedBusinesses(business.category, business.slug);
  const fullAddress = [business.address, business.city, business.state, business.zip]
    .filter(Boolean)
    .join(", ");

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip,
    },
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.website ? { url: business.website } : {}),
    ...(business.coverImage ? { image: business.coverImage } : {}),
    ...(business.latitude && business.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Businesses", href: "/businesses" },
            ...(category
              ? [
                  {
                    label: category.name,
                    href: `/businesses/category/${category.slug}`,
                  },
                ]
              : []),
            { label: business.name },
          ]}
        />

        {/* Cover Image */}
        {business.coverImage && (
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
            <Image
              src={business.coverImage}
              alt={business.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-4">
              {business.logo && (
                <div className="relative h-16 w-16 rounded-xl border overflow-hidden shrink-0">
                  <Image
                    src={business.logo}
                    alt={`${business.name} logo`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {business.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {category && (
                    <Badge variant="secondary">{category.name}</Badge>
                  )}
                  {business.isClaimed && (
                    <Badge
                      variant="outline"
                      className="text-primary border-primary"
                    >
                      ✓ Claimed
                    </Badge>
                  )}
                  {business.isFeatured && (
                    <Badge className="bg-amber text-amber-900 border-0">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {business.description && (
              <>
                <Separator className="my-4" />
                <div>
                  <h2 className="font-semibold text-lg mb-2">About</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {business.description}
                  </p>
                </div>
              </>
            )}

            {/* Gallery */}
            {business.gallery && business.gallery.length > 0 && (
              <>
                <Separator className="my-4" />
                <h2 className="font-semibold text-lg mb-3">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {business.gallery.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`${business.name} photo ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Hours */}
            {business.hours &&
              Object.keys(business.hours).length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h2 className="font-semibold text-lg mb-3">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Business Hours
                  </h2>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(business.hours).map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between py-1.5 text-sm"
                      >
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-muted-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact Card */}
            <div className="rounded-xl border p-5 space-y-4">
              <h3 className="font-semibold">Contact & Location</h3>

              {business.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-sm">{fullAddress}</span>
                </div>
              )}

              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={`tel:${business.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {formatPhoneNumber(business.phone)}
                  </a>
                </div>
              )}

              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate"
                  >
                    {business.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
              )}

              {business.address && (
                <Button asChild className="w-full">
                  <a
                    href={getDirectionsUrl(
                      fullAddress,
                      business.latitude?.toString(),
                      business.longitude?.toString()
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </a>
                </Button>
              )}
            </div>

            {/* Map */}
            {business.latitude && business.longitude && (
              <div className="rounded-xl border overflow-hidden">
                <iframe
                  title={`Map of ${business.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(business.longitude) - 0.005}%2C${Number(business.latitude) - 0.003}%2C${Number(business.longitude) + 0.005}%2C${Number(business.latitude) + 0.003}&layer=mapnik&marker=${business.latitude}%2C${business.longitude}`}
                  width="100%"
                  height="250"
                  className="border-0"
                  loading="lazy"
                />
              </div>
            )}

            {/* Claim CTA */}
            {!business.isClaimed && (
              <div className="rounded-xl border p-5 bg-muted/30">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Own this business?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Claim this listing to update your information and manage your
                  business profile.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/claim-business?id=${business.id}`}>
                    Claim This Business
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Businesses */}
        {related.length > 0 && (
          <div className="mt-12">
            <Separator className="mb-8" />
            <h2 className="text-xl font-bold mb-6">
              More {category?.name ?? "Businesses"} in {ZIP_CODE}
            </h2>
            <BusinessGrid businesses={related} />
          </div>
        )}
      </div>
    </>
  );
}
