"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function NavAuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session) {
    return <UserMenu />;
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="lg" className="font-medium">
        <Link href="/login">Log In</Link>
      </Button>
      <Button asChild size="lg" className="font-medium">
        <Link href="/register">Sign Up</Link>
      </Button>
    </div>
  );
}
