/**
 * Meow Telemetry, Token Metering & Observability Engine
 *
 * Implements real-time token tracking, accurate provider cost calculation,
 * workspace usage aggregation, and budget quota enforcement.
 */

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  usageRecords,
  workspaceLimits,
  type NewUsageRecord,
  type UsageRecord,
  type WorkspaceLimit,
} from "@/db/schema";

export interface ModelPricing {
  promptCostPerMillion: number;
  completionCostPerMillion: number;
}

// Standard Provider Token Pricing Tables (as of 2026 in USD per 1M tokens)
export const MODEL_PRICING: Record<string, ModelPricing> = {
  // OpenAI
  "gpt-4o": { promptCostPerMillion: 2.5, completionCostPerMillion: 10.0 },
  "gpt-4o-mini": { promptCostPerMillion: 0.15, completionCostPerMillion: 0.6 },
  "gpt-4-turbo": { promptCostPerMillion: 10.0, completionCostPerMillion: 30.0 },
  "gpt-3.5-turbo": { promptCostPerMillion: 0.5, completionCostPerMillion: 1.5 },

  // Google Gemini
  "gemini-1.5-pro": { promptCostPerMillion: 1.25, completionCostPerMillion: 5.0 },
  "gemini-1.5-flash": { promptCostPerMillion: 0.075, completionCostPerMillion: 0.3 },
  "gemini-2.0-flash": { promptCostPerMillion: 0.1, completionCostPerMillion: 0.4 },

  // Anthropic Claude
  "claude-3-5-sonnet": { promptCostPerMillion: 3.0, completionCostPerMillion: 15.0 },
  "claude-3-haiku": { promptCostPerMillion: 0.25, completionCostPerMillion: 1.25 },

  // Default fallback rate for unknown models
  default: { promptCostPerMillion: 1.0, completionCostPerMillion: 3.0 },
};

export interface RecordUsageParams {
  workspaceId: string;
  agentId?: string;
  conversationId?: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  durationMs?: number;
  status?: "success" | "error" | "timed_out";
}

export interface WorkspaceTelemetrySummary {
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

export class TelemetryService {
  /**
   * Calculates accurate estimated USD cost from token counts and model pricing.
   */
  public static calculateCostUsd(
    model: string,
    promptTokens: number,
    completionTokens: number,
  ): number {
    const pricing = MODEL_PRICING[model] || MODEL_PRICING["default"];
    const promptCost = (promptTokens / 1_000_000) * pricing.promptCostPerMillion;
    const completionCost = (completionTokens / 1_000_000) * pricing.completionCostPerMillion;
    return Number((promptCost + completionCost).toFixed(6));
  }

  /**
   * Records token usage for an agent execution turn, updates workspace quotas,
   * and outputs structured JSON logs.
   */
  public static async recordUsage(params: RecordUsageParams): Promise<UsageRecord> {
    const promptTokens = Math.max(0, Math.floor(params.promptTokens));
    const completionTokens = Math.max(0, Math.floor(params.completionTokens));
    const totalTokens = promptTokens + completionTokens;
    const durationMs = params.durationMs ?? 0;
    const status = params.status ?? "success";

    const estimatedCostUsd = this.calculateCostUsd(
      params.model,
      promptTokens,
      completionTokens,
    );

    // 1. Insert immutable usage record
    const [record] = await db
      .insert(usageRecords)
      .values({
        workspaceId: params.workspaceId,
        agentId: params.agentId ?? null,
        conversationId: params.conversationId ?? null,
        model: params.model,
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd: estimatedCostUsd.toString(),
        durationMs,
        status,
      })
      .returning();

    // 2. Increment workspace limits/budget counters atomically
    await db
      .insert(workspaceLimits)
      .values({
        workspaceId: params.workspaceId,
        monthlyTokenBudget: 2_000_000,
        monthlySpendLimitUsd: "50.00",
        currentMonthTokens: totalTokens,
        currentMonthSpendUsd: estimatedCostUsd.toString(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: workspaceLimits.workspaceId,
        set: {
          currentMonthTokens: sql`${workspaceLimits.currentMonthTokens} + ${totalTokens}`,
          currentMonthSpendUsd: sql`${workspaceLimits.currentMonthSpendUsd} + ${estimatedCostUsd.toString()}::numeric`,
          updatedAt: new Date(),
        },
      });

    // 3. Structured telemetry emission
    this.emitStructuredLog({
      event: "agent_turn_completed",
      workspaceId: params.workspaceId,
      agentId: params.agentId,
      conversationId: params.conversationId,
      model: params.model,
      totalTokens,
      durationMs,
      estimatedCostUsd,
      status,
    });

    return record;
  }

  /**
   * Verifies if a workspace is within its monthly spend/token budget quota.
   */
  public static async checkBudgetQuota(workspaceId: string): Promise<{
    allowed: boolean;
    reason?: string;
    limits: WorkspaceLimit | null;
  }> {
    const [limits] = await db
      .select()
      .from(workspaceLimits)
      .where(eq(workspaceLimits.workspaceId, workspaceId))
      .limit(1);

    if (!limits) {
      return { allowed: true, limits: null };
    }

    const currentSpend = Number(limits.currentMonthSpendUsd);
    const maxSpend = Number(limits.monthlySpendLimitUsd);

    if (currentSpend >= maxSpend) {
      return {
        allowed: false,
        reason: `Monthly spend limit of $${maxSpend} exceeded (current spend: $${currentSpend.toFixed(2)})`,
        limits,
      };
    }

    if (limits.currentMonthTokens >= limits.monthlyTokenBudget) {
      return {
        allowed: false,
        reason: `Monthly token budget of ${limits.monthlyTokenBudget.toLocaleString()} tokens exceeded`,
        limits,
      };
    }

    return { allowed: true, limits };
  }

  /**
   * Aggregates telemetry stats across all runs in a workspace for dashboard display.
   */
  public static async getWorkspaceTelemetry(
    workspaceId: string,
    days: number = 30,
  ): Promise<WorkspaceTelemetrySummary> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Fetch records in timeframe
    const records = await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.workspaceId, workspaceId),
          gte(usageRecords.createdAt, cutoffDate),
        ),
      )
      .orderBy(desc(usageRecords.createdAt));

    let totalTokens = 0;
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalEstimatedCostUsd = 0;
    let totalDurationMs = 0;

    const modelDistribution: Record<string, { count: number; tokens: number; costUsd: number }> =
      {};
    const agentMap: Record<string, { tokens: number; costUsd: number; invocations: number }> = {};

    for (const r of records) {
      totalTokens += r.totalTokens;
      totalPromptTokens += r.promptTokens;
      totalCompletionTokens += r.completionTokens;
      const cost = Number(r.estimatedCostUsd);
      totalEstimatedCostUsd += cost;
      totalDurationMs += r.durationMs;

      // Model breakdown
      if (!modelDistribution[r.model]) {
        modelDistribution[r.model] = { count: 0, tokens: 0, costUsd: 0 };
      }
      modelDistribution[r.model].count += 1;
      modelDistribution[r.model].tokens += r.totalTokens;
      modelDistribution[r.model].costUsd = Number(
        (modelDistribution[r.model].costUsd + cost).toFixed(6),
      );

      // Agent breakdown
      const agentKey = r.agentId ?? "system";
      if (!agentMap[agentKey]) {
        agentMap[agentKey] = { tokens: 0, costUsd: 0, invocations: 0 };
      }
      agentMap[agentKey].tokens += r.totalTokens;
      agentMap[agentKey].costUsd = Number((agentMap[agentKey].costUsd + cost).toFixed(6));
      agentMap[agentKey].invocations += 1;
    }

    const topAgents = Object.entries(agentMap)
      .map(([agentId, data]) => ({ agentId, ...data }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 10);

    // Fetch limits
    const [limitsRecord] = await db
      .select()
      .from(workspaceLimits)
      .where(eq(workspaceLimits.workspaceId, workspaceId))
      .limit(1);

    const budget = limitsRecord?.monthlyTokenBudget ?? 2_000_000;
    const spendLimit = Number(limitsRecord?.monthlySpendLimitUsd ?? 50.0);
    const curTokens = limitsRecord?.currentMonthTokens ?? totalTokens;
    const curSpend = Number(limitsRecord?.currentMonthSpendUsd ?? totalEstimatedCostUsd);

    const percentUsed = Math.min(100, Math.round((curTokens / budget) * 100));

    return {
      workspaceId,
      totalTokens,
      totalPromptTokens,
      totalCompletionTokens,
      totalEstimatedCostUsd: Number(totalEstimatedCostUsd.toFixed(6)),
      totalInvocations: records.length,
      averageLatencyMs:
        records.length > 0 ? Math.round(totalDurationMs / records.length) : 0,
      modelDistribution,
      topAgents,
      limits: {
        monthlyTokenBudget: budget,
        monthlySpendLimitUsd: spendLimit,
        currentMonthTokens: curTokens,
        currentMonthSpendUsd: Number(curSpend.toFixed(6)),
        percentUsed,
      },
    };
  }

  /**
   * Structured JSON machine-parseable log emitter.
   */
  public static emitStructuredLog(logData: Record<string, unknown>): void {
    const entry = {
      timestamp: new Date().toISOString(),
      service: "meow-telemetry",
      level: "INFO",
      ...logData,
    };
    console.log(JSON.stringify(entry));
  }
}

