"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModelUsage } from "@/context/model-usage-context";
import { AVAILABLE_MODELS, getModelById, EFFORT_CONFIG } from "@/lib/ai/models";
import {
  BarChart3,
  Coins,
  Cpu,
  Layers,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ModelUsageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModelUsageModal({ open, onOpenChange }: ModelUsageModalProps) {
  const {
    selectedModel,
    reasoningEffort,
    sessionUsage,
    allTimeUsage,
    modelBreakdown,
    resetSessionUsage,
    getKeyStatusForModel,
  } = useModelUsage();

  const effortInfo = EFFORT_CONFIG[reasoningEffort] || EFFORT_CONFIG.medium;
  const statusInfo = getKeyStatusForModel(selectedModel.id);

  // Format currency
  const formatCost = (cost: number) => {
    if (cost === 0) return "$0.000";
    if (cost < 0.001) return `< $0.001`;
    return `$${cost.toFixed(4)}`;
  };

  // Format token counts
  const formatTokens = (count: number) => {
    return new Intl.NumberFormat().format(count);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BarChart3 className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Model Usage & Billing</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Real-time token metrics, frontier pricing, and reasoning workload.
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSessionUsage}
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
              title="Reset session counters"
            >
              <RotateCcw className="size-3" />
              <span>Reset Session</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-2">
          {/* Active Model Snapshot Card */}
          <div className="p-3.5 rounded-xl border border-border bg-surface-2 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{selectedModel.name}</span>
                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                  {selectedModel.providerName}
                </Badge>
                {selectedModel.isFree ? (
                  <span className="text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    Free Tier
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded">
                    BYOK
                  </span>
                )}
              </div>

              {/* Workload Effort Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <span>Workload:</span>
                <span className="font-semibold text-foreground">{effortInfo.label}</span>
                <span className="text-primary">{effortInfo.bars}</span>
              </div>
            </div>

            {/* Pricing Rates */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">Input Pricing</span>
                <span className="font-mono font-medium text-foreground">
                  {selectedModel.isFree ? "Free ($0.00)" : `$${selectedModel.pricing.inputPerMillion} / 1M`}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Output Pricing</span>
                <span className="font-mono font-medium text-foreground">
                  {selectedModel.isFree ? "Free ($0.00)" : `$${selectedModel.pricing.outputPerMillion} / 1M`}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Context Window</span>
                <span className="font-mono font-medium text-foreground">
                  {selectedModel.contextWindow}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Session Tokens */}
            <div className="p-3 rounded-xl border border-border bg-surface-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono mb-1">
                <Cpu className="size-3 text-primary" />
                <span>Session Tokens</span>
              </div>
              <span className="text-base font-bold font-mono text-foreground block">
                {formatTokens(sessionUsage.totalTokens)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                In: {formatTokens(sessionUsage.promptTokens)} • Out: {formatTokens(sessionUsage.completionTokens)}
              </span>
            </div>

            {/* 2. Session Cost */}
            <div className="p-3 rounded-xl border border-border bg-surface-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono mb-1">
                <Coins className="size-3 text-emerald-500" />
                <span>Session Cost</span>
              </div>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                {formatCost(sessionUsage.estimatedCost)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {selectedModel.isFree ? "Covered by Meow" : "BYOK Billing"}
              </span>
            </div>

            {/* 3. All-Time Tokens */}
            <div className="p-3 rounded-xl border border-border bg-surface-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono mb-1">
                <Layers className="size-3 text-blue-500" />
                <span>All-Time Tokens</span>
              </div>
              <span className="text-base font-bold font-mono text-foreground block">
                {formatTokens(allTimeUsage.totalTokens)}
              </span>
              <span className="text-[10px] text-muted-foreground">Lifetime across models</span>
            </div>

            {/* 4. All-Time Cost */}
            <div className="p-3 rounded-xl border border-border bg-surface-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono mb-1">
                <ShieldCheck className="size-3 text-violet-500" />
                <span>All-Time Cost</span>
              </div>
              <span className="text-base font-bold font-mono text-foreground block">
                {formatCost(allTimeUsage.estimatedCost)}
              </span>
              <span className="text-[10px] text-muted-foreground">Estimated spend</span>
            </div>
          </div>

          {/* Model Breakdown Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Model Breakdown</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {Object.keys(modelBreakdown).length} models utilized
              </span>
            </div>

            {Object.keys(modelBreakdown).length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-1">
                <span>No conversation tokens recorded in this session yet.</span>
                <span className="text-[10px] block text-muted-foreground/80">
                  Send a message to your agent to track live consumption.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(modelBreakdown).map(([mId, stats]) => {
                  const m = getModelById(mId);
                  const percentOfTotal =
                    sessionUsage.totalTokens > 0
                      ? Math.min(100, Math.round((stats.totalTokens / sessionUsage.totalTokens) * 100))
                      : 0;

                  return (
                    <div
                      key={mId}
                      className="p-3 rounded-lg border border-border bg-surface-1 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{m.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {stats.messageCount} msg{stats.messageCount === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-muted-foreground">
                            {formatTokens(stats.totalTokens)} tok
                          </span>
                          <span className="font-semibold text-foreground">
                            {m.isFree ? "Free" : formatCost(stats.cost)}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${percentOfTotal || 5}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">Zero Markup Guarantee</span>
              Meow Bot provides Gemini 2.5 Flash at zero cost. When using your own API keys for Claude, OpenAI, or DeepSeek, tokens are billed directly to your provider account with no platform fee.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
