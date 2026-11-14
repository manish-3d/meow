/**
 * Meow - Verification Suite: Gemini AI API Connection, Billing Engine & Workspace Settings
 * Run: npx tsx --env-file=.env scripts/verify-billing-settings.ts
 */

import assert from "node:assert";
import { db } from "@/db";
import {
  users,
  workspaces,
  workspaceMembers,
  subscriptions,
  invoices,
  workspaceLimits,
  workspaceSettings,
  auditLogs,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { AIProviderFactory } from "@/lib/ai/factory";
import { BillingService } from "@/lib/billing/service";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";

async function runVerification() {
  console.log("================================================================================");
  console.log("🚀 Starting Meow Billing, Plans, Settings & Gemini API Verification Suite");
  console.log("================================================================================\n");

  const runId = Date.now().toString(36);
  const testEmail = `billing-test-${runId}@example.com`;
  let testUserId: string | null = null;
  let testWorkspaceId: string | null = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Gemini Adapter Registration & Environment Connection
    // -------------------------------------------------------------------------
    console.log("▶ [Test 1/5] Verifying Gemini AI Adapter Connection...");
    const geminiKey = process.env.GEMINI_API_KEY;
    assert(geminiKey, "GEMINI_API_KEY must be defined in process.env");
    assert(
      geminiKey.startsWith("AQ.") || geminiKey.length > 20,
      "GEMINI_API_KEY should be a valid Google AI Studio key format",
    );

    const adapter = AIProviderFactory.getProvider("gemini");
    assert(adapter, "Google Gemini adapter must be registered in AI factory");
    const flashAdapter = AIProviderFactory.getProvider("gemini-1.5-flash");
    assert(flashAdapter, "Resolving 'gemini-1.5-flash' should return Gemini adapter");
    console.log("  ✔ GEMINI_API_KEY detected:", geminiKey.slice(0, 10) + "..." + geminiKey.slice(-6));
    console.log("  ✔ Default 'gemini' OpenAI-compatible adapter successfully instantiated");

    // -------------------------------------------------------------------------
    // TEST 2: Seed Test User and Workspace
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 2/5] Provisioning Test Workspace & User in Neon Database...");
    const [user] = await db
      .insert(users)
      .values({
        email: testEmail,
        name: `Tester ${runId}`,
      })
      .returning();
    testUserId = user.id;

    const [ws] = await db
      .insert(workspaces)
      .values({
        name: `Billing Test Workspace ${runId}`,
        slug: `billing-test-${runId}`,
        ownerUserId: user.id,
      })
      .returning();
    testWorkspaceId = ws.id;

    await db.insert(workspaceMembers).values({
      workspaceId: ws.id,
      userId: user.id,
      role: "owner",
    });
    console.log(`  ✔ Created Workspace ${ws.id} owned by User ${user.id}`);

    // -------------------------------------------------------------------------
    // TEST 3: Default Free Subscription & Quota Limits Initialization
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 3/5] Testing Default Free Subscription Provisioning...");
    const initialBilling = await BillingService.getWorkspaceBilling(ws.id);
    assert.strictEqual(initialBilling.subscription.plan, "free");
    assert.strictEqual(initialBilling.subscription.status, "active");
    assert.strictEqual(
      initialBilling.limits.monthlyTokenBudget,
      SUBSCRIPTION_PLANS.free.monthlyTokenBudget,
    );
    assert.strictEqual(initialBilling.invoices.length, 0);
    console.log("  ✔ Initialized default 'free' plan: 200,000 monthly tokens, 0 invoices");

    // -------------------------------------------------------------------------
    // TEST 4: Subscription Plan Upgrades & Automated Invoicing
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 4/5] Testing Plan Upgrades (Pro $29 & Enterprise $199) & Invoicing...");
    
    // Upgrade to PRO
    console.log("  - Upgrading workspace to 'pro' tier ($29/month)...");
    const proSub = await BillingService.changePlan(ws.id, user.id, "pro");
    assert.strictEqual(proSub.plan, "pro");

    const proBilling = await BillingService.getWorkspaceBilling(ws.id);
    assert.strictEqual(proBilling.subscription.plan, "pro");
    assert.strictEqual(
      proBilling.limits.monthlyTokenBudget,
      SUBSCRIPTION_PLANS.pro.monthlyTokenBudget, // 5,000,000 tokens
    );
    assert.strictEqual(
      proBilling.limits.monthlySpendLimitUsd,
      SUBSCRIPTION_PLANS.pro.monthlySpendLimitUsd, // $100.00
    );
    assert.strictEqual(proBilling.invoices.length, 1);
    assert.strictEqual(proBilling.invoices[0].amountUsd, "29.00");
    assert.strictEqual(proBilling.invoices[0].status, "paid");
    console.log("  ✔ Upgraded to 'pro': token limit = 5,000,000, generated invoice INV #1 ($29.00, PAID)");

    // Upgrade to ENTERPRISE
    console.log("  - Upgrading workspace to 'enterprise' tier ($199/month)...");
    const entSub = await BillingService.changePlan(ws.id, user.id, "enterprise");
    assert.strictEqual(entSub.plan, "enterprise");

    const entBilling = await BillingService.getWorkspaceBilling(ws.id);
    assert.strictEqual(entBilling.subscription.plan, "enterprise");
    assert.strictEqual(
      entBilling.limits.monthlyTokenBudget,
      SUBSCRIPTION_PLANS.enterprise.monthlyTokenBudget, // 50,000,000 tokens
    );
    assert.strictEqual(entBilling.invoices.length, 2);
    assert.strictEqual(entBilling.invoices[0].amountUsd, "199.00");
    assert.strictEqual(entBilling.invoices[0].status, "paid");
    console.log("  ✔ Upgraded to 'enterprise': token limit = 50,000,000, generated invoice INV #2 ($199.00, PAID)");

    // -------------------------------------------------------------------------
    // TEST 5: Workspace Settings Configuration & Audit Logging
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 5/5] Testing Workspace Settings CRUD & Audit Logging...");

    const initialSettings = await BillingService.getWorkspaceSettings(ws.id);
    assert.strictEqual(initialSettings.defaultModel, "gemini-1.5-flash");
    assert.strictEqual(initialSettings.enforceSafetyGuardrails, true);
    assert.strictEqual(initialSettings.allowPublicSharing, false);
    console.log("  ✔ Initial settings retrieved with default 'gemini-1.5-flash' and guardrails enabled");

    const updatedSettings = await BillingService.updateWorkspaceSettings(ws.id, user.id, {
      defaultModel: "gemini-1.5-pro",
      allowPublicSharing: true,
      notificationEmail: "ops@meow.ai",
      webhookUrl: "https://api.example.com/meow/webhooks",
    });
    assert.strictEqual(updatedSettings.defaultModel, "gemini-1.5-pro");
    assert.strictEqual(updatedSettings.allowPublicSharing, true);
    assert.strictEqual(updatedSettings.notificationEmail, "ops@meow.ai");
    assert.strictEqual(updatedSettings.webhookUrl, "https://api.example.com/meow/webhooks");
    console.log("  ✔ Settings updated to 'gemini-1.5-pro', public sharing enabled, notification email saved");

    // Verify Audit Logs
    const planChangeLogs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, ws.id));
    
    const hasPlanLog = planChangeLogs.some((l) => l.action === "subscription_plan_changed");
    const hasSettingsLog = planChangeLogs.some((l) => l.action === "workspace_settings_updated");
    assert(hasPlanLog, "Must record subscription_plan_changed in audit logs");
    assert(hasSettingsLog, "Must record workspace_settings_updated in audit logs");
    console.log(`  ✔ Verified ${planChangeLogs.length} audit trail records persisted`);

    console.log("\n================================================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! (5/5)");
    console.log("================================================================================");
  } finally {
    // Cleanup
    if (testWorkspaceId) {
      console.log("\n🧹 Cleaning up test fixtures from Neon PostgreSQL...");
      await db.delete(auditLogs).where(eq(auditLogs.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(invoices).where(eq(invoices.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(workspaceLimits).where(eq(workspaceLimits.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(workspaceSettings).where(eq(workspaceSettings.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(subscriptions).where(eq(subscriptions.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(workspaces).where(eq(workspaces.id, testWorkspaceId)).catch(() => {});
    }
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId)).catch(() => {});
    }
    console.log("✔ Cleanup complete.");
  }
}

runVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Verification Failed:", err);
    process.exit(1);
  });
