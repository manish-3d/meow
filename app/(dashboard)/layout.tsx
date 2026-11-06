import React from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Sparkles, Terminal, ShieldCheck } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Persistent Left Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card/30 backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 font-black text-sm">
              🐾
            </span>
            <div className="flex flex-col">
              <span className="text-base font-extrabold leading-none tracking-tight">
                Meow
              </span>
              <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Agent OS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Workspace</span>
              <span>/</span>
              <span className="text-foreground">Default Tenancy</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" />
              RBAC Verified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/agents/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>+ New Agent</span>
            </Link>

            <Link
              href="/sign-in"
              className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Account
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
      </div>
    </div>
  );
}
