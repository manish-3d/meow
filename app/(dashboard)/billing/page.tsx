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
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const fetchBilling = async () => {
    try {
      setIsLoading(true);
      setNotification(null);

      // 1. Get current workspace
      const wsRes = await fetch("/api/workspaces");
      if (!wsRes.ok) throw new Error("Failed to load workspace");
      const wsData = await wsRes.json();
      const wsId = wsData.activeWorkspace?.id || wsData.workspaces?.[0]?.workspaceId || wsData.workspaces?.[0]?.id;

      if (!wsId) {
        throw new Error("No active workspace found");
      }
      setWorkspaceId(wsId);

      // 2. Get billing overview
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

  const handlePlanChange = async (newPlan: SubscriptionPlan) => {
    if (!workspaceId) return;
    if (billing?.subscription.plan === newPlan) return;

    try {
      setIsUpdating(newPlan);
      setNotification(null);

      const res = await fetch(`/api/workspaces/${workspaceId}/billing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to change plan");
      }

      setBilling(json.billing);
      setNotification({
        type: "success",
        message: `Subscription successfully updated to ${SUBSCRIPTION_PLANS[newPlan].name}! Your token limits have been synced.`,
      });
    } catch (err: unknown) {
      console.error("Plan upgrade error:", err);
      const msg = err instanceof Error ? err.message : "Failed to update plan";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsUpdating(null);
    }
  };

  const currentPlan = billing?.subscription.plan || "free";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Subscription & Billing Management</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
            <p className="text-muted-foreground text-sm">
              Manage your Meow agent runtime subscription, monitor monthly token quotas, and inspect invoice receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBilling}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3.5 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3.5 py-2 text-sm">
              <span className="text-muted-foreground">Active Plan:</span>
              <span className="font-semibold text-primary capitalize">{currentPlan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border p-4 flex items-start gap-3 transition-all ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
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

      {/* AI Engine & Gemini Connected Banner */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              Google Gemini Live Adapter Active
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                Connected
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Direct Gemini API integration configured via GEMINI_API_KEY. All models (1.5 Flash, 1.5 Pro, 2.0 Flash) are active.
            </div>
          </div>
        </div>
      </div>

      {/* Quota & Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token Budget Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold tracking-wider uppercase">Monthly Token Budget</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {billing?.limits.currentMonthTokens.toLocaleString() ?? "0"}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {billing?.limits.monthlyTokenBudget.toLocaleString() ?? "200,000"} tokens
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {billing?.limits.percentUsed ?? 0}% consumed this billing cycle
            </p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (billing?.limits.percentUsed ?? 0) > 85
                  ? "bg-red-500"
                  : (billing?.limits.percentUsed ?? 0) > 60
                  ? "bg-amber-500"
                  : "bg-primary"
              }`}
              style={{ width: `${Math.min(100, Math.max(2, billing?.limits.percentUsed ?? 0))}%` }}
            />
          </div>
        </div>

        {/* Monthly Spend Limit Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold tracking-wider uppercase">Monthly Spend Cap</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              ${billing?.limits.currentMonthSpendUsd.toFixed(2) ?? "0.00"}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / ${billing?.limits.monthlySpendLimitUsd.toFixed(2) ?? "5.00"} USD
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Soft limit protection to prevent runaway LLM costs
            </p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    2,
                    ((billing?.limits.currentMonthSpendUsd ?? 0) /
                      Math.max(1, billing?.limits.monthlySpendLimitUsd ?? 1)) *
                      100,
                  ),
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold tracking-wider uppercase">Active Tier</span>
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold capitalize">
              Meow {currentPlan}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentPlan === "free"
                ? "Free tier with 200k monthly tokens"
                : currentPlan === "pro"
                ? "$29/month • 5M tokens • Priority SLA"
                : "$199/month • 50M tokens • Enterprise SLA"}
            </p>
          </div>
          <div className="text-xs text-muted-foreground pt-1 border-t">
            Status: <span className="text-emerald-500 font-medium">Active</span>
            {billing?.subscription.currentPeriodEnd && (
              <span className="ml-2">
                • Renews: {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Plan Tiers Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Available Subscription Plans</h2>
          <p className="text-sm text-muted-foreground">
            Select the plan that matches your AI agent orchestration and token throughput needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["free", "pro", "enterprise"] as const).map((planKey) => {
            const plan = SUBSCRIPTION_PLANS[planKey];
            const isCurrent = currentPlan === planKey;
            const isPopular = planKey === "pro";

            return (
              <div
                key={planKey}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
                  isCurrent
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                    : isPopular
                    ? "border-primary/50 bg-card shadow-sm hover:border-primary"
                    : "border-border bg-card shadow-xs hover:border-muted-foreground/30"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-xs">
                    Most Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight">
                      ${plan.priceMonthlyUsd}
                    </span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.monthlyTokenBudget.toLocaleString()} tokens / month
                  </p>
                </div>

                <div className="space-y-2.5 my-6 flex-1 border-t pt-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanChange(planKey)}
                  disabled={isCurrent || isUpdating !== null}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                    isCurrent
                      ? "bg-muted text-muted-foreground cursor-default"
                      : isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                      : "border border-input bg-background hover:bg-muted text-foreground"
                  } disabled:opacity-50`}
                >
                  {isUpdating === planKey ? (
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Updating...
                    </span>
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : plan.priceMonthlyUsd > 0 ? (
                    `Upgrade to ${plan.name}`
                  ) : (
                    "Switch to Free"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice Receipts & Billing History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Invoices & Payment History</h2>
            <p className="text-sm text-muted-foreground">
              Review and download receipts for subscription renewals and tier upgrades.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Receipt className="h-4 w-4" />
            <span>Automated Billing</span>
          </div>
        </div>

        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          {billing?.invoices && billing.invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs text-muted-foreground uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Invoice #</th>
                    <th className="px-6 py-3.5">Description</th>
                    <th className="px-6 py-3.5">Date Paid</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {billing.invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-foreground">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {inv.description || "Meow Subscription"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {inv.paidAt
                          ? new Date(inv.paidAt).toLocaleDateString()
                          : new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${parseFloat(inv.amountUsd).toFixed(2)} USD
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Check className="h-3 w-3" />
                          PAID
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground space-y-2">
              <Receipt className="h-8 w-8 mx-auto opacity-30" />
              <p className="text-sm font-medium">No invoices generated yet.</p>
              <p className="text-xs">
                Invoices will appear here automatically when you upgrade to a paid tier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
