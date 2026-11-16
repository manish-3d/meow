"use client";

import React from "react";
import { Sparkles, HelpCircle, Bot } from "lucide-react";
import { RoutineCard } from "./routine-card";
import { AgentResponseSchemaType } from "@/lib/ai/agent_response_schema";

interface AgentResponseViewProps {
  content: string;
  agentId: string;
  isStreaming?: boolean;
  onRoutineCreated?: () => void;
}

export function AgentResponseView({
  content,
  agentId,
  isStreaming,
  onRoutineCreated,
}: AgentResponseViewProps) {
  // If streaming and content is still incomplete, render plain streaming text
  if (isStreaming) {
    return <span className="leading-relaxed">{content}</span>;
  }

  // Attempt to parse structured response from content
  let parsedResponse: AgentResponseSchemaType | null = null;

  try {
    const trimmed = content.trim();

    // Check direct JSON
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      parsedResponse = JSON.parse(trimmed);
    } else {
      // Check for JSON embedded in ```json ... ``` code blocks
      const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      }
    }
  } catch (err) {
    // Parsing failed; treat as raw text
    parsedResponse = null;
  }

  // 1. Structured Routine Response
  if (parsedResponse && parsedResponse.type === "routine" && parsedResponse.routine) {
    return (
      <div className="space-y-3">
        {parsedResponse.content && (
          <p className="text-xs leading-relaxed text-foreground">
            {parsedResponse.content}
          </p>
        )}
        <RoutineCard
          routine={parsedResponse.routine}
          agentId={agentId}
          onRoutineCreated={onRoutineCreated}
        />
      </div>
    );
  }

  // 2. Structured Clarification Response
  if (parsedResponse && parsedResponse.type === "clarification") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold">
          <HelpCircle className="size-3.5" />
          <span>Clarification Needed</span>
        </div>
        <p className="text-xs leading-relaxed text-foreground bg-primary/5 p-3 rounded-xl border border-primary/20">
          {parsedResponse.content}
        </p>
      </div>
    );
  }

  // 3. Structured Message Response
  if (parsedResponse && parsedResponse.type === "message" && parsedResponse.content) {
    return <span className="leading-relaxed whitespace-pre-wrap">{parsedResponse.content}</span>;
  }

  // 4. Default / Fallback: Plain Markdown / Text Message
  return <span className="leading-relaxed whitespace-pre-wrap">{content}</span>;
}
