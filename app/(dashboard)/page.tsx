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
        // 1. Fetch user workspace
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

        // 2. Fetch agents for this workspace
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
        <div className="rounded-2xl border bg-card p-10 text-center shadow-xs space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold">
            🐾
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome to Meow Agent OS</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Please sign in with your GitHub or Google account to access your personal workspace, orchestrate autonomous agents, and inspect sandboxed tools.
          </p>
          <div className="pt-2">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02]"
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Agent Operating System • Phase 9 UI Active</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {workspace ? workspace.name : "Agent Mission Control"}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Orchestrate autonomous AI agents, customize instructions, grant granular
            sandboxed tools, and review human-in-the-loop approvals with full multi-tenant isolation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/agents/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              <span>Deploy New Agent</span>
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl border bg-background/80 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-all"
            >
              <Wrench className="h-4 w-4" />
              <span>Explore Tool Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Agents */}
        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Agents
            </span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
              <Bot className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">
              {isLoading ? "..." : agents.length}
            </span>
            <span className="text-xs text-muted-foreground">fleet instances</span>
          </div>
        </div>

        {/* Metric 2: Tools Catalog */}
        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Native Tools
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">5 Tools</span>
            <span className="text-xs text-muted-foreground">Web, Files, Code</span>
          </div>
        </div>

        {/* Metric 3: Safety Guard */}
        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Safety Boundary
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">Tier 3</span>
            <span className="text-xs text-muted-foreground">Human Approvals</span>
          </div>
        </div>

        {/* Metric 4: Runtime Engine */}
        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              ReAct Engine
            </span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">Autonomous</span>
            <span className="text-xs text-muted-foreground">10-step ceiling</span>
          </div>
        </div>
      </div>

      {/* Agents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Your Agent Fleet</h2>
            <p className="text-xs text-muted-foreground">
              Configured autonomous agents available in this workspace.
            </p>
          </div>
          <Link
            href="/agents"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-xl border bg-card p-12 text-center text-sm text-muted-foreground">
            Loading workspace agents...
          </div>
        ) : agents.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/50 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No agents found</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Get started by provisioning your first autonomous agent with system instructions and tools.
            </p>
            <div className="mt-6">
              <Link
                href="/agents/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Your First Agent</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors">
                          {agent.name}
                        </h4>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          ID: {agent.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      {agent.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                    {agent.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/50">
                  <Link
                    href={`/agents/${agent.id}`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Details & Tools
                  </Link>
                  <Link
                    href={`/agents/${agent.id}/chat`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat Canvas</span>
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
