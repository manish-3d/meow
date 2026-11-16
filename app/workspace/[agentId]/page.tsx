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

export default function AgentSpacePage() {
  const params = useParams();
  const agentId = params.agentId as string;

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
        <Loader2 className="size-6 animate-spin text-primary" />
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
      <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Center Column: Chat Viewport */}
        <div className="lg:col-span-7 xl:col-span-8 h-full overflow-hidden border-b lg:border-b-0">
          <ChatPanel />
        </div>

        {/* Right Column: Configuration & Observability Panel */}
        <div className="lg:col-span-5 xl:col-span-4 h-full overflow-hidden">
          <ConfigurationPanel />
        </div>
      </div>
    </AgentConfigProvider>
  );
}
