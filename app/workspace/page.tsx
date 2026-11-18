"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import axios from "axios";
import { Plus, Bot, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { AgentConfigType } from "@/types/agent";

// Dynamically import the 3D Voxel Scene to prevent SSR canvas issues
const VoxelWorkspaceScene = dynamic(
  () =>
    import("@/components/custom/workspace/voxel-workspace-cat").then(
      (mod) => mod.VoxelWorkspaceScene
    ),
  { ssr: false }
);

export default function WorkspacePage() {
  const [agents, setAgents] = useState<AgentConfigType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/agent")
      .then((res) => {
        if (isMounted && Array.isArray(res.data)) {
          setAgents(res.data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch agents for workspace landing:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const firstAgentId = agents.length > 0 ? agents[0].agentId : null;

  return (
    <div className="relative h-full flex flex-col justify-between overflow-hidden bg-transparent select-none">
      {/* ── 3D MINECRAFT SKY WORLD (CLOUDS, CENTRAL FLOATING ISLAND WITH LAPTOP CAT, BOTTOM GRASS) ── */}
      <VoxelWorkspaceScene />

      {/* ── HTML CONTENT LAYER (TITLE, SPACER & ACTION CARDS) ── */}
      <div className="relative z-10 flex flex-col justify-between h-full pt-8 sm:pt-10 pb-8 sm:pb-10 px-4 sm:px-6 max-w-5xl mx-auto w-full pointer-events-auto">
        {/* Top Header & Welcome Typography */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-center space-y-2.5 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
            <span className="text-[#8dcb16] text-xl sm:text-2xl font-bold select-none tracking-widest drop-shadow-xs">
              ✦
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Agent Workspace
            </h1>
            <span className="text-[#8dcb16] text-xl sm:text-2xl font-bold select-none tracking-widest drop-shadow-xs">
              ✦
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal max-w-xl mx-auto px-4">
            Welcome to Meow Bot. Create, configure, and orchestrate autonomous AI
            agents with dedicated cloud VMs and tool integrations.
          </p>
        </motion.div>

        {/* Central Breathing Window (Shows the 3D Voxel Cat on Island with Laptop) */}
        <div className="min-h-[200px] sm:min-h-[250px] md:min-h-[290px] flex-1" />

        {/* Action Cards Grid (Anchored neatly above the bottom grass terrain) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto w-full"
        >
          {/* Card 1: Create an AI Agent */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_38px_rgba(0,0,0,0.07)] hover:border-black/20 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="size-11 sm:size-12 rounded-2xl bg-[#f4fbe8] border border-[#8dcb16]/40 flex items-center justify-center text-[#276e1a] shadow-xs">
                <Bot className="size-5 sm:size-6 stroke-[1.8]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Create an AI Agent
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Build an agent with custom personality, objectives, cloud VM
                desktop, and scheduled routines.
              </p>
            </div>

            <div className="pt-5 sm:pt-6">
              <Link href="/workspace/create-agent" className="inline-block">
                <Button className="h-10 px-5 rounded-full bg-[#276e1a] hover:bg-[#1f5815] text-white font-semibold text-xs gap-1.5 shadow-sm transition-all cursor-pointer">
                  <Plus className="size-4 stroke-[2.5]" />
                  <span>Create New Agent</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: Automated Routines */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_38px_rgba(0,0,0,0.07)] hover:border-black/20 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="size-11 sm:size-12 rounded-2xl bg-[#f4fbe8] border border-[#8dcb16]/40 flex items-center justify-center text-[#276e1a] shadow-xs">
                <Sparkles className="size-5 sm:size-6 stroke-[1.8]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Automated Routines
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect Gmail, Slack, and Google Docs to run scheduled daily
                summaries without opening your laptop.
              </p>
            </div>

            <div className="pt-5 sm:pt-6">
              <Link
                href={
                  firstAgentId
                    ? `/workspace/${firstAgentId}`
                    : "/workspace/create-agent"
                }
                className="inline-block"
              >
                <Button
                  variant="outline"
                  className="h-10 px-5 rounded-full border-black/[0.14] bg-white hover:bg-neutral-50 text-foreground font-semibold text-xs gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <span>Configure Routines</span>
                  <ArrowRight className="size-3.5 stroke-[2]" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
