"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/workspace/app-sidebar";
import { ModelUsageProvider } from "@/context/model-usage-context";
import { usePathname } from "next/navigation";
import { Box, Search, Bell, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeAgentName, setActiveAgentName] = useState<string>("Social Media Bot");

  useEffect(() => {
    // If on an agent route /workspace/[agentId], fetch agent name for breadcrumb
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "workspace" && parts[1] !== "create-agent") {
      const agentId = parts[1];
      axios
        .get(`/api/agent?agentId=${agentId}`)
        .then((res) => {
          if (res.data?.name) {
            setActiveAgentName(res.data.name);
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  return (
    <ModelUsageProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-white text-foreground">
          <AppSidebar />

          <main className="flex-1 flex flex-col min-w-0 bg-white">
            {/* ── TOP WORKSPACE HEADER (MATCHING REFERENCE EXACTLY) ── */}
            <header className="h-14 border-b border-black/[0.08] flex items-center justify-between px-6 bg-white shrink-0">
              {/* Left Breadcrumb */}
              <div className="flex items-center gap-2.5 text-xs">
                <Box className="size-4 text-foreground/80 stroke-[2]" />
                <span className="font-medium text-foreground">Workspace</span>
                <span className="text-muted-foreground/60 text-[11px]">›</span>
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <span>{activeAgentName}</span>
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                </div>
              </div>

              {/* Right Utilities (Search, Bell, User Avatar) */}
              <div className="flex items-center gap-3">
                {/* Search Shortcut */}
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/[0.08] bg-neutral-50 hover:bg-neutral-100 text-xs text-muted-foreground transition-all cursor-pointer shadow-2xs"
                >
                  <Search className="size-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-mono text-muted-foreground">⌘ K</span>
                </button>

                {/* Notifications Bell */}
                <button
                  type="button"
                  className="size-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-neutral-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="size-4 stroke-[1.8]" />
                </button>

                {/* User Avatar Circle */}
                <div className="size-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold overflow-hidden shrink-0 shadow-2xs">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{session?.user?.name?.[0] || "M"}</span>
                  )}
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden bg-white">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ModelUsageProvider>
  );
}
