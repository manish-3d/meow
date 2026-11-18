"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModelUsage } from "@/context/model-usage-context";
import { AVAILABLE_MODELS, ModelDefinition, ReasoningEffort, EFFORT_CONFIG } from "@/lib/ai/models";
import { MissingKeyDialog } from "./missing-key-dialog";
import { ModelUsageModal } from "./model-usage-modal";
import {
  ChevronDown,
  Sparkles,
  BarChart3,
  Sliders,
  Check,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface ModelSelectorBarProps {
  className?: string;
  compact?: boolean;
}

export function ModelSelectorBar({ className = "", compact = false }: ModelSelectorBarProps) {
  const {
    selectedModel,
    setSelectedModelId,
    reasoningEffort,
    setReasoningEffort,
    isKeyConfiguredForModel,
    getKeyStatusForModel,
    sessionUsage,
  } = useModelUsage();

  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [missingKeyModalOpen, setMissingKeyModalOpen] = useState(false);
  const [targetMissingModel, setTargetMissingModel] = useState<ModelDefinition>(selectedModel);

  const handleSelectModel = (model: ModelDefinition) => {
    setSelectedModelId(model.id);

    // If model requires an API key and user hasn't configured it, open dialog
    if (!model.isFree && !isKeyConfiguredForModel(model.id)) {
      setTargetMissingModel(model);
      setMissingKeyModalOpen(true);
    }
  };

  const currentStatus = getKeyStatusForModel(selectedModel.id);
  const effortConfig = EFFORT_CONFIG[reasoningEffort] || EFFORT_CONFIG.medium;

  // Group models by provider
  const googleModels = AVAILABLE_MODELS.filter((m) => m.provider === "google");
  const anthropicModels = AVAILABLE_MODELS.filter((m) => m.provider === "anthropic");
  const openaiModels = AVAILABLE_MODELS.filter((m) => m.provider === "openai");
  const deepseekModels = AVAILABLE_MODELS.filter((m) => m.provider === "deepseek");

  // Format token counts
  const formatTokens = (count: number) => {
    if (count > 999999) return `${(count / 1000000).toFixed(1)}M`;
    if (count > 999) return `${(count / 1000).toFixed(1)}k`;
    return `${count}`;
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return "$0.00";
    if (cost < 0.01) return `< $0.01`;
    return `$${cost.toFixed(2)}`;
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {/* --- 1. MODEL SELECTOR DROPDOWN --- */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-border-subtle bg-surface-1 hover:bg-surface-2 h-7 gap-1.5 px-2.5 font-sans transition-all active:scale-[0.98] shadow-2xs cursor-pointer select-none text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {selectedModel.isFree ? (
              <Sparkles className="size-3 text-emerald-500 shrink-0" />
            ) : (
              <Zap className="size-3 text-sky-500 shrink-0" />
            )}
            <span className="font-medium text-foreground truncate max-w-[130px] sm:max-w-none">
              {selectedModel.name}
            </span>

            {/* Status pill */}
            {selectedModel.isFree ? (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                Free
              </span>
            ) : currentStatus.status === "valid" ? (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ● Ready
              </span>
            ) : currentStatus.status === "exhausted" ? (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20">
                Quota Exhausted
              </span>
            ) : (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-0.5">
                <AlertTriangle className="size-2.5" />
                Key Required
              </span>
            )}
          </div>
          <ChevronDown className="size-3 text-muted-foreground shrink-0 ml-0.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-72 max-h-[75vh] overflow-y-auto p-1.5">
          {/* Default Free Tier */}
          <DropdownMenuLabel className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-2 py-1">
            Meow Built-In (Free)
          </DropdownMenuLabel>
          {googleModels
            .filter((m) => m.isFree)
            .map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="flex items-center justify-between text-xs px-2 py-1.5 cursor-pointer rounded-md"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{model.name}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                      Free Default
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">{model.recommendedFor}</span>
                </div>
                {selectedModel.id === model.id && <Check className="size-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            ))}

          <DropdownMenuSeparator className="my-1" />

          {/* Anthropic Section */}
          <DropdownMenuLabel className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-2 py-1">
            Anthropic (BYOK)
          </DropdownMenuLabel>
          {anthropicModels.map((model) => {
            const hasKey = isKeyConfiguredForModel(model.id);
            return (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="flex items-center justify-between text-xs px-2 py-1.5 cursor-pointer rounded-md"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{model.name}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">${model.pricing.inputPerMillion}/1M</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {hasKey ? "Key Connected" : "Requires API Key"}
                  </span>
                </div>
                {selectedModel.id === model.id && <Check className="size-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-1" />

          {/* OpenAI Section */}
          <DropdownMenuLabel className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-2 py-1">
            OpenAI (BYOK)
          </DropdownMenuLabel>
          {openaiModels.map((model) => {
            const hasKey = isKeyConfiguredForModel(model.id);
            return (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="flex items-center justify-between text-xs px-2 py-1.5 cursor-pointer rounded-md"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{model.name}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">${model.pricing.inputPerMillion}/1M</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {hasKey ? "Key Connected" : "Requires API Key"}
                  </span>
                </div>
                {selectedModel.id === model.id && <Check className="size-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-1" />

          {/* DeepSeek Section */}
          <DropdownMenuLabel className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-2 py-1">
            DeepSeek (BYOK)
          </DropdownMenuLabel>
          {deepseekModels.map((model) => {
            const hasKey = isKeyConfiguredForModel(model.id);
            return (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="flex items-center justify-between text-xs px-2 py-1.5 cursor-pointer rounded-md"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{model.name}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">${model.pricing.inputPerMillion}/1M</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {hasKey ? "Key Connected" : "Requires API Key"}
                  </span>
                </div>
                {selectedModel.id === model.id && <Check className="size-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-1" />

          {/* Google Frontier Section */}
          <DropdownMenuLabel className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-2 py-1">
            Google Frontier (BYOK)
          </DropdownMenuLabel>
          {googleModels
            .filter((m) => !m.isFree)
            .map((model) => {
              const hasKey = isKeyConfiguredForModel(model.id);
              return (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className="flex items-center justify-between text-xs px-2 py-1.5 cursor-pointer rounded-md"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{model.name}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">${model.pricing.inputPerMillion}/1M</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {hasKey ? "Key Connected" : "Requires API Key"}
                    </span>
                  </div>
                  {selectedModel.id === model.id && <Check className="size-3.5 text-primary shrink-0" />}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- 2. WORKLOAD / EFFORT BAR (Low / Med / High) --- */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-border-subtle bg-surface-1 hover:bg-surface-2 h-7 gap-1.5 px-2 font-mono transition-all active:scale-[0.98] shadow-2xs cursor-pointer select-none text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
          title="Adjust reasoning and workload intensity"
        >
          <Sliders className="size-3 text-muted-foreground" />
          <span className="hidden sm:inline text-muted-foreground">Workload:</span>
          <span className="font-semibold text-foreground">{effortConfig.label.split(" ")[0]}</span>
          <span className="text-primary tracking-tighter text-[11px]">{effortConfig.bars}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-60 p-1.5">
          <DropdownMenuLabel className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-2 py-1">
            Reasoning & Workload Effort
          </DropdownMenuLabel>

          {(["low", "medium", "high"] as ReasoningEffort[]).map((level) => {
            const conf = EFFORT_CONFIG[level];
            const isSelected = reasoningEffort === level;

            return (
              <DropdownMenuItem
                key={level}
                onClick={() => setReasoningEffort(level)}
                className={`flex items-start justify-between text-xs p-2 cursor-pointer rounded-md ${
                  isSelected ? "bg-surface-2" : ""
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{conf.label}</span>
                    <span className="font-mono text-[10px] text-primary">{conf.bars}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block leading-tight">
                    {conf.description}
                  </span>
                </div>
                {isSelected && <Check className="size-3.5 text-primary shrink-0 mt-0.5" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- 3. MODEL USAGE & BILLING BUTTON --- */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setUsageModalOpen(true)}
        className="h-7 text-xs gap-1.5 px-2.5 font-mono border-border-subtle bg-surface-1 hover:bg-surface-2 transition-all active:scale-[0.98] shadow-2xs text-muted-foreground hover:text-foreground"
        title="View Token Usage & Billing metrics"
      >
        <BarChart3 className="size-3 text-primary" />
        <span className="font-medium text-foreground">
          {formatTokens(sessionUsage.totalTokens)} tok
        </span>
        <span className="hidden sm:inline text-muted-foreground">•</span>
        <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400 font-medium">
          {formatCost(sessionUsage.estimatedCost)}
        </span>
      </Button>

      {/* Missing API Key Dialog */}
      <MissingKeyDialog
        open={missingKeyModalOpen}
        onOpenChange={setMissingKeyModalOpen}
        targetModel={targetMissingModel}
        isExhausted={currentStatus.status === "exhausted"}
      />

      {/* Detailed Token & Billing Modal */}
      <ModelUsageModal
        open={usageModalOpen}
        onOpenChange={setUsageModalOpen}
      />
    </div>
  );
}
