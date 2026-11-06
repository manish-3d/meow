"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Bot,
  Plus,
  Search,
  Sparkles,
  MessageSquare,
  Settings,
  Filter,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
}

export default function AgentsGalleryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorNotice(null);
      try {
        // 1. Get workspace
        const wsRes = await fetch("/api/workspaces");
        if (wsRes.status === 401) {
          setErrorNotice("unauthenticated");
          return;
        }
        if (!wsRes.ok) throw new Error("Failed to load workspace");
        const wsData = await wsRes.json();
        const activeWs = wsData.activeWorkspace;
        setWorkspace(activeWs);

        // 2. Fetch workspace agents
        if (activeWs?.id) {
          const agentsRes = await fetch(`/api/agents?workspaceId=${activeWs.id}`);
          if (!agentsRes.ok) throw new Error("Failed to load agents list");
          const agentsData = await agentsRes.json();
          setAgents(agentsData.agents || []);
        }
      } catch (err: unknown) {
        console.error("Agents gallery load error:", err);
        setErrorNotice("Unable to load agents for this workspace");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter agents by search query and status filter
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ? true : agent.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [agents, searchQuery, statusFilter]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Agent Fleet</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {agents.length} configured
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage autonomous agent personas, adjust instructions, and inspect enabled tools.
          </p>
        </div>

        <Link
          href="/agents/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          <span>Deploy New Agent</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents by name or role..."
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border bg-card p-1">
          {(["all", "active", "archived"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-all ${
                statusFilter === filter
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Canvas */}
      {isLoading ? (
        <div className="rounded-2xl border bg-card p-16 text-center text-sm text-muted-foreground">
          Loading agent fleet...
        </div>
      ) : errorNotice === "unauthenticated" ? (
        <div className="rounded-2xl border bg-card p-12 text-center space-y-3">
          <h3 className="text-base font-bold">Authentication Required</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Please sign in to view and orchestrate your workspace agents.
          </p>
          <div className="pt-2">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              Sign In to Workspace →
            </Link>
          </div>
        </div>
      ) : errorNotice ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive">
          {errorNotice}
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card/50 p-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No agents match your criteria</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery
              ? `No agents found matching "${searchQuery}". Clear your search to see all agents.`
              : "Get started by building your first autonomous agent."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                Clear Search
              </button>
            )}
            <Link
              href="/agents/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Deploy Agent</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {agent.id.slice(0, 10)}...
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      agent.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="mt-4 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {agent.description || "No description configured for this agent."}
                </p>
              </div>

              <div className="mt-6 space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                  <Link
                    href={`/agents/${agent.id}/edit`}
                    className="hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Settings className="h-3 w-3" />
                    <span>Edit</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/agents/${agent.id}`}
                    className="flex-1 text-center rounded-lg border bg-muted/20 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Overview
                  </Link>
                  <Link
                    href={`/agents/${agent.id}/chat`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Start Chat</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

