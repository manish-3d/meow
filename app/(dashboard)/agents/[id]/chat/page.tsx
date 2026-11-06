"use client";

import React, { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, CornerDownLeft, Loader2, Plus, Sparkles, User, Wrench } from "lucide-react";

interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    status: string;
    arguments?: Record<string, unknown>;
    result?: unknown;
  }>;
  createdAt?: string;
}

interface ConversationItem {
  id: string;
  title: string;
  agentVersionId: string;
  updatedAt: string;
}

interface AgentDetails {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  status: string;
  activeVersion?: {
    model: string;
    instructions: string;
    version: number;
  };
}

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: agentId } = use(params);

  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [processingApprovalId, setProcessingApprovalId] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages feed
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // 1. Initial Load: Fetch Agent Details & Conversation Threads
  useEffect(() => {
    async function initAgent() {
      setIsLoading(true);
      setErrorNotice(null);
      try {
        // Fetch agent detail
        const agentRes = await fetch(`/api/agents/${agentId}`);
        if (!agentRes.ok) {
          throw new Error("Failed to load agent details");
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
            // Auto-create initial conversation thread
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

    // Optimistically add user turn to UI
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

      // Replace optimistic message and append assistant response
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

      // Update tool call status locally and append continuation response
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading agent environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* ─── THREADS SIDEBAR ─── */}
      <aside className="w-64 border-r bg-muted/20 flex flex-col justify-between hidden md:flex">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Conversations
            </span>
          </div>

          <button
            onClick={() => createNewConversation()}
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
              className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors truncate flex items-center justify-between ${
                c.id === activeConversationId
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <span className="truncate">{c.title}</span>
            </button>
          ))}

          {conversations.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-6">
              No previous threads.
            </div>
          )}
        </div>

        {/* Agent Metadata Footer */}
        <div className="p-3 border-t bg-background/50 text-[11px] text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Model</span>
            <span className="font-mono text-foreground font-medium">
              {agent?.activeVersion?.model || "default"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Version</span>
            <span className="font-mono text-foreground font-medium">
              v{agent?.activeVersion?.version || 1}
            </span>
          </div>
        </div>
      </aside>

      {/* ─── CHAT MAIN CANVAS ─── */}
      <section className="flex-1 flex flex-col bg-background min-w-0">
        {/* Agent Header */}
        <header className="h-14 border-b px-6 flex items-center justify-between bg-background/50 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground flex items-center gap-2">
                {agent?.name}
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {agent?.status}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground truncate max-w-md">
                {agent?.description || agent?.activeVersion?.instructions}
              </p>
            </div>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-base font-semibold">Start chatting with {agent?.name}</h2>
              <p className="text-xs text-muted-foreground max-w-sm">
                Ask questions, trigger complex multi-step routines, or let the agent autonomously plan and execute tasks.
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
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div className={`space-y-1.5 max-w-[85%] ${isUser ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block text-sm rounded-2xl px-4 py-2.5 whitespace-pre-wrap leading-relaxed ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/50 border text-foreground rounded-tl-sm shadow-xs"
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
                            className={`flex flex-col gap-2 rounded-xl border p-3 text-xs transition-all ${
                              isPending
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                                : "bg-muted/30 border-muted"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 font-mono">
                              <div className="flex items-center gap-1.5 font-semibold">
                                <Wrench className="h-3.5 w-3.5 text-primary" />
                                <span>Tool: {tc.name}</span>
                              </div>
                              <span
                                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  isPending
                                    ? "bg-amber-500 text-amber-950 animate-pulse"
                                    : tc.status === "completed"
                                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-destructive/20 text-destructive"
                                }`}
                              >
                                {tc.status}
                              </span>
                            </div>

                            {/* Render Arguments / Code Snippet */}
                            {tc.arguments && Object.keys(tc.arguments).length > 0 && (
                              <pre className="font-mono text-[11px] bg-background/80 p-2 rounded border overflow-x-auto max-h-32 text-left">
                                {JSON.stringify(tc.arguments, null, 2)}
                              </pre>
                            )}

                            {/* Action Buttons for Pending Approvals */}
                            {isPending && (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => handleApproval(tc.id, "approved")}
                                  disabled={processingApprovalId === tc.id}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                  {processingApprovalId === tc.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <span>Approve & Execute</span>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleApproval(tc.id, "rejected")}
                                  disabled={processingApprovalId === tc.id}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium transition-colors disabled:opacity-50"
                                >
                                  <span>Reject</span>
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
              <div className="h-7 w-7 rounded-full shrink-0 bg-muted text-muted-foreground flex items-center justify-center">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-2 bg-muted/40 border rounded-2xl px-4 py-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Thinking & reasoning...</span>
              </div>
            </div>
          )}

          {errorNotice && (
            <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {errorNotice}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-4 border-t bg-background shrink-0">
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative flex items-center rounded-xl border bg-muted/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
          >
            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              rows={1}
              placeholder={`Message ${agent?.name || "agent"}... (Press Enter to send, Shift+Enter for newline)`}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm focus:outline-hidden placeholder:text-muted-foreground disabled:opacity-50 min-h-[44px] max-h-32"
            />

            <button
              type="submit"
              disabled={!inputContent.trim() || isSending}
              className="mr-2 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CornerDownLeft className="h-4 w-4" />
              )}
            </button>
          </form>
        </footer>
      </section>
    </div>
  );
}

