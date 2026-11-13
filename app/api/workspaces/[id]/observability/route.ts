import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { TelemetryService } from "@/lib/observability/telemetry";
import { db } from "@/db";
import { usageRecords } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * GET /api/workspaces/[id]/observability
 * Returns aggregated token usage, cost analytics, and recent execution traces for a workspace.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: workspaceId } = await params;

    const auth = await requireWorkspaceAccess(workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") ?? "30", 10);

    const summary = await TelemetryService.getWorkspaceTelemetry(workspaceId, days);

    // Fetch the 20 most recent execution traces
    const recentTraces = await db
      .select()
      .from(usageRecords)
      .where(eq(usageRecords.workspaceId, workspaceId))
      .orderBy(desc(usageRecords.createdAt))
      .limit(20);

    return NextResponse.json(
      {
        summary,
        recentTraces,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("GET /api/workspaces/[id]/observability error:", error);
    return NextResponse.json({ error: "Failed to fetch observability telemetry" }, { status: 500 });
  }
}

