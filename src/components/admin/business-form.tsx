"use client";

import { useTransition, useState } from "react";
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
import { CATEGORIES } from "@/lib/categories";
import { BUSINESS_STATUS } from "@/lib/constants";
import { updateBusiness } from "@/actions/businesses";
import type { Business } from "@/lib/db/schema";

interface AdminBusinessFormProps {
  business: Business;
}

export function AdminBusinessForm({ business }: AdminBusinessFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setSaved(false);
    startTransition(async () => {
      await updateBusiness(business.id, formData);
      setSaved(true);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={business.name}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={business.category}>
              <SelectTrigger>
                <SelectValue />
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

          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={business.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BUSINESS_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
              defaultValue={business.description || ""}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={business.address || ""}
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={business.city}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={business.state}
              />
            </div>
            <div>
              <Label htmlFor="zip">ZIP</Label>
              <Input id="zip" name="zip" defaultValue={business.zip} />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={business.phone || ""}
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              defaultValue={business.website || ""}
            />
          </div>

          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              defaultValue={business.latitude?.toString() || ""}
            />
          </div>

          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              defaultValue={business.longitude?.toString() || ""}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="url"
              defaultValue={business.coverImage || ""}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              name="logo"
              type="url"
              defaultValue={business.logo || ""}
              placeholder="https://example.com/logo.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="gallery">Gallery URLs (comma-separated)</Label>
            <Textarea
              id="gallery"
              name="gallery"
              rows={3}
              defaultValue={business.gallery?.join(", ") || ""}
              placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            value="true"
            defaultChecked={business.isFeatured}
            className="rounded border"
          />
          <Label htmlFor="isFeatured" className="cursor-pointer">
            Featured Business
          </Label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <span className="text-sm text-primary">✓ Saved</span>
        )}
      </div>
    </form>
  );
}
