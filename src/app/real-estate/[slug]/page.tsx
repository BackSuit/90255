export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getListingBySlug } from "@/actions/real-estate";
import { formatPrice, absoluteUrl, getDirectionsUrl } from "@/lib/utils";
import { PROPERTY_TYPES, ZIP_CODE, CITY, STATE_SHORT } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Listing Not Found" };

  const title = `${listing.title} | Real Estate in ${ZIP_CODE}`;
  const description =
    listing.description ||
    `${listing.title} — ${listing.address}, ${CITY}, ${STATE_SHORT}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/real-estate/${slug}`),
      ...(listing.mainImage ? { images: [listing.mainImage] } : {}),
    },
    alternates: { canonical: absoluteUrl(`/real-estate/${slug}`) },
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing || (listing.status !== "active" && listing.status !== "sold")) {
    notFound();
  }

  const propertyLabel =
    PROPERTY_TYPES.find((t) => t.value === listing.propertyType)?.label ??
    listing.propertyType;
  const fullAddress = [listing.address, listing.city, listing.state, listing.zip]
    .filter(Boolean)
    .join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description,
    url: absoluteUrl(`/real-estate/${slug}`),
    ...(listing.mainImage ? { image: listing.mainImage } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
    },
    ...(listing.price
      ? {
          offers: {
            "@type": "Offer",
            price: listing.price / 100,
            priceCurrency: "USD",
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
            { label: "Real Estate", href: "/real-estate" },
            { label: listing.title },
          ]}
        />

        {/* Main Image */}
        {listing.mainImage && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
            <Image
              src={listing.mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge>{propertyLabel}</Badge>
                  {listing.status === "sold" && (
                    <Badge variant="secondary">Sold</Badge>
                  )}
                </div>
              </div>
              {listing.price && (
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {formatPrice(listing.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{fullAddress}</span>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              {listing.bedrooms != null && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{listing.bedrooms}</div>
                    <div className="text-xs text-muted-foreground">Beds</div>
                  </div>
                </div>
              )}
              {listing.bathrooms != null && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{listing.bathrooms}</div>
                    <div className="text-xs text-muted-foreground">Baths</div>
                  </div>
                </div>
              )}
              {listing.sqft != null && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">
                      {listing.sqft.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
              )}
            </div>

            {listing.description && (
              <>
                <Separator className="my-4" />
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {listing.description}
                </p>
              </>
            )}

            {/* Gallery */}
            {listing.gallery && listing.gallery.length > 0 && (
              <>
                <Separator className="my-4" />
                <h2 className="font-semibold text-lg mb-3">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.gallery.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`${listing.title} photo ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border p-5 space-y-4">
              {listing.externalUrl && (
                <Button asChild className="w-full" size="lg">
                  <a
                    href={listing.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Full Listing
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <a
                  href={getDirectionsUrl(
                    fullAddress,
                    listing.latitude?.toString(),
                    listing.longitude?.toString()
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Listed{" "}
                {new Date(listing.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              {listing.source && listing.source !== "manual" && (
                <p className="text-xs text-muted-foreground">
                  Source: {listing.source}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
