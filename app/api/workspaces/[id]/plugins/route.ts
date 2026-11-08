import { NextRequest, NextResponse } from "next/server";
import { PluginManager } from "@/lib/plugins/manager";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";

/**
 * GET /api/workspaces/[id]/plugins
 * Returns all installed plugins and their enabled status for the given workspace.
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

    const installed = await PluginManager.getInstalledPlugins(workspaceId);

    return NextResponse.json({ installed }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/workspaces/[id]/plugins error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

