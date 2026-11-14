/**
 * Meow Subscription Tiers & Plan Contracts
 */

export type SubscriptionPlan = "free" | "pro" | "enterprise";

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  badge: string;
  priceMonthlyUsd: number;
  monthlyTokenBudget: number;
  monthlySpendLimitUsd: number;
  maxAgents: number;
  features: string[];
  allowedModels: string[];
  supportTier: string;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    id: "free",
    name: "Developer Starter",
    badge: "Free Tier",
    priceMonthlyUsd: 0,
    monthlyTokenBudget: 200_000,
    monthlySpendLimitUsd: 5.0,
    maxAgents: 3,
    allowedModels: ["gemini-2.5-flash", "gemini-1.5-flash", "gpt-4o-mini"],
    features: [
      "200k Monthly Model Tokens",
      "Up to 3 Autonomous Agents",
      "Standard ReAct Loop Execution",
      "Community Plugin Access",
      "Local Session Memory",
    ],
    supportTier: "Community",
  },
  pro: {
    id: "pro",
    name: "Autonomous Pro",
    badge: "Most Popular",
    priceMonthlyUsd: 29,
    monthlyTokenBudget: 5_000_000,
    monthlySpendLimitUsd: 100.0,
    maxAgents: 50,
    allowedModels: [
      "gemini-2.5-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gpt-4o",
      "gpt-4o-mini",
      "claude-3-5-sonnet",
    ],
    features: [
      "5 Million Monthly Model Tokens",
      "Unlimited Autonomous Agents",
      "pgvector Document RAG with HNSW",
      "Inngest Durable Background Cron Workers",
      "Full Plugin Marketplace Integrations",
      "Multi-User Workspace Collaboration (5 seats)",
      "Priority API Inference Speed",
    ],
    supportTier: "Priority Email",
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Fleet",
    badge: "Scale",
    priceMonthlyUsd: 199,
    monthlyTokenBudget: 50_000_000,
    monthlySpendLimitUsd: 1000.0,
    maxAgents: 9999,
    allowedModels: [
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gpt-4o",
      "gpt-4-turbo",
      "claude-3-5-sonnet",
      "custom-endpoints",
    ],
    features: [
      "50 Million Monthly Model Tokens",
      "Unlimited Multi-Agent Fleets",
      "Dedicated Background Worker Concurrency",
      "SOC2-Compliant Immutable Audit Retention",
      "Custom MCP Servers & Private Sandbox Runners",
      "Unlimited Team Seats & Granular RBAC",
      "24/7 Dedicated Solutions Engineer SLA",
    ],
    supportTier: "24/7 Dedicated SLA",
  },
};
