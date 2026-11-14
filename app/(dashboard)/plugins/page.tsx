"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Package,
  CheckCircle2,
  Download,
  Trash2,
  Power,
  PowerOff,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Layers,
  Cpu,
} from "lucide-react";

interface PluginManifestItem {
  pluginId: string;
  name: string;
  description: string;
  version: string;
  category: string;
  manifest: {
    author?: string;
    requiredPermissions?: string[];
  };
}

interface InstalledItem {
  plugin: {
    id: string;
    workspaceId: string;
    pluginId: string;
    enabled: boolean;
    installedAt: string;
  };
  manifest: PluginManifestItem | null;
}

export default function PluginsPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "installed">("marketplace");
  const [marketplace, setMarketplace] = useState<PluginManifestItem[]>([]);
  const [installed, setInstalled] = useState<InstalledItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // We fetch a default workspace ID from workspaces API or use fallback
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);

  const fetchWorkspaceAndData = async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      // 1. Fetch current user workspaces
      const wsRes = await fetch("/api/workspaces");
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        const primaryWs =
          wsData.activeWorkspace?.id ||
          wsData.workspaces?.[0]?.id ||
          wsData.workspaces?.[0]?.workspaceId;
        if (primaryWs) {
          setCurrentWorkspaceId(primaryWs);
          // Fetch installed plugins for primary workspace
          const instRes = await fetch(`/api/workspaces/${primaryWs}/plugins`);
          if (instRes.ok) {
            const instData = await instRes.json();
            setInstalled(instData.installed || []);
          }
        }
      }

      // 2. Fetch marketplace
      const mRes = await fetch("/api/plugins");
      if (mRes.ok) {
        const mData = await mRes.json();
        setMarketplace(mData.marketplace || []);
      }
    } catch (err: unknown) {
      console.error("Plugins fetch error:", err);
      setErrorNotice("Failed to load plugins");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceAndData();
  }, []);

  const installedPluginIds = useMemo(() => {
    return new Set(installed.map((item) => item.plugin.pluginId));
  }, [installed]);

  const handleInstall = async (pluginId: string) => {
    if (!currentWorkspaceId) {
      setErrorNotice("No active workspace found to install plugin");
      return;
    }
    setActionInProgress(pluginId);
    setErrorNotice(null);
    setSuccessNotice(null);

    try {
      const res = await fetch("/api/plugins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspaceId,
          pluginId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Installation failed");
      }

      setSuccessNotice(`Plugin installed successfully!`);
      await fetchWorkspaceAndData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Install error";
      setErrorNotice(message);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggle = async (pluginId: string, currentEnabled: boolean) => {
    if (!currentWorkspaceId) return;
    setActionInProgress(pluginId);
    setErrorNotice(null);

    try {
      const res = await fetch(`/api/plugins/${pluginId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspaceId,
          enabled: !currentEnabled,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Toggle failed");
      }

      await fetchWorkspaceAndData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Toggle error";
      setErrorNotice(message);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleUninstall = async (pluginId: string) => {
    if (!currentWorkspaceId) return;
    setActionInProgress(pluginId);
    setErrorNotice(null);

    try {
      const res = await fetch(
        `/api/plugins?workspaceId=${currentWorkspaceId}&pluginId=${pluginId}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Uninstall failed");
      }

      setSuccessNotice(`Plugin uninstalled successfully`);
      await fetchWorkspaceAndData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Uninstall error";
      setErrorNotice(message);
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredMarketplace = useMemo(() => {
    return marketplace.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pluginId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === "all" ? true : item.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [marketplace, searchQuery, categoryFilter]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Package className="h-3.5 w-3.5" />
            <span>Phase 8 Ecosystem & Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Plugin Marketplace</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Expand your autonomous agents with sandboxed integrations, third-party connectors,
            and background automation workers. All plugins execute under strict workspace tenancy
            and RBAC audit trails.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {errorNotice && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive font-medium">
          {errorNotice}
        </div>
      )}
      {successNotice && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 font-medium">
          {successNotice}
        </div>
      )}

      {/* Navigation Tabs & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 rounded-xl bg-muted p-1">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "marketplace"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Marketplace Catalog ({marketplace.length})
          </button>
          <button
            onClick={() => setActiveTab("installed")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "installed"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Installed Plugins ({installed.length})
          </button>
        </div>

        {activeTab === "marketplace" && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border bg-background pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Categories</option>
              <option value="productivity">Productivity</option>
              <option value="developer">Developer</option>
              <option value="integrations">Integrations</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading plugin directory...
        </div>
      ) : activeTab === "marketplace" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarketplace.map((item) => {
            const isInstalled = installedPluginIds.has(item.pluginId);
            const inProgress = actionInProgress === item.pluginId;

            return (
              <div
                key={item.pluginId}
                className="rounded-2xl border bg-card p-6 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base">{item.name}</h3>
                      <span className="text-xs text-muted-foreground font-mono">
                        v{item.version} • {item.manifest.author ?? "Official"}
                      </span>
                    </div>
                    <span className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-semibold capitalize">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  {isInstalled ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Installed
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Ready to install</span>
                  )}

                  <button
                    disabled={inProgress || isInstalled}
                    onClick={() => handleInstall(item.pluginId)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      isInstalled
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {inProgress ? (
                      "Processing..."
                    ) : isInstalled ? (
                      "Installed"
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" />
                        Install
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Installed Plugins Tab */
        <div className="space-y-4">
          {installed.length === 0 ? (
            <div className="py-16 text-center border rounded-2xl bg-card p-8">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-semibold">No plugins installed</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Explore the marketplace catalog to attach third-party connectors and autonomous capabilities.
              </p>
            </div>
          ) : (
            installed.map((item) => {
              const inProgress = actionInProgress === item.plugin.pluginId;
              const isEnabled = item.plugin.enabled;

              return (
                <div
                  key={item.plugin.id}
                  className="rounded-2xl border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">
                        {item.manifest?.name ?? item.plugin.pluginId}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isEnabled
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground border"
                        }`}
                      >
                        {isEnabled ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.manifest?.description ?? "Installed custom integration."}
                    </p>
                    <span className="text-xs text-muted-foreground font-mono">
                      Installed on {new Date(item.plugin.installedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      disabled={inProgress}
                      onClick={() => handleToggle(item.plugin.pluginId, isEnabled)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isEnabled
                          ? "border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                          : "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <PowerOff className="h-3.5 w-3.5" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Power className="h-3.5 w-3.5" />
                          Enable
                        </>
                      )}
                    </button>

                    <button
                      disabled={inProgress}
                      onClick={() => handleUninstall(item.plugin.pluginId)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Uninstall
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

