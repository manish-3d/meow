"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Plus } from "lucide-react";
import { BrandLogo } from "@/components/custom/brands/brand-logo";

interface ToolSuggestionCardProps {
  toolSlug: string;
  toolName?: string;
  description?: string;
  onConnect?: () => void;
}

export function ToolSuggestionCard({ toolSlug, toolName, description, onConnect }: ToolSuggestionCardProps) {
  const [connecting, setConnecting] = useState(false);
  const displayName = toolName || toolSlug.charAt(0).toUpperCase() + toolSlug.slice(1).toLowerCase();

  const handleConnectClick = async () => {
    if (connecting) return;
    setConnecting(true);
    try {
      if (onConnect) {
        onConnect();
        return;
      }
      const res = await fetch("/api/tools/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolkitSlug: toolSlug.toUpperCase() }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank");
      }
    } catch (e) {
      console.error("Connect error:", e);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl border border-black/[0.08] bg-white text-foreground shadow-2xs my-2 hover:border-black/20 transition-all">
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="size-9 rounded-xl bg-white border border-black/[0.08] flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
          <BrandLogo slug={toolSlug} name={displayName} size={20} />
        </div>
        <div className="min-w-0">
          <h5 className="text-xs font-semibold text-foreground tracking-tight truncate">{displayName}</h5>
          <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
            {description || `Connect ${displayName} to enable automated workflows.`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConnectClick}
        disabled={connecting}
        className="h-7 px-3 rounded-xl text-xs font-semibold bg-black text-white hover:bg-neutral-800 transition-all shadow-2xs shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        {connecting ? (
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
    </div>
  );
}
