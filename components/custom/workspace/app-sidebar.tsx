"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { Plus, Store, LogOut, Bot, Sparkles, Loader2 } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AgentConfigType } from "@/types/agent";
import { MarketplaceDialog } from "./marketplace-dialog";

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Live agents state from Neon Database (Tutorial timestamp 1:43:54)
  const [agents, setAgents] = useState<AgentConfigType[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);

  // Fetch agents owned by authenticated user (Tutorial timestamp 1:44:13)
  const getUserAgents = async () => {
    try {
      const result = await axios.get("/api/agent");
      setAgents(result.data);
    } catch (error) {
      console.error("Error fetching user agents:", error);
    } finally {
      setLoadingAgents(false);
    }
  };

  // Re-fetch agents whenever route/pathname changes (Tutorial timestamp 1:47:44)
  useEffect(() => {
    if (session?.user?.email) {
      getUserAgents();
    }
  }, [pathname, session]);

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      {/* Brand & App Header */}
      <SidebarHeader className="p-4 border-b border-border/50">
        <Link href="/workspace" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Meow Bot Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-tight">Meow Bot</span>
            <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">
              Agent Cloud
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-4">
        {/* Create New Agent CTA */}
        <div className="px-1">
          <Link href="/workspace/create-agent" className="block w-full">
            <Button className="w-full gap-2 font-medium shadow-sm transition-all" size="default">
              <Plus className="size-4" />
              <span>Create New Agent</span>
            </Button>
          </Link>
        </div>

        {/* Your Agents Group */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2 mb-1 flex items-center justify-between">
            <span>Your Agents</span>
            {agents.length > 0 && (
              <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {agents.length}
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {loadingAgents ? (
              <div className="flex items-center justify-center py-4 text-xs text-muted-foreground gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Loading agents...</span>
              </div>
            ) : agents.length === 0 ? (
              <div className="px-2 py-4 text-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground space-y-1">
                <p>No agents yet.</p>
                <Link href="/workspace/create-agent" className="text-primary hover:underline font-medium block">
                  Create your first agent →
                </Link>
              </div>
            ) : (
              <SidebarMenu className="gap-1">
                {agents.map((agent) => (
                  <SidebarMenuItem key={agent.agentId}>
                    <SidebarMenuButton
                      render={<Link href={`/workspace/${agent.agentId}`} />}
                      className="h-10 hover:bg-muted/80 rounded-lg px-2"
                      isActive={pathname === `/workspace/${agent.agentId}`}
                    >
                      <div className="size-7 rounded-md bg-muted overflow-hidden flex items-center justify-center border border-border shrink-0">
                        {agent.agentImage ? (
                          <img
                            src={agent.agentImage}
                            alt={agent.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Bot className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-sm font-medium truncate">{agent.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Marketplace & User Session */}
      <SidebarFooter className="p-3 border-t border-border/50 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setMarketplaceOpen(true)}
              className="h-9 px-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Store className="size-4" />
              <span className="text-sm font-medium">Marketplace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <MarketplaceDialog
          open={marketplaceOpen}
          onOpenChange={setMarketplaceOpen}
        />

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center text-xs font-semibold uppercase">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="size-full object-cover"
                />
              ) : (
                <span>{session?.user?.name?.[0] || "U"}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium truncate text-foreground">
                {session?.user?.name || "Authenticated User"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {session?.user?.email || ""}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            title="Sign Out"
            className="text-muted-foreground hover:text-destructive shrink-0 size-7 p-0"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
