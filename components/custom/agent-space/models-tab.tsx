"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useModelUsage } from "@/context/model-usage-context";
import { AVAILABLE_MODELS, ModelDefinition, ReasoningEffort, EFFORT_CONFIG } from "@/lib/ai/models";
import {
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cpu,
  BarChart3,
  Coins,
  Zap,
  Sliders,
  ShieldAlert,
} from "lucide-react";

export function ModelsTab() {
  const {
    selectedModel,
    setSelectedModelId,
    reasoningEffort,
    setReasoningEffort,
    apiKeys,
    setApiKey,
    keyStatus,
    verifyApiKey,
    sessionUsage,
    allTimeUsage,
    isKeyConfiguredForModel,
    getKeyStatusForModel,
  } = useModelUsage();

  const [verifyingProvider, setVerifyingProvider] = useState<string | null>(null);

  const handleTestKey = async (provider: string) => {
    setVerifyingProvider(provider);
    await verifyApiKey(provider);
    setVerifyingProvider(null);
  };

  const providers = [
    {
      id: "anthropic",
      name: "Anthropic",
      models: "Claude 3.7 Sonnet, Claude 3.5 Sonnet, Claude 3.5 Haiku",
      placeholder: "sk-ant-api03-...",
      docsUrl: "https://console.anthropic.com/settings/keys",
    },
    {
      id: "openai",
      name: "OpenAI",
      models: "GPT-4o, GPT-4.5, o3-mini",
      placeholder: "sk-proj-...",
      docsUrl: "https://platform.openai.com/api-keys",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      models: "DeepSeek R1, DeepSeek V3",
      placeholder: "sk-...",
      docsUrl: "https://platform.deepseek.com/api_keys",
    },
    {
      id: "google",
      name: "Google Gemini (Custom Key)",
      models: "Gemini 3 Pro (Note: Gemini 3 Flash is already free)",
      placeholder: "AIzaSy...",
      docsUrl: "https://aistudio.google.com/app/apikey",
    },
  ];

  const formatTokens = (count: number) => new Intl.NumberFormat().format(count);
  const formatCost = (cost: number) => (cost === 0 ? "$0.00" : `$${cost.toFixed(3)}`);

  return (
    <div className="space-y-6 pt-3 pb-8 text-xs select-none">
      {/* --- SECTION 1: WORKLOAD & REASONING EFFORT --- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Sliders className="size-3.5 text-primary" />
            <span>Workload & Reasoning Effort</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            Multi-Pass Reasoning Intensity
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["low", "medium", "high"] as ReasoningEffort[]).map((level) => {
            const conf = EFFORT_CONFIG[level];
            const isSelected = reasoningEffort === level;

            return (
              <button
                key={level}
                type="button"
                onClick={() => setReasoningEffort(level)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-primary/10 border-primary text-foreground shadow-2xs"
                    : "bg-surface-1 border-border-subtle hover:bg-surface-2 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{conf.label.split(" ")[0]}</span>
                  <span className="font-mono text-xs text-primary">{conf.bars}</span>
                </div>
                <span className="text-[10px] leading-tight block opacity-85">
                  {conf.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 2: MODEL SELECTION --- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Cpu className="size-3.5 text-primary" />
            <span>Active Coding & Agent Model</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            Frontier Architecture
          </span>
        </div>

        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {AVAILABLE_MODELS.map((model) => {
            const isSelected = selectedModel.id === model.id;
            const status = getKeyStatusForModel(model.id);

            return (
              <div
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-surface-2 border-primary shadow-xs"
                    : "bg-surface-1 border-border-subtle hover:border-foreground/20 hover:bg-surface-2/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">{model.name}</span>
                      <Badge variant="outline" className="text-[9px] font-mono px-1 py-0">
                        {model.providerName}
                      </Badge>
                      {model.isFree ? (
                        <span className="text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                          Free Default
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 px-1.5 py-0.2 rounded">
                          BYOK
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {model.description}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 text-right">
                    {model.isFree ? (
                      <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        <span>Ready</span>
                      </span>
                    ) : status.status === "valid" ? (
                      <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        <span>Connected</span>
                      </span>
                    ) : status.status === "exhausted" ? (
                      <span className="text-[10px] font-mono text-rose-500 flex items-center gap-1">
                        <ShieldAlert className="size-3" />
                        <span>Exhausted</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-500 flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        <span>Key Required</span>
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-muted-foreground block mt-0.5">
                      {model.isFree ? "Free" : `$${model.pricing.inputPerMillion}/1M in`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 3: PROVIDER API KEYS (BYOK) --- */}
      <div className="space-y-3 pt-2 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <KeyRound className="size-3.5 text-primary" />
            <span>Bring Your Own Key (BYOK)</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            Client-Side Encrypted
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Meow Bot covers Gemini 3 Flash for free. To use Anthropic Claude, OpenAI, or DeepSeek, enter your API keys below and test connection.
        </p>

        <div className="space-y-3">
          {providers.map((p) => {
            const currentKey = apiKeys[p.id] || "";
            const status = keyStatus[p.id] || { status: "not_configured" };
            const isTesting = verifyingProvider === p.id;

            return (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-border-subtle bg-surface-1 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-foreground block">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground">{p.models}</span>
                  </div>

                  {/* Status Badge */}
                  {status.status === "valid" ? (
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border-emerald-500/20 gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>Connected {status.latencyMs ? `(${status.latencyMs}ms)` : ""}</span>
                    </Badge>
                  ) : status.status === "exhausted" ? (
                    <Badge variant="outline" className="text-[10px] font-mono text-rose-500 bg-rose-500/10 border-rose-500/20 gap-1">
                      <ShieldAlert className="size-3" />
                      <span>Quota Depleted</span>
                    </Badge>
                  ) : status.status === "invalid" ? (
                    <Badge variant="outline" className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border-amber-500/20 gap-1">
                      <AlertTriangle className="size-3" />
                      <span>Invalid Key</span>
                    </Badge>
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground">Not configured</span>
                  )}
                </div>

                {/* Input + Test Button */}
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    placeholder={p.placeholder}
                    value={currentKey}
                    onChange={(e) => setApiKey(p.id, e.target.value)}
                    className="text-xs font-mono h-8 bg-surface-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!currentKey.trim() || isTesting}
                    onClick={() => handleTestKey(p.id)}
                    className="h-8 text-xs px-2.5 shrink-0 gap-1 font-sans"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        <span>Testing...</span>
                      </>
                    ) : (
                      <span>Verify</span>
                    )}
                  </Button>
                </div>

                {/* Error Banner if validation failed */}
                {status.error && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400">
                    {status.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 4: TOKEN USAGE & BILLING SUMMARY --- */}
      <div className="space-y-3 pt-2 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <BarChart3 className="size-3.5 text-primary" />
            <span>Token Consumption & Billing</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 font-semibold">
            Session: {formatCost(sessionUsage.estimatedCost)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg border border-border-subtle bg-surface-1">
            <span className="text-[10px] text-muted-foreground block font-mono">Session Tokens</span>
            <span className="text-sm font-bold font-mono text-foreground">
              {formatTokens(sessionUsage.totalTokens)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg border border-border-subtle bg-surface-1">
            <span className="text-[10px] text-muted-foreground block font-mono">All-Time Spend</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatCost(allTimeUsage.estimatedCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
