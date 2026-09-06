"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Database } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDatabaseError =
    error.message.includes("Failed query") ||
    error.message.includes("connect") ||
    error.message.includes("database");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-6">
        {isDatabaseError ? (
          <Database className="h-10 w-10" />
        ) : (
          <AlertTriangle className="h-10 w-10" />
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {isDatabaseError
          ? "Database Connection Error"
          : "Something went wrong!"}
      </h1>

      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        {isDatabaseError
          ? "We're having trouble connecting to the database. Please ensure your DATABASE_URL environment variable is correct and your database is running."
          : error.message || "An unexpected error occurred while loading this page."}
      </p>

      <div className="flex items-center gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
