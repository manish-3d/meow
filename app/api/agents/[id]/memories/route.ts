import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { MemoryManager } from "@/lib/memory/manager";
import type { MemoryType } from "@/db/schema";

interface CreateMemoryBody {
  memoryType: MemoryType;
  content: string;
  metadata?: Record<string, unknown>;
}

const VALID_MEMORY_TYPES = new Set<string>(["fact", "preference", "instruction", "summary"]);

function isCreateMemoryBody(value: unknown): value is CreateMemoryBody {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const body = value as Record<string, unknown>;
  return (
    typeof body.memoryType === "string" &&
    VALID_MEMORY_TYPES.has(body.memoryType) &&
    typeof body.content === "string" &&
    body.content.trim().length > 0
  );
}

/**
 * GET /api/agents/[id]/memories
 * Lists all persistent cross-thread memories for an agent.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: agentId } = await params;

    // 1. Fetch agent to verify workspace access
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const auth = await requireWorkspaceAccess(agent.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const memories = await MemoryManager.getMemoriesForAgent(agentId);

    return NextResponse.json({ memories }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/agents/[id]/memories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/agents/[id]/memories
 * Creates a new persistent memory for an agent.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: agentId } = await params;
    const body: unknown = await request.json();

    if (!isCreateMemoryBody(body)) {
      return NextResponse.json(
        { error: "Invalid payload. Expected { memoryType: 'fact'|'preference'|'instruction'|'summary', content: string }" },
        { status: 400 },
      );
    }

    // 1. Fetch agent to verify workspace access
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const auth = await requireWorkspaceAccess(agent.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const memory = await MemoryManager.addMemory(agentId, {
      memoryType: body.memoryType,
      content: body.content,
      metadata: body.metadata,
    });

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/agents/[id]/memories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/agents/[id]/memories?memoryId=...
 * Deletes a specific memory entry.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: agentId } = await params;
    const memoryId = request.nextUrl.searchParams.get("memoryId");

    if (!memoryId) {
      return NextResponse.json(
        { error: "Query parameter 'memoryId' is required" },
        { status: 400 },
      );
    }

    // 1. Fetch agent to verify workspace access
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const auth = await requireWorkspaceAccess(agent.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const deleted = await MemoryManager.deleteMemory(memoryId);

    if (!deleted) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Memory deleted" }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE /api/agents/[id]/memories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

