"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AVAILABLE_MODELS, getModelById, ReasoningEffort, ModelDefinition, EFFORT_CONFIG } from "@/lib/ai/models";

export interface KeyStatusInfo {
  status: "not_configured" | "valid" | "invalid" | "exhausted";
  latencyMs?: number;
  error?: string;
  lastChecked?: number;
}

export interface ModelUsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  messageCount: number;
}

interface ModelUsageContextType {
  selectedModel: ModelDefinition;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  reasoningEffort: ReasoningEffort;
  setReasoningEffort: (effort: ReasoningEffort) => void;
  apiKeys: Record<string, string>;
  setApiKey: (provider: string, key: string) => void;
  keyStatus: Record<string, KeyStatusInfo>;
  verifyApiKey: (provider: string) => Promise<{ valid: boolean; status: string; error?: string }>;
  sessionUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
  allTimeUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
  modelBreakdown: Record<string, ModelUsageStats>;
  recordUsage: (modelId: string, promptTokens: number, completionTokens: number) => void;
  resetSessionUsage: () => void;
  isKeyConfiguredForModel: (modelId: string) => boolean;
  getKeyStatusForModel: (modelId: string) => KeyStatusInfo;
}

const ModelUsageContext = createContext<ModelUsageContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MODEL: "meow_selected_model_id",
  EFFORT: "meow_reasoning_effort",
  KEYS: "meow_provider_api_keys",
  KEY_STATUS: "meow_key_status",
  ALL_TIME: "meow_all_time_token_usage",
  BREAKDOWN: "meow_model_token_breakdown",
};

export function ModelUsageProvider({ children }: { children: React.ReactNode }) {
  const [selectedModelId, setSelectedModelIdState] = useState<string>("gemini-2.5-flash");
  const [reasoningEffort, setReasoningEffortState] = useState<ReasoningEffort>("medium");
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    google: "",
    anthropic: "",
    openai: "",
    deepseek: "",
  });
  const [keyStatus, setKeyStatus] = useState<Record<string, KeyStatusInfo>>({
    google: { status: "not_configured" },
    anthropic: { status: "not_configured" },
    openai: { status: "not_configured" },
    deepseek: { status: "not_configured" },
  });

  const [sessionUsage, setSessionUsage] = useState({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
  });

  const [allTimeUsage, setAllTimeUsage] = useState({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
  });

  const [modelBreakdown, setModelBreakdown] = useState<Record<string, ModelUsageStats>>({});

  // 1. Hydrate state from localStorage on mount
  useEffect(() => {
    try {
      const savedModel = localStorage.getItem(STORAGE_KEYS.MODEL);
      if (savedModel && AVAILABLE_MODELS.some((m) => m.id === savedModel)) {
        setSelectedModelIdState(savedModel);
      }

      const savedEffort = localStorage.getItem(STORAGE_KEYS.EFFORT) as ReasoningEffort;
      if (savedEffort && ["low", "medium", "high"].includes(savedEffort)) {
        setReasoningEffortState(savedEffort);
      }

      const savedKeys = localStorage.getItem(STORAGE_KEYS.KEYS);
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }

      const savedStatus = localStorage.getItem(STORAGE_KEYS.KEY_STATUS);
      if (savedStatus) {
        setKeyStatus(JSON.parse(savedStatus));
      }

      const savedAllTime = localStorage.getItem(STORAGE_KEYS.ALL_TIME);
      if (savedAllTime) {
        setAllTimeUsage(JSON.parse(savedAllTime));
      }

      const savedBreakdown = localStorage.getItem(STORAGE_KEYS.BREAKDOWN);
      if (savedBreakdown) {
        setModelBreakdown(JSON.parse(savedBreakdown));
      }
    } catch (e) {
      console.warn("Could not load model settings from localStorage:", e);
    }
  }, []);

  const setSelectedModelId = useCallback((id: string) => {
    setSelectedModelIdState(id);
    try {
      localStorage.setItem(STORAGE_KEYS.MODEL, id);
    } catch {}
  }, []);

  const setReasoningEffort = useCallback((effort: ReasoningEffort) => {
    setReasoningEffortState(effort);
    try {
      localStorage.setItem(STORAGE_KEYS.EFFORT, effort);
    } catch {}
  }, []);

  const setApiKey = useCallback((provider: string, key: string) => {
    setApiKeys((prev) => {
      const updated = { ...prev, [provider]: key.trim() };
      try {
        localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Reset status to unverified if key changed
    setKeyStatus((prev) => {
      const updated = {
        ...prev,
        [provider]: key.trim() ? { status: "not_configured" as const } : { status: "not_configured" as const },
      };
      try {
        localStorage.setItem(STORAGE_KEYS.KEY_STATUS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Live test & verify API key against provider
  const verifyApiKey = useCallback(
    async (provider: string) => {
      const keyToTest = apiKeys[provider]?.trim();
      if (!keyToTest) {
        const result: KeyStatusInfo = { status: "not_configured" };
        setKeyStatus((prev) => ({ ...prev, [provider]: result }));
        return { valid: false, status: "not_configured", error: "Please enter an API key first." };
      }

      try {
        const res = await fetch("/api/models/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, apiKey: keyToTest }),
        });

        const data = await res.json();
        const newStatus: KeyStatusInfo = {
          status: data.status,
          latencyMs: data.latencyMs,
          error: data.error,
          lastChecked: Date.now(),
        };

        setKeyStatus((prev) => {
          const updated = { ...prev, [provider]: newStatus };
          try {
            localStorage.setItem(STORAGE_KEYS.KEY_STATUS, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        return data;
      } catch (err: any) {
        const errorStatus: KeyStatusInfo = {
          status: "invalid",
          error: err.message || "Network error verifying key",
          lastChecked: Date.now(),
        };

        setKeyStatus((prev) => {
          const updated = { ...prev, [provider]: errorStatus };
          try {
            localStorage.setItem(STORAGE_KEYS.KEY_STATUS, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        return { valid: false, status: "invalid", error: err.message };
      }
    },
    [apiKeys]
  );

  // Record usage after every chat message
  const recordUsage = useCallback((modelId: string, promptTokens: number, completionTokens: number) => {
    const model = getModelById(modelId);
    const total = promptTokens + completionTokens;

    // Calculate cost in USD
    const inputCost = (promptTokens / 1_000_000) * model.pricing.inputPerMillion;
    const outputCost = (completionTokens / 1_000_000) * model.pricing.outputPerMillion;
    const msgCost = inputCost + outputCost;

    setSessionUsage((prev) => ({
      promptTokens: prev.promptTokens + promptTokens,
      completionTokens: prev.completionTokens + completionTokens,
      totalTokens: prev.totalTokens + total,
      estimatedCost: prev.estimatedCost + msgCost,
    }));

    setAllTimeUsage((prev) => {
      const updated = {
        promptTokens: prev.promptTokens + promptTokens,
        completionTokens: prev.completionTokens + completionTokens,
        totalTokens: prev.totalTokens + total,
        estimatedCost: prev.estimatedCost + msgCost,
      };
      try {
        localStorage.setItem(STORAGE_KEYS.ALL_TIME, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setModelBreakdown((prev) => {
      const existing = prev[modelId] || {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        cost: 0,
        messageCount: 0,
      };

      const updated = {
        ...prev,
        [modelId]: {
          promptTokens: existing.promptTokens + promptTokens,
          completionTokens: existing.completionTokens + completionTokens,
          totalTokens: existing.totalTokens + total,
          cost: existing.cost + msgCost,
          messageCount: existing.messageCount + 1,
        },
      };

      try {
        localStorage.setItem(STORAGE_KEYS.BREAKDOWN, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const resetSessionUsage = useCallback(() => {
    setSessionUsage({
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
    });
  }, []);

  const isKeyConfiguredForModel = useCallback(
    (modelId: string) => {
      const model = getModelById(modelId);
      if (model.isFree) return true; // Gemini 2.5 Flash is always available for free
      const key = apiKeys[model.provider]?.trim();
      return Boolean(key && key.length > 5);
    },
    [apiKeys]
  );

  const getKeyStatusForModel = useCallback(
    (modelId: string) => {
      const model = getModelById(modelId);
      if (model.isFree) {
        return { status: "valid" as const };
      }
      const provider = model.provider;
      const key = apiKeys[provider]?.trim();
      if (!key) {
        return { status: "not_configured" as const };
      }
      return keyStatus[provider] || { status: "not_configured" as const };
    },
    [apiKeys, keyStatus]
  );

  const selectedModel = getModelById(selectedModelId);

  return (
    <ModelUsageContext.Provider
      value={{
        selectedModel,
        selectedModelId,
        setSelectedModelId,
        reasoningEffort,
        setReasoningEffort,
        apiKeys,
        setApiKey,
        keyStatus,
        verifyApiKey,
        sessionUsage,
        allTimeUsage,
        modelBreakdown,
        recordUsage,
        resetSessionUsage,
        isKeyConfiguredForModel,
        getKeyStatusForModel,
      }}
    >
      {children}
    </ModelUsageContext.Provider>
  );
}

export function useModelUsage() {
  const context = useContext(ModelUsageContext);
  if (!context) {
    throw new Error("useModelUsage must be used within a ModelUsageProvider");
  }
  return context;
}
