"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Mail,
  Menu,
  Newspaper,
  Rocket,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface NavItem {
  title: string;
  href?: string;
  items?: {
    title: string;
    href: string;
    icon?: LucideIcon;
  }[];
}

const navItems: NavItem[] = [
  {
    title: "Product",
    items: [
      {
        title: "Database",
        href: "/product/database",
        icon: Database,
      },
      {
        title: "Branching",
        href: "/product/branching",
        icon: GitBranch,
      },
      {
        title: "Autoscaling",
        href: "/product/autoscaling",
        icon: Gauge,
      },
    ],
  },
  {
    title: "Solutions",
    items: [
      {
        title: "Startups",
        href: "/solutions/startups",
        icon: Rocket,
      },
      {
        title: "Enterprise",
        href: "/solutions/enterprise",
        icon: Building2,
      },
      {
        title: "Agencies",
        href: "/solutions/agencies",
        icon: Users,
      },
    ],
  },
  {
    title: "Docs",
    href: "/docs",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Company",
    items: [
      {
        title: "Blog",
        href: "/blog",
        icon: Newspaper,
      },
      {
        title: "About us",
        href: "/about",
        icon: FileText,
      },
      {
        title: "Careers",
        href: "/careers",
        icon: Briefcase,
      },
      {
        title: "Contact",
        href: "/contact",
        icon: Mail,
      },
    ],
  },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleItem = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <>
                  <button
                    onClick={() => toggleItem(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                    )}
                  >
                    {item.title}
                    <span
                      className={cn(
                        "transition-transform",
                        expandedItems.includes(item.title) && "rotate-180"
                      )}
                    >
                      ▼
                    </span>
                  </button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.items.map((subItem) => {
                        const Icon = subItem.icon;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="font-medium">{subItem.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
