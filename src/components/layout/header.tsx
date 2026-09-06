import Link from "next/link";
import { MapPin, Menu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { DOMAIN_SALE_URL } from "@/lib/constants";
import { AuthButton } from "@/components/layout/auth-button";

const navLinks = [
  { href: "/businesses", label: "Businesses" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/submit-business", label: "Submit Business" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top bar — domain CTA */}
      <div className="bg-primary text-primary-foreground text-center text-sm py-1.5 px-4">
        <Link
          href={DOMAIN_SALE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:underline font-medium"
        >
          <span>90255.com is available for acquisition</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Main nav */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-foreground">
            90255<span className="text-primary">.com</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <AuthButton />
          <Button asChild size="sm" variant="outline" className="border-amber text-amber-800 hover:bg-amber-light">
            <Link href="/domain-for-sale">Buy This Domain</Link>
          </Button>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2">
          <AuthButton />
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center size-9 rounded-lg hover:bg-muted transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-lg font-bold">90255.com</SheetTitle>
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/domain-for-sale"
                  className="text-base font-medium text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Buy This Domain
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
