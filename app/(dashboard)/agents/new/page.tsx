"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";

interface CatalogTool {
  id: string;
  name: string;
  description: string;
  permissionLevel: "read" | "write" | "dangerous";
  requiresApproval: boolean;
}

const MODEL_OPTIONS = [
  {
    id: "gpt-4o",
    name: "GPT-4o (OpenAI)",
    description: "Multimodal flagship with advanced tool reasoning",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini (OpenAI)",
    description: "Fast, cost-effective model for high-frequency workflows",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro (Google)",
    description: "Deep analysis with massive context window handling",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet (Anthropic)",
    description: "Superior coding, agentic reasoning, and formatting precision",
  },
  {
    id: "ollama/llama3",
    name: "Llama 3 (Local Ollama)",
    description: "Runs entirely on your local machine with 0 cloud API fees",
  },
];

const PROMPT_TEMPLATES = [
  {
    title: "Web Research Specialist",
    instructions:
      "You are an autonomous web researcher. When asked a question, search the web, analyze multiple sources, extract key findings, and cite verified URLs with objective, structured summaries.",
  },
  {
    title: "Autonomous Coder",
    instructions:
      "You are an autonomous software engineering assistant. Write safe, clean TypeScript and JavaScript code, inspect files in the workspace, and execute isolated snippets to test correctness.",
  },
  {
    title: "General ReAct Assistant",
    instructions:
      "You are a helpful, accurate, and autonomous AI assistant. Plan your reasoning step-by-step before calling any tools. Verify results before producing your final answer.",
  },
];

export default function NewAgentWizardPage() {
  const router = useRouter();

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [catalogTools, setCatalogTools] = useState<CatalogTool[]>([]);
  const [selectedToolIds, setSelectedToolIds] = useState<Set<string>>(new Set());

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [instructions, setInstructions] = useState(PROMPT_TEMPLATES[0].instructions);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load workspace context and available tools
  useEffect(() => {
    async function initWizard() {
      try {
        const wsRes = await fetch("/api/workspaces");
        if (wsRes.ok) {
          const wsData = await wsRes.json();
          setWorkspaceId(wsData.activeWorkspace?.id || null);
        }

        const toolsRes = await fetch("/api/tools");
        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          const list: CatalogTool[] = toolsData.tools || [];
          setCatalogTools(list);

          // By default, pre-select safe read tools (e.g. web_search, read_url)
          const defaultSafe = new Set<string>();
          list.forEach((t) => {
            if (t.permissionLevel === "read") {
              defaultSafe.add(t.id);
            }
          });
          setSelectedToolIds(defaultSafe);
        }
      } catch (err: unknown) {
        console.error("Wizard initialization error:", err);
      }
    }

    initWizard();
  }, []);

  const toggleTool = (toolId: string) => {
    setSelectedToolIds((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Agent name is required");
      return;
    }
    if (!instructions.trim()) {
      setErrorMessage("Instructions are required");
      return;
    }
    if (!workspaceId) {
      setErrorMessage("Workspace context not loaded. Please refresh.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Create Agent with initial version
      const createRes = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name: name.trim(),
          description: description.trim() || undefined,
          model: model.trim(),
          instructions: instructions.trim(),
        }),
      });

      if (!createRes.ok) {
        const errData = await createRes.json();
        throw new Error(errData.error || "Failed to create agent");
      }

      const { agent } = await createRes.json();

      // 2. Attach selected tools via PUT /api/agents/[id]/tools
      if (catalogTools.length > 0) {
        const toolsPayload = catalogTools.map((t) => ({
          toolId: t.id,
          enabled: selectedToolIds.has(t.id),
        }));

        await fetch(`/api/agents/${agent.id}/tools`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tools: toolsPayload }),
        });
      }

      // 3. Redirect to the newly created agent's dossier
      router.push(`/agents/${agent.id}`);
    } catch (err: unknown) {
      console.error("Agent creation failed:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to create agent");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
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

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Deploy New Agent</h1>
        <p className="text-sm text-muted-foreground">
          Configure identity, model runtime, system prompts, and tool permissions.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-medium text-destructive">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Identity */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Bot className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight">Step 1: Agent Identity</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Agent Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Market Research Bot"
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Role Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this agent does..."
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Model Runtime */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Cpu className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight">Step 2: AI Provider & Model</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODEL_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                onClick={() => setModel(opt.id)}
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                  model === opt.id
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/60 hover:border-border hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{opt.name}</span>
                  {model === opt.id && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  {opt.description}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: System Prompt */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold tracking-tight">
                Step 3: System Prompt (Behavior Instructions)
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground mr-1">Templates:</span>
              {PROMPT_TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.title}
                  onClick={() => setInstructions(tmpl.instructions)}
                  className="rounded-md border bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              required
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter instructions that guide the agent's reasoning..."
              className="w-full rounded-xl border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Compiled into Prompt Layer 1. Governs how the agent reasons, invokes tools, and responds.
            </p>
          </div>
        </div>

        {/* Step 4: Tool Capabilities */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold tracking-tight">Step 4: Tool Capabilities</h2>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {selectedToolIds.size} of {catalogTools.length} tools enabled
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {catalogTools.map((t) => {
              const isSelected = selectedToolIds.has(t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTool(t.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? "border-primary/50 bg-primary/5 shadow-2xs"
                      : "border-border/60 hover:bg-muted/10 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by container onClick
                      className="h-4 w-4 rounded accent-primary cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/agents"
            className="rounded-xl border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Provisioning Agent...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Deploy Agent & Open Dossier</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

