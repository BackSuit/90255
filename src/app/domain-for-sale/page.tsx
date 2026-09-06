import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  TrendingUp,
  Building2,
  Home,
  Search,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { DOMAIN_SALE_URL, CITY, STATE, ZIP_CODE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Buy 90255.com | Premium ZIP Code Domain",
  description:
    "90255.com is available for acquisition. An exact-match ZIP code domain for Huntington Park, California — perfect for a local portal, directory, or real estate platform.",
};

const useCases = [
  {
    icon: Building2,
    title: "Local Business Directory",
    description:
      "Dominate local search for 90255 businesses with an exact-match domain.",
  },
  {
    icon: Home,
    title: "Real Estate Portal",
    description:
      "Build a Zillow-like experience specifically for the 90255 housing market.",
  },
  {
    icon: Search,
    title: "Community Hub",
    description:
      "Create a community resource with local news, events, and services.",
  },
  {
    icon: TrendingUp,
    title: "Lead Generation",
    description:
      "Generate high-intent local leads for service businesses targeting 90255.",
  },
];

const benefits = [
  "Exact-match ZIP code domain — powerful for local SEO",
  "Serves a population of 60,000+ residents",
  "Located in the Los Angeles metro area",
  `Covers all of ${CITY}, ${STATE}`,
  "Memorable 5-digit domain — easy to share and brand",
  "Immediately brandable — no explanation needed",
  "Works for any local business or service vertical",
  "Potential for recurring revenue through local advertising",
];

export default function DomainForSalePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Domain for Sale" }]} />

      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-6">
          <Globe className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">90255</span>.com is for sale
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Own the definitive domain for ZIP code {ZIP_CODE} — {CITY},{" "}
          {STATE}. An exact-match local domain with built-in recognition and
          SEO authority.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="text-base px-8">
            <Link
              href={DOMAIN_SALE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy 90255.com
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Use Cases */}
      <section className="py-12 md:py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          What you can build with 90255.com
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border p-6 hover:border-primary/30 transition-colors"
            >
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Benefits */}
      <section className="py-12 md:py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why 90255.com?
        </h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Final CTA */}
      <section className="text-center py-12 md:py-16">
        <Sparkles className="h-8 w-8 text-amber mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">
          Ready to own 90255.com?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          This domain is listed through GoDaddy/Afternic. Click below to make
          an offer or purchase directly.
        </p>
        <Button asChild size="lg" className="text-base px-10">
          <Link
            href={DOMAIN_SALE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy 90255.com
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Listed via GoDaddy/Afternic. Secure transfer guaranteed.
        </p>
      </section>
    </div>
  );
}
