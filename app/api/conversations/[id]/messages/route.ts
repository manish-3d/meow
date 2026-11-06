import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { conversations, messages, toolCalls } from "@/db/schema";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";

/**
 * GET /api/conversations/[id]/messages
 * Fetches all message turns and associated tool calls for a conversation thread.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    // 1. Fetch conversation to determine workspace
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
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

    // 3. Fetch messages ordered chronologically
    const messageList = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    // 4. Fetch any tool calls associated with these messages
    const messageIds = messageList.map((m) => m.id);
    let toolCallRecords: typeof toolCalls.$inferSelect[] = [];

    if (messageIds.length > 0) {
      toolCallRecords = await db.select().from(toolCalls);
      // Filter tool calls to only those belonging to these messages
      const messageIdSet = new Set(messageIds);
      toolCallRecords = toolCallRecords.filter((tc) => messageIdSet.has(tc.messageId));
    }

    // Group tool calls by messageId
    const toolCallsByMessageId = new Map<string, typeof toolCalls.$inferSelect[]>();
    for (const tc of toolCallRecords) {
      const list = toolCallsByMessageId.get(tc.messageId) || [];
      list.push(tc);
      toolCallsByMessageId.set(tc.messageId, list);
    }

    const messagesWithTools = messageList.map((m) => ({
      ...m,
      toolCalls: toolCallsByMessageId.get(m.id) || [],
    }));

    return NextResponse.json(
      {
        conversation,
        messages: messagesWithTools,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("GET /api/conversations/[id]/messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

