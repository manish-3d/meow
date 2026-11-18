"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Store,
  Bot,
  Loader2,
  LayoutDashboard,
  Users,
  ChevronRight,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AgentConfigType } from "@/types/agent";
import { MarketplaceDialog } from "./marketplace-dialog";
import { useModelUsage } from "@/context/model-usage-context";
import { DEFAULT_AVATAR } from "@/lib/avatars";

const NAV_ITEMS = [
  { label: "Workspace", href: "/workspace", icon: LayoutDashboard },
  { label: "Agents", href: "/workspace", icon: Users, badge: true },
  { label: "Marketplace", href: "#", icon: Store, action: "marketplace" },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const [agents, setAgents] = useState<AgentConfigType[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const { allTimeUsage } = useModelUsage();

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

  useEffect(() => {
    if (session?.user?.email) {
      getUserAgents();
    }
  }, [pathname, session]);

  const totalTokens = Math.max(12430, allTimeUsage.totalTokens);
  const tokenLimit = 25000;
  const usagePct = Math.min(100, Math.round((totalTokens / tokenLimit) * 100));

  return (
    <Sidebar className="border-r border-black/[0.08] bg-white text-foreground">
      {/* ── BRAND HEADER ── */}
      <SidebarHeader className="p-4 pb-3 border-b border-black/[0.06]">
        <div className="flex items-center justify-between">
          <Link href="/workspace" className="flex items-center gap-3">
            <div className="size-9 rounded-xl overflow-hidden shrink-0">
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
              <span className="font-bold text-base tracking-tight leading-tight text-foreground">
                Meow Bot
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                AI Agent Cloud
              </span>
            </div>
          </Link>

          {/* Toggle sidebar button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-colors"
            title="Toggle Sidebar"
          >
            <div className="size-4 border border-black/30 rounded flex items-center justify-center">
              <div className="w-1.5 h-full border-r border-black/30" />
            </div>
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-5 overflow-y-auto flex-1">
        {/* ── CREATE NEW AGENT (SOLID BLACK PILL) ── */}
        <div className="px-0.5">
          <Link href="/workspace/create-agent" className="block w-full">
            <Button
              className="w-full gap-2 font-semibold shadow-xs bg-black hover:bg-neutral-800 text-white h-10 text-xs rounded-xl transition-all cursor-pointer"
              size="default"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Create New Agent</span>
            </Button>
          </Link>
        </div>

        {/* ── NAVIGATION LIST ── */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isAgents = item.label === "Agents";
                const isWorkspace = item.label === "Workspace";
                const isActive = isWorkspace && pathname === "/workspace";

                if (item.action === "marketplace") {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        onClick={() => setMarketplaceOpen(true)}
                        className="h-9 hover:bg-black/[0.04] rounded-xl px-2.5 cursor-pointer transition-all text-muted-foreground hover:text-foreground group"
                      >
                        <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground">
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      className={`h-9 rounded-xl px-2.5 transition-all group ${
                        isActive
                          ? "bg-neutral-100 text-foreground font-semibold"
                          : "hover:bg-black/[0.04] text-foreground/80 hover:text-foreground"
                      }`}
                      isActive={isActive}
                    >
                      <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-xs font-medium flex-1">
                        {item.label}
                      </span>
                      {isAgents && agents.length > 0 && (
                        <span className="text-[10px] font-mono font-medium text-muted-foreground">
                          {agents.length}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── YOUR AGENTS SECTION ── */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[11px] font-semibold text-foreground tracking-tight px-2 mb-1.5 flex items-center justify-between">
            <span>Your Agents</span>
            <Link
              href="/workspace/create-agent"
              className="size-5 flex items-center justify-center rounded-md hover:bg-black/[0.04] text-muted-foreground hover:text-foreground transition-all"
              title="Create Agent"
            >
              <Plus className="size-3.5 stroke-[2]" />
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            {loadingAgents ? (
              <div className="flex items-center justify-center py-4 text-xs text-muted-foreground gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Loading agents...</span>
              </div>
            ) : agents.length === 0 ? (
              <div className="px-2 py-4 text-center rounded-xl border border-dashed border-black/[0.08] text-xs text-muted-foreground space-y-1 mx-0.5">
                <p>No agents yet.</p>
                <Link
                  href="/workspace/create-agent"
                  className="text-foreground hover:underline font-medium block"
                >
                  Create your first agent →
                </Link>
              </div>
            ) : (
              <SidebarMenu className="gap-1">
                <AnimatePresence initial={false}>
                  {agents.map((agent) => {
                    const isActive = pathname === `/workspace/${agent.agentId}`;
                    const avatarSrc = agent.agentImage || DEFAULT_AVATAR.path;

                    return (
                      <SidebarMenuItem key={agent.agentId}>
                        <SidebarMenuButton
                          render={<Link href={`/workspace/${agent.agentId}`} />}
                          className={`h-10 rounded-xl px-2.5 transition-all group flex items-center gap-2.5 ${
                            isActive
                              ? "bg-neutral-100 text-foreground font-semibold"
                              : "hover:bg-black/[0.03] text-foreground/80 hover:text-foreground"
                          }`}
                          isActive={isActive}
                        >
                          {/* Avatar */}
                          <div className="size-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-black/[0.08] bg-white">
                            <img
                              src={avatarSrc}
                              alt={agent.name}
                              className="size-full object-contain p-0.5"
                            />
                          </div>

                          {/* Agent Name */}
                          <span className="text-xs truncate flex-1 leading-tight">
                            {agent.name}
                          </span>

                          {/* Active dot indicator */}
                          {isActive && (
                            <span className="size-1.5 rounded-full bg-neutral-400 shrink-0" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </AnimatePresence>
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── FOOTER: PRO PLAN & USER PROFILE ── */}
      <SidebarFooter className="p-3 border-t border-black/[0.06] space-y-2.5">
        {/* Pro Plan Card */}
        <div className="p-3 rounded-2xl border border-black/[0.08] bg-white space-y-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            {/* Minecraft Voxel Dirt/Grass Block Icon */}
            <div className="size-6 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-emerald-700 shadow-2xs">
              <svg viewBox="0 0 24 24" className="size-5 fill-current">
                {/* Grass top */}
                <rect x="2" y="2" width="20" height="7" fill="#5b8731" />
                <path d="M2 9h4v3h4V9h4v3h4V9h4v2H2z" fill="#5b8731" />
                {/* Dirt bottom */}
                <rect x="2" y="9" width="20" height="13" fill="#866043" />
                <rect x="5" y="13" width="3" height="3" fill="#6d4e36" />
                <rect x="14" y="15" width="3" height="3" fill="#6d4e36" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground leading-tight">
                Pro Plan
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {usagePct}% used · {totalTokens.toLocaleString()} / {tokenLimit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Solid Black Progress Bar */}
          <div className="h-1.5 w-full bg-black/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${usagePct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Marketplace Dialog */}
        <MarketplaceDialog open={marketplaceOpen} onOpenChange={setMarketplaceOpen} />

        {/* User Profile Bar */}
        <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-black/[0.03] transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Profile Avatar Circle */}
            <div className="size-7 rounded-full overflow-hidden bg-black text-white shrink-0 flex items-center justify-center text-xs font-semibold uppercase">
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

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate text-foreground leading-tight">
                {session?.user?.name || "Manish Kumar"}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Pro Plan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              title="Sign Out"
              className="text-muted-foreground hover:text-rose-600 size-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <LogOut className="size-3.5" />
            </button>
            <ChevronRight className="size-3.5 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
