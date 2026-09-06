"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { createBusiness } from "@/actions/businesses";
import { CATEGORIES } from "@/lib/categories";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function SubmitBusinessForm({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [error, setError] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Show submitted success message
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  if (searchParams?.get("submitted") === "true") {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Business Submitted!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you! Your business has been submitted for review. Our team will
          review and publish it shortly.
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
          Please sign in to submit a business listing.
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
    const result = await createBusiness(formData);
    if (result?.error) {
      setError(result.error as Record<string, string[]>);
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Breadcrumbs items={[{ label: "Submit Business" }]} />

      <h1 className="text-3xl font-bold mb-2">Submit a Business</h1>
      <p className="text-muted-foreground mb-8">
        Add a local business in Huntington Park, CA 90255 to the directory.
        Submissions are reviewed before publishing.
      </p>

      <form action={handleSubmit} className="space-y-6 rounded-xl border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="name">Business Name *</Label>
            <Input id="name" name="name" required placeholder="Business name" />
            {error.name && (
              <p className="text-sm text-destructive mt-1">{error.name[0]}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="category">Category *</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Brief description of the business..."
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Pacific Blvd"
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue="Huntington Park"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue="CA" />
            </div>
            <div>
              <Label htmlFor="zip">ZIP</Label>
              <Input id="zip" name="zip" defaultValue="90255" />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(323) 555-0123"
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              placeholder="33.9803"
            />
          </div>

          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              placeholder="-118.2251"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              name="logo"
              type="url"
              placeholder="https://example.com/logo.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="gallery">Gallery URLs (comma-separated)</Label>
            <Textarea
              id="gallery"
              name="gallery"
              rows={3}
              placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Business"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting, you confirm this is a legitimate business and the
          information is accurate to the best of your knowledge.
        </p>
      </form>
    </div>
  );
}
