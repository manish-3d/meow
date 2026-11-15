"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, RefreshCw, ArrowRight, ArrowLeft } from "lucide-react";

export default function CreateAgentPage() {
  const router = useRouter();

  const [avatarSeed, setAvatarSeed] = useState<string>("agent-mickey-1");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>(
    "You are an autonomous AI agent capable of using cloud VM desktop and executing live browser workflows."
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const handleShuffleAvatar = () => {
    const randomSeed = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `seed_${Date.now()}`;
    setAvatarSeed(randomSeed);
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter an agent name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const cleanAgentId = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: cleanAgentId,
          name: name.trim(),
          description: description.trim(),
          agentImage: avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create agent");
      }

      router.push(`/workspace/${data.agent.agentId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create agent");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex items-center justify-center">
      <div className="max-w-xl w-full rounded-2xl border border-[#ebe8e4] bg-white p-8 sm:p-10 shadow-[0_1px_1px_rgba(0,0,0,0.04)] space-y-6">
        {/* Header */}
        <div className="space-y-1.5 pb-4 border-b border-[#ebe8e4]">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs font-medium text-black border border-[#ebe8e4]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Agent Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-[-0.03em] text-black">
            Create Your AI Agent
          </h1>
          <p className="text-xs text-[#777169] leading-relaxed">
            Configure your agent's persona, assign autonomous browser abilities, and connect cloud VM tools.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateAgent} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Agent Avatar"
                className="h-24 w-24 rounded-full border-2 border-black bg-[#FAFAF9] p-1.5 object-cover shadow-sm transition-transform group-hover:scale-105"
              />
            </div>

            <button
              type="button"
              onClick={handleShuffleAvatar}
              className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full border border-[#ebe8e4] bg-[#FAFAF9] text-xs font-medium text-black hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Shuffle Avatar</span>
            </button>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black uppercase tracking-wider">
              Agent Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mickey, DailyBriefer, PriceFinder"
              className="w-full rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] px-4 py-2.5 text-sm text-black placeholder-[#9E988F] outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

          {/* Description / Instructions Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black uppercase tracking-wider">
              Agent Instructions & Rules
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent should do, which sites to visit, and how it should behave..."
              className="w-full rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4 text-xs sm:text-sm text-black placeholder-[#9E988F] outline-none focus:border-black focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#ebe8e4] flex items-center justify-end gap-3">
            <Link
              href="/workspace"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-[#ebe8e4] bg-white text-xs font-medium text-black hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Creating Agent...</span>
                </>
              ) : (
                <>
                  <span>Create Agent</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
