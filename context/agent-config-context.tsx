"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/components/ui/toast";
import { AgentConfigType } from "@/types/agent";

interface AgentConfigContextType {
  agentConfig: AgentConfigType | null;
  setAgentConfig: React.Dispatch<React.SetStateAction<AgentConfigType | null>>;
  updateAgentField: (fields: Partial<AgentConfigType>) => void;
  saveAgentConfig: (overrideFields?: Partial<AgentConfigType>) => Promise<boolean>;
  saving: boolean;
  loading: boolean;
}

const AgentConfigContext = createContext<AgentConfigContextType | undefined>(undefined);

interface AgentConfigProviderProps {
  children: React.ReactNode;
  initialAgent?: AgentConfigType | null;
  agentId?: string;
}

export function AgentConfigProvider({
  children,
  initialAgent = null,
  agentId,
}: AgentConfigProviderProps) {
  const [agentConfig, setAgentConfig] = useState<AgentConfigType | null>(initialAgent);
  const [loading, setLoading] = useState<boolean>(!initialAgent && !!agentId);
  const [saving, setSaving] = useState<boolean>(false);

  // Sync state if initialAgent changes
  useEffect(() => {
    if (initialAgent) {
      setAgentConfig(initialAgent);
    }
  }, [initialAgent]);

  // If agentId is passed without initialAgent, fetch from API
  useEffect(() => {
    if (!agentConfig && agentId) {
      const fetchAgent = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`/api/agent?agentId=${agentId}`);
          setAgentConfig(res.data);
        } catch (err: any) {
          console.error("Failed to load agent config:", err);
          toast.add({
            title: "Error",
            description: "Failed to load agent configuration.",
            type: "error",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchAgent();
    }
  }, [agentId]);

  // Update in-memory state
  const updateAgentField = (fields: Partial<AgentConfigType>) => {
    setAgentConfig((prev) => (prev ? { ...prev, ...fields } : null));
  };

  // Persist changes to PostgreSQL via PUT /api/agent
  const saveAgentConfig = async (overrideFields?: Partial<AgentConfigType>): Promise<boolean> => {
    const targetAgent = overrideFields
      ? { ...agentConfig, ...overrideFields }
      : agentConfig;

    if (!targetAgent || !targetAgent.agentId) {
      toast.add({
        title: "Error",
        description: "No active agent to save.",
        type: "error",
      });
      return false;
    }

    try {
      setSaving(true);
      const res = await axios.put("/api/agent", {
        agentId: targetAgent.agentId,
        name: targetAgent.name,
        description: targetAgent.description || "",
        agentImage: targetAgent.agentImage || "",
        isActive: targetAgent.isActive,
      });

      if (res.data?.agent) {
        setAgentConfig(res.data.agent);
      }

      toast.add({
        title: "Saved Successfully",
        description: `Agent "${targetAgent.name}" configuration has been updated.`,
        type: "success",
      });
      return true;
    } catch (err: any) {
      console.error("Failed to update agent:", err);
      toast.add({
        title: "Save Failed",
        description: err.response?.data?.error || "Could not save agent configuration.",
        type: "error",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <AgentConfigContext.Provider
      value={{
        agentConfig,
        setAgentConfig,
        updateAgentField,
        saveAgentConfig,
        saving,
        loading,
      }}
    >
      {children}
    </AgentConfigContext.Provider>
  );
}

// Hook for consuming components
export function useAgentConfig() {
  const context = useContext(AgentConfigContext);
  if (!context) {
    throw new Error("useAgentConfig must be used within an AgentConfigProvider");
  }
  return context;
}
