"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import {
  Search,
  Store,
  Check,
  Plus,
  Loader2,
  RefreshCw,
  X,
  ShieldCheck,
  CheckCircle2,
  Unlink,
} from "lucide-react";
import axios from "axios";
import { BrandLogo } from "@/components/custom/brands/brand-logo";
import { motion, AnimatePresence } from "motion/react";

export interface ToolRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  authType: string | null;
  isActive: boolean;
  connected?: boolean;
}

const CATEGORIES = [
  "All",
  "Connected",
  "Communication",
  "Productivity",
  "Social Media",
  "Developer",
] as const;

type Category = typeof CATEGORIES[number];

function getToolCategory(slug: string): Category {
  const s = slug.toUpperCase();
  if (["GMAIL", "OUTLOOK", "SLACK", "DISCORD"].includes(s)) return "Communication";
  if (["GOOGLECALENDAR", "NOTION", "GOOGLEDRIVE", "GOOGLEDOCS"].includes(s)) return "Productivity";
  if (["TWITTER", "LINKEDIN", "INSTAGRAM", "REDDIT"].includes(s)) return "Social Media";
  if (["GITHUB", "JIRA", "LINEAR", "HACKERNEWS", "TRELLO", "E2B"].includes(s)) return "Developer";
  return "Productivity";
}

interface MarketplaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarketplaceDialog({ open, onOpenChange }: MarketplaceDialogProps) {
  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [actionLoadingSlug, setActionLoadingSlug] = useState<string | null>(null);
  const [hoveredDisconnectSlug, setHoveredDisconnectSlug] = useState<string | null>(null);

  // 1. Fetch live tools catalog with connection status
  const fetchTools = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await axios.get("/api/tools");
      setTools(res.data);
    } catch (err: any) {
      console.error("Error fetching marketplace tools:", err);
      toast.add({
        title: "Catalog Unavailable",
        description: "Could not retrieve the tools catalog. Please try again.",
        type: "error",
      });
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchTools();
    }
  }, [open, fetchTools]);

  // 2. Connect tool flow (OAuth redirect)
  const handleConnect = async (tool: ToolRecord) => {
    setActionLoadingSlug(tool.slug);
    try {
      const res = await axios.post("/api/tools/connect", {
        toolkitSlug: tool.slug,
        callbackUrl: window.location.href,
      });

      if (res.data?.redirectUrl) {
        toast.add({
          title: `Connecting ${tool.name}`,
          description: "Complete authentication in the opened window.",
          type: "info",
        });

        const popup = window.open(
          res.data.redirectUrl,
          `oauth_${tool.slug}`,
          "width=600,height=720,top=120,left=240"
        );

        const checkInterval = setInterval(async () => {
          if (!popup || popup.closed) {
            clearInterval(checkInterval);
            setActionLoadingSlug(null);
            await fetchTools(true);
            toast.add({
              title: `${tool.name} Connected`,
              description: `Tool successfully linked to your agent workspace.`,
              type: "success",
            });
          }
        }, 1500);
      } else {
        toast.add({
          title: "Connection Ready",
          description: res.data?.message || "Tool configured.",
          type: "success",
        });
        await fetchTools(true);
        setActionLoadingSlug(null);
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      toast.add({
        title: "Connection Failed",
        description: err.response?.data?.error || err.message || "Failed to start OAuth flow",
        type: "error",
      });
      setActionLoadingSlug(null);
    }
  };

  // 3. Disconnect tool flow
  const handleDisconnect = async (tool: ToolRecord) => {
    setActionLoadingSlug(tool.slug);
    try {
      await axios.post("/api/tools/disconnect", {
        toolkitSlug: tool.slug,
      });

      toast.add({
        title: `${tool.name} Disconnected`,
        description: "Account access revoked successfully.",
        type: "info",
      });

      await fetchTools(true);
    } catch (err: any) {
      toast.add({
        title: "Disconnection Failed",
        description: err.response?.data?.error || err.message || "Could not disconnect tool",
        type: "error",
      });
    } finally {
      setActionLoadingSlug(null);
    }
  };

  // 4. Counts & Filter logic
  const connectedCount = useMemo(() => tools.filter((t) => t.connected).length, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.slug.toLowerCase().includes(search.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedCategory === "All") return true;
      if (selectedCategory === "Connected") return Boolean(tool.connected);

      return getToolCategory(tool.slug) === selectedCategory;
    });
  }, [tools, search, selectedCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white rounded-3xl border border-black/[0.08] shadow-2xl flex flex-col max-h-[85vh]">
        {/* ── HEADER ── */}
        <div className="px-6 pt-6 pb-4 border-b border-black/[0.06] shrink-0 bg-white">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-neutral-100 border border-black/[0.08] flex items-center justify-center text-foreground shadow-2xs">
                <Store className="size-4" />
              </div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-foreground tracking-tight">
                  Tool & Integration Marketplace
                </DialogTitle>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {connectedCount} Connected
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchTools()}
              disabled={loading}
              className="size-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-neutral-100 transition-colors"
              title="Refresh integrations"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Connect your SaaS accounts and cloud services. Connected tools are immediately accessible to all your autonomous agents.
          </DialogDescription>

          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools by name, service, or keyword (e.g. Gmail, GitHub, Calendar)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-black/[0.08] bg-neutral-50/80 outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-muted-foreground/60 shadow-2xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-black text-white shadow-2xs font-semibold"
                      : "bg-neutral-100 text-muted-foreground hover:text-foreground hover:bg-neutral-200/70"
                  }`}
                >
                  {cat} {cat === "Connected" && `(${connectedCount})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TOOL CARDS GRID (PRO STAGESHOW SPEC) ── */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/40">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-black" />
              <span className="text-xs font-mono">Loading integrations catalog...</span>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <span className="text-xs text-muted-foreground">No integrations match your search.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTools.map((tool) => {
                const isConnecting = actionLoadingSlug === tool.slug;
                const category = getToolCategory(tool.slug);
                const isHovered = hoveredDisconnectSlug === tool.slug;

                return (
                  <div
                    key={tool.id}
                    className="p-4 rounded-2xl border border-black/[0.08] bg-white shadow-2xs hover:border-black/20 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    {/* Top Row: Real Brand Logo + Name + Category Tag */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Real Official Brand Mark */}
                        <div className="size-10 rounded-xl border border-black/[0.08] bg-white flex items-center justify-center p-1.5 shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <BrandLogo slug={tool.slug} name={tool.name} size={22} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-foreground tracking-tight truncate">
                              {tool.name}
                            </span>
                            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider bg-neutral-100 px-1.5 py-0.2 rounded">
                              {category}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            OAuth 2.0
                          </span>
                        </div>
                      </div>

                      {/* Connection Status Indicator */}
                      {tool.connected && (
                        <span className="flex items-center gap-1 text-[10px] font-medium font-mono text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full shrink-0">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Connected</span>
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {tool.description || `Integrate ${tool.name} tools and automated workflows.`}
                    </p>

                    {/* Bottom Action Row (NO developer-slop slug tag) */}
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-end">
                      {tool.connected ? (
                        <button
                          type="button"
                          onMouseEnter={() => setHoveredDisconnectSlug(tool.slug)}
                          onMouseLeave={() => setHoveredDisconnectSlug(null)}
                          onClick={() => handleDisconnect(tool)}
                          disabled={isConnecting}
                          className={`h-7 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isHovered
                              ? "bg-rose-50 border-rose-200 text-rose-600 shadow-2xs"
                              : "bg-neutral-50 border-black/[0.06] text-muted-foreground"
                          }`}
                        >
                          {isConnecting ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : isHovered ? (
                            <>
                              <Unlink className="size-3" />
                              <span>Disconnect</span>
                            </>
                          ) : (
                            <>
                              <Check className="size-3 text-emerald-600 stroke-[2.5]" />
                              <span>Active</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnect(tool)}
                          disabled={isConnecting}
                          className="h-7 px-3.5 rounded-xl text-xs font-semibold bg-black text-white hover:bg-neutral-800 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="size-3 animate-spin" />
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <>
                              <Plus className="size-3 stroke-[2.5]" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="px-6 py-3.5 border-t border-black/[0.06] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Encrypted OAuth credentials managed via Composio vaults.</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-xl hover:bg-neutral-100"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
