"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Shuffle, ArrowLeft, Bot, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateAgentPage() {
  const router = useRouter();

  // Avatar state - dynamically generated via DiceBear
  const [avatarSeed, setAvatarSeed] = useState("meow-bot-agent-seed-1");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // DiceBear SVG URL
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const handleShuffleAvatar = () => {
    const newSeed = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `seed-${Date.now()}`;
    setAvatarSeed(newSeed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    const newAgentId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `agent-${Date.now()}`;

    try {
      // POST to /api/agent (Tutorial timestamp 1:33:18)
      const result = await axios.post("/api/agent", {
        agentId: newAgentId,
        name: name.trim(),
        description: description.trim(),
        agentImage: avatarUrl,
      });

      console.log("Agent created successfully:", result.data);

      // Navigate to the dynamic agent workspace (Tutorial timestamp 1:40:42)
      router.push(`/workspace/${newAgentId}`);
    } catch (err: any) {
      console.error("Error creating agent:", err);
      setErrorMsg(err.response?.data?.error || "Failed to create agent. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      {/* Back navigation */}
      <Link
        href="/workspace"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to Workspace</span>
      </Link>

      <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-4" />
            <span>Agent Creator</span>
          </div>
          <CardTitle className="text-2xl">Create a New AI Agent</CardTitle>
          <CardDescription>
            Configure your agent's persona, system instructions, and visual avatar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                {errorMsg}
              </div>
            )}

            {/* Avatar Selection & Shuffle Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-muted/40 border border-border/50">
              <div className="relative size-24 rounded-2xl bg-background border-2 border-primary/20 shadow-sm overflow-hidden flex items-center justify-center p-2 shrink-0 group">
                <img
                  src={avatarUrl}
                  alt="Agent Avatar"
                  className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h4 className="text-sm font-semibold">Agent Avatar</h4>
                <p className="text-xs text-muted-foreground">
                  Pick a unique avatar personality for your agent. Click shuffle to generate a new character.
                </p>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleShuffleAvatar}
                    className="gap-2 text-xs"
                  >
                    <Shuffle className="size-3.5" />
                    <span>Shuffle Avatar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Agent Name */}
            <div className="space-y-2">
              <Label htmlFor="agent-name" className="text-sm font-medium">
                Agent Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="agent-name"
                placeholder="e.g. Daily Briefing Bot, PR Reviewer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            {/* Agent Instructions / Description */}
            <div className="space-y-2">
              <Label htmlFor="agent-description" className="text-sm font-medium">
                Instructions & Objectives
              </Label>
              <Textarea
                id="agent-description"
                placeholder="Describe what this agent should do, its tone of voice, tools it should prioritize, and routines it should perform..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background resize-none"
              />
              <p className="text-[11px] text-muted-foreground">
                These instructions will be compiled directly into the OpenAI Agent runtime.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Link href="/workspace">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading || !name.trim()} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Creating Agent...</span>
                  </>
                ) : (
                  <>
                    <Bot className="size-4" />
                    <span>Create Agent</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
