"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Sparkles } from "lucide-react";
import { AgentConfigType } from "@/types/agent";
import { useAgentConfig } from "@/context/agent-config-context";

interface SettingTabProps {
  agent?: AgentConfigType;
  onSave?: (updated: Partial<AgentConfigType>) => void;
}

export function SettingTab({ agent: propAgent, onSave }: SettingTabProps) {
  const { agentConfig, updateAgentField, saveAgentConfig, saving } = useAgentConfig();
  const currentAgent = propAgent || agentConfig;

  const [name, setName] = useState(currentAgent?.name || "");
  const [description, setDescription] = useState(currentAgent?.description || "");

  // Sync state when agentConfig changes (e.g. initial fetch)
  useEffect(() => {
    if (currentAgent) {
      setName(currentAgent.name || "");
      setDescription(currentAgent.description || "");
    }
  }, [currentAgent?.name, currentAgent?.description]);

  const handleNameChange = (val: string) => {
    setName(val);
    updateAgentField({ name: val });
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    updateAgentField({ description: val });
  };

  const handleSave = async () => {
    if (onSave) {
      onSave({ name, description });
    } else {
      await saveAgentConfig({ name, description });
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label htmlFor="setting-name" className="text-xs font-medium flex items-center justify-between">
          <span>Agent Name</span>
          <span className="text-[10px] text-muted-foreground font-normal">Required</span>
        </Label>
        <Input
          id="setting-name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="text-xs bg-background h-8"
          placeholder="e.g. Daily Briefing Pro"
          disabled={saving}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="setting-prompt" className="text-xs font-medium flex items-center justify-between">
          <span>System Instructions & Objectives</span>
          <span className="text-[10px] text-muted-foreground font-normal">Core Persona</span>
        </Label>
        <Textarea
          id="setting-prompt"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          rows={6}
          className="text-xs bg-background resize-none leading-relaxed"
          placeholder="You are an autonomous AI assistant that summarizes emails, searches the web, and creates daily routines..."
          disabled={saving}
        />
        <p className="text-[10px] text-muted-foreground">
          Passed directly into the OpenAI Agent runtime instructions to govern decision-making.
        </p>
      </div>

      <Button
        size="sm"
        className="w-full gap-2 text-xs h-8"
        onClick={handleSave}
        disabled={saving || !name.trim()}
      >
        {saving ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Saving Configuration...</span>
          </>
        ) : (
          <>
            <Save className="size-3.5" />
            <span>Save Configuration</span>
          </>
        )}
      </Button>
    </div>
  );
}
