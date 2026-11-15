"use client";

import React, { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Settings,
  Wrench,
  Clock,
  Monitor,
  RefreshCw,
  Play,
  Check,
  X,
  ExternalLink,
  Terminal,
  ShieldCheck,
  AlertCircle,
  Copy,
  Plus,
} from "lucide-react";

interface AgentConfigData {
  id: number;
  agentId: string;
  name: string;
  description: string;
  agentImage: string;
  userEmail: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  createdAt: string;
  taskResult?: any;
}

interface RoutineItem {
  id: string;
  title: string;
  instruction: string;
  frequency: string;
  time: string;
  status: string;
}

export default function AgentSpacePage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);

  // Agent State
  const [agent, setAgent] = useState<AgentConfigData | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(true);

  // Tab State: 'settings' | 'tools' | 'schedule' | 'vm'
  const [activeTab, setActiveTab] = useState<"settings" | "tools" | "schedule" | "vm">("settings");

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Settings Tab State
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Schedule Tab State
  const [routinesList, setRoutinesList] = useState<RoutineItem[]>([]);
  const [newRoutineTitle, setNewRoutineTitle] = useState("");
  const [newRoutineInstruction, setNewRoutineInstruction] = useState("");
  const [isRunningRoutine, setIsRunningRoutine] = useState<string | null>(null);

  // VM Desktop State
  const [vmActive, setVmActive] = useState(true);
  const [vmStatus, setVmStatus] = useState<"idle" | "running" | "ready">("ready");
  const [vmPreviewUrl, setVmPreviewUrl] = useState<string>("https://browserbase.com/demo-debugger");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Agent Profile
  const loadAgent = async () => {
    try {
      setLoadingAgent(true);
      const res = await fetch(`/api/agent?agentId=${agentId}`);
      if (res.ok) {
        const data = await res.json();
        setAgent(data.agent);
        setEditName(data.agent.name);
        setEditDescription(data.agent.description || "");
        setEditAvatar(data.agent.agentImage || "");

        // Set initial welcome message
        setMessages([
          {
            id: "welcome",
            role: "agent",
            content: `Hello! I am **${data.agent.name}**.\n\nI can execute cloud browser tasks on the VM desktop (like scraping Flipkart/Amazon, researching news, or posting to social media with your approval). How can I help you today?`,
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to load agent profile:", err);
    } finally {
      setLoadingAgent(false);
    }
  };

  // 2. Fetch Routines
  const loadRoutines = async () => {
    try {
      const res = await fetch(`/api/agent/schedule?agentId=${agentId}`);
      if (res.ok) {
        const data = await res.json();
        setRoutinesList(data.routines || []);
      }
    } catch (err) {
      console.error("Failed to load routines:", err);
    }
  };

  useEffect(() => {
    if (agentId) {
      loadAgent();
      loadRoutines();
    }
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save Config (Chapter 8)
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/agent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          name: editName.trim(),
          description: editDescription.trim(),
          agentImage: editAvatar,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAgent(data.agent);
        triggerToast("✓ Agent configuration saved successfully");
      } else {
        triggerToast("✕ Failed to save configuration");
      }
    } catch {
      triggerToast("✕ Network error saving configuration");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Shuffle Avatar
  const handleShuffleAvatar = () => {
    const seed = `seed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setEditAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`);
  };

  // Send Chat Message (Chapter 9)
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsSending(true);

    if (text.toLowerCase().includes("vm desktop") || text.toLowerCase().includes("browser") || text.toLowerCase().includes("flipkart") || text.toLowerCase().includes("amazon")) {
      setActiveTab("vm");
      setVmStatus("running");
    }

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Chat turn failed");
      }

      const agentMsg: ChatMessage = {
        id: `agt_${Date.now()}`,
        role: "agent",
        content: data.response,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        taskResult: data.browserTaskResult,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setVmStatus("ready");
    } catch (err: unknown) {
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "agent",
        content: `Error: ${err instanceof Error ? err.message : "Something went wrong"}`,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
      setVmStatus("idle");
    } finally {
      setIsSending(false);
    }
  };

  // Create Routine (Chapter 10)
  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineTitle.trim() || !newRoutineInstruction.trim()) return;

    try {
      const res = await fetch("/api/agent/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          title: newRoutineTitle.trim(),
          instruction: newRoutineInstruction.trim(),
          frequency: "daily",
          time: "08:00 AM",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRoutinesList((prev) => [data.routine, ...prev]);
        setNewRoutineTitle("");
        setNewRoutineInstruction("");
        triggerToast("✓ Routine created successfully");
      }
    } catch {
      triggerToast("✕ Failed to create routine");
    }
  };

  // Run Routine Immediately
  const handleRunRoutineNow = async (routine: RoutineItem) => {
    setIsRunningRoutine(routine.id);
    handleSendMessage(`Execute scheduled routine: "${routine.instruction}"`);
    setTimeout(() => setIsRunningRoutine(null), 1500);
  };

  if (loadingAgent) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-[#777169] animate-pulse">
        Connecting to agent space...
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-xs text-[#777169]">
        <p>Agent not found or unauthorized.</p>
        <Link href="/workspace/create-agent" className="text-black underline font-medium">
          Create new agent →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#FDFCFC] selection:bg-black/10 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-full bg-black text-white px-4 py-2 text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* ─── LEFT / CENTER: CHAT PANEL (Chapter 7 & 9) ─── */}
      <div className="flex-1 flex flex-col h-full border-r border-[#ebe8e4] bg-[#FDFCFC] min-w-0">
        {/* Agent Space Header */}
        <div className="h-16 px-6 border-b border-[#ebe8e4] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={agent.agentImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.agentId}`}
              alt={agent.name}
              className="h-9 w-9 rounded-full border border-[#ebe8e4] bg-[#FAFAF9] object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-black truncate">{agent.name}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Online & Ready" />
              </div>
              <span className="text-[11px] text-[#777169] truncate font-mono">
                {agent.description || "Cloud VM Desktop Agent"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("vm")}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium border transition-colors ${
                activeTab === "vm"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-[#ebe8e4] hover:bg-[#FAFAF9]"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>VM Desktop</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "user" ? (
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                  U
                </div>
              ) : (
                <img
                  src={agent.agentImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.agentId}`}
                  alt={agent.name}
                  className="h-8 w-8 rounded-full border border-[#ebe8e4] bg-white object-cover shrink-0"
                />
              )}

              <div
                className={`max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  msg.role === "user"
                    ? "bg-black text-white rounded-tr-none shadow-xs"
                    : "bg-white text-black border border-[#ebe8e4] rounded-tl-none shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* If the message generated autonomous browser findings, render the structured card */}
                {msg.taskResult && msg.taskResult.steps && (
                  <div className="mt-3 pt-3 border-t border-[#ebe8e4] text-xs font-mono space-y-2 text-[#777169]">
                    <div className="font-semibold text-black flex items-center gap-1.5">
                      <Terminal className="h-3 w-3" />
                      <span>Stagehand Execution Trace ({msg.taskResult.steps.length} steps)</span>
                    </div>
                    {msg.taskResult.finalOutput && (
                      <div className="p-3 rounded-xl bg-[#FAFAF9] border border-[#ebe8e4] text-black font-sans whitespace-pre-wrap">
                        {msg.taskResult.finalOutput}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono ${
                    msg.role === "user" ? "text-white/60 text-right" : "text-[#9E988F]"
                  }`}
                >
                  {msg.createdAt}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-start gap-3">
              <img
                src={agent.agentImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.agentId}`}
                alt={agent.name}
                className="h-8 w-8 rounded-full border border-[#ebe8e4] bg-white object-cover shrink-0 animate-pulse"
              />
              <div className="rounded-2xl rounded-tl-none border border-[#ebe8e4] bg-white p-3.5 text-xs text-[#777169] flex items-center gap-2 shadow-xs">
                <div className="h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                <span>{agent.name} is reasoning & operating browser...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & 1-Click Prompt Chips */}
        <div className="p-4 border-t border-[#ebe8e4] bg-white space-y-3 shrink-0">
          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => handleSendMessage("find price of ipad on flipkart")}
              className="rounded-full border border-[#ebe8e4] bg-[#FAFAF9] px-3 py-1 text-[11px] text-black hover:bg-black hover:text-white transition-all shrink-0"
            >
              ⚡ find price of ipad on flipkart
            </button>
            <button
              onClick={() => handleSendMessage("Give me top five AI news from Google News. Use VM desktop")}
              className="rounded-full border border-[#ebe8e4] bg-[#FAFAF9] px-3 py-1 text-[11px] text-black hover:bg-black hover:text-white transition-all shrink-0"
            >
              ⚡ top 5 AI news from Google News
            </button>
            <button
              onClick={() => handleSendMessage("Draft a post about NVIDIA on X and ask for approval")}
              className="rounded-full border border-[#ebe8e4] bg-[#FAFAF9] px-3 py-1 text-[11px] text-black hover:bg-black hover:text-white transition-all shrink-0"
            >
              ⚡ draft post on X
            </button>
          </div>

          {/* Textbox Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isSending}
              placeholder={`Tell ${agent.name} what to do on the web...`}
              className="flex-1 rounded-full border border-[#ebe8e4] bg-[#FAFAF9] px-4 py-2.5 text-xs sm:text-sm text-black placeholder-[#9E988F] outline-none focus:border-black focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xs disabled:opacity-40 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ─── RIGHT: AGENT BOARD CONFIGURATION (4 Tabs - Chapter 7, 8, 10) ─── */}
      <div className="w-80 md:w-96 flex flex-col h-full bg-[#FAFAF9] overflow-hidden shrink-0">
        {/* Tab Switcher */}
        <div className="h-16 px-4 border-b border-[#ebe8e4] flex items-center justify-between bg-white shrink-0">
          <div className="inline-flex p-1 bg-[#F5F4F0] rounded-full border border-[#ebe8e4] w-full justify-between text-xs">
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-1.5 rounded-full font-medium transition-all text-center ${
                activeTab === "settings" ? "bg-white text-black shadow-xs" : "text-[#777169] hover:text-black"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`flex-1 py-1.5 rounded-full font-medium transition-all text-center ${
                activeTab === "tools" ? "bg-white text-black shadow-xs" : "text-[#777169] hover:text-black"
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 py-1.5 rounded-full font-medium transition-all text-center ${
                activeTab === "schedule" ? "bg-white text-black shadow-xs" : "text-[#777169] hover:text-black"
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab("vm")}
              className={`flex-1 py-1.5 rounded-full font-medium transition-all text-center ${
                activeTab === "vm" ? "bg-white text-black shadow-xs" : "text-[#777169] hover:text-black"
              }`}
            >
              VM Desktop
            </button>
          </div>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* ─── TAB 1: SETTINGS TAB (Chapter 8) ─── */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="flex flex-col items-center justify-center gap-3 pb-3 border-b border-[#ebe8e4]">
                <img
                  src={editAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.agentId}`}
                  alt="Agent Avatar"
                  className="h-20 w-20 rounded-full border-2 border-black bg-white p-1 object-cover shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleShuffleAvatar}
                  className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full border border-[#ebe8e4] bg-white text-[11px] font-medium text-black hover:bg-neutral-100 transition-colors shadow-2xs"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Shuffle Avatar</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-black uppercase tracking-wider">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-[#ebe8e4] bg-white px-3.5 py-2 text-xs text-black outline-none focus:border-black transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-black uppercase tracking-wider">
                  Description & Instruction
                </label>
                <textarea
                  rows={5}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#ebe8e4] bg-white p-3 text-xs text-black outline-none focus:border-black transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingConfig}
                className="w-full inline-flex items-center justify-center h-10 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xs disabled:opacity-50"
              >
                {isSavingConfig ? "Saving..." : "Save Configuration"}
              </button>
            </form>
          )}

          {/* ─── TAB 2: TOOLS TAB (Chapter 10) ─── */}
          {activeTab === "tools" && (
            <div className="space-y-3">
              <div className="text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider">
                Connected Agent Tools
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Browserbase VM Desktop", desc: "Cloud Chromium for live human-grade web navigation", connected: true },
                  { name: "Google Search & Scraper", desc: "Stealth HTTP scraping for Flipkart, Amazon, and web feeds", connected: true },
                  { name: "Slack Notifications", desc: "Post execution summaries and alerts to your channels", connected: true },
                  { name: "Gmail Automator", desc: "Read and summarize unread email feeds", connected: false },
                  { name: "GitHub Integration", desc: "Inspect PRs and repository changelogs", connected: false },
                  { name: "Notion Sync", desc: "Create pages and update workspace databases", connected: false },
                ].map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#ebe8e4] bg-white space-y-1 shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-black">{tool.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          tool.connected ? "bg-black text-white" : "bg-[#F5F4F0] text-[#777169] border border-[#ebe8e4]"
                        }`}
                      >
                        {tool.connected ? "Active" : "Connect"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777169] leading-relaxed">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB 3: SCHEDULE / ROUTINES TAB (Chapter 1) ─── */}
          {activeTab === "schedule" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider block">
                  Automated Routines
                </span>
                <p className="text-xs text-[#777169]">
                  Recurring background jobs executed on your behalf.
                </p>
              </div>

              {/* Routine Creator Form */}
              <form onSubmit={handleCreateRoutine} className="p-3.5 rounded-xl border border-[#ebe8e4] bg-white space-y-3">
                <span className="text-xs font-semibold text-black block">+ Add New Routine</span>
                <input
                  type="text"
                  placeholder="Routine title (e.g. Daily email summary)"
                  value={newRoutineTitle}
                  onChange={(e) => setNewRoutineTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#ebe8e4] bg-[#FAFAF9] px-3 py-1.5 text-xs text-black outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="Instruction (e.g. summarize unread emails and post to Slack every day at 8 AM)"
                  value={newRoutineInstruction}
                  onChange={(e) => setNewRoutineInstruction(e.target.value)}
                  className="w-full rounded-lg border border-[#ebe8e4] bg-[#FAFAF9] p-2 text-xs text-black outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full h-8 rounded-full bg-black text-white text-[11px] font-medium hover:bg-neutral-800 transition-all"
                >
                  Create Routine
                </button>
              </form>

              {/* Routines List */}
              <div className="space-y-2.5">
                {routinesList.length === 0 ? (
                  <div className="text-center py-4 text-xs text-[#777169] border border-dashed border-[#ebe8e4] rounded-xl p-3">
                    No active routines yet. Add one above or ask {agent.name} in chat!
                  </div>
                ) : (
                  routinesList.map((routine) => (
                    <div
                      key={routine.id}
                      className="p-3.5 rounded-xl border border-[#ebe8e4] bg-white space-y-2 shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-black">{routine.title}</span>
                        <span className="rounded-full bg-[#F5F4F0] border border-[#ebe8e4] px-2 py-0.5 text-[10px] text-black font-mono">
                          {routine.frequency} · {routine.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777169] leading-relaxed">{routine.instruction}</p>
                      <div className="pt-2 border-t border-[#ebe8e4] flex items-center justify-between">
                        <span className="text-[10px] text-emerald-600 font-medium">● Active Inngest Job</span>
                        <button
                          type="button"
                          onClick={() => handleRunRoutineNow(routine)}
                          disabled={isRunningRoutine === routine.id}
                          className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-black text-white text-[10px] font-medium hover:bg-neutral-800 transition-all"
                        >
                          <Play className="h-2.5 w-2.5 fill-current" />
                          <span>{isRunningRoutine === routine.id ? "Running..." : "Run Now"}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ─── TAB 4: CLOUD VM DESKTOP TAB (Chapters 1 & 10) ─── */}
          {activeTab === "vm" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-black block">Cloud VM Desktop</span>
                  <span className="text-[11px] text-[#777169]">Dedicated remote Chromium session</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVmActive(!vmActive)}
                  className={`h-6 px-3 rounded-full text-[10px] font-semibold border transition-all ${
                    vmActive
                      ? "bg-black text-white border-black"
                      : "bg-[#F5F4F0] text-[#777169] border-[#ebe8e4]"
                  }`}
                >
                  {vmActive ? "VM Online" : "Paused"}
                </button>
              </div>

              {/* VM Screen Frame */}
              <div className="rounded-2xl border border-black bg-black p-1 shadow-md overflow-hidden space-y-1">
                {/* VM Browser Header Bar */}
                <div className="h-6 px-3 bg-[#18181B] flex items-center justify-between text-[10px] text-white/70 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-white">Chromium 128 (Stealth)</span>
                  </div>
                  <span>{vmStatus === "running" ? "Active Playwright Worker" : "Ready"}</span>
                </div>

                {/* Simulated / Live Screen */}
                <div className="relative h-64 bg-[#111113] rounded-b-xl flex flex-col justify-between p-4 text-white font-mono text-xs overflow-hidden">
                  <div className="space-y-1 text-white/80 text-[11px]">
                    <div className="text-emerald-400">&gt; stagehand.page.init() [1280x800]</div>
                    <div className="text-white/60">&gt; Browserbase Cloud Session provisioned</div>
                    {vmStatus === "running" && (
                      <div className="text-amber-300 animate-pulse">&gt; Observing DOM elements and executing clicks...</div>
                    )}
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center space-y-2">
                    <p className="text-xs text-white">
                      Ask {agent.name} to search, check prices, or navigate in the chat to watch the VM operate live!
                    </p>
                    <button
                      onClick={() => handleSendMessage("find price of ipad on flipkart")}
                      className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white text-black text-[10px] font-semibold hover:bg-neutral-200 transition-colors"
                    >
                      <span>Trigger Flipkart Scrape</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#ebe8e4] bg-white space-y-1.5 text-xs">
                <span className="font-semibold text-black block">Autonomous Web Capabilities:</span>
                <ul className="text-[11px] text-[#777169] space-y-1 list-disc list-inside">
                  <li>Full Playwright DOM interaction & scrolling</li>
                  <li>Stealth headers bypassing anti-bot rate limits</li>
                  <li>Zero API fees for web reading & market research</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
