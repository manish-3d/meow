import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { agents, agentTools, tools as dbTools } from "@/db/schema";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { ToolRegistry } from "@/lib/tools/registry";

interface UpdateAgentToolsBody {
  tools: Array<{
    toolId: string;
    enabled: boolean;
    configOverride?: Record<string, unknown>;
  }>;
}

function isUpdateAgentToolsBody(value: unknown): value is UpdateAgentToolsBody {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const body = value as Record<string, unknown>;
  if (!Array.isArray(body.tools)) return false;

  return body.tools.every(
    (t) =>
      typeof t === "object" &&
      t !== null &&
      typeof (t as any).toolId === "string" &&
      typeof (t as any).enabled === "boolean",
  );
}

/**
 * GET /api/agents/[id]/tools
 * Lists all available catalog tools and indicates which ones are enabled for this agent.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: agentId } = await params;

    // 1. Fetch agent to verify existence & workspace
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 2. Auth guard
    const auth = await requireWorkspaceAccess(agent.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    // Ensure catalog is synced
    await ToolRegistry.syncCatalogToDatabase();

    // 3. Fetch all catalog tools
    const catalogTools = await db.select().from(dbTools);

    // 4. Fetch agent's existing tool assignments
    const activeAssignments = await db
      .select()
      .from(agentTools)
      .where(eq(agentTools.agentId, agentId));

    const assignmentMap = new Map<string, typeof agentTools.$inferSelect>();
    for (const a of activeAssignments) {
      assignmentMap.set(a.toolId, a);
    }

    // Merge catalog tools with agent-specific assignment state
    const result = catalogTools.map((t) => {
      const assignment = assignmentMap.get(t.id);
      return {
        ...t,
        enabled: assignment ? assignment.enabled : false,
        configOverride: assignment ? assignment.configOverride : {},
      };
    });

    return NextResponse.json({ tools: result }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/agents/[id]/tools error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/agents/[id]/tools
 * Atomically updates which tools are enabled or disabled for an agent.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: agentId } = await params;
    const body: unknown = await request.json();

    if (!isUpdateAgentToolsBody(body)) {
      return NextResponse.json(
        { error: "Invalid payload. Expected { tools: [{ toolId, enabled, configOverride }] }" },
        { status: 400 },
      );
    }

    // 1. Fetch agent
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 2. Auth guard
    const auth = await requireWorkspaceAccess(agent.workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    // 3. Update or upsert each tool assignment atomically
    for (const item of body.tools) {
      await db
        .insert(agentTools)
        .values({
          agentId,
          toolId: item.toolId,
          enabled: item.enabled,
          configOverride: item.configOverride || {},
        })
        .onConflictDoUpdate({
          target: [agentTools.agentId, agentTools.toolId],
          set: {
            enabled: item.enabled,
            configOverride: item.configOverride || {},
          },
        });
    }

    // Fetch updated assignments
    const updatedAssignments = await db
      .select()
      .from(agentTools)
      .where(eq(agentTools.agentId, agentId));

    return NextResponse.json(
      { success: true, assignments: updatedAssignments },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("PUT /api/agents/[id]/tools error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

