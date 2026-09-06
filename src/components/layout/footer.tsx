import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { DOMAIN_SALE_URL, SITE_NAME } from "@/lib/constants";

const footerLinks = {
  Directory: [
    { href: "/businesses", label: "All Businesses" },
    { href: "/real-estate", label: "Real Estate" },
    { href: "/submit-business", label: "Submit a Business" },
    { href: "/claim-business", label: "Claim a Business" },
    { href: "/search", label: "Search" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl mb-3"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span>
                90255<span className="text-primary">.com</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Your local guide to 90255 and Huntington Park, California.
              Discover businesses, services, and real estate in the community.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-light/50 border border-amber/20 max-w-md">
              <div className="shrink-0">
                <ExternalLink className="h-4 w-4 text-amber-700" />
              </div>
              <p className="text-sm">
                <span className="font-semibold text-amber-800">
                  90255.com is available for acquisition.
                </span>{" "}
                <Link
                  href={DOMAIN_SALE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2"
                >
                  Buy This Domain →
                </Link>
              </p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {title === "Company" && (
                  <li>
                    <Link
                      href="/domain-for-sale"
                      className="text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
                    >
                      Domain for Sale
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Not affiliated with the City of Huntington Park, USPS, or any
            government entity.
          </p>
        </div>
      </div>
    </footer>
  );
}
