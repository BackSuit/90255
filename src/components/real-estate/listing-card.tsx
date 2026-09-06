import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PROPERTY_TYPES } from "@/lib/constants";
import type { RealEstateListing } from "@/lib/db/schema";

interface ListingCardProps {
  listing: RealEstateListing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const propertyLabel =
    PROPERTY_TYPES.find((t) => t.value === listing.propertyType)?.label ??
    listing.propertyType;

  return (
    <div className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image */}
      <Link
        href={`/real-estate/${listing.slug}`}
        className="block relative h-48 bg-muted overflow-hidden"
      >
        {listing.mainImage ? (
          <Image
            src={listing.mainImage}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
            <MapPin className="h-10 w-10 text-primary/30" />
          </div>
        )}
        {listing.price && (
          <div className="absolute bottom-3 left-3 bg-foreground/80 text-background px-3 py-1 rounded-md text-lg font-bold backdrop-blur-sm">
            {formatPrice(listing.price)}
          </div>
        )}
        <Badge className="absolute top-3 right-3">{propertyLabel}</Badge>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/real-estate/${listing.slug}`}>
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {listing.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {listing.address}, {listing.city}, {listing.state}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {listing.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {listing.bedrooms} bd
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {listing.bathrooms} ba
            </span>
          )}
          {listing.sqft != null && (
            <span className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" />
              {listing.sqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        {listing.externalUrl && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <a
              href={listing.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Listing
              <ExternalLink className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
