export const dynamic = "force-dynamic";

import Link from "next/link";
import { Building2, FileText, Flag, Home } from "lucide-react";
import { getBusinessCount } from "@/actions/businesses";
import { getPendingClaimCount } from "@/actions/claims";
import { getListingCount } from "@/actions/real-estate";

export default async function AdminDashboardPage() {
  const [totalBusinesses, pendingBusinesses, pendingClaims, totalListings] =
    await Promise.all([
      getBusinessCount(),
      getBusinessCount("pending"),
      getPendingClaimCount(),
      getListingCount(),
    ]);

  const stats = [
    {
      label: "Total Businesses",
      value: totalBusinesses,
      icon: Building2,
      href: "/admin/businesses",
    },
    {
      label: "Pending Submissions",
      value: pendingBusinesses,
      icon: FileText,
      href: "/admin/submissions",
      alert: pendingBusinesses > 0,
    },
    {
      label: "Pending Claims",
      value: pendingClaims,
      icon: Flag,
      href: "/admin/claims",
      alert: pendingClaims > 0,
    },
    {
      label: "Real Estate Listings",
      value: totalListings,
      icon: Home,
      href: "/admin/real-estate",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border p-5 hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              {stat.alert && (
                <span className="h-2 w-2 rounded-full bg-amber animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
