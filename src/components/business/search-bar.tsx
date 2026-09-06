"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: "default" | "large";
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search businesses, services, restaurants...",
  size = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search
          className={`absolute left-3 text-muted-foreground ${isLarge ? "h-5 w-5 left-4" : "h-4 w-4"}`}
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${isLarge ? "h-14 pl-12 pr-28 text-base rounded-xl" : "h-10 pl-9 pr-20 rounded-lg"} border-2 focus-visible:ring-primary/20`}
        />
        <Button
          type="submit"
          size={isLarge ? "lg" : "sm"}
          className={`absolute right-1.5 ${isLarge ? "h-10 px-6" : "h-7 px-3 text-xs"}`}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
