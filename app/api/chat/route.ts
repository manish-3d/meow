import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  agentVersions,
  conversations,
  messages,
  toolCalls,
  workspaces,
} from "@/db/schema";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { AgentRunner } from "@/lib/ai/runner";
import { ModelMessage } from "@/lib/ai/types";
import { ToolRegistry } from "@/lib/tools/registry";
import { MemoryManager } from "@/lib/memory/manager";
import { TelemetryService } from "@/lib/observability/telemetry";

interface ChatRequestBody {
  conversationId: string;
  content: string;
}

function isChatRequestBody(value: unknown): value is ChatRequestBody {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const body = value as Record<string, unknown>;
  return (
    typeof body.conversationId === "string" &&
    body.conversationId.trim().length > 0 &&
    typeof body.content === "string" &&
    body.content.trim().length > 0
  );
}

/**
 * POST /api/chat
 * Executes an autonomous reasoning turn for an existing conversation thread.
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isChatRequestBody(body)) {
      return NextResponse.json(
        { error: "Invalid request payload. Expected conversationId and content." },
        { status: 400 },
      );
    }

    // 1. Fetch conversation
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, body.conversationId))
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // 2. Enforce workspace access
    const auth = await requireWorkspaceAccess(conversation.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    // 3. Fetch agent version bound to this conversation
    const [agentVersion] = await db
      .select()
      .from(agentVersions)
      .where(eq(agentVersions.id, conversation.agentVersionId))
      .limit(1);

    if (!agentVersion) {
      return NextResponse.json(
        { error: "Bound agent version no longer exists" },
        { status: 404 },
      );
    }

    // 4. Fetch workspace details
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, conversation.workspaceId))
      .limit(1);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    // 5. Commit the user message to database
    const [userMessageRecord] = await db
      .insert(messages)
      .values({
        conversationId: conversation.id,
        role: "user",
        content: body.content.trim(),
      })
      .returning();

    // 6. Fetch full conversation history to feed into prompt compiler
    const dbMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversation.id))
      .orderBy(asc(messages.createdAt));

    const modelHistory: ModelMessage[] = dbMessages.map((m) => ({
      role: m.role as ModelMessage["role"],
      content: m.content,
    }));

    // 7. Fetch enabled tools and compiled long-term memories for this agent
    const activeTools = await ToolRegistry.getActiveToolsForAgent(conversation.agentId, {
      workspaceId: workspace.id,
      userId: auth.userId,
      agentId: conversation.agentId,
      conversationId: conversation.id,
    });

    // 7. Check workspace budget quota before running turn
    const quotaCheck = await TelemetryService.checkBudgetQuota(workspace.id);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.reason ?? "Workspace token quota exceeded" },
        { status: 429 },
      );
    }

    const memories = await MemoryManager.getCompiledMemories(conversation.agentId);

    const turnStartTime = Date.now();
    const runnerResult = await AgentRunner.executeTurn({
      agentVersion: {
        model: agentVersion.model,
        instructions: agentVersion.instructions,
        config: agentVersion.config,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
      },
      history: modelHistory,
      activeTools,
      memories,
    });
    const turnDurationMs = Date.now() - turnStartTime;

    // 8. Commit the assistant's final response to database
    const [assistantMessageRecord] = await db
      .insert(messages)
      .values({
        conversationId: conversation.id,
        role: "assistant",
        content: runnerResult.finalContent,
        metadata: {
          usage: runnerResult.totalUsage,
          steps: runnerResult.totalSteps,
          finishReason: runnerResult.finishReason,
          durationMs: turnDurationMs,
        },
      })
      .returning();

    // 9. Asynchronously record usage telemetry and costs
    await TelemetryService.recordUsage({
      workspaceId: workspace.id,
      agentId: conversation.agentId,
      conversationId: conversation.id,
      model: agentVersion.model,
      promptTokens: runnerResult.totalUsage.promptTokens,
      completionTokens: runnerResult.totalUsage.completionTokens,
      durationMs: turnDurationMs,
      status: runnerResult.finishReason === "error" ? "error" : "success",
    });

    // 10. Commit any tool calls that were executed during reasoning steps
    for (const step of runnerResult.steps) {
      if (step.toolCalls && step.toolCalls.length > 0) {
        for (const tc of step.toolCalls) {
          await db.insert(toolCalls).values({
            messageId: assistantMessageRecord.id,
            callId: tc.id,
            name: tc.name,
            arguments: tc.arguments,
            result:
              tc.result !== undefined
                ? typeof tc.result === "object" && tc.result !== null
                  ? (tc.result as Record<string, unknown>)
                  : { output: tc.result }
                : null,
            status: tc.status,
          });
        }
      }
    }

    // 10. Update conversation timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversation.id));

    return NextResponse.json(
      {
        userMessage: userMessageRecord,
        assistantMessage: assistantMessageRecord,
        steps: runnerResult.steps,
        totalUsage: runnerResult.totalUsage,
        finishReason: runnerResult.finishReason,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

