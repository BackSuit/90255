"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { signup } from "@/actions/auth";

export default function SignupPage() {
  const [error, setError] = useState<string | Record<string, string[]>>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === "string") return error;
    // Format field errors
    const msgs: string[] = [];
    Object.entries(error).forEach(([field, errors]) => {
      if (errors.length > 0) msgs.push(`${field}: ${errors[0]}`);
    });
    return msgs.join(", ");
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground mb-4">
          <MapPin className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground mt-1">
          Join 90255.com to submit and claim businesses
        </p>
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{getErrorMessage()}</p>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="flex justify-center text-sm">
          <Link
            href="/auth/login"
            className="text-primary hover:underline"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
