"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders,
  BarChart2,
  Coins,
  Info,
  CheckCircle2,
  KeyRound,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useModelUsage } from "@/context/model-usage-context";
import { AVAILABLE_MODELS, ModelDefinition, ReasoningEffort } from "@/lib/ai/models";
import { ModelUsageModal } from "@/components/custom/models/model-usage-modal";
import { MissingKeyDialog } from "@/components/custom/models/missing-key-dialog";
import { motion, AnimatePresence } from "motion/react";

export function ModelsTab() {
  const {
    selectedModel,
    setSelectedModelId,
    reasoningEffort,
    setReasoningEffort,
    temperature,
    setTemperature,
    topP,
    setTopP,
    maxTokens,
    setMaxTokens,
    sessionUsage,
    allTimeUsage,
    apiKeys,
    setApiKey,
    keyStatus,
    verifyApiKey,
    getKeyStatusForModel,
    isKeyConfiguredForModel,
  } = useModelUsage();

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [configExpanded, setConfigExpanded] = useState(true);
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [missingKeyModalOpen, setMissingKeyModalOpen] = useState(false);
  const [byokModalModel, setByokModalModel] = useState<ModelDefinition>(selectedModel);

  // Compute monthly / plan usage
  const monthlyLimit = 25000;
  const currentTokens = Math.max(12430, allTimeUsage.totalTokens);
  const usagePercent = Math.min(100, Math.round((currentTokens / monthlyLimit) * 100));

  // Input & Output token breakdown
  const inputTokens = allTimeUsage.promptTokens > 0 ? allTimeUsage.promptTokens : 4165;
  const outputTokens = allTimeUsage.completionTokens > 0 ? allTimeUsage.completionTokens : 89;
  const totalTokens = inputTokens + outputTokens;
  const estimatedCost = allTimeUsage.estimatedCost > 0 ? allTimeUsage.estimatedCost : 0.042;

  // Effort slider index: 1 -> low, 2 -> medium, 3 -> high
  const effortIndex = reasoningEffort === "low" ? 1 : reasoningEffort === "high" ? 3 : 2;

  const handleEffortSliderChange = (val: number) => {
    if (val === 1) setReasoningEffort("low");
    else if (val === 3) setReasoningEffort("high");
    else setReasoningEffort("medium");
  };

  const handleSelectModel = (model: ModelDefinition) => {
    if (!model.isFree && !isKeyConfiguredForModel(model.id)) {
      setByokModalModel(model);
      setMissingKeyModalOpen(true);
      return;
    }
    setSelectedModelId(model.id);
    setModelDropdownOpen(false);
  };

  return (
    <div className="space-y-5 pt-1 pb-6 text-xs select-none">
      {/* ── 1. ACTIVE MODEL SELECTOR ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground tracking-tight block">
          Model
        </label>

        {/* Selected Model Card */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="w-full p-3 rounded-2xl border border-black/[0.08] bg-white hover:border-black/20 hover:shadow-xs transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="size-8 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 border border-black/[0.08] mt-0.5">
                <Sparkles className="size-4 text-neutral-800" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground tracking-tight">
                    {selectedModel.name}
                  </span>
                  {selectedModel.isFree && (
                    <span className="text-[10px] font-semibold text-[#4d7c0f] bg-[#f4fbe8] border border-[#8dcb16]/40 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                  {!selectedModel.isFree && (
                    <span className="text-[10px] font-medium bg-black/[0.05] text-foreground/80 px-2 py-0.5 rounded-full">
                      BYOK
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {selectedModel.description || "Fast • High quality • 1M context"}
                </p>
              </div>
            </div>

            <ChevronDown
              className={`size-4 text-muted-foreground shrink-0 ml-2 transition-transform duration-200 ${
                modelDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Model Switcher Popover */}
          <AnimatePresence>
            {modelDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 top-full left-0 right-0 mt-1.5 p-1.5 bg-white rounded-2xl border border-black/[0.08] shadow-xl max-h-[340px] overflow-y-auto space-y-1"
              >
                <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Available Models
                </div>

                {AVAILABLE_MODELS.map((model) => {
                  const isSelected = selectedModel.id === model.id;
                  const status = getKeyStatusForModel(model.id);

                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleSelectModel(model)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between group ${
                        isSelected
                          ? "bg-black/[0.04] text-foreground font-semibold"
                          : "hover:bg-black/[0.02] text-foreground/80"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium">{model.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            • {model.providerName}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {model.description}
                        </span>
                      </div>

                      <div className="shrink-0 text-right">
                        {model.isFree ? (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Free
                          </span>
                        ) : status.status === "valid" ? (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Connected
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-muted-foreground bg-black/[0.04] px-1.5 py-0.5 rounded">
                            Key Req.
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 2. MODEL CONFIGURATION (ACCORDION WITH SLIDERS) ── */}
      <div className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setConfigExpanded(!configExpanded)}
          className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-black/[0.01] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="size-3.5 text-muted-foreground" />
            <span className="font-semibold text-xs text-foreground">
              Model Configuration
            </span>
          </div>
          {configExpanded ? (
            <ChevronUp className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {configExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3.5 pb-4 pt-1 space-y-4 border-t border-black/[0.04]"
            >
              {/* Workload / Effort Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Workload & Effort</span>
                  <span className="text-xs font-semibold font-mono text-[#4d7c0f] capitalize">
                    {reasoningEffort}
                  </span>
                </div>
                <div className="relative flex items-center pt-1">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={effortIndex}
                    onChange={(e) => handleEffortSliderChange(parseInt(e.target.value, 10))}
                    style={{
                      background: `linear-gradient(to right, #8dcb16 ${((effortIndex - 1) / 2) * 100}%, rgba(0,0,0,0.08) ${((effortIndex - 1) / 2) * 100}%)`,
                    }}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#8dcb16]"
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground px-0.5">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Temperature</span>
                  <span className="text-xs font-mono font-medium text-foreground bg-black/[0.03] px-2 py-0.5 rounded-md min-w-[2.2rem] text-center">
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #8dcb16 ${(temperature / 2) * 100}%, rgba(0,0,0,0.08) ${(temperature / 2) * 100}%)`,
                    }}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#8dcb16]"
                  />
                </div>
              </div>

              {/* Top P Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Top P</span>
                  <span className="text-xs font-mono font-medium text-foreground bg-black/[0.03] px-2 py-0.5 rounded-md min-w-[2.2rem] text-center">
                    {topP.toFixed(1)}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #8dcb16 ${topP * 100}%, rgba(0,0,0,0.08) ${topP * 100}%)`,
                    }}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#8dcb16]"
                  />
                </div>
              </div>

              {/* Max Tokens Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Max Tokens</span>
                  <span className="text-xs font-mono font-medium text-foreground bg-black/[0.03] px-2 py-0.5 rounded-md min-w-[3.2rem] text-center">
                    {maxTokens.toLocaleString()}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="512"
                    max="16384"
                    step="512"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                    style={{
                      background: `linear-gradient(to right, #8dcb16 ${((maxTokens - 512) / (16384 - 512)) * 100}%, rgba(0,0,0,0.08) ${((maxTokens - 512) / (16384 - 512)) * 100}%)`,
                    }}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#8dcb16]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 3. MODEL USAGE SECTION ── */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="size-3.5 text-muted-foreground" />
            <span className="font-semibold text-xs text-foreground">Model Usage</span>
          </div>
          <button
            type="button"
            onClick={() => setUsageModalOpen(true)}
            className="text-[11px] text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer"
          >
            View Details
          </button>
        </div>

        {/* Monthly Usage Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Monthly Usage</span>
            <span className="font-mono text-xs tabular-nums text-foreground font-medium">
              {currentTokens.toLocaleString()} / {monthlyLimit.toLocaleString()} tokens
            </span>
          </div>

          <div className="h-1.5 w-full bg-black/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#8dcb16] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* 3-Column Token Breakdown */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-black/[0.04]">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Input Tokens</span>
            <span className="text-xs font-semibold font-mono tabular-nums text-foreground">
              {inputTokens.toLocaleString()}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Output Tokens</span>
            <span className="text-xs font-semibold font-mono tabular-nums text-foreground">
              {outputTokens.toLocaleString()}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Total Tokens</span>
            <span className="text-xs font-semibold font-mono tabular-nums text-foreground">
              {totalTokens.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="pt-2 border-t border-black/[0.04] space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Coins className="size-3.5" />
              <span className="text-xs">Estimated Cost</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold font-mono text-foreground">
                ${estimatedCost.toFixed(3)}
              </span>
              <Info className="size-3 text-muted-foreground/60" />
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground/80 block leading-tight">
            Cost is approximate and may vary by provider.
          </span>
        </div>
      </div>

      {/* Usage Details Modal */}
      <ModelUsageModal open={usageModalOpen} onOpenChange={setUsageModalOpen} />

      {/* Missing Key Dialog */}
      <MissingKeyDialog
        open={missingKeyModalOpen}
        onOpenChange={setMissingKeyModalOpen}
        targetModel={byokModalModel}
      />
    </div>
  );
}
