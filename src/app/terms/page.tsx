import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME}`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-sm text-muted-foreground">
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">1. Acceptance of Terms</h2>
        <p>By accessing and using 90255.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">2. Use of Service</h2>
        <p>90255.com is a local business directory and community portal. You may use the service to discover businesses, submit business listings, and browse real estate information in the 90255 ZIP code area.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">3. User Accounts</h2>
        <p>You are responsible for maintaining the security of your account. You must not use another person&apos;s account without permission. You agree to provide accurate information when creating an account or submitting a business listing.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">4. Business Listings</h2>
        <p>Business listings are submitted by users and business owners. We reserve the right to approve, reject, edit, or remove any listing at our discretion. We do not guarantee the accuracy of business information.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">5. Disclaimer</h2>
        <p>90255.com is provided &quot;as is&quot; without warranties of any kind. We are not affiliated with the City of Huntington Park, USPS, or any government entity. Real estate listings are for informational purposes only and may include affiliate links to third-party services.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">6. Contact</h2>
        <p>For questions about these terms, please contact us at hello@90255.com.</p>
      </div>
    </div>
  );
}
