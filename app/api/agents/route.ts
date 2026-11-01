import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { agents, agentVersions } from "@/db/schema";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";

type CreateAgentBody = {
  workspaceId: string;
  name: string;
  description?: string | null;
  instructions: string;
  model: string;
  config?: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCreateAgentBody(value: unknown): value is CreateAgentBody {
  if (!isRecord(value)) return false;

  const allowedKeys = new Set([
    "workspaceId",
    "name",
    "description",
    "instructions",
    "model",
    "config",
  ]);

  return (
    Object.keys(value).every((key) => allowedKeys.has(key)) &&
    typeof value.workspaceId === "string" &&
    value.workspaceId.trim().length > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    (value.description === undefined ||
      value.description === null ||
      typeof value.description === "string") &&
    typeof value.instructions === "string" &&
    value.instructions.trim().length > 0 &&
    typeof value.model === "string" &&
    value.model.trim().length > 0 &&
    (value.config === undefined || isRecord(value.config))
  );
}

export async function GET(request: NextRequest) {
  try {
    const workspaceId = request.nextUrl.searchParams.get("workspaceId")?.trim();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    const access = await requireWorkspaceAccess(workspaceId);

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status },
      );
    }

    const workspaceAgents = await db
      .select()
      .from(agents)
      .where(eq(agents.workspaceId, workspaceId))
      .orderBy(desc(agents.createdAt));

    return NextResponse.json({ agents: workspaceAgents });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isCreateAgentBody(body)) {
    return NextResponse.json(
      { error: "Invalid agent data" },
      { status: 400 },
    );
  }

  try {
    const workspaceId = body.workspaceId.trim();
    const access = await requireWorkspaceAccess(workspaceId);

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status },
      );
    }

    if (access.role === "member") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const created = await db.transaction(async (tx) => {
      const [agent] = await tx
        .insert(agents)
        .values({
          workspaceId,
          name: body.name.trim(),
          description: body.description?.trim() || null,
          createdBy: access.userId,
        })
        .returning();

      const [version] = await tx
        .insert(agentVersions)
        .values({
          agentId: agent.id,
          version: 1,
          instructions: body.instructions.trim(),
          model: body.model.trim(),
          config: body.config ?? {},
          createdBy: access.userId,
        })
        .returning();

      return { agent, version };
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 },
    );
  }
}
