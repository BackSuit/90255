import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { CITY, STATE, ZIP_CODE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact 90255.com — the local guide to ${CITY}, ${STATE} ${ZIP_CODE}.`,
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-6">
        <p className="text-muted-foreground">
          Have a question, suggestion, or need help with your business listing?
          We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-6">
            <Mail className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-muted-foreground">
              For general inquiries and support:
            </p>
            <a
              href="mailto:hello@90255.com"
              className="text-sm text-primary hover:underline mt-2 block"
            >
              hello@90255.com
            </a>
          </div>

          <div className="rounded-xl border p-6">
            <MapPin className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Coverage Area</h3>
            <p className="text-sm text-muted-foreground">
              We cover ZIP code {ZIP_CODE}:
            </p>
            <p className="text-sm mt-2">
              {CITY}, {STATE}
            </p>
          </div>
        </div>

        <div className="rounded-xl border p-6 bg-muted/30">
          <h3 className="font-semibold mb-2">Business Listings</h3>
          <p className="text-sm text-muted-foreground">
            To add or update a business listing, please use our{" "}
            <a href="/submit-business" className="text-primary hover:underline">
              Submit Business
            </a>{" "}
            form. To claim an existing listing, visit our{" "}
            <a href="/claim-business" className="text-primary hover:underline">
              Claim Business
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
