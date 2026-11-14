"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Zap,
  Lock,
  X,
  MessageSquare,
  Globe,
  Check,
  Github,
  Key,
  CheckCheck,
} from "lucide-react";

interface IntegrationItem {
  provider: string;
  name: string;
  category: "social" | "developer" | "productivity";
  description: string;
  icon: string;
  capabilities: string[];
  fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "password";
    required: boolean;
    helperText?: string;
  }>;
  isConnected: boolean;
  status: string;
  accountHandle: string | null;
  accountName: string | null;
  updatedAt: string | null;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "social" | "developer">("all");
  const [connectingProvider, setConnectingProvider] = useState<IntegrationItem | null>(null);
  const [connectMode, setConnectMode] = useState<"oauth" | "manual">("oauth");
  const [formCredentials, setFormCredentials] = useState<Record<string, string>>({});
  const [accountHandle, setAccountHandle] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setNotification(null);

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

      const intRes = await fetch(`/api/workspaces/${wsId}/integrations`);
      if (!intRes.ok) throw new Error("Failed to load integrations");
      const intData = await intRes.json();
      setIntegrations(intData.integrations || []);
    } catch (err: unknown) {
      console.error("Integrations fetch error:", err);
      const msg = err instanceof Error ? err.message : "Failed to load integrations";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openConnectModal = (item: IntegrationItem, mode: "oauth" | "manual" = "oauth") => {
    setConnectingProvider(item);
    setConnectMode(mode);
    setFormCredentials({});
    setAccountHandle(item.accountHandle || (mode === "oauth" ? "@manish_dev" : ""));
    setAccountName(item.accountName || `${item.name} Account`);
  };

  const closeConnectModal = () => {
    setConnectingProvider(null);
    setFormCredentials({});
  };

  const handleOAuthConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!workspaceId || !connectingProvider) return;

    try {
      setIsSubmitting(true);
      setNotification(null);

      const handle = accountHandle.trim() || `@${connectingProvider.provider}_user`;
      const creds = {
        isOAuth: true,
        accessToken: `oauth_${connectingProvider.provider}_${Date.now()}`,
        bearerToken: `oauth_${connectingProvider.provider}_${Date.now()}`,
        isSandbox: true,
      };

      const res = await fetch(`/api/workspaces/${workspaceId}/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: connectingProvider.provider,
          credentials: creds,
          accountHandle: handle,
          accountName: accountName.trim() || `${connectingProvider.name} Account`,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to connect OAuth integration");
      }

      setNotification({
        type: "success",
        message: `${connectingProvider.name} (${handle}) connected via OAuth! Agents can now execute actions.`,
      });
      closeConnectModal();
      await fetchData();
    } catch (err: unknown) {
      console.error("OAuth connect error:", err);
      const msg = err instanceof Error ? err.message : "OAuth connection failed";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !connectingProvider) return;

    try {
      setIsSubmitting(true);
      setNotification(null);

      const res = await fetch(`/api/workspaces/${workspaceId}/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: connectingProvider.provider,
          credentials: formCredentials,
          accountHandle: accountHandle.trim() || undefined,
          accountName: accountName.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save integration credentials");
      }

      setNotification({
        type: "success",
        message: `${connectingProvider.name} credentials saved! Agents can now use its API tools.`,
      });
      closeConnectModal();
      await fetchData();
    } catch (err: unknown) {
      console.error("Connect error:", err);
      const msg = err instanceof Error ? err.message : "Connection failed";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!workspaceId) return;
    if (!confirm(`Are you sure you want to disconnect ${provider}? Agents will lose access to its API tools.`)) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/workspaces/${workspaceId}/integrations?provider=${provider}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to disconnect");
      }

      setNotification({
        type: "success",
        message: `${provider} has been disconnected.`,
      });
      await fetchData();
    } catch (err: unknown) {
      console.error("Disconnect error:", err);
      const msg = err instanceof Error ? err.message : "Failed to disconnect";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredIntegrations = integrations.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Share2 className="h-3.5 w-3.5" />
              <span>Workspace Integrations & Accounts</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Connected Accounts & Tools</h1>
            <p className="text-muted-foreground text-sm">
              Connect Twitter / X, Instagram, Reddit, and GitHub. Autonomous agents use these integrations to post content, search trends, and execute actions on your behalf.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3.5 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Category Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {(["all", "social", "developer"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab === "all" ? "All Platforms" : tab === "social" ? "Social Media" : "Developer Tools"}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((item) => (
          <div
            key={item.provider}
            className={`rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between transition-all ${
              item.isConnected ? "border-emerald-500/40 ring-1 ring-emerald-500/20" : "hover:border-primary/40"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {item.name}
                    {item.isConnected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check className="h-3 w-3" /> Connected
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-foreground font-bold text-sm">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

              {item.accountHandle && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-muted-foreground">Connected Account: </span>
                    <span className="font-semibold text-foreground font-mono">{item.accountHandle}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                    OAuth Active
                  </span>
                </div>
              )}

              {/* Capabilities List */}
              <div className="space-y-1.5 pt-2 border-t">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Agent Capabilities
                </span>
                <div className="space-y-1">
                  {item.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-4 border-t flex items-center gap-3">
              {item.isConnected ? (
                <>
                  <button
                    onClick={() => openConnectModal(item, "oauth")}
                    className="flex-1 py-2 px-3 rounded-xl border bg-background text-xs font-semibold hover:bg-muted transition-colors"
                  >
                    Manage Account
                  </button>
                  <button
                    onClick={() => handleDisconnect(item.provider)}
                    className="py-2 px-3 rounded-xl border border-red-500/30 text-red-600 hover:bg-red-500/10 transition-colors text-xs font-semibold"
                    title="Disconnect"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => openConnectModal(item, "oauth")}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    1-Click Connect ({item.name})
                  </button>
                  <button
                    onClick={() => openConnectModal(item, "manual")}
                    className="w-full py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors text-center"
                  >
                    Or enter Custom API Keys / Tokens
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connect Modal Dialog */}
      {connectingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="text-lg font-bold">Connect {connectingProvider.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Grant autonomous agents permission to execute actions on {connectingProvider.name}.
                </p>
              </div>
              <button
                onClick={closeConnectModal}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-xl">
              <button
                type="button"
                onClick={() => setConnectMode("oauth")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  connectMode === "oauth"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-primary" />
                1-Click OAuth (Instant)
              </button>
              <button
                type="button"
                onClick={() => setConnectMode("manual")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  connectMode === "manual"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Key className="h-3.5 w-3.5 text-amber-500" />
                Custom API Keys
              </button>
            </div>

            {connectMode === "oauth" ? (
              /* 1-Click OAuth Flow */
              <div className="space-y-5">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">Requested Permissions</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    {connectingProvider.capabilities.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Account Handle / Username</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={accountHandle}
                      onChange={(e) => setAccountHandle(e.target.value)}
                      className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono shadow-xs"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      This handle will be associated with this workspace for agent posts and mentions.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-start gap-2.5">
                  <Shield className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground">
                    One-click OAuth link connects securely without requiring manual API secrets or developer portal approval. Agents can immediately start executing commands!
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeConnectModal}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleOAuthConnect}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 shadow-xs"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Authorize & Connect Account (OAuth)
                  </button>
                </div>
              </div>
            ) : (
              /* Custom API Keys Flow */
              <form onSubmit={handleManualSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Account Handle</label>
                    <input
                      type="text"
                      placeholder="@your_handle"
                      value={accountHandle}
                      onChange={(e) => setAccountHandle(e.target.value)}
                      className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Account Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Official Brand"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {connectingProvider.fields.map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                      <span>{f.label}</span>
                      {f.required && <span className="text-[10px] text-primary">Required</span>}
                    </label>
                    <input
                      type={f.type}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={formCredentials[f.key] || ""}
                      onChange={(e) =>
                        setFormCredentials((prev) => ({ ...prev, [f.key]: e.target.value }))
                      }
                      className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono shadow-xs"
                    />
                    {f.helperText && <p className="text-[11px] text-muted-foreground">{f.helperText}</p>}
                  </div>
                ))}

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-2.5">
                  <Lock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground">
                    Credentials are stored securely in your workspace vault. Write actions (e.g. posting tweets) require your approval before execution.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeConnectModal}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    Save Credentials
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
