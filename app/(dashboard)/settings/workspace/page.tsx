"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Shield,
  Cpu,
  Mail,
  Webhook,
  Globe,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Building2,
  Lock,
} from "lucide-react";

interface WorkspaceSettingsData {
  workspace: {
    id: string;
    name: string;
    slug: string;
    ownerUserId: string;
    createdAt: string;
  };
  settings: {
    id: string;
    workspaceId: string;
    defaultModel: string;
    enforceSafetyGuardrails: boolean;
    allowPublicSharing: boolean;
    notificationEmail: string | null;
    webhookUrl: string | null;
  };
  userRole: string;
}

export default function WorkspaceSettingsPage() {
  const [data, setData] = useState<WorkspaceSettingsData | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [defaultModel, setDefaultModel] = useState("gemini-1.5-flash");
  const [enforceSafetyGuardrails, setEnforceSafetyGuardrails] = useState(true);
  const [allowPublicSharing, setAllowPublicSharing] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setNotification(null);

      // 1. Fetch user's active workspace
      const wsRes = await fetch("/api/workspaces");
      if (!wsRes.ok) throw new Error("Failed to load workspace");
      const wsData = await wsRes.json();
      const wsId =
        wsData.activeWorkspace?.id ||
        wsData.workspaces?.[0]?.workspaceId ||
        wsData.workspaces?.[0]?.id;

      if (!wsId) {
        throw new Error("No active workspace found");
      }
      setWorkspaceId(wsId);

      // 2. Fetch workspace settings
      const setRes = await fetch(`/api/workspaces/${wsId}/settings`);
      if (!setRes.ok) {
        const errJson = await setRes.json();
        throw new Error(errJson.error || "Failed to load settings");
      }
      const fetched: WorkspaceSettingsData = await setRes.json();
      setData(fetched);

      // Populate form state
      setDefaultModel(fetched.settings.defaultModel || "gemini-1.5-flash");
      setEnforceSafetyGuardrails(fetched.settings.enforceSafetyGuardrails ?? true);
      setAllowPublicSharing(fetched.settings.allowPublicSharing ?? false);
      setNotificationEmail(fetched.settings.notificationEmail || "");
      setWebhookUrl(fetched.settings.webhookUrl || "");
    } catch (err: unknown) {
      console.error("Workspace settings fetch error:", err);
      const msg = err instanceof Error ? err.message : "Failed to load settings";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    try {
      setIsSaving(true);
      setNotification(null);

      const res = await fetch(`/api/workspaces/${workspaceId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultModel,
          enforceSafetyGuardrails,
          allowPublicSharing,
          notificationEmail: notificationEmail.trim() || null,
          webhookUrl: webhookUrl.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update settings");
      }

      setNotification({
        type: "success",
        message: "Workspace settings updated and saved successfully!",
      });
    } catch (err: unknown) {
      console.error("Save settings error:", err);
      const msg = err instanceof Error ? err.message : "Failed to save settings";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Settings className="h-3.5 w-3.5" />
              <span>Workspace Preferences</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
            <p className="text-muted-foreground text-sm">
              Configure default LLM models, guardrails, notification channels, and operational rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSettings}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3.5 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Reload
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border p-4 flex items-start gap-3 transition-all ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-medium">{notification.message}</div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Workspace Profile Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Workspace Profile</h2>
              <p className="text-xs text-muted-foreground">General workspace metadata and identifier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                disabled
                value={data?.workspace.name || "My Workspace"}
                className="w-full rounded-xl border bg-muted/50 px-3.5 py-2 text-sm text-foreground opacity-80 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Slug / Handle
              </label>
              <input
                type="text"
                disabled
                value={data?.workspace.slug || "workspace-slug"}
                className="w-full rounded-xl border bg-muted/50 px-3.5 py-2 text-sm font-mono text-foreground opacity-80 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Model & Inference Configuration */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">AI Model Configuration</h2>
              <p className="text-xs text-muted-foreground">
                Set the default language model used when executing agents and workflows
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Default LLM Model
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full max-w-md rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              <optgroup label="Google Gemini (Connected via API Key)">
                <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended - Fast, Multimodal & Active)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash (Legacy alias)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Legacy alias)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Next-Gen Gemini)</option>
              </optgroup>
              <optgroup label="OpenAI Models">
                <option value="gpt-4o">gpt-4o (Omni intelligence)</option>
                <option value="gpt-4o-mini">gpt-4o-mini (Lightweight reasoning)</option>
              </optgroup>
            </select>
            <p className="text-xs text-muted-foreground">
              Google Gemini is connected live using your configured Gemini API Key in the backend adapter.
            </p>
          </div>
        </div>

        {/* Safety & Security Guardrails */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Safety & Security Guardrails</h2>
              <p className="text-xs text-muted-foreground">
                Control execution safety, prompt containment, and public accessibility
              </p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-border">
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5 max-w-xl">
                <div className="text-sm font-semibold">Enforce Safety Guardrails</div>
                <div className="text-xs text-muted-foreground">
                  Validates inputs and responses against jailbreak attempts and prevents untrusted shell execution.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceSafetyGuardrails}
                  onChange={(e) => setEnforceSafetyGuardrails(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5 max-w-xl">
                <div className="text-sm font-semibold">Allow Public Agent Sharing</div>
                <div className="text-xs text-muted-foreground">
                  Enables team members to generate public read-only preview links for agent execution logs and chats.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPublicSharing}
                  onChange={(e) => setAllowPublicSharing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications & Webhooks */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Webhook className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Alerts & Integrations</h2>
              <p className="text-xs text-muted-foreground">
                Set up automated notifications for token budget thresholds and webhook events
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                Notification Email
              </label>
              <input
                type="email"
                placeholder="alerts@yourdomain.com"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
              <p className="text-xs text-muted-foreground">
                Receives alerts when your monthly token budget reaches 80% and 100%.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Webhook className="h-3.5 w-3.5" />
                Outgoing Webhook URL
              </label>
              <input
                type="url"
                placeholder="https://api.yourdomain.com/webhooks/meow"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Receives HTTP POST payloads whenever critical workspace events trigger.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-xs hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger Zone Card */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>
        <p className="text-xs text-muted-foreground max-w-xl">
          Deleting a workspace will permanently delete all associated agents, tools, execution logs, and subscription records. This action is irreversible.
        </p>
        <button
          type="button"
          disabled
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-600 opacity-60 cursor-not-allowed"
        >
          Delete Workspace (Contact Support)
        </button>
      </div>
    </div>
  );
}

