import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { agentChatHistory } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

/**
 * GET /api/agent/chat/history?agentId=...
 * Hydrates past conversation history for the current agent and authenticated user.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  try {
    const records = await db
      .select()
      .from(agentChatHistory)
      .where(
        and(
          eq(agentChatHistory.agentId, agentId),
          eq(agentChatHistory.userEmail, session.user.email)
        )
      )
      .orderBy(asc(agentChatHistory.createdAt));

    const messages = records.map((r) => ({
      id: `history-${r.id}`,
      role: r.role as "user" | "agent",
      content: r.content,
      timestamp: new Date(r.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent/chat/history?agentId=...
 * Clears conversation history for the current agent and authenticated user.
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  try {
    await db
      .delete(agentChatHistory)
      .where(
        and(
          eq(agentChatHistory.agentId, agentId),
          eq(agentChatHistory.userEmail, session.user.email)
        )
      );

    return NextResponse.json({ success: true, message: "Chat history cleared" });
  } catch (error: any) {
    console.error("Error deleting chat history:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to clear chat history" },
      { status: 500 }
    );
  }
}
