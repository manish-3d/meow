"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  User,
  ArrowUp,
  Loader2,
  Paperclip,
  Mic,
} from "lucide-react";
import { AgentConfigType } from "@/types/agent";
import { useAgentConfig } from "@/context/agent-config-context";
import { AgentResponseView } from "./agent-response-view";
import { useModelUsage } from "@/context/model-usage-context";
import { MissingKeyDialog } from "@/components/custom/models/missing-key-dialog";
import { ModelDefinition } from "@/lib/ai/models";
import { DEFAULT_AVATAR } from "@/lib/avatars";

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
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* ── MESSAGES / WELCOME STAGE ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            /* Stageshow: Centered Isometric Mascot & Persona Intro */
            <motion.div
              key="welcome-stage"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center min-h-full px-6 py-16 text-center select-none"
            >
              {/* Isometric Character Base with Floating Cubes */}
              <div className="relative mb-6 flex items-center justify-center">
                {/* Floating Voxel Pixel Elements */}
                <motion.div
                  animate={{ y: [-2, 3, -2], opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-6 top-4 size-2.5 bg-neutral-300 rounded-[2px]"
                />
                <motion.div
                  animate={{ y: [3, -3, 3], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-5 top-7 size-2 bg-neutral-300 rounded-[2px]"
                />
                <motion.div
                  animate={{ y: [-3, 2, -3], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-7 -top-2 size-1.5 bg-neutral-400 rounded-[2px]"
                />

                {/* Pedestal / Island Base */}
                <div className="relative">
                  {/* Subtle isometric tile base under cat */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black/[0.04] rounded-full blur-[2px]" />

                  {/* Character with gentle idle float */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative size-24 flex items-center justify-center"
                  >
                    <img
                      src={agentAvatarSrc}
                      alt={agent.name}
                      className="size-full object-contain filter drop-shadow-sm"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                {agent.name}
              </h1>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed font-normal">
                {agent.description || "Manage, create and grow your social media presence across platforms."}
              </p>
            </motion.div>
          ) : (
            /* Active Message Thread */
            <div className="p-6 space-y-5 max-w-3xl mx-auto w-full">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.08) }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "agent" && (
                    <div className="size-7 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-white border border-black/[0.08] shadow-2xs">
                      <img src={agentAvatarSrc} alt={agent.name} className="size-full object-contain p-0.5" />
                    </div>
                  )}

                  <div className={`space-y-1 max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                        msg.role === "user"
                          ? "bg-black text-white rounded-tr-xs shadow-xs"
                          : "bg-neutral-50 text-foreground border border-black/[0.06] rounded-tl-xs shadow-2xs"
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
                      className={`text-[10px] font-mono tabular-nums text-muted-foreground px-1 ${
                        msg.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === "user" && (
                    <div className="size-7 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-neutral-100 border border-black/[0.08] shadow-2xs">
                      <User className="size-3.5 text-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FLOATING BOTTOM INPUT CAPSULE (MATCHING REFERENCE EXACTLY) ── */}
      <div className="p-5 pt-2 bg-transparent shrink-0 max-w-3xl mx-auto w-full">
        <div className="relative flex items-center gap-2 rounded-full border border-black/[0.1] bg-white shadow-xs px-4 py-2 hover:border-black/20 focus-within:border-black/30 transition-all">
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

          {/* Solid Black Send Button */}
          <motion.button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming || propLoading || agent.isActive === false}
            whileTap={{ scale: 0.94 }}
            aria-label="Send message"
            className="shrink-0 size-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
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
