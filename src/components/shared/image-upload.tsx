"use client";

import { useState } from "react";
import { uploadImageAction } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder: "businesses" | "real-estate" | "uploads";
}

export function ImageUpload({ value, onChange, folder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const result = await uploadImageAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        onChange(result.url);
      }
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Upload preview"
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-6 w-6"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="w-full max-w-sm"
          />
          {isUploading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder: "businesses" | "real-estate" | "uploads";
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    setError(null);

    const newUrls = [...(value || [])];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const result = await uploadImageAction(formData);
        if (result.error) {
          setError(result.error);
        } else if (result.url) {
          newUrls.push(result.url);
        }
      } catch (err) {
        setError("Failed to upload image");
      }
    }

    onChange(newUrls);
    setIsUploading(false);
    if (e.target) e.target.value = ''; // Reset input
  };

  const removeImage = (indexToRemove: number) => {
    onChange((value || []).filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {(value || []).map((url, index) => (
          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Gallery ${index}`} className="object-cover w-full h-full" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
          className="w-full max-w-sm"
        />
        {isUploading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
