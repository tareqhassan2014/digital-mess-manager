"use client";

import { AuthSection } from "@/components/auth/auth-section";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold text-foreground hover:text-foreground/80 transition-colors"
          >
            Latent Talent Hostel
          </Link>

          {/* Right side: Theme Toggle + Auth */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <AuthSection />
          </div>
        </div>
      </div>
    </nav>
  );
}
