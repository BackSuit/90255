"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { submitClaim } from "@/actions/claims";
import { CheckCircle2, Flag } from "lucide-react";

export function ClaimBusinessForm({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [error, setError] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id") || "";
  const submitted = searchParams.get("submitted") === "true";

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Claim Submitted!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you! We&apos;ll review your claim and get back to you shortly.
        </p>
        <Button asChild>
          <Link href="/businesses">Browse Businesses</Link>
        </Button>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Sign in required</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to claim a business.
        </p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setError({});
    const result = await submitClaim(formData);
    if (result?.error) {
      setError(result.error as Record<string, string[]>);
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Breadcrumbs items={[{ label: "Claim Business" }]} />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
          <Flag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Claim a Business</h1>
          <p className="text-muted-foreground text-sm">
            Prove you own or manage this business to take control of its listing
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6 rounded-xl border p-6">
        <div>
          <Label htmlFor="businessId">Business ID</Label>
          <Input
            id="businessId"
            name="businessId"
            value={businessId}
            readOnly={!!businessId}
            placeholder="Enter the business ID"
            required
          />
          {!businessId && (
            <p className="text-xs text-muted-foreground mt-1">
              You can find the business ID from the business page URL or by
              contacting us.
            </p>
          )}
          {error.businessId && (
            <p className="text-sm text-destructive mt-1">
              {error.businessId[0]}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="message">
            Tell us why you should be the owner of this listing *
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            placeholder="I am the owner/manager of this business. My role is... I can verify by..."
            required
            minLength={10}
          />
          {error.message && (
            <p className="text-sm text-destructive mt-1">
              {error.message[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Claim"}
        </Button>
      </form>
    </div>
  );
}
