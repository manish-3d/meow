"use client";

import React, { useState } from "react";
import { Monitor, Globe, Power, Play, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VmDesktopTab() {
  const [vmActive, setVmActive] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("https://news.google.com");

  return (
    <div className="space-y-4 pt-2">
      {/* VM Status & Toggle Card */}
      <div className="p-3 rounded-xl border border-border/60 bg-muted/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`size-2.5 rounded-full ${vmActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"}`} />
            <span className="text-xs font-semibold">
              {vmActive ? "Cloud Sandbox: Running" : "Cloud Sandbox: Inactive"}
            </span>
          </div>

          <Button
            size="sm"
            variant={vmActive ? "destructive" : "default"}
            className="h-7 text-xs gap-1.5 px-3"
            onClick={() => setVmActive(!vmActive)}
          >
            <Power className="size-3" />
            <span>{vmActive ? "Stop VM" : "Start VM"}</span>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Gives the agent its own cloud browser to navigate websites, click elements, and extract live web data.
          Auto-pauses after 2 minutes of inactivity to save cloud resources.
        </p>
      </div>

      {/* Simulated Live Viewport */}
      <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
        {/* Browser Top Chrome */}
        <div className="h-8 bg-muted/60 border-b border-border/50 px-2 flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground/60">
            <div className="size-2 rounded-full bg-red-400" />
            <div className="size-2 rounded-full bg-amber-400" />
            <div className="size-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 bg-background/80 px-2 py-0.5 rounded text-[10px] text-muted-foreground border border-border/40 truncate">
            <Globe className="size-2.5 shrink-0" />
            <span className="truncate">{currentUrl}</span>
          </div>
          <RefreshCw className="size-3 text-muted-foreground shrink-0 cursor-pointer hover:text-foreground" />
        </div>

        {/* Browser Body */}
        <div className="h-44 flex flex-col items-center justify-center p-4 text-center bg-muted/10">
          {vmActive ? (
            <div className="space-y-2">
              <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <Globe className="size-4 animate-spin" />
              </div>
              <p className="text-xs font-medium text-foreground">Interactive Session Live</p>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Agent is ready to navigate live URLs and stream DOM actions directly to this viewport.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Monitor className="size-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">
                Cloud VM is offline. Click <strong>&quot;Start VM&quot;</strong> to initialize a dedicated browser sandbox.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
