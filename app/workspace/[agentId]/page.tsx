"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentConfigType } from "@/types/agent";
import { AgentConfigProvider } from "@/context/agent-config-context";
import { ChatPanel } from "@/components/custom/agent-space/chat-panel";
import { ConfigurationPanel } from "@/components/custom/agent-space/configuration-panel";
import { useWorkspaceUI } from "@/context/workspace-ui-context";
import { motion, AnimatePresence } from "motion/react";

export default function AgentSpacePage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const { isConfigOpen } = useWorkspaceUI();

  const [agent, setAgent] = useState<AgentConfigType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) return;

    const fetchAgent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/agent?agentId=${agentId}`);
        setAgent(res.data);
      } catch (err: any) {
        console.error("Error fetching agent:", err);
        setError("Agent not found or unauthorized.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="size-6 animate-spin text-foreground" />
        <span className="text-xs text-muted-foreground">Initializing Agent Space...</span>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Agent Not Found</h2>
        <p className="text-sm text-muted-foreground">{error || "This agent does not exist."}</p>
        <Link href="/workspace">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Return to Workspace</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <AgentConfigProvider initialAgent={agent} agentId={agentId}>
      <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-white">
        {/* ── CENTER CHAT WORKSPACE (FLEXIBLE FULL-WIDTH) ── */}
        <div className="flex-1 h-full min-w-0 overflow-hidden">
          <ChatPanel />
        </div>

        {/* ── RIGHT CONFIGURATION PANEL (TOGGLEABLE WITH ANIMATION) ── */}
        <AnimatePresence initial={false}>
          {isConfigOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-[380px] xl:w-[420px] h-full shrink-0 overflow-hidden"
            >
              <div className="w-[380px] xl:w-[420px] h-full">
                <ConfigurationPanel />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </AgentConfigProvider>
  );
}
