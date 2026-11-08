/**
 * Phase 6 Verification Test Suite
 * Tests Background Task Tool, Inngest dispatch payload, and database job persistence.
 */

import { db } from "../db";
import { backgroundJobs, users, workspaces } from "../db/schema";
import { backgroundTaskTool } from "../lib/tools/builtin/background-task";
import { ToolRegistry } from "../lib/tools/registry";
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
  console.log("=== PHASE 6: DURABLE BACKGROUND WORKERS VERIFICATION ===");

  const testUser = `test_p6_${Date.now()}@meow.test`;
  const [user] = await db
    .insert(users)
    .values({ email: testUser, name: "P6 Tester" })
    .returning();

  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: "P6 Test Space",
      slug: `p6-test-${Date.now()}`,
      ownerUserId: user.id,
    })
    .returning();

  try {
    // Test 1: Tool Registry presence
    console.log("\nSuite 1: Tool Registry Binding");
    ToolRegistry.init();
    const tool = ToolRegistry.get("background_task");
    assert(tool !== undefined, "background_task tool is registered in ToolRegistry");
    assert(tool?.permissionLevel === "dangerous", "background_task is marked 'dangerous'");
    assert(tool?.requiresApproval === true, "background_task requires human approval");

    // Test 2: Execution & Database Job Creation
    console.log("\nSuite 2: Task Dispatch & Persistence");
    const result = await backgroundTaskTool.execute(
      {
        name: "test_nightly_backup",
        payload: { target: "analytics_db", compress: true },
        cron: "0 2 * * *",
      },
      {
        workspaceId: workspace.id,
        userId: user.id,
      },
    );

    const resObj = result as Record<string, unknown>;
    assert(typeof resObj.jobId === "string", "Tool execution returned valid jobId");
    assert(resObj.status === "scheduled", "Tool returned 'scheduled' status");

    const [persisted] = await db
      .select()
      .from(backgroundJobs)
      .where(eq(backgroundJobs.id, resObj.jobId as string))
      .limit(1);

    assert(persisted !== undefined, "Job record exists in background_jobs table");
    assert(persisted?.workspaceId === workspace.id, "Job is correctly scoped to workspace");
    assert(persisted?.name === "test_nightly_backup", "Job name matches");
    assert(persisted?.cron === "0 2 * * *", "Cron schedule preserved");
    assert(persisted?.status === "pending", "Initial status is 'pending'");

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  } finally {
    // Cleanup
    await db.delete(backgroundJobs).where(eq(backgroundJobs.workspaceId, workspace.id));
    await db.delete(workspaces).where(eq(workspaces.id, workspace.id));
    await db.delete(users).where(eq(users.id, user.id));
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

