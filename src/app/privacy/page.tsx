import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}`,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-sm text-muted-foreground">
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">1. Information We Collect</h2>
        <p>We collect information you provide when creating an account (email, name), submitting a business listing, or contacting us. We also collect standard web analytics data (page views, browser type, IP address).</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">2. How We Use Your Information</h2>
        <p>We use your information to operate the directory, manage your account, process business submissions, and improve our services. We do not sell your personal information to third parties.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">3. Authentication</h2>
        <p>We use Supabase for authentication. When you sign in with Google, we receive your public profile information (name, email, profile picture). Your password is never stored by us when using email authentication — it is managed securely by our authentication provider.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">4. Business Information</h2>
        <p>Business information submitted to the directory is intended to be publicly visible. Do not submit private or sensitive information through business listings.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">5. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We may use analytics cookies to understand site usage.</p>

        <h2 className="text-lg font-semibold text-foreground mt-6">6. Contact</h2>
        <p>For privacy-related inquiries, please contact us at hello@90255.com.</p>
      </div>
    </div>
  );
}
