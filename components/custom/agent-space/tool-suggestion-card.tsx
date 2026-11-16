"use client";

import React, { useState } from "react";
import { Wrench, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      // Trigger tool connection endpoint
      const res = await fetch("/api/tools/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: toolSlug.toUpperCase() }),
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
    <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card/80 text-card-foreground shadow-xs my-2">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0 border border-border">
          <Wrench className="size-4" />
        </div>
        <div>
          <h5 className="text-xs font-semibold text-foreground">{displayName}</h5>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            {description || `Connect your ${displayName} account to allow your agent to perform actions.`}
          </p>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={handleConnectClick}
        disabled={connecting}
        className="h-7 text-xs gap-1.5 shrink-0 border-border hover:bg-muted"
      >
        {connecting ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <ExternalLink className="size-3" />
        )}
        Connect
      </Button>
    </div>
  );
}
