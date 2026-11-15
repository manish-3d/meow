"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Plus,
  Bot,
  Globe,
  Settings,
  LogOut,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface AgentItem {
  id: number;
  agentId: string;
  name: string;
  description: string;
  agentImage: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agent");
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (err) {
      console.error("Failed to load agents in sidebar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [pathname]);

  const user = session?.user;
  const userName = user?.name || user?.email?.split("@")[0] || "Explorer";
  const userEmail = user?.email || "user@meow.ai";

  return (
    <aside className="w-64 border-r border-[#ebe8e4] bg-[#FAFAF9] flex flex-col h-screen shrink-0 selection:bg-black/10 selection:text-black">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#ebe8e4] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-black">Meow</span>
            <span className="text-[10px] text-[#777169] font-mono">Agent Cloud Platform</span>
          </div>
        </Link>

        <Link
          href="/"
          title="Landing Page"
          className="p-1.5 text-[#777169] hover:text-black rounded-full hover:bg-black/5 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Create Agent CTA Button */}
      <div className="p-4 border-b border-[#ebe8e4]/60">
        <Link
          href="/workspace/create-agent"
          className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Agent</span>
        </Link>
      </div>

      {/* Agents List (Chapter 5) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-[#9E988F] uppercase flex items-center justify-between">
          <span>Your Agents</span>
          <span className="font-mono text-[10px]">{agents.length}</span>
        </div>

        {loading ? (
          <div className="px-3 py-2 text-xs text-[#777169] animate-pulse">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="px-3 py-4 text-center rounded-xl border border-dashed border-[#ebe8e4] p-4 text-xs text-[#777169]">
            <p>No agents yet.</p>
            <Link
              href="/workspace/create-agent"
              className="mt-2 text-black underline font-medium block text-[11px]"
            >
              + Create your first agent
            </Link>
          </div>
        ) : (
          agents.map((agent) => {
            const isActive = pathname.includes(agent.agentId);
            return (
              <Link
                key={agent.agentId}
                href={`/workspace/${agent.agentId}`}
                className={`group flex items-center justify-between rounded-full px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-black text-white shadow-xs"
                    : "text-[#777169] hover:bg-black/5 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <img
                    src={agent.agentImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.agentId}`}
                    alt={agent.name}
                    className="h-6 w-6 rounded-full bg-white border border-[#ebe8e4] object-cover shrink-0"
                  />
                  <span className="truncate">{agent.name}</span>
                </div>
                <ChevronRight
                  className={`h-3 w-3 shrink-0 ${
                    isActive ? "text-white" : "text-[#777169] opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-[#ebe8e4] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-black truncate">{userName}</span>
              <span className="text-[10px] text-[#777169] truncate font-mono">{userEmail}</span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign Out"
            className="p-1.5 text-[#777169] hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
