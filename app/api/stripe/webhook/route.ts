import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { BillingService } from "@/lib/billing/service";
import { SubscriptionPlan } from "@/db/schema";

/**
 * POST /api/stripe/webhook
 * Handles incoming Stripe lifecycle events.
 */
export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret || !sig) {
      return NextResponse.json({ received: true, note: "Webhook received in sandbox mode" });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret);
    } catch (err: unknown) {
      console.error("Stripe webhook verification failed:", err);
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const workspaceId = session.metadata?.workspaceId;
        const userId = session.metadata?.userId || "system_stripe";
        const plan = session.metadata?.plan as SubscriptionPlan;

        if (workspaceId && plan) {
          await BillingService.changePlan(workspaceId, userId, plan);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const workspaceId = sub.metadata?.workspaceId;
        if (workspaceId) {
          await BillingService.changePlan(workspaceId, "system_stripe", "free");
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}

