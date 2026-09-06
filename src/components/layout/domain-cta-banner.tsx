import Link from "next/link";
import { ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOMAIN_SALE_URL } from "@/lib/constants";

export function DomainCtaBanner() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-10 px-4">
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mb-4">
          <Globe className="h-6 w-6" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Own 90255.com
        </h2>
        <p className="text-primary-foreground/90 mb-6 max-w-lg mx-auto">
          An exact ZIP-code domain for Huntington Park, California. Perfect for
          a local business directory, real estate portal, or community platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold"
          >
            <Link
              href={DOMAIN_SALE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy 90255.com
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link href="/domain-for-sale">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
