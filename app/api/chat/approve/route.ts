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

interface ApproveRequestBody {
  toolCallId: string;
  decision: "approved" | "rejected";
}

function isApproveRequestBody(value: unknown): value is ApproveRequestBody {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const body = value as Record<string, unknown>;
  return (
    typeof body.toolCallId === "string" &&
    body.toolCallId.trim().length > 0 &&
    (body.decision === "approved" || body.decision === "rejected")
  );
}

/**
 * POST /api/chat/approve
 * Resumes an agent reasoning loop after a human approves or rejects a pending dangerous tool action.
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isApproveRequestBody(body)) {
      return NextResponse.json(
        { error: "Invalid payload. Expected toolCallId and decision ('approved' | 'rejected')." },
        { status: 400 },
      );
    }

    // 1. Fetch pending tool call record
    const [tcRecord] = await db
      .select()
      .from(toolCalls)
      .where(eq(toolCalls.id, body.toolCallId))
      .limit(1);

    if (!tcRecord) {
      return NextResponse.json(
        { error: "Tool call record not found" },
        { status: 404 },
      );
    }

    // 2. Fetch parent message & conversation
    const [parentMessage] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, tcRecord.messageId))
      .limit(1);

    if (!parentMessage) {
      return NextResponse.json(
        { error: "Parent message not found" },
        { status: 404 },
      );
    }

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, parentMessage.conversationId))
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation thread not found" },
        { status: 404 },
      );
    }

    // 3. Verify workspace access (Auth Guard before business logic validation)
    const auth = await requireWorkspaceAccess(conversation.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    // 4. Validate tool call state
    if (tcRecord.status !== "requested") {
      return NextResponse.json(
        { error: `Tool call has already been processed with status: '${tcRecord.status}'` },
        { status: 400 },
      );
    }

    // 4. Fetch agent version & workspace details
    const [agentVersion] = await db
      .select()
      .from(agentVersions)
      .where(eq(agentVersions.id, conversation.agentVersionId))
      .limit(1);

    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, conversation.workspaceId))
      .limit(1);

    if (!agentVersion || !workspace) {
      return NextResponse.json(
        { error: "Agent version or workspace details missing" },
        { status: 404 },
      );
    }

    let observationContent = "";

    // 5. Handle Decision
    if (body.decision === "approved") {
      // Find tool in registry
      const tool = ToolRegistry.get(tcRecord.name);
      let execResult: Record<string, unknown> | string;

      if (!tool) {
        execResult = { error: `Tool '${tcRecord.name}' is not registered` };
      } else {
        try {
          execResult = await tool.execute(tcRecord.arguments, {
            workspaceId: workspace.id,
            userId: auth.userId,
            agentId: conversation.agentId,
            conversationId: conversation.id,
          });
        } catch (execErr: unknown) {
          execResult = {
            error: execErr instanceof Error ? execErr.message : String(execErr),
          };
        }
      }

      // Update tool_calls status = 'completed'
      await db
        .update(toolCalls)
        .set({
          status: "completed",
          result:
            typeof execResult === "object" && execResult !== null
              ? (execResult as Record<string, unknown>)
              : { output: execResult },
        })
        .where(eq(toolCalls.id, tcRecord.id));

      const resultString =
        typeof execResult === "string" ? execResult : JSON.stringify(execResult, null, 2);
      observationContent = `<untrusted_tool_data>\n${resultString}\n</untrusted_tool_data>`;
    } else {
      // Rejected
      await db
        .update(toolCalls)
        .set({
          status: "rejected",
          result: { rejection: "User declined to authorize this action." },
        })
        .where(eq(toolCalls.id, tcRecord.id));

      observationContent = `<untrusted_tool_data>\n{"error": "Action rejected by user: Execution authorization was denied."}\n</untrusted_tool_data>`;
    }

    // 6. Append tool observation message to thread
    await db.insert(messages).values({
      conversationId: conversation.id,
      role: "tool",
      content: observationContent,
    });

    // 7. Load all messages to resume reasoning turn
    const dbMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversation.id))
      .orderBy(asc(messages.createdAt));

    const modelHistory: ModelMessage[] = dbMessages.map((m) => ({
      role: m.role as ModelMessage["role"],
      content: m.content,
    }));

    const activeTools = await ToolRegistry.getActiveToolsForAgent(conversation.agentId, {
      workspaceId: workspace.id,
      userId: auth.userId,
      agentId: conversation.agentId,
      conversationId: conversation.id,
    });

    const memories = await MemoryManager.getCompiledMemories(conversation.agentId);

    // 8. Resume agent reasoning loop
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

    // 9. Commit the assistant's continuation response
    const [assistantMessageRecord] = await db
      .insert(messages)
      .values({
        conversationId: conversation.id,
        role: "assistant",
        content: runnerResult.finalContent,
        metadata: {
          resumedFromApproval: body.toolCallId,
          decision: body.decision,
          usage: runnerResult.totalUsage,
          steps: runnerResult.totalSteps,
          finishReason: runnerResult.finishReason,
        },
      })
      .returning();

    // 10. Update conversation timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversation.id));

    return NextResponse.json(
      {
        decision: body.decision,
        toolCallId: tcRecord.id,
        assistantMessage: assistantMessageRecord,
        steps: runnerResult.steps,
        finishReason: runnerResult.finishReason,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("POST /api/chat/approve error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

