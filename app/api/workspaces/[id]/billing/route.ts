import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { BillingService } from "@/lib/billing/service";
import { SubscriptionPlan } from "@/db/schema";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";

/**
 * GET /api/workspaces/[id]/billing
 * Returns current subscription, quotas, usage percentages, and invoice history.
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

    const billingOverview = await BillingService.getWorkspaceBilling(workspaceId);

    return NextResponse.json(billingOverview, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/workspaces/[id]/billing error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve billing information" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/workspaces/[id]/billing
 * Upgrades or downgrades the workspace subscription plan.
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

    // Only owners and admins can modify workspace subscriptions
    if (auth.role !== "owner" && auth.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only workspace owners and admins can manage billing." },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { plan } = body;

    if (!plan || !SUBSCRIPTION_PLANS[plan as SubscriptionPlan]) {
      return NextResponse.json(
        {
          error: `Invalid plan specified. Valid plans are: ${Object.keys(
            SUBSCRIPTION_PLANS,
          ).join(", ")}`,
        },
        { status: 400 },
      );
    }

    await BillingService.changePlan(workspaceId, auth.userId, plan as SubscriptionPlan);
    const updatedBilling = await BillingService.getWorkspaceBilling(workspaceId);

    return NextResponse.json(
      {
        success: true,
        message: `Plan successfully changed to ${SUBSCRIPTION_PLANS[plan as SubscriptionPlan].name}`,
        billing: updatedBilling,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("POST /api/workspaces/[id]/billing error:", error);
    const msg = error instanceof Error ? error.message : "Failed to change subscription plan";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

