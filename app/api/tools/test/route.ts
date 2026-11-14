import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ToolRegistry } from "@/lib/tools/registry";
import { db } from "@/db";
import { workspaces } from "@/db/schema";

/**
 * POST /api/tools/test
 * Executes a tool test run with sample parameters.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { toolId, args = {} } = body;

    if (!toolId) {
      return NextResponse.json({ error: "toolId is required" }, { status: 400 });
    }

    const tool = ToolRegistry.get(toolId);
    if (!tool) {
      return NextResponse.json({ error: `Tool '${toolId}' not found in registry.` }, { status: 404 });
    }

    const [ws] = await db.select().from(workspaces).limit(1);
    const workspaceId = ws?.id || "test-workspace";

    const startTime = Date.now();
    const result = await tool.execute(args, {
      workspaceId,
      userId: session.user.id,
      agentId: "test-agent",
      conversationId: "test-conv",
    });
    const durationMs = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        toolId,
        args,
        result,
        durationMs,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("POST /api/tools/test error:", error);
    const msg = error instanceof Error ? error.message : "Tool test execution failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
