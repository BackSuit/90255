import { Suspense } from "react";
import { ClaimBusinessForm } from "./claim-form";
import { getSession } from "@/lib/auth";

export default async function ClaimBusinessPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ClaimBusinessForm isAuthenticated={!!session} />
    </Suspense>
  );
}
