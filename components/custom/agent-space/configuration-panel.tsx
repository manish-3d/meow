"use client";

import React, { useState } from "react";
import { Wrench, Calendar, Monitor, Cpu, Shuffle, Sparkles, Box, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentConfigType } from "@/types/agent";
import { useAgentConfig } from "@/context/agent-config-context";
import { useWorkspaceUI } from "@/context/workspace-ui-context";
import { ToolTab } from "./tool-tab";
import { ScheduleTab } from "./schedule-tab";
import { VmDesktopTab } from "./vm-desktop-tab";
import { ModelsTab } from "./models-tab";
import { AvatarSelector } from "@/components/custom/workspace/avatar-selector";
import { AVATARS, getAvatarByPath, DEFAULT_AVATAR } from "@/lib/avatars";
import axios from "axios";

interface ConfigurationPanelProps {
  agent?: AgentConfigType;
  onUpdateAgent?: (updated: Partial<AgentConfigType>) => void;
}

export function ConfigurationPanel({ agent: propAgent, onUpdateAgent }: ConfigurationPanelProps) {
  const { agentConfig, updateAgentField } = useAgentConfig();
  const { toggleConfig } = useWorkspaceUI();
  const currentAgent = propAgent || agentConfig;
  const [activeTab, setActiveTab] = useState<"model" | "tools" | "schedule" | "vm">("model");
  const [avatarSelectorOpen, setAvatarSelectorOpen] = useState(false);

  const avatar = currentAgent?.agentImage || DEFAULT_AVATAR.path;
  const name = currentAgent?.name || "AI Agent";

  const handleShuffleAvatar = () => {
    // Pick a random avatar from our 30 avatars
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    handleAvatarSelect(randomAvatar);
  };

  const handleAvatarSelect = async (av: typeof AVATARS[0]) => {
    updateAgentField({ agentImage: av.path });
    onUpdateAgent?.({ agentImage: av.path });
    setAvatarSelectorOpen(false);

    if (currentAgent?.agentId) {
      try {
        await axios.put("/api/agent", {
          agentId: currentAgent.agentId,
          agentImage: av.path,
        });
      } catch (e) {
        console.warn("Failed to persist avatar to DB:", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-black/[0.08] bg-white overflow-hidden">
      {/* ── TOP HEADER: AVATAR & SHUFFLE ── */}
      <div className="px-5 py-4 border-b border-black/[0.08] flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar Box with subtle voxel accent */}
          <button
            type="button"
            onClick={() => setAvatarSelectorOpen(true)}
            className="relative size-12 rounded-2xl bg-white border border-black/[0.08] overflow-hidden shrink-0 flex items-center justify-center p-0.5 group shadow-xs hover:border-black/30 transition-all cursor-pointer"
            title="Click to change avatar"
          >
            <img
              src={avatar}
              alt={name}
              className="size-full object-contain transition-transform group-hover:scale-105 duration-200"
            />
          </button>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold tracking-tight truncate text-foreground">
              {name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              Configuration Hub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffleAvatar}
            className="h-8 text-xs gap-1.5 px-3 rounded-xl border-black/[0.08] hover:bg-black/[0.03] text-foreground font-medium shadow-2xs"
            title="Shuffle Agent Avatar"
          >
            <Shuffle className="size-3.5" />
            <span>Shuffle</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleConfig}
            className="h-8 size-8 p-0 rounded-xl hover:bg-black/[0.04] text-muted-foreground hover:text-foreground transition-colors"
            title="Hide Configuration Panel"
          >
            <PanelRightClose className="size-4" />
          </Button>
        </div>
      </div>

      {/* ── TABS NAVIGATION (Model, Tools, Schedule, VM) ── */}
      <div className="border-b border-black/[0.08] px-5 flex items-center gap-6 bg-white">
        <button
          type="button"
          onClick={() => setActiveTab("model")}
          className={`flex items-center gap-1.5 py-3 text-xs transition-colors relative cursor-pointer ${
            activeTab === "model"
              ? "font-semibold text-foreground"
              : "font-medium text-muted-foreground hover:text-foreground"
          }`}
        >
          <Box className="size-3.5" />
          <span>Model</span>
          {activeTab === "model" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tools")}
          className={`flex items-center gap-1.5 py-3 text-xs transition-colors relative cursor-pointer ${
            activeTab === "tools"
              ? "font-semibold text-foreground"
              : "font-medium text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wrench className="size-3.5" />
          <span>Tools</span>
          {activeTab === "tools" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schedule")}
          className={`flex items-center gap-1.5 py-3 text-xs transition-colors relative cursor-pointer ${
            activeTab === "schedule"
              ? "font-semibold text-foreground"
              : "font-medium text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="size-3.5" />
          <span>Schedule</span>
          {activeTab === "schedule" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vm")}
          className={`flex items-center gap-1.5 py-3 text-xs transition-colors relative cursor-pointer ${
            activeTab === "vm"
              ? "font-semibold text-foreground"
              : "font-medium text-muted-foreground hover:text-foreground"
          }`}
        >
          <Monitor className="size-3.5" />
          <span>VM</span>
          {activeTab === "vm" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
          )}
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeTab === "model" && <ModelsTab />}
        {activeTab === "tools" && <ToolTab />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "vm" && <VmDesktopTab />}
      </div>

      {/* Avatar Selector Dialog */}
      <AvatarSelector
        open={avatarSelectorOpen}
        onClose={() => setAvatarSelectorOpen(false)}
        currentPath={avatar}
        onSelect={handleAvatarSelect}
      />
    </div>
  );
}
