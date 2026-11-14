import React from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Sparkles, ShieldCheck, ExternalLink, Zap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#08090a] text-[#f7f8f8] antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Persistent Left Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/[0.08] bg-[#0c0d10] backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Meow Logo"
                className="h-8 w-8 rounded-full border border-white/20 object-cover shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0d10]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">
                  Meow
                </span>
                <span className="text-[10px] font-mono uppercase bg-white/10 text-white/70 px-1.5 py-0.2 rounded font-semibold">
                  OS
                </span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">
                Linear Runtime
              </span>
            </div>
          </Link>

          <Link
            href="/"
            title="View Public Landing Page"
            className="p-1.5 text-white/40 hover:text-white rounded-md hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-2">
          <SidebarNav />
        </div>

        {/* Bottom Workspace Badge */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/60 font-mono text-[11px]">ReAct Engine Live</span>
            </div>
            <Link
              href="/billing"
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Zap className="h-3 w-3" /> Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#08090a]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#08090a]/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
              <span className="font-semibold text-white/80">workspace</span>
              <span>/</span>
              <span className="text-white">default</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" />
              RBAC Verified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/agents/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black px-3.5 py-1.5 text-xs font-semibold shadow-xs hover:bg-white/90 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>+ New Agent</span>
            </Link>

            <Link
              href="/sign-in"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              Account
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#08090a]">{children}</main>
      </div>
    </div>
  );
}
