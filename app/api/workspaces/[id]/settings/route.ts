import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { BillingService } from "@/lib/billing/service";
import { db } from "@/db";
import { workspaces } from "@/db/schema";

/**
 * GET /api/workspaces/[id]/settings
 * Retrieves workspace settings and metadata.
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

    const [workspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        ownerUserId: workspaces.ownerUserId,
        createdAt: workspaces.createdAt,
      })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const settings = await BillingService.getWorkspaceSettings(workspaceId);

    return NextResponse.json(
      {
        workspace,
        settings,
        userRole: auth.role,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("GET /api/workspaces/[id]/settings error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve workspace settings" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/workspaces/[id]/settings
 * Updates workspace configuration options (model, safety guardrails, public sharing, webhook, notification).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: workspaceId } = await params;

    const auth = await requireWorkspaceAccess(workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    if (auth.role !== "owner" && auth.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only workspace owners and admins can update settings." },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      defaultModel,
      enforceSafetyGuardrails,
      allowPublicSharing,
      notificationEmail,
      webhookUrl,
    } = body;

    const updates: Parameters<typeof BillingService.updateWorkspaceSettings>[2] = {};

    if (typeof defaultModel === "string" && defaultModel.trim().length > 0) {
      updates.defaultModel = defaultModel.trim();
    }
    if (typeof enforceSafetyGuardrails === "boolean") {
      updates.enforceSafetyGuardrails = enforceSafetyGuardrails;
    }
    if (typeof allowPublicSharing === "boolean") {
      updates.allowPublicSharing = allowPublicSharing;
    }
    if (notificationEmail !== undefined) {
      updates.notificationEmail = notificationEmail ? String(notificationEmail).trim() : null;
    }
    if (webhookUrl !== undefined) {
      updates.webhookUrl = webhookUrl ? String(webhookUrl).trim() : null;
    }

    const updatedSettings = await BillingService.updateWorkspaceSettings(
      workspaceId,
      auth.userId,
      updates,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Settings updated successfully",
        settings: updatedSettings,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("PATCH /api/workspaces/[id]/settings error:", error);
    const msg = error instanceof Error ? error.message : "Failed to update workspace settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
