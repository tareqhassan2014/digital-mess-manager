"use client";

import { MobileNav } from "@/components/marketing/mobile-nav";
import { NavAuthButtons } from "@/components/marketing/nav-auth-buttons";
import { NavMenu } from "@/components/marketing/nav-menu";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link
              href="/"
              className="text-lg font-bold text-foreground hover:text-foreground/80 transition-colors"
            >
              Latent Talent Hostel
            </Link>
          </div>

          {/* Center section: Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <NavMenu />
          </div>

          {/* Right section: Theme Toggle + Auth Buttons */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <NavAuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}
