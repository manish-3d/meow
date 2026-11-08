/**
 * Phase 8 Verification Test Suite
 * Tests Plugin Marketplace catalog, installation, enable/disable toggling,
 * uninstallation, tenant isolation, and audit logging.
 */

import { db } from "../db";
import {
  auditLogs,
  pluginManifests,
  users,
  workspacePlugins,
  workspaces,
} from "../db/schema";
import { PluginManager } from "../lib/plugins/manager";
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
  console.log("=== PHASE 8: PLUGIN MARKETPLACE & EXTENSIBILITY VERIFICATION ===");

  const [userA] = await db
    .insert(users)
    .values({ email: `user_p8a_${Date.now()}@meow.test`, name: "Tenant A" })
    .returning();

  const [userB] = await db
    .insert(users)
    .values({ email: `user_p8b_${Date.now()}@meow.test`, name: "Tenant B" })
    .returning();

  const [workspaceA] = await db
    .insert(workspaces)
    .values({
      name: "Workspace Alpha",
      slug: `ws-alpha-${Date.now()}`,
      ownerUserId: userA.id,
    })
    .returning();

  const [workspaceB] = await db
    .insert(workspaces)
    .values({
      name: "Workspace Beta",
      slug: `ws-beta-${Date.now()}`,
      ownerUserId: userB.id,
    })
    .returning();

  try {
    // Suite 1: Catalog Sync & Retrieval
    console.log("\nSuite 1: Marketplace Catalog");
    const catalog = await PluginManager.getMarketplace();
    assert(catalog.length >= 4, "Marketplace returns at least 4 catalog plugins");

    const pluginIds = new Set(catalog.map((p) => p.pluginId));
    assert(pluginIds.has("google-workspace"), "Marketplace includes 'google-workspace'");
    assert(pluginIds.has("github-integration"), "Marketplace includes 'github-integration'");
    assert(pluginIds.has("python-sandbox"), "Marketplace includes 'python-sandbox'");

    // Suite 2: Plugin Installation & Audit
    console.log("\nSuite 2: Plugin Installation");
    const installed = await PluginManager.installPlugin(
      workspaceA.id,
      userA.id,
      "google-workspace",
      { autoSync: true },
    );

    assert(installed.pluginId === "google-workspace", "google-workspace installed in Workspace A");
    assert(installed.enabled === true, "Plugin enabled by default on initial install");

    // Suite 3: Tenant Isolation
    console.log("\nSuite 3: Multi-Tenant Plugin Isolation");
    const wsAPlugins = await PluginManager.getInstalledPlugins(workspaceA.id);
    const wsBPlugins = await PluginManager.getInstalledPlugins(workspaceB.id);

    assert(wsAPlugins.length === 1, "Workspace A has exactly 1 plugin installed");
    assert(wsBPlugins.length === 0, "Workspace B has 0 plugins installed (strict tenant isolation)");

    // Suite 4: Toggle Plugin
    console.log("\nSuite 4: Enable / Disable Toggle");
    const disabled = await PluginManager.setPluginEnabled(
      workspaceA.id,
      userA.id,
      "google-workspace",
      false,
    );
    assert(disabled.enabled === false, "Plugin successfully toggled to disabled");

    const reEnabled = await PluginManager.setPluginEnabled(
      workspaceA.id,
      userA.id,
      "google-workspace",
      true,
    );
    assert(reEnabled.enabled === true, "Plugin successfully re-enabled");

    // Suite 5: Audit Log Verifications
    console.log("\nSuite 5: Plugin Lifecycle Audit Trail");
    const auditEntries = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceA.id));

    assert(auditEntries.length >= 3, "Recorded at least 3 audit events for plugin actions");
    assert(auditEntries.some((a) => a.action === "plugin_installed"), "Audit log recorded 'plugin_installed'");
    assert(auditEntries.some((a) => a.action === "plugin_disabled"), "Audit log recorded 'plugin_disabled'");
    assert(auditEntries.some((a) => a.action === "plugin_enabled"), "Audit log recorded 'plugin_enabled'");

    // Suite 6: Uninstall
    console.log("\nSuite 6: Uninstallation");
    const uninstalled = await PluginManager.uninstallPlugin(
      workspaceA.id,
      userA.id,
      "google-workspace",
    );
    assert(uninstalled === true, "Plugin successfully uninstalled");

    const remaining = await PluginManager.getInstalledPlugins(workspaceA.id);
    assert(remaining.length === 0, "0 plugins remaining after uninstall");

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  } finally {
    // Teardown
    await db.delete(workspacePlugins).where(eq(workspacePlugins.workspaceId, workspaceA.id));
    await db.delete(auditLogs).where(eq(auditLogs.workspaceId, workspaceA.id));
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

