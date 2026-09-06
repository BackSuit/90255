import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {CATEGORIES.filter((c) => c.slug !== "other").map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.slug}
            href={`/businesses/category/${category.slug}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:border-primary/30 hover:bg-accent transition-all duration-200"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
