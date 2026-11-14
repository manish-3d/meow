/**
 * Stripe Client & Billing Integration
 * Supports live Stripe API when STRIPE_SECRET_KEY is configured,
 * and high-fidelity sandbox simulation for instant testing.
 */

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(
  stripeSecretKey &&
  !stripeSecretKey.includes("placeholder") &&
  stripeSecretKey.startsWith("sk_")
);

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey!, {
      apiVersion: "2025-02-24.acacia" as any,
    })
  : null;

export interface StripeCheckoutParams {
  workspaceId: string;
  userId: string;
  plan: "pro" | "enterprise";
  billingCycle?: "monthly" | "annual";
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export class StripeService {
  /**
   * Creates a checkout session for a subscription upgrade.
   */
  public static async createCheckoutSession(params: StripeCheckoutParams) {
    const isAnnual = params.billingCycle === "annual";
    const amountUsd = params.plan === "enterprise" ? (isAnnual ? 79 : 99) : (isAnnual ? 24 : 29);
    const planName = params.plan === "enterprise" ? "Meow Enterprise Plan" : "Meow Pro Plan";

    if (isStripeConfigured && stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: params.customerEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: planName,
                description: `Autonomous agent execution, unlimited skills, and ${
                  params.plan === "enterprise" ? "2,500,000" : "500,000"
                } monthly tokens.`,
              },
              unit_amount: amountUsd * 100,
              recurring: {
                interval: isAnnual ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          workspaceId: params.workspaceId,
          userId: params.userId,
          plan: params.plan,
          billingCycle: params.billingCycle || "monthly",
        },
        success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}&plan=${params.plan}`,
        cancel_url: params.cancelUrl,
      });

      return {
        url: session.url,
        sessionId: session.id,
        isSandbox: false,
      };
    }

    // High-fidelity Sandbox Checkout Simulation
    const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const sandboxSuccessUrl = new URL(params.successUrl);
    sandboxSuccessUrl.searchParams.set("session_id", mockSessionId);
    sandboxSuccessUrl.searchParams.set("plan", params.plan);
    sandboxSuccessUrl.searchParams.set("simulated", "true");

    return {
      url: sandboxSuccessUrl.toString(),
      sessionId: mockSessionId,
      isSandbox: true,
      amountUsd,
      planName,
    };
  }

  /**
   * Creates a customer portal session for managing payment methods.
   */
  public static async createPortalSession(params: {
    customerId?: string;
    returnUrl: string;
  }) {
    if (isStripeConfigured && stripe && params.customerId) {
      const portal = await stripe.billingPortal.sessions.create({
        customer: params.customerId,
        return_url: params.returnUrl,
      });
      return { url: portal.url };
    }

    return {
      url: `${params.returnUrl}?portal=sandbox_managed`,
    };
  }
}
