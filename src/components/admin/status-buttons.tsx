"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface StatusButtonsProps {
  id: string;
  updateAction: (id: string, status: string) => Promise<void>;
  approveLabel?: string;
  rejectLabel?: string;
}

export function StatusButtons({
  id,
  updateAction,
  approveLabel = "Approve",
  rejectLabel = "Reject",
}: StatusButtonsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() =>
          startTransition(() => updateAction(id, "published"))
        }
        disabled={isPending}
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
        {approveLabel}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() =>
          startTransition(() => updateAction(id, "rejected"))
        }
        disabled={isPending}
      >
        <XCircle className="h-3.5 w-3.5 mr-1" />
        {rejectLabel}
      </Button>
    </div>
  );
}
