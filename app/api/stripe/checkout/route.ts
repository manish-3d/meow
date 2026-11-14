import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { StripeService } from "@/lib/stripe/client";
import { BillingService } from "@/lib/billing/service";

/**
 * POST /api/stripe/checkout
 * Initiates Stripe Checkout for Pro and Enterprise workspace plans.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { workspaceId, plan, billingCycle } = body;

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }

    if (plan !== "pro" && plan !== "enterprise") {
      return NextResponse.json(
        { error: "Invalid plan. Only 'pro' and 'enterprise' can be purchased." },
        { status: 400 },
      );
    }

    const auth = await requireWorkspaceAccess(workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutResult = await StripeService.createCheckoutSession({
      workspaceId,
      userId: auth.userId,
      plan,
      billingCycle: billingCycle === "annual" ? "annual" : "monthly",
      successUrl: `${origin}/billing`,
      cancelUrl: `${origin}/billing`,
      customerEmail: session.user.email || undefined,
    });

    // If sandbox mode, upgrade the workspace immediately so the user doesn't have to wait
    if (checkoutResult.isSandbox) {
      await BillingService.changePlan(workspaceId, auth.userId, plan);
    }

    return NextResponse.json(
      {
        success: true,
        url: checkoutResult.url,
        sessionId: checkoutResult.sessionId,
        isSandbox: checkoutResult.isSandbox,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("POST /api/stripe/checkout error:", error);
    const msg = error instanceof Error ? error.message : "Failed to initiate checkout";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

