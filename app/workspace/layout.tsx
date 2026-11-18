"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/workspace/app-sidebar";
import { ModelUsageProvider } from "@/context/model-usage-context";
import { ModelSelectorBar } from "@/components/custom/models/model-selector-bar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModelUsageProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar />
          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 gap-3 bg-background/95 backdrop-blur shrink-0">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="h-4 w-px bg-border/60" />
                <span className="text-xs font-medium text-muted-foreground">Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <ModelSelectorBar compact />
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ModelUsageProvider>
  );
}
