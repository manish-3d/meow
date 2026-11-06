import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { agents, agentVersions, conversations } from "@/db/schema";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";

interface CreateConversationBody {
  workspaceId: string;
  agentId: string;
  title?: string;
}

function isCreateConversationBody(value: unknown): value is CreateConversationBody {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const body = value as Record<string, unknown>;
  return (
    typeof body.workspaceId === "string" &&
    body.workspaceId.trim().length > 0 &&
    typeof body.agentId === "string" &&
    body.agentId.trim().length > 0 &&
    (body.title === undefined || typeof body.title === "string")
  );
}

/**
 * GET /api/conversations?workspaceId=...&agentId=...
 * Lists conversations for a given agent in a workspace.
 */
export async function GET(request: NextRequest) {
  try {
    const workspaceId = request.nextUrl.searchParams.get("workspaceId")?.trim();
    const agentId = request.nextUrl.searchParams.get("agentId")?.trim();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    const auth = await requireWorkspaceAccess(workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const conditions = [eq(conversations.workspaceId, workspaceId)];
    if (agentId) {
      conditions.push(eq(conversations.agentId, agentId));
    }

    const conversationList = await db
      .select()
      .from(conversations)
      .where(and(...conditions))
      .orderBy(desc(conversations.updatedAt));

    return NextResponse.json({ conversations: conversationList }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/conversations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/conversations
 * Creates a new conversation thread bound to the agent's latest active version.
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isCreateConversationBody(body)) {
      return NextResponse.json(
        { error: "Invalid request payload. Expected workspaceId and agentId." },
        { status: 400 },
      );
    }

    const auth = await requireWorkspaceAccess(body.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    // 1. Verify agent exists and belongs to the workspace
    const [agent] = await db
      .select()
      .from(agents)
      .where(
        and(
          eq(agents.id, body.agentId),
          eq(agents.workspaceId, body.workspaceId),
        ),
      )
      .limit(1);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found in this workspace" },
        { status: 404 },
      );
    }

    // 2. Fetch the latest active version for the agent
    const [latestVersion] = await db
      .select()
      .from(agentVersions)
      .where(eq(agentVersions.agentId, body.agentId))
      .orderBy(desc(agentVersions.version))
      .limit(1);

    if (!latestVersion) {
      return NextResponse.json(
        { error: "Agent has no active versions configured" },
        { status: 400 },
      );
    }

    // 3. Create the conversation thread
    const [conversation] = await db
      .insert(conversations)
      .values({
        workspaceId: body.workspaceId,
        agentId: body.agentId,
        agentVersionId: latestVersion.id,
        title: body.title?.trim() || "New Conversation",
        createdBy: auth.userId,
      })
      .returning();

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/conversations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

