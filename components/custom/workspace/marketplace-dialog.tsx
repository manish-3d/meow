"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import {
  Search,
  Store,
  CheckCircle2,
  Plus,
  Loader2,
  RefreshCw,
  ExternalLink,
  Unlink,
  Mail,
  MessageSquare,
  Github,
  FileText,
  Calendar,
  Globe,
  Newspaper,
  HardDrive,
  Hash,
  KanbanSquare,
  Layers,
  Monitor,
  Sparkles,
} from "lucide-react";
import axios from "axios";

export interface ToolRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  authType: string | null;
  isActive: boolean;
  connected?: boolean;
}

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "size-4"}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "size-4"}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m1.37 9.74v-8.37H5.1v8.37h2.73z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "size-4"}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TOOL_ICON_MAP: Record<string, React.ElementType> = {
  GMAIL: Mail,
  OUTLOOK: Mail,
  SLACK: MessageSquare,
  DISCORD: Hash,
  GITHUB: Github,
  NOTION: FileText,
  GOOGLECALENDAR: Calendar,
  GOOGLEDRIVE: HardDrive,
  HACKERNEWS: Newspaper,
  JIRA: KanbanSquare,
  LINEAR: Layers,
  TWITTER: TwitterIcon,
  LINKEDIN: LinkedinIcon,
  INSTAGRAM: InstagramIcon,
  E2B: Monitor,
};

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
  if (["GOOGLECALENDAR", "NOTION", "GOOGLEDRIVE"].includes(s)) return "Productivity";
  if (["TWITTER", "LINKEDIN", "INSTAGRAM", "REDDIT"].includes(s)) return "Social Media";
  if (["GITHUB", "JIRA", "LINEAR", "HACKERNEWS", "E2B"].includes(s)) return "Developer";
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
          description: "Opening authorization window in a new tab...",
          type: "info",
        });

        // Open OAuth authorization in a new window/tab
        window.open(res.data.redirectUrl, "_blank", "noopener,noreferrer");

        // Periodically poll for completion over the next 15 seconds
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          attempts++;
          await fetchTools(true);
          if (attempts >= 5) clearInterval(pollInterval);
        }, 3000);
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.message ||
        `Failed to initiate connection to ${tool.name}`;
      toast.add({
        title: "Connection Failed",
        description: errorMsg,
        type: "error",
      });
    } finally {
      setActionLoadingSlug(null);
    }
  };

  // 3. Disconnect tool flow
  const handleDisconnect = async (tool: ToolRecord) => {
    setActionLoadingSlug(tool.slug);
    try {
      await axios.post("/api/tools/disconnect", {
        toolSlug: tool.slug,
      });

      toast.add({
        title: `${tool.name} Disconnected`,
        description: "Integration authorization was revoked.",
        type: "success",
      });

      await fetchTools(true);
    } catch (err: any) {
      toast.add({
        title: "Disconnection Failed",
        description: err?.response?.data?.error || "Could not revoke tool access.",
        type: "error",
      });
    } finally {
      setActionLoadingSlug(null);
    }
  };

  // 4. Filtered & searched tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.slug.toLowerCase().includes(search.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedCategory === "All") return true;
      if (selectedCategory === "Connected") return !!tool.connected;

      return getToolCategory(tool.slug) === selectedCategory;
    });
  }, [tools, search, selectedCategory]);

  const connectedCount = tools.filter((t) => t.connected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-card text-card-foreground border-border shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-border/70 bg-muted/20 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Store className="size-4" />
                </div>
                <DialogTitle className="text-base font-bold tracking-tight">
                  Tool & Integration Marketplace
                </DialogTitle>
                <Badge variant="outline" className="text-[10px] font-mono ml-1">
                  {connectedCount} Connected
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Connect your SaaS accounts and cloud services. Connected tools are instantly accessible to all your autonomous agents.
              </DialogDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="size-8 p-0 shrink-0"
              onClick={() => fetchTools()}
              disabled={loading}
              title="Refresh integrations"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Search & Categories Bar */}
          <div className="mt-4 space-y-2.5">
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools by name, service, or keyword (e.g. Gmail, GitHub, Calendar)..."
                className="pl-8 text-xs h-8 bg-background border-border"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors shrink-0 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                  {cat === "Connected" && connectedCount > 0 && ` (${connectedCount})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs">Loading integration catalog...</span>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-14 space-y-2">
              <Store className="size-8 mx-auto text-muted-foreground/60" />
              <p className="text-xs font-semibold text-foreground">No integrations found</p>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                No tools match &ldquo;{search}&rdquo; in category {selectedCategory}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTools.map((tool) => {
                const IconComponent =
                  TOOL_ICON_MAP[tool.slug.toUpperCase()] || Globe;
                const isActionLoading = actionLoadingSlug === tool.slug;
                const category = getToolCategory(tool.slug);

                return (
                  <div
                    key={tool.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-border transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="size-8 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground shrink-0 mt-0.5">
                          <IconComponent className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-foreground truncate">
                              {tool.name}
                            </h4>
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                              {category}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {tool.description || `Autonomous integration for ${tool.name}.`}
                          </p>
                        </div>
                      </div>

                      {tool.connected && (
                        <Badge
                          variant="outline"
                          className="text-[9px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0 gap-1"
                        >
                          <CheckCircle2 className="size-2.5" />
                          Connected
                        </Badge>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        slug: {tool.slug}
                      </span>

                      {tool.connected ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDisconnect(tool)}
                          disabled={isActionLoading}
                          className="h-7 text-[11px] gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
                        >
                          {isActionLoading ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Unlink className="size-3" />
                          )}
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(tool)}
                          disabled={isActionLoading}
                          className="h-7 text-[11px] gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                        >
                          {isActionLoading ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Plus className="size-3" />
                          )}
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Advisory */}
        <div className="p-3 border-t border-border/70 bg-muted/20 px-5 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary shrink-0" />
            <span>Secure OAuth tokens are managed and encrypted via Composio proxy vaults.</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
