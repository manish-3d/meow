import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { IntegrationsService } from "@/lib/integrations/service";
import { IntegrationProvider } from "@/db/schema";
import { SUPPORTED_INTEGRATIONS } from "@/lib/integrations/types";

/**
 * GET /api/workspaces/[id]/integrations
 * Lists all integrations and their connection statuses for a workspace.
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

    const integrations = await IntegrationsService.listWorkspaceIntegrations(workspaceId);

    return NextResponse.json({ integrations }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/workspaces/[id]/integrations error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve workspace integrations" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/workspaces/[id]/integrations
 * Connects or updates credentials for a social or developer platform.
 */
export async function POST(
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
        { error: "Forbidden: Only workspace owners and admins can manage integrations." },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { provider, credentials, accountHandle, accountName } = body;

    if (!provider || !SUPPORTED_INTEGRATIONS[provider as IntegrationProvider]) {
      return NextResponse.json(
        {
          error: `Invalid or unsupported provider '${provider}'. Valid providers: ${Object.keys(
            SUPPORTED_INTEGRATIONS,
          ).join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (!credentials || typeof credentials !== "object") {
      return NextResponse.json(
        { error: "Integration credentials object is required." },
        { status: 400 },
      );
    }

    const saved = await IntegrationsService.connectIntegration({
      workspaceId,
      userId: auth.userId,
      provider: provider as IntegrationProvider,
      credentials,
      accountHandle: accountHandle ? String(accountHandle).trim() : undefined,
      accountName: accountName ? String(accountName).trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${SUPPORTED_INTEGRATIONS[provider as IntegrationProvider].name} connected successfully!`,
        integration: {
          id: saved.id,
          provider: saved.provider,
          status: saved.status,
          accountHandle: saved.accountHandle,
          accountName: saved.accountName,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("POST /api/workspaces/[id]/integrations error:", error);
    const msg = error instanceof Error ? error.message : "Failed to connect integration";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * DELETE /api/workspaces/[id]/integrations
 * Disconnects an integration from the workspace.
 */
export async function DELETE(
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
        { error: "Forbidden: Only workspace owners and admins can manage integrations." },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") as IntegrationProvider | null;

    if (!provider || !SUPPORTED_INTEGRATIONS[provider]) {
      return NextResponse.json(
        { error: "Valid provider parameter is required." },
        { status: 400 },
      );
    }

    const removed = await IntegrationsService.disconnectIntegration(
      workspaceId,
      auth.userId,
      provider,
    );

    return NextResponse.json(
      {
        success: removed,
        message: `${SUPPORTED_INTEGRATIONS[provider].name} disconnected.`,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("DELETE /api/workspaces/[id]/integrations error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect integration" },
      { status: 500 },
    );
  }
}

