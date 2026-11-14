"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Wrench,
  ShieldAlert,
  ArrowRight,
  Plus,
  Sparkles,
  MessageSquare,
  Activity,
  CheckCircle2,
  Cpu,
  LogIn,
  Share2,
  Zap,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
}

export default function DashboardOverviewPage() {
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthenticated, setIsUnauthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      setError(null);
      setIsUnauthenticated(false);
      try {
        const wsRes = await fetch("/api/workspaces");
        if (wsRes.status === 401) {
          setIsUnauthenticated(true);
          return;
        }
        if (!wsRes.ok) {
          throw new Error("Failed to load workspace context");
        }
        const wsData = await wsRes.json();
        const activeWs = wsData.activeWorkspace;
        setWorkspace(activeWs);

        if (activeWs?.id) {
          const agentsRes = await fetch(`/api/agents?workspaceId=${activeWs.id}`);
          if (agentsRes.ok) {
            const agentsData = await agentsRes.json();
            setAgents(agentsData.agents || []);
          }
        }
      } catch (err: unknown) {
        console.error("Dashboard overview error:", err);
        setError("Could not load workspace telemetry");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isUnauthenticated) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-10 text-center shadow-xl space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <img src="/logo.png" alt="Meow Logo" className="h-16 w-16 rounded-full border border-white/20" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome to Meow Agent OS</h1>
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            Please sign in with your GitHub or Google account to access your personal workspace, orchestrate autonomous agents, and inspect sandboxed tools.
          </p>
          <div className="pt-2">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-2.5 text-xs font-bold shadow-md hover:bg-white/90 transition-all hover:scale-[1.02]"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to Your Workspace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#f7f8f8]">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0c0d10] via-[#0c0d10] to-indigo-950/20 p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Meow Agent Runtime · Linear Edition</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            {workspace ? workspace.name : "Mission Control"}
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Orchestrate autonomous AI agents with sandboxed tool execution, 1-click OAuth workspace integrations, and human approval safety gates.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/agents/new"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-xs font-bold shadow-md hover:bg-white/90 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Deploy New Agent</span>
            </Link>
            <Link
              href="/integrations"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Workspace Integrations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0d10] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">Active Agents</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
              <Bot className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {isLoading ? "..." : agents.length}
            </span>
            <span className="text-xs text-white/40 font-mono">fleet instances</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0d10] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">Active Tools & Skills</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">14 Tools</span>
            <span className="text-xs text-white/40 font-mono">Twitter, GitHub, Web</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0d10] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">Safety Boundary</span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">Tier 3 Gate</span>
            <span className="text-xs text-white/40 font-mono">Human Approvals</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0d10] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">ReAct Loop Engine</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400 border border-purple-500/20">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">Gemini 2.5</span>
            <span className="text-xs text-white/40 font-mono">Autonomous</span>
          </div>
        </div>
      </div>

      {/* Agents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">Your Agent Fleet</h2>
            <p className="text-xs text-white/50">
              Configured autonomous agents available in this workspace.
            </p>
          </div>
          <Link
            href="/agents"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-white/40 font-mono">
            Loading agent fleet instances...
          </div>
        ) : agents.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-8 text-center space-y-3">
            <Bot className="h-8 w-8 text-white/30 mx-auto" />
            <h3 className="text-sm font-bold text-white">No agents deployed yet</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Create your first agent with custom instructions and sandboxed capabilities.
            </p>
            <Link
              href="/agents/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-bold hover:bg-white/90 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Agent</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5 flex flex-col justify-between hover:border-white/20 transition-all space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {agent.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-2">
                    {agent.description || "Autonomous agent initialized for this workspace."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                  <Link
                    href={`/agents/${agent.id}/chat`}
                    className="flex-1 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Open Chat</span>
                  </Link>
                  <Link
                    href={`/agents/${agent.id}`}
                    className="py-1.5 px-3 rounded-xl border border-white/10 text-white/70 hover:text-white text-xs font-semibold hover:bg-white/5 transition-colors"
                  >
                    Config
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
