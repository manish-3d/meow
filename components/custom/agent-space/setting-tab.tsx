"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Save,
  Loader2,
  Sparkles,
  Power,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";
import { AgentConfigType } from "@/types/agent";
import { useAgentConfig } from "@/context/agent-config-context";
import axios from "axios";

interface SettingTabProps {
  agent?: AgentConfigType;
  onSave?: (updated: Partial<AgentConfigType>) => void;
}

export function SettingTab({ agent: propAgent, onSave }: SettingTabProps) {
  const router = useRouter();
  const { agentConfig, updateAgentField, saveAgentConfig, saving } = useAgentConfig();
  const currentAgent = propAgent || agentConfig;

  const [name, setName] = useState(currentAgent?.name || "");
  const [description, setDescription] = useState(currentAgent?.description || "");
  const [isActive, setIsActive] = useState(currentAgent?.isActive ?? true);
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Danger Zone Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmNameInput, setConfirmNameInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Sync state when agentConfig changes
  useEffect(() => {
    if (currentAgent) {
      setName(currentAgent.name || "");
      setDescription(currentAgent.description || "");
      setIsActive(currentAgent.isActive ?? true);
    }
  }, [currentAgent?.name, currentAgent?.description, currentAgent?.isActive]);

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
      onSave({ name, description, isActive });
    } else {
      await saveAgentConfig({ name, description, isActive });
    }
  };

  // Toggle active/paused lifecycle state
  const handleToggleActive = async (checked: boolean) => {
    setIsActive(checked);
    updateAgentField({ isActive: checked });
    setTogglingStatus(true);

    try {
      if (currentAgent?.agentId) {
        await axios.put("/api/agent", {
          agentId: currentAgent.agentId,
          isActive: checked,
        });

        toast.add({
          title: checked ? "Agent Activated" : "Agent Paused",
          description: checked
            ? `Agent "${name}" is now active and ready for chat & routines.`
            : `Agent "${name}" has been paused. Routines and chat are suspended.`,
          type: checked ? "success" : "info",
        });
      }
    } catch (err: any) {
      console.error("Failed to toggle agent active state:", err);
      // Revert on failure
      setIsActive(!checked);
      updateAgentField({ isActive: !checked });
      toast.add({
        title: "Update Failed",
        description: err?.response?.data?.error || "Could not update agent status.",
        type: "error",
      });
    } finally {
      setTogglingStatus(false);
    }
  };

  // Permanently delete agent (Danger Zone)
  const handleDeleteAgent = async () => {
    if (!currentAgent?.agentId) return;
    setDeleting(true);

    try {
      await axios.delete(`/api/agent?agentId=${currentAgent.agentId}`);

      toast.add({
        title: "Agent Deleted",
        description: `Agent "${name}" and all associated data were permanently removed.`,
        type: "success",
      });

      setDeleteModalOpen(false);
      // Navigate to workspace home and trigger full refresh
      router.push("/workspace");
      window.location.href = "/workspace";
    } catch (err: any) {
      console.error("Failed to delete agent:", err);
      toast.add({
        title: "Deletion Failed",
        description: err?.response?.data?.error || "Could not delete agent.",
        type: "error",
      });
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pt-2 pb-6">
      {/* 1. Agent Lifecycle Status Card */}
      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-card-foreground shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`size-2.5 rounded-full ${
                isActive
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                  : "bg-amber-500"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none text-foreground flex items-center gap-1.5">
                <span>Agent Status:</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium py-0 px-1.5 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }`}
                >
                  {isActive ? "Active" : "Paused"}
                </Badge>
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {isActive
                  ? "Accepting chat inference & running scheduled Inngest routines."
                  : "Conversations and scheduled executions are temporarily suspended."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {togglingStatus && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
            <Switch
              checked={isActive}
              onCheckedChange={handleToggleActive}
              disabled={togglingStatus || saving}
              aria-label="Toggle agent active status"
            />
          </div>
        </div>
      </div>

      {/* 2. Core Persona & Instructions Form */}
      <div className="space-y-4">
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
            <span>System Instructions & Persona</span>
            <span className="text-[10px] text-muted-foreground font-normal">Core Prompt</span>
          </Label>
          <Textarea
            id="setting-prompt"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={5}
            className="text-xs bg-background resize-none leading-relaxed"
            placeholder="You are an autonomous AI assistant that summarizes emails, searches the web, and creates daily routines..."
            disabled={saving}
          />
          <p className="text-[10px] text-muted-foreground">
            Injected into Gemini system instructions to govern reasoning and tool selection.
          </p>
        </div>

        <Button
          size="sm"
          className="w-full gap-2 text-xs h-8 bg-primary text-primary-foreground font-medium"
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

      {/* 3. Danger Zone (Deletion) */}
      <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="size-7 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shrink-0 mt-0.5">
            <AlertTriangle className="size-3.5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-destructive">Danger Zone</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Permanently delete this agent and purge all associated routines, execution logs, and conversational history.
            </p>
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <Button
            size="sm"
            variant="destructive"
            className="h-7 text-xs gap-1.5 font-medium"
            onClick={() => {
              setConfirmNameInput("");
              setDeleteModalOpen(true);
            }}
          >
            <Trash2 className="size-3" />
            Delete Agent
          </Button>
        </div>
      </div>

      {/* Danger Zone Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-card text-card-foreground border-destructive/30">
          <DialogHeader className="space-y-2">
            <div className="size-10 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle className="text-center text-sm font-bold text-foreground">
              Delete Agent &ldquo;{name}&rdquo;?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground leading-relaxed">
              This action is permanent and irreversible. All automated background routines, execution logs, and chat records belonging to this agent will be permanently erased.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label className="text-[11px] text-muted-foreground">
              Please type <span className="font-semibold text-foreground">&ldquo;{name}&rdquo;</span> to confirm:
            </Label>
            <Input
              value={confirmNameInput}
              onChange={(e) => setConfirmNameInput(e.target.value)}
              placeholder={name}
              className="text-xs h-8 bg-background border-border"
              disabled={deleting}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteAgent}
              disabled={deleting || confirmNameInput.trim().toLowerCase() !== name.trim().toLowerCase()}
              className="text-xs h-8 gap-1.5"
            >
              {deleting ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Trash2 className="size-3" />
              )}
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
