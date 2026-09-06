import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { businesses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AdminBusinessForm } from "@/components/admin/business-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBusinessPage({ params }: Props) {
  const { id } = await params;

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.id, id),
  });

  if (!business) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit: {business.name}</h1>
      <AdminBusinessForm business={business} />
    </div>
  );
}
