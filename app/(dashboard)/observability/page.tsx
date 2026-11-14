"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Zap,
  DollarSign,
  Clock,
  Cpu,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Layers,
} from "lucide-react";

interface TelemetrySummary {
  workspaceId: string;
  totalTokens: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalEstimatedCostUsd: number;
  totalInvocations: number;
  averageLatencyMs: number;
  modelDistribution: Record<string, { count: number; tokens: number; costUsd: number }>;
  topAgents: Array<{ agentId: string; tokens: number; costUsd: number; invocations: number }>;
  limits: {
    monthlyTokenBudget: number;
    monthlySpendLimitUsd: number;
    currentMonthTokens: number;
    currentMonthSpendUsd: number;
    percentUsed: number;
  };
}

interface UsageTrace {
  id: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: string;
  durationMs: number;
  status: string;
  createdAt: string;
  agentId: string | null;
}

export default function ObservabilityPage() {
  const [summary, setSummary] = useState<TelemetrySummary | null>(null);
  const [traces, setTraces] = useState<UsageTrace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframeDays, setTimeframeDays] = useState(30);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      // 1. Fetch user's primary workspace
      const wsRes = await fetch("/api/workspaces");
      if (!wsRes.ok) throw new Error("Failed to load workspace");
      const wsData = await wsRes.json();
      const primaryWsId =
        wsData.activeWorkspace?.id ||
        wsData.workspaces?.[0]?.id ||
        wsData.workspaces?.[0]?.workspaceId;

      if (!primaryWsId) {
        throw new Error("No active workspace found");
      }

      // 2. Fetch observability metrics for this workspace
      const obsRes = await fetch(
        `/api/workspaces/${primaryWsId}/observability?days=${timeframeDays}`,
      );
      if (!obsRes.ok) throw new Error("Failed to fetch observability telemetry");
      const obsData = await obsRes.json();

      setSummary(obsData.summary);
      setTraces(obsData.recentTraces || []);
    } catch (err: unknown) {
      console.error("Observability fetch error:", err);
      const message = err instanceof Error ? err.message : "Failed to load telemetry";
      setErrorNotice(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframeDays]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <Activity className="h-3.5 w-3.5" />
              <span>Live Agent Telemetry</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Observability & Cost Metering
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time token utilization, provider inference costs, latency analytics, and
              execution trace telemetry across your autonomous agent fleet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeframeDays}
              onChange={(e) => setTimeframeDays(Number(e.target.value))}
              className="rounded-xl border bg-background px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>

            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {errorNotice && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive font-medium">
          {errorNotice}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">
          Compiling telemetry and token metrics...
        </div>
      ) : summary ? (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tokens */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">Total Tokens</span>
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black">{summary.totalTokens.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>Prompt: {summary.totalPromptTokens.toLocaleString()}</span>
                <span>•</span>
                <span>Comp: {summary.totalCompletionTokens.toLocaleString()}</span>
              </div>
            </div>

            {/* Estimated Spend */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">Estimated Spend</span>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black">
                ${summary.totalEstimatedCostUsd.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Monthly Cap: ${summary.limits.monthlySpendLimitUsd.toFixed(2)}
              </div>
            </div>

            {/* Invocations */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">Total Turns</span>
                <Cpu className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black">{summary.totalInvocations.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Completed reasoning cycles</div>
            </div>

            {/* Average Latency */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">Avg Latency</span>
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black">
                {summary.averageLatencyMs.toLocaleString()} ms
              </div>
              <div className="text-xs text-muted-foreground">Wall-clock response time</div>
            </div>
          </div>

          {/* Budget Quota Bar */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Monthly Token Budget Utilization</h3>
                <p className="text-xs text-muted-foreground">
                  {summary.limits.currentMonthTokens.toLocaleString()} of{" "}
                  {summary.limits.monthlyTokenBudget.toLocaleString()} tokens used
                </p>
              </div>
              <span className="text-sm font-extrabold">{summary.limits.percentUsed}%</span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  summary.limits.percentUsed > 85
                    ? "bg-destructive"
                    : summary.limits.percentUsed > 60
                    ? "bg-amber-500"
                    : "bg-primary"
                }`}
                style={{ width: `${Math.min(100, summary.limits.percentUsed)}%` }}
              />
            </div>
          </div>

          {/* Model Breakdown & Agent Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Distribution */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-base">Model Distribution</h3>
              </div>

              {Object.keys(summary.modelDistribution).length === 0 ? (
                <div className="text-xs text-muted-foreground py-6 text-center">
                  No model calls recorded yet in this timeframe.
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(summary.modelDistribution).map(([model, data]) => (
                    <div
                      key={model}
                      className="flex items-center justify-between border-b pb-2 last:border-b-0 text-sm"
                    >
                      <div>
                        <div className="font-semibold font-mono text-xs">{model}</div>
                        <div className="text-xs text-muted-foreground">
                          {data.count} calls • {data.tokens.toLocaleString()} tokens
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs font-bold text-emerald-600">
                        ${data.costUsd.toFixed(5)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Agents */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-base">Agent Resource Consumption</h3>
              </div>

              {summary.topAgents.length === 0 ? (
                <div className="text-xs text-muted-foreground py-6 text-center">
                  No agent runs recorded yet in this timeframe.
                </div>
              ) : (
                <div className="space-y-3">
                  {summary.topAgents.map((ag) => (
                    <div
                      key={ag.agentId}
                      className="flex items-center justify-between border-b pb-2 last:border-b-0 text-sm"
                    >
                      <div>
                        <div className="font-semibold text-xs font-mono">
                          Agent ID: {ag.agentId.slice(0, 12)}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ag.invocations} turns • {ag.tokens.toLocaleString()} tokens
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs font-bold">
                        ${ag.costUsd.toFixed(5)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Traces Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Live Execution Traces</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recent autonomous turns with latency, token breakdown, and cost.
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Showing {traces.length} recent runs
              </span>
            </div>

            {traces.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No recent execution traces logged yet. Start a chat turn to see live telemetry!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Model</th>
                      <th className="py-3 px-4">Prompt</th>
                      <th className="py-3 px-4">Completion</th>
                      <th className="py-3 px-4">Total Tokens</th>
                      <th className="py-3 px-4">Latency</th>
                      <th className="py-3 px-4">Cost</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {traces.map((trace) => (
                      <tr key={trace.id} className="hover:bg-muted/20 transition-all font-mono">
                        <td className="py-3 px-4">
                          {trace.status === "success" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive font-semibold">
                              <XCircle className="h-3.5 w-3.5" />
                              ERR
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {trace.model}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {trace.promptTokens.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {trace.completionTokens.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold">
                          {trace.totalTokens.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-purple-600 font-medium">
                          {trace.durationMs}ms
                        </td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">
                          ${Number(trace.estimatedCostUsd).toFixed(5)}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(trace.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

