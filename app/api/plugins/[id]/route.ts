import { NextRequest, NextResponse } from "next/server";
import { PluginManager } from "@/lib/plugins/manager";
import { requirePermission } from "@/lib/auth/require-permission";

/**
 * PATCH /api/plugins/[id]
 * Enables or disables an installed workspace plugin.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: pluginId } = await params;
    const body = await request.json();
    const { workspaceId, enabled } = body ?? {};

    if (!workspaceId || typeof workspaceId !== "string") {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }
    if (typeof enabled !== "boolean") {
      return NextResponse.json({ error: "enabled (boolean) is required" }, { status: 400 });
    }

    const auth = await requirePermission(workspaceId, "manage_plugins");
    if (!auth.authorized || !auth.userId) {
      return NextResponse.json({ error: auth.message ?? "Unauthorized" }, { status: auth.status });
    }

    const updated = await PluginManager.setPluginEnabled(
      workspaceId,
      auth.userId,
      pluginId,
      enabled,
    );

    return NextResponse.json({ plugin: updated }, { status: 200 });
  } catch (error: unknown) {
    console.error("PATCH /api/plugins/[id] error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

