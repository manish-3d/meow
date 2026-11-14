"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Check,
  Zap,
  Shield,
  Layers,
  Sparkles,
  ArrowUpRight,
  Receipt,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Cpu,
  TrendingUp,
  Download,
  Building,
  Lock,
  ExternalLink,
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";
import { type SubscriptionPlan } from "@/db/schema";

interface BillingData {
  workspaceId: string;
  subscription: {
    id: string;
    plan: SubscriptionPlan;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
  };
  planConfig: {
    id: SubscriptionPlan;
    name: string;
    priceMonthlyUsd: number;
    monthlyTokenBudget: number;
    monthlySpendLimitUsd: number;
    maxAgents: number;
    features: string[];
  };
  limits: {
    monthlyTokenBudget: number;
    monthlySpendLimitUsd: number;
    currentMonthTokens: number;
    currentMonthSpendUsd: number;
    percentUsed: number;
  };
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    amountUsd: string;
    status: string;
    description: string | null;
    paidAt: string | null;
    createdAt: string;
  }>;
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const fetchBilling = async () => {
    try {
      setIsLoading(true);
      setNotification(null);

      const wsRes = await fetch("/api/workspaces");
      if (!wsRes.ok) throw new Error("Failed to load workspace");
      const wsData = await wsRes.json();
      const wsId =
        wsData.activeWorkspace?.id ||
        wsData.workspaces?.[0]?.workspaceId ||
        wsData.workspaces?.[0]?.id;

      if (!wsId) {
        throw new Error("No active workspace found");
      }
      setWorkspaceId(wsId);

      const billRes = await fetch(`/api/workspaces/${wsId}/billing`);
      if (!billRes.ok) {
        const errJson = await billRes.json();
        throw new Error(errJson.error || "Failed to load billing details");
      }
      const data: BillingData = await billRes.json();
      setBilling(data);
    } catch (err: unknown) {
      console.error("Billing fetch error:", err);
      const msg = err instanceof Error ? err.message : "Failed to load billing";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleStripeCheckout = async (targetPlan: "pro" | "enterprise") => {
    if (!workspaceId) return;

    try {
      setIsUpdating(targetPlan);
      setNotification(null);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          plan: targetPlan,
          billingCycle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate Stripe Checkout");
      }

      if (data.isSandbox) {
        setNotification({
          type: "success",
          message: `Stripe Checkout completed (Sandbox Mode)! Upgraded to ${
            targetPlan === "enterprise" ? "Enterprise" : "Pro"
          } with instant token limit activation.`,
        });
        await fetchBilling();
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      console.error("Stripe checkout error:", err);
      const msg = err instanceof Error ? err.message : "Checkout failed";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleOpenPortal = async () => {
    if (!workspaceId) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = billing?.subscription.plan || "free";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#f7f8f8]">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-white/70">
              <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
              <span>Stripe Payments & Subscription Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Billing & Quotas
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Manage your Meow agent runtime tier, monitor real-time token execution budgets, and inspect Stripe invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBilling}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#08090a] px-4 py-2 text-xs font-mono">
              <span className="text-white/40">Tier:</span>
              <span className="font-bold text-emerald-400 capitalize">{currentPlan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`rounded-xl border p-4 flex items-start gap-3 transition-all ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-medium">{notification.message}</div>
        </div>
      )}

      {/* Quota & Usage Progress */}
      {billing && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Monthly Token Consumption Meter</span>
                <span className="text-xs font-mono text-indigo-400 font-normal">
                  ({billing.limits.percentUsed}% used)
                </span>
              </h3>
              <p className="text-xs text-white/50">
                Resets on the 1st of each billing month. Quota enforces workspace runtime budget limits.
              </p>
            </div>
            <div className="text-right font-mono text-xs text-white/70">
              <span className="font-bold text-white text-base">
                {billing.limits.currentMonthTokens.toLocaleString()}
              </span>{" "}
              / {billing.limits.monthlyTokenBudget.toLocaleString()} tokens
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                billing.limits.percentUsed > 90
                  ? "bg-red-500"
                  : billing.limits.percentUsed > 75
                  ? "bg-amber-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${Math.max(3, billing.limits.percentUsed)}%` }}
            />
          </div>
        </div>
      )}

      {/* Billing Cycle Switch */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-bold tracking-tight text-white">Choose Your Plan</h2>
        <div className="flex items-center gap-2 bg-[#0c0d10] border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              billingCycle === "monthly" ? "bg-white text-black font-semibold shadow-xs" : "text-white/50 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              billingCycle === "annual" ? "bg-white text-black font-semibold shadow-xs" : "text-white/50 hover:text-white"
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div
          className={`rounded-2xl border p-6 flex flex-col justify-between space-y-6 ${
            currentPlan === "free"
              ? "border-emerald-500/50 bg-[#0c0d10] ring-1 ring-emerald-500/20"
              : "border-white/[0.08] bg-[#0c0d10]"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Hobbyist</h3>
                <p className="text-xs text-white/50">Local testing and dev runtimes.</p>
              </div>
              {currentPlan === "free" && (
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Current
                </span>
              )}
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">$0</div>
            <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>50,000 monthly tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Up to 3 active agents</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>OAuth Socials (Sandbox)</span>
              </li>
            </ul>
          </div>

          <button
            disabled={currentPlan === "free"}
            className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white/40 cursor-default"
          >
            {currentPlan === "free" ? "Active Free Tier" : "Downgrade to Free"}
          </button>
        </div>

        {/* Pro Plan */}
        <div
          className={`rounded-2xl border-2 p-6 flex flex-col justify-between space-y-6 relative ${
            currentPlan === "pro"
              ? "border-indigo-500 bg-[#0f1117] ring-2 ring-indigo-500/30"
              : "border-indigo-500/50 bg-[#0c0d10]"
          }`}
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-3 py-1 rounded-full shadow-sm">
            Recommended
          </span>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Pro</h3>
                <p className="text-xs text-white/50">For production autonomy & social bots.</p>
              </div>
              {currentPlan === "pro" && (
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-white">
                ${billingCycle === "annual" ? "24" : "29"}
              </span>
              <span className="text-xs text-white/50 font-mono">/month</span>
            </div>
            <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="font-semibold text-white">500,000 monthly tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Unlimited agents</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Live Twitter & Reddit publishing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Custom Skills & Tool Studio</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleStripeCheckout("pro")}
            disabled={isUpdating === "pro" || currentPlan === "pro"}
            className="w-full py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isUpdating === "pro" ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CreditCard className="h-3.5 w-3.5" />
            )}
            <span>{currentPlan === "pro" ? "Current Active Plan" : "Upgrade with Stripe"}</span>
          </button>
        </div>

        {/* Enterprise Plan */}
        <div
          className={`rounded-2xl border p-6 flex flex-col justify-between space-y-6 ${
            currentPlan === "enterprise"
              ? "border-emerald-500/50 bg-[#0c0d10] ring-1 ring-emerald-500/20"
              : "border-white/[0.08] bg-[#0c0d10]"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Enterprise</h3>
                <p className="text-xs text-white/50">Dedicated Neon VPC & custom limits.</p>
              </div>
              {currentPlan === "enterprise" && (
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-white">
                ${billingCycle === "annual" ? "79" : "99"}
              </span>
              <span className="text-xs text-white/50 font-mono">/month</span>
            </div>
            <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">2,500,000 monthly tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Dedicated Neon cloud tenancy</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Priority agent loop queue</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleStripeCheckout("enterprise")}
            disabled={isUpdating === "enterprise" || currentPlan === "enterprise"}
            className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpdating === "enterprise" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            <span>{currentPlan === "enterprise" ? "Current Active Plan" : "Upgrade to Enterprise"}</span>
          </button>
        </div>
      </div>

      {/* Payment Methods & Stripe Customer Portal */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>Accepted Payment Methods</span>
          </h3>
          <p className="text-xs text-white/50">
            Powered securely by Stripe. We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and bank transfers.
          </p>
        </div>

        <button
          onClick={handleOpenPortal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Stripe Customer Portal</span>
        </button>
      </div>

      {/* Invoice History Table */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="h-4 w-4 text-indigo-400" />
            <span>Invoices & Billing History</span>
          </h2>
          <span className="text-xs font-mono text-white/40">
            {billing?.invoices?.length || 0} records
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-white/40 font-mono">
              <tr>
                <th className="py-3 px-4 font-medium">Invoice Number</th>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono text-white/80">
              {billing?.invoices && billing.invoices.length > 0 ? (
                billing.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 text-white/60 font-sans">{inv.description || "Meow Subscription"}</td>
                    <td className="py-3 px-4 text-white font-bold">${Number(inv.amountUsd).toFixed(2)}</td>
                    <td className="py-3 px-4 text-white/40">
                      {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "Pending"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Downloaded receipt for invoice ${inv.invoiceNumber}`)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Download Receipt"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-white/40 font-mono">
                    No billing transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
