"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Wrench,
  CheckCircle2,
  Plus,
  Loader2,
  RefreshCw,
  Unlink,
  Check,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { BrandLogo } from "@/components/custom/brands/brand-logo";

interface ToolRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  authType: string | null;
  isActive: boolean;
  connected?: boolean;
}

export function ToolTab() {
  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingSlug, setConnectingSlug] = useState<string | null>(null);
  const [hoveredDisconnectSlug, setHoveredDisconnectSlug] = useState<string | null>(null);

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

        const popup = window.open(
          res.data.redirectUrl,
          `composio_${tool.slug}`,
          "width=600,height=720,top=120,left=240"
        );

        const timer = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(timer);
            setConnectingSlug(null);
            fetchTools(true);
          }
        }, 1500);
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

  const handleDisconnect = async (tool: ToolRecord) => {
    try {
      setConnectingSlug(tool.slug);
      await axios.post("/api/tools/disconnect", {
        toolkitSlug: tool.slug,
      });

      toast.add({
        title: `${tool.name} Disconnected`,
        description: "Integration disconnected.",
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
      setConnectingSlug(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-center text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-black" />
        <span className="text-xs font-mono">Syncing integrations...</span>
      </div>
    );
  }

  if (!tools.length) {
    return (
      <div className="text-center py-12 space-y-2">
        <Wrench className="size-6 mx-auto text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">No integrations available.</p>
      </div>
    );
  }

  const connectedCount = tools.filter((t) => t.connected).length;

  return (
    <div className="space-y-4 pt-1 pb-6 text-xs select-none">
      {/* ── HEADER TELEMETRY ── */}
      <div className="flex items-center justify-between pb-1 border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-foreground">Active Toolkits</span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            {connectedCount}/{tools.length} Ready
          </span>
        </div>

        <button
          type="button"
          onClick={() => fetchTools(false)}
          className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-neutral-100 transition-colors"
          title="Refresh integrations"
        >
          <RefreshCw className="size-3" />
        </button>
      </div>

      {/* ── TOOL LIST ── */}
      <div className="space-y-2">
        {tools.map((tool) => {
          const isConnecting = connectingSlug === tool.slug;
          const isHovered = hoveredDisconnectSlug === tool.slug;

          return (
            <div
              key={tool.id}
              className="p-3 rounded-2xl border border-black/[0.08] bg-white shadow-2xs hover:border-black/20 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
            >
              {/* Left: Real Official Logo + Name + Description */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-xl border border-black/[0.08] bg-white flex items-center justify-center p-1.5 shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <BrandLogo slug={tool.slug} name={tool.name} size={20} />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground truncate tracking-tight">
                      {tool.name}
                    </span>
                    {tool.connected && (
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate leading-tight">
                    {tool.description || "Cloud integration"}
                  </span>
                </div>
              </div>

              {/* Right: Connect or Disconnect Button */}
              <div className="shrink-0">
                {tool.connected ? (
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredDisconnectSlug(tool.slug)}
                    onMouseLeave={() => setHoveredDisconnectSlug(null)}
                    onClick={() => handleDisconnect(tool)}
                    disabled={isConnecting}
                    className={`h-7 px-2.5 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border ${
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
                        <span>Connected</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConnect(tool)}
                    disabled={isConnecting}
                    className="h-7 px-3 rounded-xl text-[11px] font-semibold bg-black text-white hover:bg-neutral-800 transition-all shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <Loader2 className="size-3 animate-spin" />
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
    </div>
  );
}
