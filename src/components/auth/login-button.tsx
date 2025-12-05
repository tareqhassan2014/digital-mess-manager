"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginButton() {
  return (
    <Button asChild variant="ghost">
      <Link href="/login">Login</Link>
    </Button>
  );
}
