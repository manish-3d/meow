"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  LayoutDashboard,
  Settings,
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
    title: "Browser Automation",
    href: "/automation",
    icon: Globe,
    badge: "Studio",
  },
  {
    title: "Workflow Pipelines",
    href: "/overview",
    icon: LayoutDashboard,
    badge: "n8n Style",
    exact: true,
  },
  {
    title: "Engine Settings",
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
      <div className="space-y-1.5 px-3">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[#9E988F] uppercase">
          Workspace
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
                  active
                    ? "bg-black text-white shadow-xs"
                    : "text-[#777169] hover:bg-black/5 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-105 ${
                      active ? "text-white" : "text-[#777169] group-hover:text-black"
                    }`}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#F5F4F0] text-[#777169] border border-[#ebe8e4]"
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

      <div className="px-4 py-4 space-y-2 border-t border-[#ebe8e4] mx-3">
        <div className="text-[11px] font-semibold text-black">Meow Engine</div>
        <p className="text-[11px] text-[#777169] leading-relaxed">
          Browserbase & Playwright stealth automation runtime.
        </p>
      </div>
    </div>
  );
}
