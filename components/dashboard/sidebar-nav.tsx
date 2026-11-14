"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  LayoutDashboard,
  Wrench,
  Settings,
  Sparkles,
  ExternalLink,
  Package,
  Activity,
  CreditCard,
  Share2,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  exact?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: Bot,
    badge: "Runtime",
  },
  {
    title: "Tool Catalog",
    href: "/tools",
    icon: Wrench,
    badge: "Phase 4",
  },
  {
    title: "Plugins",
    href: "/plugins",
    icon: Package,
    badge: "Phase 8",
  },
  {
    title: "Observability",
    href: "/observability",
    icon: Activity,
    badge: "Phase 10",
  },
  {
    title: "Billing & Plans",
    href: "/billing",
    icon: CreditCard,
    badge: "Pro",
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: Share2,
    badge: "Social",
  },
  {
    title: "Settings",
    href: "/settings/workspace",
    icon: Settings,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-1 px-3 py-4">
        <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      active ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status Pill at the bottom */}
      <div className="p-4 border-t bg-muted/30">
        <div className="rounded-xl border bg-card p-3 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">Meow Engine</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            ReAct Loop, Tool Sandboxing & Human Approvals Active
          </p>
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
            <span>Next.js 16 + Neon</span>
            <span className="font-mono">v0.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

