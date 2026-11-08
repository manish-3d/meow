import { NextRequest, NextResponse } from "next/server";
import { PluginManager } from "@/lib/plugins/manager";
import { requirePermission } from "@/lib/auth/require-permission";

/**
 * GET /api/plugins
 * Lists all plugins in the marketplace catalog.
 */
export async function GET() {
  try {
    const marketplace = await PluginManager.getMarketplace();
    return NextResponse.json({ marketplace }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/plugins error:", error);
    return NextResponse.json({ error: "Failed to load marketplace catalog" }, { status: 500 });
  }
}

/**
 * POST /api/plugins
 * Installs a plugin into a workspace.
 * Requires 'manage_plugins' permission.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, pluginId, config } = body ?? {};

    if (!workspaceId || typeof workspaceId !== "string") {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }
    if (!pluginId || typeof pluginId !== "string") {
      return NextResponse.json({ error: "pluginId is required" }, { status: 400 });
    }

    const auth = await requirePermission(workspaceId, "manage_plugins");
    if (!auth.authorized || !auth.userId) {
      return NextResponse.json({ error: auth.message ?? "Unauthorized" }, { status: auth.status });
    }

    const installed = await PluginManager.installPlugin(
      workspaceId,
      auth.userId,
      pluginId,
      config ?? {},
    );

    return NextResponse.json({ plugin: installed }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/plugins error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/plugins
 * Uninstalls a plugin from a workspace.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const pluginId = searchParams.get("pluginId");

    if (!workspaceId || !pluginId) {
      return NextResponse.json({ error: "workspaceId and pluginId are required" }, { status: 400 });
    }

    const auth = await requirePermission(workspaceId, "manage_plugins");
    if (!auth.authorized || !auth.userId) {
      return NextResponse.json({ error: auth.message ?? "Unauthorized" }, { status: auth.status });
    }

    const success = await PluginManager.uninstallPlugin(workspaceId, auth.userId, pluginId);
    if (!success) {
      return NextResponse.json({ error: "Plugin was not installed" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE /api/plugins error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

