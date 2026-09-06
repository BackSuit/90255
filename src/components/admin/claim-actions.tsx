"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface ClaimActionsProps {
  claimId: string;
  updateAction: (
    claimId: string,
    status: "approved" | "rejected",
    adminNotes?: string
  ) => Promise<void>;
}

export function ClaimActions({ claimId, updateAction }: ClaimActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() =>
          startTransition(() => updateAction(claimId, "approved"))
        }
        disabled={isPending}
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() =>
          startTransition(() => updateAction(claimId, "rejected"))
        }
        disabled={isPending}
      >
        <XCircle className="h-3.5 w-3.5 mr-1" />
        Reject
      </Button>
    </div>
  );
}
