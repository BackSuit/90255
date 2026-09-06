"use client";

import { useTransition, useState } from "react";
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
import { PROPERTY_TYPES, LISTING_STATUS } from "@/lib/constants";
import { createListing, updateListing } from "@/actions/real-estate";
import type { RealEstateListing } from "@/lib/db/schema";

interface AdminListingFormProps {
  listing?: RealEstateListing;
}

export function AdminListingForm({ listing }: AdminListingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const isNew = !listing;

  const handleSubmit = (formData: FormData) => {
    setSaved(false);
    startTransition(async () => {
      if (isNew) {
        await createListing(formData);
        router.push("/admin/real-estate");
      } else {
        await updateListing(listing.id, formData);
        setSaved(true);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={listing?.title || ""}
              required
              placeholder="3BR Home in Huntington Park"
            />
          </div>

          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              name="propertyType"
              defaultValue={listing?.propertyType || "house"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              defaultValue={listing?.status || "draft"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LISTING_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={listing?.address || ""}
              required
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={listing?.city || "Huntington Park"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={listing?.state || "CA"}
              />
            </div>
            <div>
              <Label htmlFor="zip">ZIP</Label>
              <Input
                id="zip"
                name="zip"
                defaultValue={listing?.zip || "90255"}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price (cents)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={listing?.price?.toString() || ""}
              placeholder="50000000"
            />
          </div>

          <div>
            <Label htmlFor="sqft">Square Feet</Label>
            <Input
              id="sqft"
              name="sqft"
              type="number"
              defaultValue={listing?.sqft?.toString() || ""}
            />
          </div>

          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              defaultValue={listing?.bedrooms?.toString() || ""}
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              step="0.5"
              defaultValue={listing?.bathrooms?.toString() || ""}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={listing?.description || ""}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="externalUrl">External URL (affiliate link)</Label>
            <Input
              id="externalUrl"
              name="externalUrl"
              type="url"
              defaultValue={listing?.externalUrl || ""}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              defaultValue={listing?.source || "manual"}
            />
          </div>

          <div>
            <Label htmlFor="affiliateSource">Affiliate Source</Label>
            <Input
              id="affiliateSource"
              name="affiliateSource"
              defaultValue={listing?.affiliateSource || ""}
              placeholder="Optional"
            />
          </div>

          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              defaultValue={listing?.latitude?.toString() || ""}
            />
          </div>

          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              defaultValue={listing?.longitude?.toString() || ""}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="mainImage">Main Image URL</Label>
            <Input
              id="mainImage"
              name="mainImage"
              type="url"
              defaultValue={listing?.mainImage || ""}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="gallery">Gallery URLs (comma-separated)</Label>
            <Textarea
              id="gallery"
              name="gallery"
              rows={3}
              defaultValue={listing?.gallery?.join(", ") || ""}
              placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : isNew
              ? "Create Listing"
              : "Save Changes"}
        </Button>
        {saved && (
          <span className="text-sm text-primary">✓ Saved</span>
        )}
      </div>
    </form>
  );
}
