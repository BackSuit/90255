import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryBySlug } from "@/lib/categories";
import { formatPhoneNumber, truncate } from "@/lib/utils";
import type { Business } from "@/lib/db/schema";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const category = getCategoryBySlug(business.category);
  const CategoryIcon = category?.icon;

  return (
    <Link
      href={`/businesses/${business.slug}`}
      className="group block rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Cover Image */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {business.coverImage ? (
          <Image
            src={business.coverImage}
            alt={business.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
            {CategoryIcon && (
              <CategoryIcon className="h-10 w-10 text-primary/30" />
            )}
          </div>
        )}
        {business.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-amber text-amber-900 border-0">
            Featured
          </Badge>
        )}
        {business.logo && (
          <div className="absolute -bottom-5 left-4 h-12 w-12 rounded-lg border-2 border-white bg-white shadow-sm overflow-hidden">
            <Image
              src={business.logo}
              alt={`${business.name} logo`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 ${business.logo ? "pt-7" : "pt-4"}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
            {business.name}
          </h3>
        </div>

        {category && (
          <Badge variant="secondary" className="text-xs mb-2">
            {category.name}
          </Badge>
        )}

        {business.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {truncate(business.description, 120)}
          </p>
        )}

        <div className="flex flex-col gap-1">
          {business.address && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">
                {business.address}, {business.city}, {business.state}
              </span>
            </div>
          )}
          {business.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{formatPhoneNumber(business.phone)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
