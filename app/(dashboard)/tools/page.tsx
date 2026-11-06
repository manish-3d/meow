"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Wrench,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Code2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Bot,
  ExternalLink,
  Lock,
} from "lucide-react";

interface CatalogTool {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  executionType: string;
  permissionLevel: "read" | "write" | "dangerous";
  requiresApproval: boolean;
  createdAt: string;
}

export default function ToolCatalogPage() {
  const [tools, setTools] = useState<CatalogTool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "read" | "write" | "dangerous">("all");
  const [expandedSchemaId, setExpandedSchemaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadTools() {
      setIsLoading(true);
      setErrorNotice(null);
      try {
        const res = await fetch("/api/tools");
        if (!res.ok) throw new Error("Failed to load tools catalog");
        const data = await res.json();
        setTools(data.tools || []);
      } catch (err: unknown) {
        console.error("Tools directory error:", err);
        setErrorNotice("Unable to load tools catalog");
      } finally {
        setIsLoading(false);
      }
    }

    loadTools();
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === "all" ? true : tool.permissionLevel === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [tools, searchQuery, tierFilter]);

  const toggleSchema = (id: string) => {
    setExpandedSchemaId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Wrench className="h-3.5 w-3.5" />
            <span>Central Tool Registry & Sandboxing</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tool Catalog & Security Tiers</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every capability exposed to an autonomous agent is registered here. Tools execute
            through strict server-side permission gates with isolated directory sandboxing
            and human-in-the-loop approvals.
          </p>

          {/* Security Tiers Legend */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-lg border bg-blue-500/5 px-2.5 py-1 font-medium text-blue-600 border-blue-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Read (Safe Data Retrieval)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border bg-amber-500/5 px-2.5 py-1 font-medium text-amber-600 border-amber-500/20">
              <Shield className="h-3.5 w-3.5" />
              <span>Write (Sandboxed Workspace State)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border bg-rose-500/5 px-2.5 py-1 font-medium text-rose-600 border-rose-500/20">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Dangerous (Human Approval Required)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, description, or ID..."
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border bg-card p-1">
          {(["all", "read", "write", "dangerous"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-all ${
                tierFilter === tier
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="rounded-2xl border bg-card p-16 text-center text-sm text-muted-foreground">
          Loading tool catalog...
        </div>
      ) : errorNotice ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive">
          {errorNotice}
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card/50 p-16 text-center text-sm text-muted-foreground">
          No tools match your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isExpanded = expandedSchemaId === tool.id;
            return (
              <div
                key={tool.id}
                className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {tool.id}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        tool.permissionLevel === "dangerous"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : tool.permissionLevel === "write"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      }`}
                    >
                      {tool.permissionLevel}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-[10px] font-mono text-foreground">
                      <Cpu className="h-3 w-3 text-muted-foreground" />
                      Target: {tool.executionType}
                    </span>

                    {tool.requiresApproval && (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-600 border border-rose-500/20">
                        <Lock className="h-3 w-3" />
                        Approval Gate Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Collapsible Parameter Schema Inspector */}
                <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                  <button
                    onClick={() => toggleSchema(tool.id)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5" />
                      <span>Parameter Schema</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
                      <pre className="font-mono text-[11px] text-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
                        {JSON.stringify(tool.inputSchema, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href="/agents"
                      className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Assign to Agent Fleet</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

