"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  User,
  Send,
  Loader2,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Plus,
  CornerDownLeft,
  ChevronDown,
  ChevronRight,
  Shield,
  Zap,
  Cpu,
} from "lucide-react";

interface AgentDetails {
  id: string;
  name: string;
  description: string | null;
  status: string;
  workspaceId: string;
  activeVersion?: {
    id: string;
    version: number;
    model: string;
    instructions: string;
  };
}

interface ToolCallItem {
  id: string;
  callId: string;
  name: string;
  arguments: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  status: string;
}

interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  createdAt: string;
  metadata?: {
    durationMs?: number;
    steps?: number;
    finishReason?: string;
  };
  toolCalls?: ToolCallItem[];
}

interface ConversationItem {
  id: string;
  title: string;
  updatedAt: string;
}

export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [processingApprovalId, setProcessingApprovalId] = useState<string | null>(null);
  const [expandedThinkingIds, setExpandedThinkingIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // 1. Fetch Agent Profile & Active Version
  useEffect(() => {
    async function initAgent() {
      try {
        setIsLoading(true);
        setErrorNotice(null);

        const agentRes = await fetch(`/api/agents/${agentId}`);
        if (!agentRes.ok) {
          throw new Error("Failed to load agent configuration");
        }
        const agentData = await agentRes.json();
        const agentObj: AgentDetails = {
          ...agentData.agent,
          activeVersion: agentData.activeVersion || agentData.versions?.[0],
        };
        setAgent(agentObj);

        // Fetch conversation threads for this agent
        const convRes = await fetch(
          `/api/conversations?workspaceId=${agentObj.workspaceId}&agentId=${agentObj.id}`,
        );
        if (convRes.ok) {
          const convData = await convRes.json();
          const list: ConversationItem[] = convData.conversations || [];
          setConversations(list);

          if (list.length > 0) {
            setActiveConversationId(list[0].id);
          } else {
            await createNewConversation(agentObj.workspaceId, agentObj.id);
          }
        }
      } catch (err: unknown) {
        setErrorNotice(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    if (agentId) {
      initAgent();
    }
  }, [agentId]);

  // 2. Fetch Messages whenever activeConversationId changes
  useEffect(() => {
    async function loadMessages() {
      if (!activeConversationId) return;
      try {
        const res = await fetch(`/api/conversations/${activeConversationId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to load thread messages:", err);
      }
    }

    loadMessages();
  }, [activeConversationId]);

  // Create a new thread
  const createNewConversation = async (wsId?: string, agId?: string) => {
    const workspaceId = wsId || agent?.workspaceId;
    const currentAgentId = agId || agent?.id;
    if (!workspaceId || !currentAgentId) return;

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          agentId: currentAgentId,
          title: `Thread #${conversations.length + 1}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newConv = data.conversation;
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  // Submit User Message Turn
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputContent.trim();
    if (!trimmed || !activeConversationId || isSending) return;

    setInputContent("");
    setIsSending(true);
    setErrorNotice(null);

    const optimisticUserMessage: MessageItem = {
      id: `opt_${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversationId,
          content: trimmed,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process turn");
      }

      const chatData = await res.json();

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUserMessage.id),
        chatData.userMessage,
        chatData.assistantMessage,
      ]);
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSending(false);
    }
  };

  const handleApproval = async (toolCallId: string, decision: "approved" | "rejected") => {
    setProcessingApprovalId(toolCallId);
    setErrorNotice(null);
    try {
      const res = await fetch("/api/chat/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolCallId, decision }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process authorization");
      }

      const approveData = await res.json();

      setMessages((prev) => {
        const updated = prev.map((msg) => {
          if (!msg.toolCalls) return msg;
          return {
            ...msg,
            toolCalls: msg.toolCalls.map((tc) =>
              tc.id === toolCallId
                ? { ...tc, status: decision === "approved" ? "completed" : "rejected" }
                : tc,
            ),
          };
        });
        return [...updated, approveData.assistantMessage];
      });
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : String(err));
    } finally {
      setProcessingApprovalId(null);
    }
  };

  const toggleThinking = (id: string) => {
    setExpandedThinkingIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-[#08090a]">
        <div className="flex items-center gap-3 text-white/50 text-xs font-mono">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          <span>Loading agent runtime environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-[#08090a] text-[#f7f8f8] font-sans">
      {/* ─── THREADS SIDEBAR ─── */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#0c0d10] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/agents"
              className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white/60">
              Threads
            </span>
          </div>

          <button
            onClick={() => createNewConversation()}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white text-black hover:bg-white/90 transition-colors shadow-xs"
            title="New Conversation"
          >
            <Plus className="h-3 w-3" />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConversationId(c.id)}
              className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-all truncate flex items-center justify-between ${
                c.id === activeConversationId
                  ? "bg-white/10 text-white font-semibold border border-white/10"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="truncate">{c.title}</span>
            </button>
          ))}

          {conversations.length === 0 && (
            <div className="text-xs text-white/40 text-center py-6 font-mono">
              No threads recorded.
            </div>
          )}
        </div>

        {/* Agent Metadata Footer */}
        <div className="p-3 border-t border-white/[0.08] bg-white/[0.01] text-[11px] text-white/40 space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span>Model</span>
            <span className="text-indigo-400 font-semibold">gemini-2.5-flash</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Version</span>
            <span className="text-white/80">v{agent?.activeVersion?.version || 1}</span>
          </div>
        </div>
      </aside>

      {/* ─── CHAT MAIN CANVAS ─── */}
      <section className="flex-1 flex flex-col bg-[#08090a] min-w-0">
        {/* Agent Header */}
        <header className="h-14 border-b border-white/[0.08] px-6 flex items-center justify-between bg-[#08090a]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Agent Avatar"
                className="h-8 w-8 rounded-full border border-white/20 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#08090a]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                {agent?.name}
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Active
                </span>
              </h1>
              <p className="text-[11px] text-white/50 truncate max-w-md">
                {agent?.description || agent?.activeVersion?.instructions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-white/40">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ReAct Loop Online</span>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-4">
              <img src="/logo.png" alt="Meow" className="h-16 w-16 rounded-full border border-white/20 shadow-md opacity-80" />
              <h2 className="text-base font-bold text-white">How can {agent?.name} assist you today?</h2>
              <p className="text-xs text-white/50 max-w-md leading-relaxed">
                Instruct your agent to search Twitter trends, publish posts, triage GitHub issues, query Reddit, or execute custom sandboxed skills.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                    isUser
                      ? "bg-white text-black font-bold"
                      : "bg-[#0c0d10] border border-white/20 overflow-hidden"
                  }`}
                >
                  {isUser ? <User className="h-3.5 w-3.5" /> : <img src="/logo.png" alt="Bot" className="h-7 w-7 object-cover" />}
                </div>

                <div className={`space-y-2 max-w-[85%] ${isUser ? "text-right" : "text-left"}`}>
                  {/* Grok-style Thinking Drawer */}
                  {!isUser && msg.metadata?.durationMs && (
                    <div className="pb-1">
                      <button
                        onClick={() => toggleThinking(msg.id)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/50 hover:text-white bg-white/5 px-2.5 py-1 rounded-full border border-white/10 transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span>Thought for {(msg.metadata.durationMs / 1000).toFixed(1)}s</span>
                        {expandedThinkingIds[msg.id] ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>

                      {expandedThinkingIds[msg.id] && (
                        <div className="mt-2 rounded-xl border border-white/[0.08] bg-black/60 p-3 text-xs font-mono text-white/60 space-y-1">
                          <p className="text-[10px] uppercase text-white/40 font-bold">Reasoning Trace</p>
                          <p className="text-[11px] text-indigo-300">
                            Evaluated tool dependencies and formulated execution plan.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`inline-block text-xs sm:text-sm rounded-2xl px-4 py-3 whitespace-pre-wrap leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-white text-black font-medium rounded-tr-xs"
                        : "bg-[#0c0d10] border border-white/[0.08] text-white/90 rounded-tl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Render executed or pending tool calls */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex flex-col gap-2 pt-1 w-full">
                      {msg.toolCalls.map((tc) => {
                        const isPending = tc.status === "requested";
                        return (
                          <div
                            key={tc.id}
                            className={`flex flex-col gap-2 rounded-xl border p-3.5 text-xs transition-all ${
                              isPending
                                ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                                : "bg-[#0c0d10] border-white/[0.08]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 font-mono">
                              <div className="flex items-center gap-1.5 font-bold">
                                <Wrench className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Tool Call: {tc.name}</span>
                              </div>
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  isPending
                                    ? "bg-amber-500 text-black font-extrabold animate-pulse"
                                    : tc.status === "completed"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {tc.status}
                              </span>
                            </div>

                            {/* Arguments Code Box */}
                            {tc.arguments && Object.keys(tc.arguments).length > 0 && (
                              <pre className="font-mono text-[11px] bg-black/70 p-2.5 rounded border border-white/5 overflow-x-auto max-h-32 text-left text-indigo-300">
                                {JSON.stringify(tc.arguments, null, 2)}
                              </pre>
                            )}

                            {/* Result Output */}
                            {tc.result && (
                              <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/20 p-2 rounded border border-emerald-500/20">
                                <span className="text-white/40">↳ Output: </span>
                                <span>{JSON.stringify(tc.result)}</span>
                              </div>
                            )}

                            {/* Human Approval Gate */}
                            {isPending && (
                              <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
                                <button
                                  onClick={() => handleApproval(tc.id, "approved")}
                                  disabled={processingApprovalId === tc.id}
                                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-xs"
                                >
                                  {processingApprovalId === tc.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <span>Approve & Execute</span>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleApproval(tc.id, "rejected")}
                                  disabled={processingApprovalId === tc.id}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  <span>Decline</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Streaming Indicator */}
          {isSending && (
            <div className="flex gap-3 max-w-md mr-auto items-center">
              <div className="h-7 w-7 rounded-full shrink-0 bg-[#0c0d10] border border-white/20 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Bot" className="h-7 w-7 object-cover" />
              </div>
              <div className="flex items-center gap-2 bg-[#0c0d10] border border-white/[0.08] rounded-2xl px-4 py-2 text-xs text-white/60">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                <span className="font-mono">Reasoning & evaluating tools...</span>
              </div>
            </div>
          )}

          {errorNotice && (
            <div className="p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl">
              {errorNotice}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-4 border-t border-white/[0.08] bg-[#08090a] shrink-0 space-y-2">
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative flex items-center rounded-2xl border border-white/10 bg-[#0c0d10] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all shadow-inner"
          >
            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              rows={1}
              placeholder={`Instruct ${agent?.name || "agent"}... (e.g. Post a tweet, triage GitHub issues)`}
              className="w-full resize-none bg-transparent px-4 py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none disabled:opacity-50 min-h-[44px] max-h-32"
            />

            <button
              type="submit"
              disabled={!inputContent.trim() || isSending}
              className="mr-2 h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center hover:bg-white/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <CornerDownLeft className="h-4 w-4" />
              )}
            </button>
          </form>

          {/* Quick Action Pills Under Input */}
          <div className="max-w-4xl mx-auto flex items-center justify-between text-[11px] font-mono text-white/40 px-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-indigo-400">
                <Cpu className="h-3 w-3" /> Gemini 2.5 Flash
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3 w-3" /> Guardrails Active
              </span>
            </div>
            <span>Press ↵ to send</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
