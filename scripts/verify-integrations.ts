/**
 * Meow - Verification Suite: Social Media & Workspace API Integrations
 * Run: npx tsx --env-file=.env scripts/verify-integrations.ts
 */

import assert from "node:assert";
import { db } from "@/db";
import { users, workspaces, workspaceMembers, workspaceIntegrations, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { IntegrationsService } from "@/lib/integrations/service";
import { ToolRegistry } from "@/lib/tools/registry";
import { SUPPORTED_INTEGRATIONS } from "@/lib/integrations/types";

async function runIntegrationsVerification() {
  console.log("================================================================================");
  console.log("🚀 Starting Meow Social Media & Workspace Integrations Verification Suite");
  console.log("================================================================================\n");

  const runId = Date.now().toString(36);
  const testEmail = `integrations-test-${runId}@example.com`;
  let testUserId: string | null = null;
  let testWorkspaceId: string | null = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Tool Registry Registration of Social Media Tools
    // -------------------------------------------------------------------------
    console.log("▶ [Test 1/5] Verifying Social Media Tools in Tool Registry...");
    ToolRegistry.init();

    const twitterPost = ToolRegistry.get("twitter_post_tweet");
    assert(twitterPost, "twitter_post_tweet tool must be registered");
    assert.strictEqual(twitterPost.requiresApproval, true, "Posting a tweet must require human approval");
    assert.strictEqual(twitterPost.executionType, "integration");

    const twitterSearch = ToolRegistry.get("twitter_search_recent");
    assert(twitterSearch, "twitter_search_recent tool must be registered");
    assert.strictEqual(twitterSearch.requiresApproval, false, "Reading/searching tweets does not require approval");

    const redditPost = ToolRegistry.get("reddit_submit_post");
    assert(redditPost, "reddit_submit_post tool must be registered");
    assert.strictEqual(redditPost.requiresApproval, true, "Submitting to reddit must require approval");

    const instaPost = ToolRegistry.get("instagram_publish_post");
    assert(instaPost, "instagram_publish_post tool must be registered");
    assert.strictEqual(instaPost.requiresApproval, true, "Publishing to Instagram must require approval");

    const ghIssue = ToolRegistry.get("github_create_issue");
    assert(ghIssue, "github_create_issue tool must be registered");
    assert.strictEqual(ghIssue.requiresApproval, true, "Creating a GitHub issue must require approval");

    console.log("  ✔ Verified Twitter, Reddit, Instagram, and GitHub tools with proper human approvals.");

    // -------------------------------------------------------------------------
    // TEST 2: Seed Test User and Workspace
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 2/5] Provisioning Test Workspace in Neon Database...");
    const [user] = await db
      .insert(users)
      .values({ email: testEmail, name: `Integrations Tester ${runId}` })
      .returning();
    testUserId = user.id;

    const [ws] = await db
      .insert(workspaces)
      .values({
        name: `Integrations Test ${runId}`,
        slug: `int-test-${runId}`,
        ownerUserId: user.id,
      })
      .returning();
    testWorkspaceId = ws.id;

    await db.insert(workspaceMembers).values({
      workspaceId: ws.id,
      userId: user.id,
      role: "owner",
    });
    console.log(`  ✔ Created Workspace ${ws.id}`);

    // -------------------------------------------------------------------------
    // TEST 3: Initial Integrations State
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 3/5] Verifying Initial Workspace Integrations Listing...");
    const initialList = await IntegrationsService.listWorkspaceIntegrations(ws.id);
    assert.strictEqual(initialList.length, Object.keys(SUPPORTED_INTEGRATIONS).length);
    for (const item of initialList) {
      assert.strictEqual(item.isConnected, false);
      assert.strictEqual(item.status, "disconnected");
    }
    console.log(`  ✔ All ${initialList.length} platforms reported as disconnected initially.`);

    // -------------------------------------------------------------------------
    // TEST 4: Connect Social Media Integrations (Twitter & Reddit)
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 4/5] Connecting Twitter / X and Reddit Integrations...");
    const twitterConn = await IntegrationsService.connectIntegration({
      workspaceId: ws.id,
      userId: user.id,
      provider: "twitter",
      credentials: {
        bearerToken: "mock_test_twitter_bearer_token",
        apiKey: "mock_api_key",
      },
      accountHandle: "@meow_agent_bot",
      accountName: "Meow Bot Official",
    });
    assert.strictEqual(twitterConn.provider, "twitter");
    assert.strictEqual(twitterConn.status, "connected");
    assert.strictEqual(twitterConn.accountHandle, "@meow_agent_bot");
    console.log("  ✔ Twitter integration connected for @meow_agent_bot");

    const redditConn = await IntegrationsService.connectIntegration({
      workspaceId: ws.id,
      userId: user.id,
      provider: "reddit",
      credentials: {
        clientId: "mock_reddit_client_id",
        clientSecret: "mock_reddit_secret",
        username: "meow_reddit_bot",
      },
      accountHandle: "u/meow_reddit_bot",
    });
    assert.strictEqual(redditConn.provider, "reddit");
    assert.strictEqual(redditConn.status, "connected");
    console.log("  ✔ Reddit integration connected for u/meow_reddit_bot");

    // Verify updated list
    const updatedList = await IntegrationsService.listWorkspaceIntegrations(ws.id);
    const twItem = updatedList.find((i) => i.provider === "twitter");
    assert(twItem && twItem.isConnected && twItem.accountHandle === "@meow_agent_bot");
    const rdItem = updatedList.find((i) => i.provider === "reddit");
    assert(rdItem && rdItem.isConnected && rdItem.accountHandle === "u/meow_reddit_bot");
    console.log("  ✔ Verified updated integration status and account handles in workspace overview");

    // -------------------------------------------------------------------------
    // TEST 5: Disconnect Integration & Audit Trail
    // -------------------------------------------------------------------------
    console.log("\n▶ [Test 5/5] Testing Disconnect and Audit Logging...");
    const disconnected = await IntegrationsService.disconnectIntegration(ws.id, user.id, "twitter");
    assert.strictEqual(disconnected, true);

    const postDisconnectList = await IntegrationsService.listWorkspaceIntegrations(ws.id);
    const twAfter = postDisconnectList.find((i) => i.provider === "twitter");
    assert(twAfter && !twAfter.isConnected);
    console.log("  ✔ Twitter successfully disconnected");

    // Check audit logs
    const logs = await db.select().from(auditLogs).where(eq(auditLogs.workspaceId, ws.id));
    const hasConnectedLog = logs.some((l) => l.action === "integration_connected");
    const hasDisconnectedLog = logs.some((l) => l.action === "integration_disconnected");
    assert(hasConnectedLog, "Audit log must contain integration_connected");
    assert(hasDisconnectedLog, "Audit log must contain integration_disconnected");
    console.log(`  ✔ Verified ${logs.length} audit trail records for integration actions`);

    console.log("\n================================================================================");
    console.log("🎉 ALL SOCIAL MEDIA & WORKSPACE INTEGRATION TESTS PASSED (5/5)!");
    console.log("================================================================================");
  } finally {
    if (testWorkspaceId) {
      console.log("\n🧹 Cleaning up test fixtures from Neon PostgreSQL...");
      await db.delete(auditLogs).where(eq(auditLogs.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(workspaceIntegrations).where(eq(workspaceIntegrations.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, testWorkspaceId)).catch(() => {});
      await db.delete(workspaces).where(eq(workspaces.id, testWorkspaceId)).catch(() => {});
    }
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId)).catch(() => {});
    }
    console.log("✔ Cleanup complete.");
  }
}

runIntegrationsVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  });

