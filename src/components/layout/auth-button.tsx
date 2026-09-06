import Link from "next/link";
import { LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { logout } from "@/actions/auth";

export async function AuthButton() {
  const user = await getSession();

  if (user) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <Shield className="h-4 w-4" />
          </Link>
        </Button>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/auth/login">
        <LogIn className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    </Button>
  );
}
