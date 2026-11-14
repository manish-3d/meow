import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";
import { StripeService } from "@/lib/stripe/client";
import { BillingService } from "@/lib/billing/service";

/**
 * POST /api/stripe/portal
 * Generates a Stripe Customer Portal link to manage cards, subscriptions, and tax receipts.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { workspaceId } = body;

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(workspaceId);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const billing = await BillingService.getWorkspaceBilling(workspaceId);
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portal = await StripeService.createPortalSession({
      customerId: billing.subscription?.stripeCustomerId || undefined,
      returnUrl: `${origin}/billing`,
    });

    return NextResponse.json({ url: portal.url }, { status: 200 });
  } catch (error: unknown) {
    console.error("POST /api/stripe/portal error:", error);
    const msg = error instanceof Error ? error.message : "Failed to open customer portal";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
