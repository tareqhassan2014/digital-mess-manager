"use client";

import { useSession } from "next-auth/react";
import { LoginButton } from "./login-button";
import { UserMenu } from "./user-menu";

export function AuthSection() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  return session ? <UserMenu /> : <LoginButton />;
}
