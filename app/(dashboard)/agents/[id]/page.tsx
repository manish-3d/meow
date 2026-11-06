"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  Settings,
  Sparkles,
  Wrench,
  Shield,
  ShieldAlert,
  Cpu,
  History,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from "lucide-react";

interface AgentDetails {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AgentVersion {
  id: string;
  version: number;
  instructions: string;
  model: string;
  config: Record<string, unknown>;
  createdAt: string;
}

interface AssignedTool {
  id: string;
  name: string;
  description: string;
  permissionLevel: "read" | "write" | "dangerous";
  executionTarget: string;
  requiresApproval: boolean;
  enabled: boolean;
}

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: agentId } = use(params);

  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [versions, setVersions] = useState<AgentVersion[]>([]);
  const [tools, setTools] = useState<AssignedTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    async function loadAgentData() {
      setIsLoading(true);
      setErrorNotice(null);
      try {
        // 1. Fetch Agent & Versions
        const agentRes = await fetch(`/api/agents/${agentId}`);
        if (!agentRes.ok) throw new Error("Failed to load agent");
        const agentData = await agentRes.json();
        setAgent(agentData.agent);
        setVersions(agentData.versions || []);

        // 2. Fetch Agent Tools
        const toolsRes = await fetch(`/api/agents/${agentId}/tools`);
        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          setTools(toolsData.tools || []);
        }
      } catch (err: unknown) {
        console.error("Agent detail load error:", err);
        setErrorNotice("Could not load agent dossier");
      } finally {
        setIsLoading(false);
      }
    }

    loadAgentData();
  }, [agentId]);

  const activeVersion = versions[0]; // Latest version is sorted desc

  const handleCopyPrompt = () => {
    if (activeVersion?.instructions) {
      navigator.clipboard.writeText(activeVersion.instructions);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        Loading agent dossier...
      </div>
    );
  }

  if (errorNotice || !agent) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Agent Fleet</span>
        </Link>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive">
          {errorNotice || "Agent not found"}
        </div>
      </div>
    );
  }

  const enabledToolsCount = tools.filter((t) => t.enabled).length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Agent Fleet</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md text-2xl font-black">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {agent.name}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  agent.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {agent.status}
              </span>
              {activeVersion && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-primary">
                  v{activeVersion.version}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl">
              {agent.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-3">
          <Link
            href={`/agents/${agent.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Edit & Tools</span>
          </Link>

          <Link
            href={`/agents/${agent.id}/chat`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Open Chat Canvas</span>
          </Link>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Instructions & Tools */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: System Instructions */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold tracking-tight">
                  System Instructions (Prompt Layer 1)
                </h2>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl bg-muted/40 p-4 border border-border/60">
              <pre className="font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {activeVersion?.instructions || "No instructions defined for this version."}
              </pre>
            </div>
            <p className="text-[11px] text-muted-foreground">
              These instructions govern how the model reasons, selects tools, and formulates answers.
            </p>
          </div>

          {/* Section: Tools Matrix */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold tracking-tight">Active Tool Capabilities</h2>
                <p className="text-xs text-muted-foreground">
                  Tools enabled for this agent ({enabledToolsCount} active of {tools.length} catalog tools)
                </p>
              </div>
              <Link
                href={`/agents/${agent.id}/edit`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Manage Permissions →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tools.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-colors ${
                    t.enabled
                      ? "bg-card border-border shadow-2xs"
                      : "bg-muted/10 border-border/40 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        t.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{t.name}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider ${
                            t.permissionLevel === "dangerous"
                              ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                              : t.permissionLevel === "write"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          }`}
                        >
                          {t.permissionLevel}
                        </span>
                        {t.requiresApproval && (
                          <span className="rounded bg-rose-500/10 px-1.5 py-0.2 text-[9px] font-medium text-rose-600">
                            Approval Gate
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {t.enabled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <XCircle className="h-3 w-3" />
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Runtime Telemetry & Version Audit */}
        <div className="space-y-6">
          {/* Runtime Config */}
          <div className="rounded-2xl border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Runtime Telemetry
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Primary Model</span>
                <span className="font-mono font-semibold text-foreground">
                  {activeVersion?.model || "default"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Active Version</span>
                <span className="font-mono font-semibold text-primary">
                  v{activeVersion?.version || 1}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-muted-foreground">ReAct Max Steps</span>
                <span className="font-mono font-semibold text-foreground">10 Steps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Workspace ID</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {agent.workspaceId.slice(0, 10)}...
                </span>
              </div>
            </div>
          </div>

          {/* Immutable Version Audit */}
          <div className="rounded-2xl border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Version History
                </h3>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {versions.length} release{versions.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2.5">
              {versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  className={`rounded-xl border p-3 text-xs transition-colors ${
                    idx === 0
                      ? "bg-primary/5 border-primary/30"
                      : "bg-muted/20 border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-foreground">
                      v{ver.version} {idx === 0 && "(Active)"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(ver.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-muted-foreground">
                    Model: {ver.model}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

