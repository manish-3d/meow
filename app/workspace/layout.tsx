"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/workspace/app-sidebar";
import { ModelUsageProvider } from "@/context/model-usage-context";
import { WorkspaceUIProvider, useWorkspaceUI } from "@/context/workspace-ui-context";
import { usePathname } from "next/navigation";
import { Box, Search, Bell, PanelRightClose, PanelRight, SlidersHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

function WorkspaceHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open: sidebarOpen, toggleSidebar } = useSidebar();
  const { isConfigOpen, toggleConfig } = useWorkspaceUI();
  const [activeAgentName, setActiveAgentName] = useState<string>("Social Media Bot");

  const isAgentSpace = pathname.startsWith("/workspace/") && pathname !== "/workspace/create-agent";

  useEffect(() => {
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
    <header className="h-14 border-b border-black/[0.08] flex items-center justify-between px-5 bg-white shrink-0 z-10">
      {/* ── LEFT: SIDEBAR TOGGLE & BREADCRUMB ── */}
      <div className="flex items-center gap-3">
        {/* Persistent Left Sidebar Toggle */}
        <SidebarTrigger
          className="size-8 rounded-xl border border-black/[0.08] bg-white hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs flex items-center justify-center"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        />

        <div className="h-4 w-px bg-black/[0.08]" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <Box className="size-4 text-foreground/80 stroke-[2]" />
          <span className="font-medium text-foreground">Workspace</span>
          <span className="text-muted-foreground/60 text-[11px]">›</span>
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <span>{activeAgentName}</span>
            <span className="size-1.5 rounded-full bg-[#8dcb16] shrink-0" />
          </div>
        </div>
      </div>

      {/* ── RIGHT UTILITIES & CONFIG PANEL TOGGLE ── */}
      <div className="flex items-center gap-2.5">
        {/* Search Shortcut */}
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/[0.08] bg-neutral-50 hover:bg-neutral-100 text-xs text-muted-foreground transition-all cursor-pointer shadow-2xs"
          title="Search"
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

        {/* ── RIGHT CONFIGURATION PANEL TOGGLE BUTTON ── */}
        {isAgentSpace && (
          <button
            type="button"
            onClick={toggleConfig}
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              isConfigOpen
                ? "bg-neutral-100 border-black/[0.12] text-foreground hover:bg-neutral-200"
                : "bg-white border-black/[0.08] text-muted-foreground hover:text-foreground hover:bg-neutral-50 hover:border-black/20"
            }`}
            title={isConfigOpen ? "Hide Configuration Panel" : "Show Configuration Panel"}
          >
            {isConfigOpen ? (
              <>
                <PanelRightClose className="size-3.5 text-foreground" />
                <span className="hidden sm:inline text-[11px]">Hide Config</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="size-3.5 text-foreground" />
                <span className="hidden sm:inline text-[11px]">Show Config</span>
              </>
            )}
          </button>
        )}

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
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModelUsageProvider>
      <WorkspaceUIProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-white text-foreground">
            <AppSidebar />

            <main className="flex-1 flex flex-col min-w-0 bg-white">
              <WorkspaceHeader />
              <div className="flex-1 overflow-hidden bg-white">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </WorkspaceUIProvider>
    </ModelUsageProvider>
  );
}
