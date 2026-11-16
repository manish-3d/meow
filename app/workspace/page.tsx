import React from "react";
import Link from "next/link";
import { Plus, Bot, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkspacePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agent Workspace</h1>
        <p className="text-muted-foreground text-sm">
          Welcome to Meow Bot. Create, configure, and orchestrate autonomous AI agents with dedicated cloud VMs and tool integrations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60 hover:border-primary/50 transition-all bg-card/50">
          <CardHeader>
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Bot className="size-5" />
            </div>
            <CardTitle>Create an AI Agent</CardTitle>
            <CardDescription>
              Build an agent with custom personality, objectives, cloud VM desktop, and scheduled routines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/workspace/create-agent">
              <Button className="gap-2">
                <Plus className="size-4" />
                <span>Create New Agent</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mb-2">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>Automated Routines</CardTitle>
            <CardDescription>
              Connect Gmail, Slack, and Google Docs to run scheduled daily summaries without opening your laptop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Select an agent from the sidebar or create a new one to start configuring recurring routines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
