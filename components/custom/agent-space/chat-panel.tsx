"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  User,
  ArrowUp,
  Loader2,
  Paperclip,
  Mic,
  Sparkles,
} from "lucide-react";
import { AgentConfigType } from "@/types/agent";
import { useAgentConfig } from "@/context/agent-config-context";
import { AgentResponseView } from "./agent-response-view";
import { useModelUsage } from "@/context/model-usage-context";
import { MissingKeyDialog } from "@/components/custom/models/missing-key-dialog";
import { ModelDefinition } from "@/lib/ai/models";
import { DEFAULT_AVATAR } from "@/lib/avatars";

// Dynamically load 3D Minecraft Sky Environment with no SSR to ensure fast, glitch-free WebGL rendering
const MinecraftSkyEnvironment = dynamic(
  () => import("./minecraft-sky-environment").then((mod) => mod.MinecraftSkyEnvironment),
  { ssr: false }
);

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
    name: "Social Media Bot",
    agentImage: DEFAULT_AVATAR.path,
    description: "Manage, create and grow your social media presence across platforms.",
    isActive: true,
  };

  const {
    selectedModel,
    reasoningEffort,
    temperature,
    topP,
    maxTokens,
    apiKeys,
    isKeyConfiguredForModel,
    recordUsage,
  } = useModelUsage();

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [missingKeyModalOpen, setMissingKeyModalOpen] = useState(false);
  const [targetMissingModel, setTargetMissingModel] = useState<ModelDefinition>(selectedModel);
  const [isKeyExhausted, setIsKeyExhausted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch conversation history from database
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 140) + "px";
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isStreaming || propLoading) return;

    // Verify key if required
    if (!selectedModel.isFree && !isKeyConfiguredForModel(selectedModel.id)) {
      setTargetMissingModel(selectedModel);
      setIsKeyExhausted(false);
      setMissingKeyModalOpen(true);
      return;
    }

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

    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, agentPlaceholder]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsStreaming(true);
    onSendMessage?.(textToSend);

    try {
      const customApiKey = apiKeys[selectedModel.provider] || "";
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.agentId,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          modelId: selectedModel.id,
          customApiKey,
          effort: reasoningEffort,
          temperature,
          topP,
          maxTokens,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errText = errorData.error || `Server responded with ${response.status}`;
        const errLower = errText.toLowerCase();

        if (
          response.status === 429 ||
          errLower.includes("quota") ||
          errLower.includes("credit") ||
          errLower.includes("balance") ||
          errLower.includes("rate limit")
        ) {
          setTargetMissingModel(selectedModel);
          setIsKeyExhausted(true);
          setMissingKeyModalOpen(true);
        } else if (
          response.status === 400 &&
          (errLower.includes("api key") || errLower.includes("key required") || errLower.includes("unauthorized"))
        ) {
          setTargetMissingModel(selectedModel);
          setIsKeyExhausted(false);
          setMissingKeyModalOpen(true);
        }

        throw new Error(errText);
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

      // Record token usage
      const promptChars = nextMessages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
      const promptEst = Math.max(1, Math.ceil(promptChars / 4));
      const completionEst = Math.max(1, Math.ceil(accumulatedText.length / 4));
      recordUsage(selectedModel.id, promptEst, completionEst);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: any) {
      console.error("Chat streaming error:", err);
      const errText = err.message || "Unknown error";
      const errLower = errText.toLowerCase();

      if (errLower.includes("quota") || errLower.includes("credit") || errLower.includes("rate limit")) {
        setTargetMissingModel(selectedModel);
        setIsKeyExhausted(true);
        setMissingKeyModalOpen(true);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId
            ? {
              ...msg,
              content: `⚠️ Failed to get response from ${agent.name}: ${errText}`,
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

  const hasMessages = messages.length > 0;
  const agentAvatarSrc = agent.agentImage || DEFAULT_AVATAR.path;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      {/* ── 3D MINECRAFT SKY WORLD (UPPER-LEFT CAT ON PLATFORM + VOXEL CLOUDS) ── */}
      <MinecraftSkyEnvironment />

      {/* ── MESSAGES / CONVERSATION CONTAINER ── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            /* Stageshow: Clean Welcome Screen with Quick Starter Prompts */
            <motion.div
              key="welcome-stage"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center select-none max-w-xl mx-auto"
            >
              {/* Frosted Glass Welcome Card */}
              <div className="bg-white/75 backdrop-blur-md border border-white/70 shadow-xs rounded-3xl p-8 w-full flex flex-col items-center">
                {/* Agent Avatar Badge */}
                <div className="size-16 rounded-2xl bg-white/90 border border-black/[0.08] shadow-xs flex items-center justify-center p-2 mb-4">
                  <img
                    src={agentAvatarSrc}
                    alt={agent.name}
                    className="size-full object-contain filter drop-shadow-2xs"
                  />
                </div>

                {/* Title & Description */}
                <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                  {agent.name}
                </h1>
                <p className="text-xs text-muted-foreground max-w-md leading-relaxed font-normal mb-6">
                  {agent.description || "Manage, create and grow your social media presence across platforms."}
                </p>

                {/* Suggested Quick Starter Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                  {[
                    "Summarize my recent unread notifications",
                    "Analyze the latest trends and write an outline",
                    "Draft an update for team review",
                    "Search for real-time web updates",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="px-3.5 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-black/[0.06] hover:border-black/15 shadow-2xs text-[11px] text-foreground font-medium transition-all text-left flex items-center justify-between group cursor-pointer"
                    >
                      <span className="line-clamp-1">{prompt}</span>
                      <ArrowUp className="size-3 text-muted-foreground group-hover:text-foreground shrink-0 ml-1.5 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Active Message Thread with Frosted Translucent Cards */
            <div className="pt-28 md:pt-32 px-4 md:px-6 pb-28 md:pb-32 space-y-6 max-w-3xl mx-auto w-full">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.08) }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "agent" && (
                    <div className="size-8 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-white/80 shadow-2xs mt-0.5">
                      <img src={agentAvatarSrc} alt={agent.name} className="size-full object-contain p-0.5" />
                    </div>
                  )}

                  <div className={`space-y-1.5 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`text-xs leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user"
                        ? "px-4 py-2.5 bg-black text-white rounded-2xl rounded-tr-xs shadow-xs"
                        : "px-5 py-4 bg-white/85 backdrop-blur-md text-foreground border border-white/70 rounded-2xl rounded-tl-xs shadow-xs"
                        }`}
                    >
                      {msg.role === "agent" && msg.isStreaming && !msg.content ? (
                        <div className="flex items-center gap-2 text-muted-foreground py-0.5 font-mono">
                          <Loader2 className="size-3.5 animate-spin text-black" />
                          <span className="text-[11px]">Reasoning & executing...</span>
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
                      className={`text-[10px] font-mono tabular-nums text-muted-foreground/80 px-1 ${msg.role === "user" ? "text-right" : "text-left"
                        }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === "user" && (
                    <div className="size-8 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-black text-white shadow-2xs mt-0.5">
                      <User className="size-4" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FLOATING BOTTOM INPUT CAPSULE (FIXED OVER 3D SKY) ── */}
      <div className="relative z-10 p-4 md:p-6 pt-2 bg-transparent shrink-0 max-w-3xl mx-auto w-full">
        <div className="relative flex items-center gap-2 rounded-full border border-black/[0.1] bg-white/90 backdrop-blur-md shadow-sm px-4 py-2 hover:border-black/20 focus-within:border-black/30 transition-all">
          {/* Paperclip */}
          <button
            type="button"
            className="shrink-0 size-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="size-4" />
          </button>

          {/* Text input / textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isStreaming || agent.isActive === false}
            placeholder={`Message ${agent.name}...`}
            rows={1}
            style={{ minHeight: "24px", maxHeight: "120px" }}
            className="flex-1 resize-none bg-transparent border-0 outline-none focus:ring-0 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/60 disabled:opacity-60 py-1"
          />

          {/* Mic */}
          <button
            type="button"
            className="shrink-0 size-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Voice message"
          >
            <Mic className="size-4" />
          </button>

          {/* Green Send Button */}
          <motion.button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming || propLoading || agent.isActive === false}
            whileTap={{ scale: 0.94 }}
            aria-label="Send message"
            className="shrink-0 size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
          >
            {isStreaming ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ArrowUp className="size-3.5 stroke-[2.5]" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Missing Key Dialog */}
      <MissingKeyDialog
        open={missingKeyModalOpen}
        onOpenChange={setMissingKeyModalOpen}
        targetModel={targetMissingModel}
        isExhausted={isKeyExhausted}
      />
    </div>
  );
}
