/**
 * Meow Billing, Subscription & Settings Service
 */

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  invoices,
  subscriptions,
  workspaceLimits,
  workspaceSettings,
  workspaces,
  type Invoice,
  type Subscription,
  type SubscriptionPlan,
  type WorkspaceSettings,
} from "@/db/schema";
import { SUBSCRIPTION_PLANS, type PlanConfig } from "./plans";
import { logAction } from "@/lib/audit";

export interface WorkspaceBillingOverview {
  workspaceId: string;
  subscription: Subscription;
  planConfig: PlanConfig;
  limits: {
    monthlyTokenBudget: number;
    monthlySpendLimitUsd: number;
    currentMonthTokens: number;
    currentMonthSpendUsd: number;
    percentUsed: number;
  };
  invoices: Invoice[];
}

export class BillingService {
  /**
   * Retrieves or initializes subscription and limits for a workspace.
   */
  public static async getWorkspaceBilling(workspaceId: string): Promise<WorkspaceBillingOverview> {
    // 1. Get or create subscription record
    let [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspaceId, workspaceId))
      .limit(1);

    if (!sub) {
      [sub] = await db
        .insert(subscriptions)
        .values({
          workspaceId,
          plan: "free",
          status: "active",
        })
        .onConflictDoNothing()
        .returning();

      // If onConflict hit without returning, re-fetch
      if (!sub) {
        const [existing] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.workspaceId, workspaceId))
          .limit(1);
        sub = existing;
      }
    }

    const planConfig = SUBSCRIPTION_PLANS[sub.plan as SubscriptionPlan] || SUBSCRIPTION_PLANS.free;

    // 2. Get workspace limits
    let [limitsRecord] = await db
      .select()
      .from(workspaceLimits)
      .where(eq(workspaceLimits.workspaceId, workspaceId))
      .limit(1);

    if (!limitsRecord) {
      [limitsRecord] = await db
        .insert(workspaceLimits)
        .values({
          workspaceId,
          monthlyTokenBudget: planConfig.monthlyTokenBudget,
          monthlySpendLimitUsd: planConfig.monthlySpendLimitUsd.toFixed(2),
          currentMonthTokens: 0,
          currentMonthSpendUsd: "0.000000",
        })
        .onConflictDoNothing()
        .returning();

      if (!limitsRecord) {
        const [existingLim] = await db
          .select()
          .from(workspaceLimits)
          .where(eq(workspaceLimits.workspaceId, workspaceId))
          .limit(1);
        limitsRecord = existingLim;
      }
    }

    // 3. Get invoice history
    const invoiceList = await db
      .select()
      .from(invoices)
      .where(eq(invoices.workspaceId, workspaceId))
      .orderBy(desc(invoices.paidAt))
      .limit(10);

    const budget = limitsRecord?.monthlyTokenBudget ?? planConfig.monthlyTokenBudget;
    const curTokens = limitsRecord?.currentMonthTokens ?? 0;
    const percentUsed = Math.min(100, Math.round((curTokens / Math.max(1, budget)) * 100));

    return {
      workspaceId,
      subscription: sub,
      planConfig,
      limits: {
        monthlyTokenBudget: budget,
        monthlySpendLimitUsd: Number(limitsRecord?.monthlySpendLimitUsd ?? planConfig.monthlySpendLimitUsd),
        currentMonthTokens: curTokens,
        currentMonthSpendUsd: Number(limitsRecord?.currentMonthSpendUsd ?? 0),
        percentUsed,
      },
      invoices: invoiceList,
    };
  }

  /**
   * Upgrades or downgrades a workspace subscription plan, updating quotas and issuing an invoice.
   */
  public static async changePlan(
    workspaceId: string,
    userId: string,
    newPlan: SubscriptionPlan,
  ): Promise<Subscription> {
    const planConfig = SUBSCRIPTION_PLANS[newPlan];
    if (!planConfig) {
      throw new Error(`Invalid subscription plan: '${newPlan}'`);
    }

    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setDate(now.getDate() + 30);

    // 1. Update subscription row
    const [updatedSub] = await db
      .insert(subscriptions)
      .values({
        workspaceId,
        plan: newPlan,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: subscriptions.workspaceId,
        set: {
          plan: newPlan,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          updatedAt: now,
        },
      })
      .returning();

    // 2. Adjust workspace limits to match plan capacity
    await db
      .insert(workspaceLimits)
      .values({
        workspaceId,
        monthlyTokenBudget: planConfig.monthlyTokenBudget,
        monthlySpendLimitUsd: planConfig.monthlySpendLimitUsd.toFixed(2),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: workspaceLimits.workspaceId,
        set: {
          monthlyTokenBudget: planConfig.monthlyTokenBudget,
          monthlySpendLimitUsd: planConfig.monthlySpendLimitUsd.toFixed(2),
          updatedAt: now,
        },
      });

    // 3. If paid tier, generate invoice receipt
    if (planConfig.priceMonthlyUsd > 0) {
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
      await db.insert(invoices).values({
        workspaceId,
        invoiceNumber,
        amountUsd: planConfig.priceMonthlyUsd.toFixed(2),
        status: "paid",
        description: `Meow ${planConfig.name} - Monthly Subscription`,
        paidAt: now,
      });
    }

    // 4. Audit logging
    await logAction({
      workspaceId,
      userId,
      action: "subscription_plan_changed",
      targetType: "subscription",
      targetId: updatedSub.id,
      details: { newPlan, priceMonthlyUsd: planConfig.priceMonthlyUsd },
    });

    return updatedSub;
  }

  /**
   * Retrieves workspace settings or returns defaults.
   */
  public static async getWorkspaceSettings(workspaceId: string): Promise<WorkspaceSettings> {
    const [settings] = await db
      .select()
      .from(workspaceSettings)
      .where(eq(workspaceSettings.workspaceId, workspaceId))
      .limit(1);

    if (settings) return settings;

    // Seed default settings row
    const [created] = await db
      .insert(workspaceSettings)
      .values({
        workspaceId,
        defaultModel: "gemini-1.5-flash",
        enforceSafetyGuardrails: true,
        allowPublicSharing: false,
      })
      .onConflictDoNothing()
      .returning();

    if (created) return created;

    const [existing] = await db
      .select()
      .from(workspaceSettings)
      .where(eq(workspaceSettings.workspaceId, workspaceId))
      .limit(1);

    return existing;
  }

  /**
   * Updates workspace configuration settings.
   */
  public static async updateWorkspaceSettings(
    workspaceId: string,
    userId: string,
    updates: Partial<{
      defaultModel: string;
      enforceSafetyGuardrails: boolean;
      allowPublicSharing: boolean;
      notificationEmail: string | null;
      webhookUrl: string | null;
    }>,
  ): Promise<WorkspaceSettings> {
    const now = new Date();
    const [updated] = await db
      .insert(workspaceSettings)
      .values({
        workspaceId,
        defaultModel: updates.defaultModel ?? "gemini-1.5-flash",
        enforceSafetyGuardrails: updates.enforceSafetyGuardrails ?? true,
        allowPublicSharing: updates.allowPublicSharing ?? false,
        notificationEmail: updates.notificationEmail ?? null,
        webhookUrl: updates.webhookUrl ?? null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: workspaceSettings.workspaceId,
        set: {
          ...updates,
          updatedAt: now,
        },
      })
      .returning();

    await logAction({
      workspaceId,
      userId,
      action: "workspace_settings_updated",
      targetType: "workspace_settings",
      targetId: workspaceId,
      details: updates,
    });

    return updated;
  }
}

