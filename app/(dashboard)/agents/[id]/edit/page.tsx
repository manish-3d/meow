"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Wrench,
  Cpu,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Save,
  Trash2,
  History,
  AlertTriangle,
} from "lucide-react";

interface AgentDetails {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

interface AgentVersion {
  id: string;
  version: number;
  instructions: string;
  model: string;
}

interface AssignedTool {
  id: string;
  name: string;
  description: string;
  permissionLevel: "read" | "write" | "dangerous";
  requiresApproval: boolean;
  enabled: boolean;
}

const MODEL_OPTIONS = [
  { id: "gpt-4o", name: "GPT-4o (OpenAI)" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini (OpenAI)" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Google)" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet (Anthropic)" },
  { id: "ollama/llama3", name: "Llama 3 (Local Ollama)" },
];

export default function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: agentId } = use(params);
  const router = useRouter();

  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [latestVersion, setLatestVersion] = useState<AgentVersion | null>(null);
  const [tools, setTools] = useState<AssignedTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [model, setModel] = useState("gpt-4o");
  const [instructions, setInstructions] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [togglingToolId, setTogglingToolId] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadAgent() {
      setIsLoading(true);
      try {
        // 1. Fetch agent & versions
        const agentRes = await fetch(`/api/agents/${agentId}`);
        if (!agentRes.ok) throw new Error("Failed to load agent");
        const agentData = await agentRes.json();
        const a = agentData.agent;
        const v = agentData.versions?.[0] || null;

        setAgent(a);
        setName(a.name);
        setDescription(a.description || "");
        setStatus(a.status);

        if (v) {
          setLatestVersion(v);
          setModel(v.model);
          setInstructions(v.instructions);
        }

        // 2. Fetch tools
        const toolsRes = await fetch(`/api/agents/${agentId}/tools`);
        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          setTools(toolsData.tools || []);
        }
      } catch (err: unknown) {
        console.error("Edit agent load error:", err);
        setNoticeMessage({ type: "error", text: "Failed to load agent data" });
      } finally {
        setIsLoading(false);
      }
    }

    loadAgent();
  }, [agentId]);

  // Handle saving general details & bumping version if instructions/model changed
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNoticeMessage({ type: "error", text: "Agent name cannot be blank" });
      return;
    }

    setIsSaving(true);
    setNoticeMessage(null);

    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim() || null,
        status,
      };

      // Check if instructions or model changed
      if (
        instructions.trim() !== latestVersion?.instructions ||
        model.trim() !== latestVersion?.model
      ) {
        payload.instructions = instructions.trim();
        payload.model = model.trim();
      }

      const res = await fetch(`/api/agents/${agentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update agent");
      }

      const updatedData = await res.json();
      if (updatedData.version) {
        setLatestVersion(updatedData.version);
        setNoticeMessage({
          type: "success",
          text: `Saved! Created new version v${updatedData.version.version}`,
        });
      } else {
        setNoticeMessage({ type: "success", text: "Agent details updated successfully" });
      }
    } catch (err: unknown) {
      console.error("Save error:", err);
      setNoticeMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save changes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggling an individual tool atomically
  const handleToggleTool = async (tool: AssignedTool) => {
    const nextEnabled = !tool.enabled;
    setTogglingToolId(tool.id);

    // Optimistically update UI
    setTools((prev) =>
      prev.map((t) => (t.id === tool.id ? { ...t, enabled: nextEnabled } : t)),
    );

    try {
      const res = await fetch(`/api/agents/${agentId}/tools`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: [{ toolId: tool.id, enabled: nextEnabled }],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update tool state");
      }

      setNoticeMessage({
        type: "success",
        text: `${tool.name} ${nextEnabled ? "enabled" : "disabled"} successfully`,
      });
    } catch (err: unknown) {
      // Revert on failure
      setTools((prev) =>
        prev.map((t) => (t.id === tool.id ? { ...t, enabled: tool.enabled } : t)),
      );
      setNoticeMessage({ type: "error", text: "Failed to toggle tool permission" });
    } finally {
      setTogglingToolId(null);
    }
  };

  // Archive agent
  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this agent?")) return;

    try {
      const res = await fetch(`/api/agents/${agentId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/agents");
      } else {
        alert("Failed to archive agent");
      }
    } catch (err) {
      alert("Error archiving agent");
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Loading editor...</div>;
  }

  if (!agent) {
    return <div className="p-12 text-center text-sm text-destructive">Agent not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href={`/agents/${agentId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {agent.name} Dossier</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Edit Agent & Tool Toggles</h1>
          <p className="text-sm text-muted-foreground">
            Update identity, bump version instructions, or grant/revoke tool permissions.
          </p>
        </div>

        <Link
          href={`/agents/${agentId}/chat`}
          className="rounded-xl border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted"
        >
          Open Chat →
        </Link>
      </div>

      {noticeMessage && (
        <div
          className={`rounded-xl border p-4 text-xs font-medium ${
            noticeMessage.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {noticeMessage.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Basic Identity */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Bot className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight">Agent Metadata</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Agent Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Lifecycle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-foreground mb-1.5">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this agent does..."
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Instructions & Model (Immutable Version Bumper) */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold tracking-tight">
                Instructions & AI Model (Current: v{latestVersion?.version || 1})
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
              <History className="h-3 w-3" />
              Immutable Versioning
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">AI Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              >
                {MODEL_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                System Prompt Instructions
              </label>
              <textarea
                rows={6}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full rounded-xl border bg-background p-3 font-mono text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Notice: Editing instructions or model increments this agent to version{" "}
                <span className="font-semibold text-primary">v{(latestVersion?.version || 1) + 1}</span>,
                leaving past run history safely intact.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Metadata & Bump Version</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Section 3: Live Tool Toggles */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight">Live Tool Toggles</h2>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Instant sync via PUT /api/agents/[id]/tools
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {tools.map((t) => {
            const isToggling = togglingToolId === t.id;
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border p-4 bg-card hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
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
                          Requires Approval
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.description}</p>
                  </div>
                </div>

                {/* Interactive Toggle Switch */}
                <div className="flex items-center gap-3">
                  {isToggling ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleTool(t)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        t.enabled ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          t.enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Danger Zone */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <h2 className="text-sm font-bold tracking-tight">Danger Zone</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-foreground">Archive this agent</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Archiving hides this agent from your active fleet while preserving run telemetry.
            </p>
          </div>
          <button
            type="button"
            onClick={handleArchive}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Archive Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
}

