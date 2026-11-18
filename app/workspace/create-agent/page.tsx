"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Shuffle, ArrowLeft, Bot, Sparkles, Loader2, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AVATARS, DEFAULT_AVATAR } from "@/lib/avatars";
import { AvatarSelector } from "@/components/custom/workspace/avatar-selector";

export default function CreateAgentPage() {
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleShuffleAvatar = () => {
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    setSelectedAvatar(randomAvatar);
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
      await axios.post("/api/agent", {
        agentId: newAgentId,
        name: name.trim(),
        description: description.trim(),
        agentImage: selectedAvatar.path,
      });

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

      <Card className="border-black/[0.08] shadow-sm bg-white">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-foreground text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-4" />
            <span>Agent Creator</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create a New AI Agent</CardTitle>
          <CardDescription>
            Configure your agent's persona, system instructions, and visual avatar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                {errorMsg}
              </div>
            )}

            {/* Avatar Selection & Shuffle Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-neutral-50 border border-black/[0.06]">
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="relative size-24 rounded-2xl bg-white border border-black/[0.08] shadow-2xs overflow-hidden flex items-center justify-center p-2 shrink-0 group hover:border-black/30 transition-all cursor-pointer"
                title="Choose avatar"
              >
                <img
                  src={selectedAvatar.path}
                  alt={selectedAvatar.name}
                  className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </button>

              <div className="flex flex-col gap-2 text-center sm:text-left">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {selectedAvatar.name} — {selectedAvatar.role}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose from 30 Minecraft-style cat bot avatars or click shuffle.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAvatarModalOpen(true)}
                    className="gap-1.5 text-xs h-8 rounded-xl border-black/[0.08]"
                  >
                    <Grid className="size-3.5" />
                    <span>Choose Avatar</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleShuffleAvatar}
                    className="gap-1.5 text-xs h-8 rounded-xl border-black/[0.08]"
                  >
                    <Shuffle className="size-3.5" />
                    <span>Shuffle</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Agent Name */}
            <div className="space-y-2">
              <Label htmlFor="agent-name" className="text-xs font-semibold">
                Agent Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="agent-name"
                placeholder="e.g. Social Media Bot, Sports Analysis"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white text-xs h-9"
              />
            </div>

            {/* Agent Instructions / Description */}
            <div className="space-y-2">
              <Label htmlFor="agent-description" className="text-xs font-semibold">
                Instructions & Objectives
              </Label>
              <Textarea
                id="agent-description"
                placeholder="Describe what this agent should do, its tone of voice, tools it should prioritize, and routines it should perform..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white resize-none text-xs leading-relaxed"
              />
              <p className="text-[11px] text-muted-foreground">
                Injected into Gemini system instructions to govern reasoning and tool selection.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06]">
              <Link href="/workspace">
                <Button type="button" variant="ghost" className="text-xs">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="gap-2 text-xs bg-black text-white hover:bg-neutral-800 rounded-xl h-9"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Creating Agent...</span>
                  </>
                ) : (
                  <>
                    <Bot className="size-3.5" />
                    <span>Create Agent</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Avatar Selector Dialog */}
      <AvatarSelector
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentPath={selectedAvatar.path}
        onSelect={(av) => {
          setSelectedAvatar(av);
          setAvatarModalOpen(false);
        }}
      />
    </div>
  );
}
