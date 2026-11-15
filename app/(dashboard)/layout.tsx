import React from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserProfileMenu } from "@/components/dashboard/user-profile-menu";
import { ExternalLink, Play } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFCFC] text-black antialiased selection:bg-black/10 selection:text-black font-sans">
      {/* Persistent Left Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#ebe8e4] bg-[#FAFAF9]">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#ebe8e4] px-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-black">
                Meow
              </span>
              <span className="text-[10px] text-[#777169] font-mono">
                Browser Engine
              </span>
            </div>
          </Link>

          <Link
            href="/"
            title="View Public Landing Page"
            className="p-1.5 text-[#777169] hover:text-black rounded-full hover:bg-black/5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-3">
          <SidebarNav />
        </div>

        {/* Bottom Workspace Badge */}
        <div className="p-4 border-t border-[#ebe8e4] bg-white">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
              <span className="text-[#777169] font-mono text-[11px]">Playwright Stealth</span>
            </div>
            <Link
              href="/automation"
              className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1 font-mono"
            >
              Ready
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#FDFCFC]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#ebe8e4] bg-[#FDFCFC]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#777169] font-mono">
              <span className="font-medium text-black">engine</span>
              <span>/</span>
              <span>active</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F4F0] px-2.5 py-0.5 text-[11px] font-medium text-black border border-[#ebe8e4]">
              Zero API Cost
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/automation"
              className="inline-flex items-center gap-1.5 rounded-full bg-black text-white px-4 py-1.5 text-xs font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xs"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Run Automation</span>
            </Link>

            <UserProfileMenu />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
