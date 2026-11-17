"use client";

import React from "react";
import { Shuffle, Settings2, Wrench, Calendar, Monitor, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AgentConfigType } from "@/types/agent";
import { useAgentConfig } from "@/context/agent-config-context";
import { SettingTab } from "./setting-tab";
import { ToolTab } from "./tool-tab";
import { ScheduleTab } from "./schedule-tab";
import { VmDesktopTab } from "./vm-desktop-tab";

interface ConfigurationPanelProps {
  agent?: AgentConfigType;
  onUpdateAgent?: (updated: Partial<AgentConfigType>) => void;
}

export function ConfigurationPanel({ agent: propAgent, onUpdateAgent }: ConfigurationPanelProps) {
  const { agentConfig, updateAgentField } = useAgentConfig();
  const currentAgent = propAgent || agentConfig;

  const avatar = currentAgent?.agentImage || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";
  const name = currentAgent?.name || "AI Agent";

  const handleShuffleAvatar = () => {
    const newSeed = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `agent-seed-${Date.now()}`;
    const newUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newSeed)}`;

    updateAgentField({ agentImage: newUrl });
    onUpdateAgent?.({ agentImage: newUrl });
  };

  return (
    <div className="flex flex-col h-full border-l border-border/60 bg-card/40 overflow-hidden">
      {/* Top Header: Agent Avatar & Shuffle Action */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative size-12 rounded-xl bg-background border border-border/80 overflow-hidden shrink-0 flex items-center justify-center p-1 group">
            <img
              src={avatar}
              alt={name}
              className="size-full object-contain transition-transform group-hover:scale-105 duration-200"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold truncate text-foreground">{name}</span>
              {currentAgent?.isActive === false && (
                <span className="text-[9px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded shrink-0">
                  Paused
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground truncate">Configuration Hub</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShuffleAvatar}
          className="h-7 text-xs gap-1.5 px-2.5 shrink-0"
          title="Shuffle Agent Avatar"
        >
          <Shuffle className="size-3" />
          <span>Shuffle</span>
        </Button>
      </div>

      {/* Tabbed Navigation Bar */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-8 p-0.5 bg-muted/60">
            <TabsTrigger value="settings" className="text-[11px] gap-1 px-1">
              <Settings2 className="size-3" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-[11px] gap-1 px-1">
              <Wrench className="size-3" />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-[11px] gap-1 px-1">
              <Calendar className="size-3" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="vm" className="text-[11px] gap-1 px-1">
              <Monitor className="size-3" />
              <span className="hidden sm:inline">VM</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SettingTab onSave={onUpdateAgent} />
          </TabsContent>

          <TabsContent value="tools">
            <ToolTab />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleTab />
          </TabsContent>

          <TabsContent value="vm">
            <VmDesktopTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
