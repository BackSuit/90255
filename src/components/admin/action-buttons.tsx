"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Star, Trash2 } from "lucide-react";

interface AdminActionButtonsProps {
  id: string;
  slug?: string;
  isFeatured?: boolean;
  toggleFeaturedAction?: (id: string) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  editHref?: string;
}

export function AdminActionButtons({
  id,
  slug,
  isFeatured,
  toggleFeaturedAction,
  deleteAction,
  editHref,
}: AdminActionButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this?")) return;
    startTransition(() => deleteAction(id));
  };

  const handleToggleFeatured = () => {
    if (toggleFeaturedAction) {
      startTransition(() => toggleFeaturedAction(id));
    }
  };

  return (
    <div className="flex items-center gap-1 justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        asChild
      >
        <Link href={editHref || `/admin/businesses/${id}`}>
          <Pencil className="h-3.5 w-3.5" />
        </Link>
      </Button>
      {toggleFeaturedAction && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleFeatured}
          disabled={isPending}
          title={isFeatured ? "Remove featured" : "Mark featured"}
        >
          <Star
            className={`h-3.5 w-3.5 ${isFeatured ? "fill-amber text-amber" : ""}`}
          />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
