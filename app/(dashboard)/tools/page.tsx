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
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Terminal,
  Sparkles,
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

  // New Skill Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [skillId, setSkillId] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillType, setSkillType] = useState<"sandbox" | "integration" | "native">("sandbox");
  const [skillTier, setSkillTier] = useState<"read" | "write" | "dangerous">("write");
  const [skillParamName, setSkillParamName] = useState("query");
  const [skillParamDesc, setSkillParamDesc] = useState("The input parameter for the skill");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Test Runner State
  const [testingTool, setTestingTool] = useState<CatalogTool | null>(null);
  const [testArgs, setTestArgs] = useState<string>('{"query": "latest AI news"}');
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const loadTools = async () => {
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
  };

  useEffect(() => {
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

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillId || !skillName || !skillDesc) return;

    try {
      setIsSubmitting(true);
      setErrorNotice(null);

      const inputSchema = {
        type: "object",
        properties: {
          [skillParamName || "input"]: {
            type: "string",
            description: skillParamDesc || "Input value",
          },
        },
        required: [skillParamName || "input"],
      };

      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: skillId,
          name: skillName,
          description: skillDesc,
          executionType: skillType,
          permissionLevel: skillTier,
          requiresApproval: skillTier === "dangerous",
          inputSchema,
          bindToAllAgents: true,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create skill");
      }

      setIsCreateOpen(false);
      setSkillId("");
      setSkillName("");
      setSkillDesc("");
      await loadTools();
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunTest = async () => {
    if (!testingTool) return;
    try {
      setTestRunning(true);
      setTestResult(null);

      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(testArgs);
      } catch {
        parsedArgs = { input: testArgs };
      }

      const res = await fetch("/api/tools/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: testingTool.id,
          args: parsedArgs,
        }),
      });

      const json = await res.json();
      setTestResult(json);
    } catch (err: unknown) {
      setTestResult({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setTestRunning(false);
    }
  };

  const openTestDrawer = (tool: CatalogTool) => {
    setTestingTool(tool);
    setTestResult(null);
    const props = (tool.inputSchema?.properties as Record<string, any>) || {};
    const sampleObj: Record<string, string> = {};
    for (const key of Object.keys(props)) {
      sampleObj[key] = key.includes("query")
        ? "#AI trends"
        : key.includes("text")
        ? "Hello from Meow Agent!"
        : "sample_value";
    }
    setTestArgs(JSON.stringify(sampleObj, null, 2));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#f7f8f8]">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Extensible Agent Capability Matrix</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Agent Skills & Custom Tool Hub
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Every tool and skill exposed to autonomous agents executes through strict permission gates, sandboxing, and human-in-the-loop approvals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-xs font-bold shadow-md hover:bg-white/90 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Skill</span>
            </button>
            <button
              onClick={loadTools}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/70 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {errorNotice && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search skills & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0c0d10] pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 shadow-xs focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["all", "read", "write", "dangerous"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                tierFilter === tier
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-white/50 hover:text-white bg-white/5"
              }`}
            >
              {tier === "all" ? "All Tiers" : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 shadow-xs flex flex-col justify-between hover:border-white/20 transition-all space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {tool.name}
                  </h3>
                  <span className="text-[11px] font-mono text-indigo-400 font-semibold">{tool.id}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    tool.permissionLevel === "dangerous"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : tool.permissionLevel === "write"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {tool.permissionLevel}
                </span>
              </div>

              <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                {tool.description}
              </p>

              {tool.requiresApproval && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  <span>Human-in-the-loop authorization required</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2">
              <button
                onClick={() => openTestDrawer(tool)}
                className="flex-1 py-2 px-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Play className="h-3 w-3" />
                <span>Test Skill</span>
              </button>
              <button
                onClick={() => toggleSchema(tool.id)}
                className="py-2 px-3 rounded-xl border border-white/10 text-xs font-mono text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Schema
              </button>
            </div>

            {/* Collapsible Input Schema Viewer */}
            {expandedSchemaId === tool.id && (
              <div className="rounded-xl border border-white/[0.08] bg-black/60 p-3 text-[11px] font-mono text-indigo-300 overflow-x-auto space-y-1">
                <span className="text-[10px] uppercase text-white/40">Parameter Schema</span>
                <pre>{JSON.stringify(tool.inputSchema, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── CREATE SKILL MODAL ─── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0c0d10] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white">Create Custom Agent Skill</h3>
                <p className="text-xs text-white/50">Define and register a new tool for your agent runtime.</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Skill ID (Slug)</label>
                  <input
                    type="text"
                    required
                    placeholder="slack_post_message"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Display Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Post Slack Message"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Description & Agent Guidance</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explains to the LLM when and how to call this skill..."
                  value={skillDesc}
                  onChange={(e) => setSkillDesc(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Execution Type</label>
                  <select
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white"
                  >
                    <option value="sandbox">Sandboxed JavaScript</option>
                    <option value="integration">External Webhook / API</option>
                    <option value="native">Native Runtime</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Permission Tier</label>
                  <select
                    value={skillTier}
                    onChange={(e) => setSkillTier(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white"
                  >
                    <option value="read">Safe Read</option>
                    <option value="write">Workspace Write</option>
                    <option value="dangerous">Dangerous (Human Approval Required)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <label className="text-xs font-semibold text-white/70">Primary Parameter</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Parameter name (e.g. channel)"
                    value={skillParamName}
                    onChange={(e) => setSkillParamName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={skillParamDesc}
                    onChange={(e) => setSkillParamDesc(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Registering..." : "Save & Bind Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TEST RUNNER DRAWER ─── */}
      {testingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#0c0d10] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Play className="h-4 w-4 text-emerald-400" />
                  <span>Test Skill Execution: {testingTool.name}</span>
                </h3>
                <span className="text-xs font-mono text-indigo-400">{testingTool.id}</span>
              </div>
              <button
                onClick={() => setTestingTool(null)}
                className="p-1 rounded text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-white/70">Execution Arguments (JSON)</label>
              <textarea
                rows={4}
                value={testArgs}
                onChange={(e) => setTestArgs(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs font-mono text-indigo-300 shadow-inner focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleRunTest}
                disabled={testRunning}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {testRunning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                <span>Execute In Sandbox</span>
              </button>
              {testResult?.durationMs && (
                <span className="text-xs font-mono text-emerald-400">
                  Latency: {testResult.durationMs}ms
                </span>
              )}
            </div>

            {testResult && (
              <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                <span className="text-xs font-semibold text-white/70 font-mono uppercase">Execution Response</span>
                <div className="rounded-xl border border-white/[0.08] bg-black/70 p-3 text-xs font-mono text-emerald-300 max-h-60 overflow-y-auto">
                  <pre>{JSON.stringify(testResult, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
