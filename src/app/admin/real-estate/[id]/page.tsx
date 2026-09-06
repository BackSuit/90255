import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { realEstateListings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AdminListingForm } from "@/components/admin/listing-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditListingPage({ params }: Props) {
  const { id } = await params;

  const listing = await db.query.realEstateListings.findFirst({
    where: eq(realEstateListings.id, id),
  });

  if (!listing) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit: {listing.title}</h1>
      <AdminListingForm listing={listing} />
    </div>
  );
}
