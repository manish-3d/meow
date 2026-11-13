/**
 * Phase 10 Verification Test Suite: Observability, Telemetry & Metering
 *
 * Verifies:
 * 1. Model pricing calculation across providers
 * 2. Usage record persistence & schema integrity
 * 3. Atomic workspace budget updates & spend tracking
 * 4. Hard budget quota check enforcement
 * 5. Telemetry aggregation across timeframes, models, and agents
 * 6. Multi-tenant isolation for usage records
 */

import { db } from "../db";
import {
  agents,
  usageRecords,
  users,
  workspaceLimits,
  workspaces,
} from "../db/schema";
import { TelemetryService } from "../lib/observability/telemetry";
import { eq } from "drizzle-orm";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function run() {
  console.log("=== PHASE 10: OBSERVABILITY & TOKEN METERING VERIFICATION ===");

  const [userA] = await db
    .insert(users)
    .values({ email: `user_p10a_${Date.now()}@meow.test`, name: "Tenant A" })
    .returning();

  const [userB] = await db
    .insert(users)
    .values({ email: `user_p10b_${Date.now()}@meow.test`, name: "Tenant B" })
    .returning();

  const [workspaceA] = await db
    .insert(workspaces)
    .values({
      name: "Observability Space Alpha",
      slug: `obs-alpha-${Date.now()}`,
      ownerUserId: userA.id,
    })
    .returning();

  const [workspaceB] = await db
    .insert(workspaces)
    .values({
      name: "Observability Space Beta",
      slug: `obs-beta-${Date.now()}`,
      ownerUserId: userB.id,
    })
    .returning();

  const [agent1] = await db
    .insert(agents)
    .values({
      workspaceId: workspaceA.id,
      name: "Researcher",
      createdBy: userA.id,
    })
    .returning();

  const [agent2] = await db
    .insert(agents)
    .values({
      workspaceId: workspaceA.id,
      name: "Coder",
      createdBy: userA.id,
    })
    .returning();

  try {
    // Suite 1: Model Pricing Matrix
    console.log("\nSuite 1: Token Pricing & Cost Calculation");
    const gpt4oCost = TelemetryService.calculateCostUsd("gpt-4o", 1000, 500);
    // 1000/1M * 2.5 = 0.0025; 500/1M * 10 = 0.005 => total 0.0075
    assert(gpt4oCost === 0.0075, "Calculated exact USD cost for gpt-4o (0.0075)");

    const geminiCost = TelemetryService.calculateCostUsd("gemini-1.5-pro", 100_000, 20_000);
    // 100k/1M * 1.25 = 0.125; 20k/1M * 5.0 = 0.10 => total 0.225
    assert(geminiCost === 0.225, "Calculated exact USD cost for gemini-1.5-pro (0.225)");

    const fallbackCost = TelemetryService.calculateCostUsd("custom-llama-3", 10_000, 5_000);
    assert(fallbackCost > 0, "Gracefully falls back to default rates for unlisted models");

    // Suite 2: Usage Recording & Persistence
    console.log("\nSuite 2: Usage Record Creation & Persistence");
    const record1 = await TelemetryService.recordUsage({
      workspaceId: workspaceA.id,
      agentId: agent1.id,
      model: "gpt-4o",
      promptTokens: 2500,
      completionTokens: 800,
      durationMs: 1250,
      status: "success",
    });

    assert(record1.workspaceId === workspaceA.id, "Record matches workspace ID");
    assert(record1.totalTokens === 3300, "Calculated total tokens (2500 + 800 = 3300)");
    assert(record1.durationMs === 1250, "Persisted execution latency");
    assert(Number(record1.estimatedCostUsd) > 0, "Persisted estimated cost USD");

    // Record a second execution for another agent in Workspace A
    await TelemetryService.recordUsage({
      workspaceId: workspaceA.id,
      agentId: agent2.id,
      model: "gemini-1.5-pro",
      promptTokens: 10_000,
      completionTokens: 4_000,
      durationMs: 3100,
      status: "success",
    });

    // Suite 3: Tenant Isolation
    console.log("\nSuite 3: Multi-Tenant Usage Isolation");
    const summaryA = await TelemetryService.getWorkspaceTelemetry(workspaceA.id, 30);
    const summaryB = await TelemetryService.getWorkspaceTelemetry(workspaceB.id, 30);

    assert(summaryA.totalInvocations === 2, "Workspace A recorded exactly 2 invocations");
    assert(summaryB.totalInvocations === 0, "Workspace B has 0 invocations (isolated)");
    assert(summaryA.totalTokens === 17300, "Workspace A aggregated total tokens (3300 + 14000 = 17300)");

    // Suite 4: Telemetry Aggregation Breakdown
    console.log("\nSuite 4: Model Breakdown & Agent Leaderboard");
    assert(Object.keys(summaryA.modelDistribution).length === 2, "Recorded 2 distinct models");
    assert(summaryA.modelDistribution["gpt-4o"].count === 1, "Recorded 1 gpt-4o turn");
    assert(summaryA.modelDistribution["gemini-1.5-pro"].count === 1, "Recorded 1 gemini-1.5-pro turn");

    assert(summaryA.topAgents.length === 2, "Identified 2 active agents");
    assert(summaryA.topAgents[0].agentId === agent2.id, "Ranked agent2 as top token consumer");
    assert(summaryA.averageLatencyMs > 0, "Computed positive average turn latency");

    // Suite 5: Budget Quotas & Limit Enforcement
    console.log("\nSuite 5: Budget Quota Checking");
    const underBudget = await TelemetryService.checkBudgetQuota(workspaceA.id);
    assert(underBudget.allowed === true, "Allowed execution when usage is within limits");

    // Manually simulate exhausted budget for Workspace A
    await db
      .update(workspaceLimits)
      .set({
        currentMonthSpendUsd: "55.000000",
      })
      .where(eq(workspaceLimits.workspaceId, workspaceA.id));

    const overBudget = await TelemetryService.checkBudgetQuota(workspaceA.id);
    assert(overBudget.allowed === false, "Enforced block when spend limit is exceeded");
    assert(overBudget.reason?.includes("Monthly spend limit"), "Returned explicit budget violation reason");

    // Suite 6: Structured Logging Verification
    console.log("\nSuite 6: Structured Telemetry Output");
    let logged = false;
    const originalLog = console.log;
    console.log = (msg: string) => {
      try {
        const parsed = JSON.parse(msg);
        if (parsed.service === "meow-telemetry" && parsed.event === "unit_test_event") {
          logged = true;
        }
      } catch {}
      originalLog(msg);
    };

    TelemetryService.emitStructuredLog({ event: "unit_test_event", test: true });
    console.log = originalLog;
    assert(logged === true, "Emitted valid JSON structured telemetry log");

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  } finally {
    // Cleanup
    await db.delete(usageRecords).where(eq(usageRecords.workspaceId, workspaceA.id));
    await db.delete(workspaceLimits).where(eq(workspaceLimits.workspaceId, workspaceA.id));
    await db.delete(agents).where(eq(agents.workspaceId, workspaceA.id));
    await db.delete(workspaces).where(eq(workspaces.id, workspaceA.id));
    await db.delete(workspaces).where(eq(workspaces.id, workspaceB.id));
    await db.delete(users).where(eq(users.id, userA.id));
    await db.delete(users).where(eq(users.id, userB.id));
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
