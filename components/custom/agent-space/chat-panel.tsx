"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, User, ArrowUp, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentConfigType } from "@/types/agent";
import { useAgentConfig } from "@/context/agent-config-context";
import { AgentResponseView } from "./agent-response-view";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatPanelProps {
  agent?: AgentConfigType;
  onSendMessage?: (message: string) => void;
  loading?: boolean;
}

export function ChatPanel({ agent: propAgent, onSendMessage, loading: propLoading }: ChatPanelProps) {
  const { agentConfig } = useAgentConfig();
  const agent = propAgent || agentConfig || {
    agentId: "default",
    name: "Meow Agent",
    agentImage: "https://api.dicebear.com/7.x/bottts/svg?seed=fallback",
    description: "",
    isActive: true,
  };

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with agent welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "agent",
      content: `Hello! I am ${agent.name}. How can I assist you today? You can ask me questions, test my instructions, or request browser automations and routines.`,
      timestamp: "Just now",
    },
  ]);

  // Fetch conversation history from database on mount or when agentId changes
  useEffect(() => {
    let isMounted = true;
    if (!agent.agentId || agent.agentId === "default") return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/agent/chat/history?agentId=${agent.agentId}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.warn("Could not load chat history:", err);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [agent.agentId]);

  const quickPromptChips = [
    "Summarize my top unread emails and alert me on Slack",
    "Search Google News on your VM desktop for the latest AI breakthroughs",
    "Check open pull requests on GitHub and summarize urgent issues",
  ];

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isStreaming || propLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const agentMsgId = `agent-${Date.now() + 1}`;
    const agentPlaceholder: ChatMessage = {
      id: agentMsgId,
      role: "agent",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: true,
    };

    // Append both user message and empty agent placeholder
    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, agentPlaceholder]);
    setInput("");
    setIsStreaming(true);
    onSendMessage?.(textToSend);

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.agentId,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from chat stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMsgId
              ? { ...msg, content: accumulatedText, isStreaming: true }
              : msg
          )
        );
      }

      // Finalize streaming state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: any) {
      console.error("Chat streaming error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId
            ? {
                ...msg,
                content: `⚠️ Failed to get response from ${agent.name}: ${err.message || "Unknown error"}`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chipText: string) => {
    handleSend(chipText);
  };

  const handleClearHistory = async () => {
    try {
      if (agent.agentId && agent.agentId !== "default") {
        await fetch(`/api/agent/chat/history?agentId=${agent.agentId}`, {
          method: "DELETE",
        });
      }
    } catch (e) {
      console.warn("Failed to clear history from DB:", e);
    }
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "agent",
        content: `Conversation reset. I am ${agent.name}. How can I assist you?`,
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Top Bar: Agent Header */}
      <div className="h-14 border-b border-border/50 px-5 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center p-0.5 shrink-0">
            {agent.agentImage ? (
              <img src={agent.agentImage} alt={agent.name} className="size-full object-contain" />
            ) : (
              <Bot className="size-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground leading-tight">{agent.name}</span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" title="Agent Online" />
            </div>
            <span className="text-[11px] text-muted-foreground">
              Gemini 3 Flash • Composio Native Tools • Autonomous Mode
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5 px-2"
          onClick={handleClearHistory}
          title="Clear Conversation History"
        >
          <RefreshCw className="size-3" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </div>

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Avatar */}
            <div className="size-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xs font-semibold bg-muted border border-border">
              {msg.role === "agent" ? (
                agent.agentImage ? (
                  <img src={agent.agentImage} alt={agent.name} className="size-full object-cover" />
                ) : (
                  <Bot className="size-3.5 text-primary" />
                )
              ) : (
                <User className="size-3.5 text-muted-foreground" />
              )}
            </div>

            {/* Bubble */}
            <div className="space-y-1 max-w-[85%]">
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted/60 text-foreground border border-border/60 rounded-tl-sm shadow-xs"
                }`}
              >
                {/* Streaming Placeholder or Content */}
                {msg.role === "agent" && msg.isStreaming && !msg.content ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-0.5">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-[11px]">Executing tools & reasoning...</span>
                  </div>
                ) : msg.role === "agent" && !msg.content ? (
                  <span className="text-muted-foreground italic text-[11px]">
                    No content received. Please try again.
                  </span>
                ) : msg.role === "agent" ? (
                  <AgentResponseView
                    content={msg.content}
                    agentId={agent.agentId}
                    isStreaming={msg.isStreaming}
                  />
                ) : (
                  msg.content
                )}
              </div>
              <span
                className={`block text-[10px] text-muted-foreground px-1 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Area: Prompt Chips + Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur space-y-3 shrink-0">
        {/* Paused Agent Notice */}
        {agent.isActive === false && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs">
            <span className="font-semibold">Agent Paused:</span>
            <span className="text-muted-foreground text-[11px]">
              This agent is paused. Automated routines and conversations are suspended. Activate it in the Settings tab to resume.
            </span>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {quickPromptChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isStreaming || agent.isActive === false}
              onClick={() => handleChipClick(chip)}
              className="text-[11px] bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full border border-border/50 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative rounded-xl border border-border/70 bg-card focus-within:border-primary/60 transition-colors shadow-sm">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming || agent.isActive === false}
            placeholder={
              agent.isActive === false
                ? "Agent is paused. Activate in Settings to message..."
                : `Message ${agent.name}... (Press Enter to send, Shift+Enter for new line)`
            }
            rows={2}
            className="w-full resize-none bg-transparent border-0 focus-visible:ring-0 text-xs p-3 pr-12 leading-relaxed disabled:opacity-60"
          />

          <Button
            type="button"
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming || propLoading || agent.isActive === false}
            className="absolute bottom-2 right-2 size-7 rounded-lg"
          >
            {isStreaming ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ArrowUp className="size-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
