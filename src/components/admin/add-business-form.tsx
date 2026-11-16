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
import { adminCreateBusiness } from "@/actions/businesses";
import { ImageUpload, MultiImageUpload } from "@/components/shared/image-upload";

export function AddBusinessForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Record<string, string[]>>({});

  const [coverImage, setCoverImage] = useState("");
  const [logo, setLogo] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const handleSubmit = (formData: FormData) => {
    setError({});
    startTransition(async () => {
      const result = await adminCreateBusiness(formData);
      if (result?.error) {
        setError(result.error as Record<string, string[]>);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="name">Business Name *</Label>
            <Input id="name" name="name" required placeholder="Business name" />
            {error.name && (
              <p className="text-sm text-destructive mt-1">{error.name[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select name="category" defaultValue="restaurants">
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
            <Select name="status" defaultValue="published">
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
              placeholder="Brief description of the business..."
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="123 Pacific Blvd" />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue="Huntington Park" />
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
            <Input id="phone" name="phone" type="tel" placeholder="(323) 555-0123" />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" placeholder="https://example.com" />
          </div>

          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" name="latitude" type="number" step="any" placeholder="33.9803" />
          </div>

          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" name="longitude" type="number" step="any" placeholder="-118.2251" />
          </div>

          <div className="md:col-span-2">
            <Label>Cover Image</Label>
            <input type="hidden" name="coverImage" value={coverImage} />
            <ImageUpload value={coverImage} onChange={setCoverImage} folder="businesses" />
          </div>

          <div className="md:col-span-2">
            <Label>Logo</Label>
            <input type="hidden" name="logo" value={logo} />
            <ImageUpload value={logo} onChange={setLogo} folder="businesses" />
          </div>

          <div className="md:col-span-2">
            <Label>Gallery</Label>
            <input type="hidden" name="gallery" value={gallery.join(",")} />
            <MultiImageUpload value={gallery} onChange={setGallery} folder="businesses" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            value="true"
            className="rounded border"
          />
          <Label htmlFor="isFeatured" className="cursor-pointer">
            Featured Business
          </Label>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Business"}
      </Button>
    </form>
  );
}
