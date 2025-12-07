"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Mail,
  Newspaper,
  Rocket,
  Users,
} from "lucide-react";
import Link from "next/link";

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

export function NavMenu() {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) =>
        item.items ? (
          <DropdownMenu key={item.title}>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent/50",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              {item.title}
              <ChevronDownIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              {item.items.map((subItem) => {
                const Icon = subItem.icon;
                return (
                  <DropdownMenuItem key={subItem.href} asChild>
                    <Link
                      href={subItem.href}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {Icon && (
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-normal">{subItem.title}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={item.title}
            href={item.href || "#"}
            className={cn(
              "inline-flex items-center px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            )}
          >
            {item.title}
          </Link>
        )
      )}
    </nav>
  );
}
