"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
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
  CheckCircle2,
  Plus,
  Loader2,
  Wrench,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface ToolRecord {
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
  GITHUB: Github,
  NOTION: FileText,
  GOOGLECALENDAR: Calendar,
  GOOGLEDOCS: FileText,
  GOOGLEDRIVE: HardDrive,
  REDDIT: Newspaper,
  DISCORD: Hash,
  TRELLO: KanbanSquare,
  LINEAR: Layers,
  TWITTER: TwitterIcon,
  LINKEDIN: LinkedinIcon,
  INSTAGRAM: InstagramIcon,
};

export function ToolTab() {
  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingSlug, setConnectingSlug] = useState<string | null>(null);

  const fetchTools = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await axios.get("/api/tools");
      setTools(res.data);
    } catch (err: any) {
      console.error("Error fetching tools:", err);
      if (!silent) {
        toast.add({
          title: "Error",
          description: "Failed to load tools from Composio registry.",
          type: "error",
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  // When window regains focus (e.g. user finishes OAuth popup and returns), refresh list
  useEffect(() => {
    const handleFocus = () => {
      fetchTools(true);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchTools]);

  const handleConnect = async (tool: ToolRecord) => {
    try {
      setConnectingSlug(tool.slug);

      const res = await axios.post("/api/tools/connect", {
        slug: tool.slug,
      });

      if (res.data?.redirectUrl) {
        toast.add({
          title: `Connecting ${tool.name}`,
          description: "Complete authentication in the opened window.",
          type: "success",
        });

        // Open Composio's real OAuth window
        const popup = window.open(
          res.data.redirectUrl,
          `composio_${tool.slug}`,
          "width=650,height=750,top=100,left=200"
        );

        // Poll every 3 seconds while popup is open to detect completion
        const timer = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(timer);
            setConnectingSlug(null);
            fetchTools(true);
          }
        }, 2000);
      } else {
        throw new Error("No redirect URL returned by Composio");
      }
    } catch (err: any) {
      console.error("Connect error:", err);
      toast.add({
        title: "Connection Failed",
        description: err.response?.data?.error || err.message || "Failed to initiate OAuth flow.",
        type: "error",
      });
      setConnectingSlug(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground">Checking live Composio connections...</span>
      </div>
    );
  }

  if (!tools.length) {
    return (
      <div className="text-center py-10 space-y-2">
        <Wrench className="size-6 mx-auto text-muted-foreground/60" />
        <p className="text-xs text-muted-foreground">No tools available.</p>
      </div>
    );
  }

  const connectedCount = tools.filter((t) => t.connected).length;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Live toolkits powered by <strong>Composio v3</strong>.
          <span className="text-[10px] ml-1.5 font-medium text-emerald-500">
            ({connectedCount}/{tools.length} active)
          </span>
        </p>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground gap-1"
          onClick={() => fetchTools(false)}
          title="Refresh connections"
        >
          <RefreshCw className="size-2.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="space-y-2">
        {tools.map((tool) => {
          const IconComponent = TOOL_ICON_MAP[tool.slug] || Globe;
          const isConnecting = connectingSlug === tool.slug;

          return (
            <div
              key={tool.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                  <IconComponent className="size-4 text-foreground" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate text-foreground">{tool.name}</span>
                    {tool.authType && (
                      <span className="text-[9px] font-medium text-muted-foreground bg-muted/80 px-1.5 py-0 rounded">
                        {tool.authType}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {tool.description || "No description available"}
                  </span>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {tool.connected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="size-3" />
                    Connected
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] gap-1 px-2.5"
                    disabled={isConnecting}
                    onClick={() => handleConnect(tool)}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="size-3" />
                        <span>Connect</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
