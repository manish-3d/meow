/**
 * Phase 7 Verification Test Suite
 * Tests RBAC (roles, permissions, role assignments) and audit logging trail.
 */

import { db } from "../db";
import {
  auditLogs,
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
  workspaces,
} from "../db/schema";
import { logAction } from "../lib/audit";
import { requirePermission } from "../lib/auth/require-permission";
import { eq, and } from "drizzle-orm";

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
  console.log("=== PHASE 7: RBAC & AUDIT LOGGING VERIFICATION ===");

  const [owner] = await db
    .insert(users)
    .values({ email: `owner_p7_${Date.now()}@meow.test`, name: "Workspace Owner" })
    .returning();

  const [member] = await db
    .insert(users)
    .values({ email: `member_p7_${Date.now()}@meow.test`, name: "Staff Member" })
    .returning();

  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: "RBAC Test Org",
      slug: `rbac-org-${Date.now()}`,
      ownerUserId: owner.id,
    })
    .returning();

  try {
    // Suite 1: Permissions catalog verification
    console.log("\nSuite 1: Seeded Baseline Permissions");
    const baseline = await db.select().from(permissions);
    assert(baseline.length >= 6, "At least 6 baseline permissions are seeded in database");

    const permNames = new Set(baseline.map((p) => p.name));
    assert(permNames.has("manage_plugins"), "Baseline includes 'manage_plugins'");
    assert(permNames.has("create_background_job"), "Baseline includes 'create_background_job'");
    assert(permNames.has("view_audit_logs"), "Baseline includes 'view_audit_logs'");

    // Suite 2: Role Creation & Assignment
    console.log("\nSuite 2: Role Assignment & Clearance");
    const [editorRole] = await db
      .insert(roles)
      .values({
        workspaceId: workspace.id,
        name: "Security Officer",
        description: "Can audit and inspect system actions",
      })
      .returning();

    assert(editorRole.name === "Security Officer", "Created custom workspace role");

    // Link 'view_audit_logs' permission to this role
    const [auditPerm] = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, "view_audit_logs"))
      .limit(1);

    await db.insert(rolePermissions).values({
      roleId: editorRole.id,
      permissionId: auditPerm.id,
    });

    // Assign role to member
    await db.insert(userRoles).values({
      userId: member.id,
      workspaceId: workspace.id,
      roleId: editorRole.id,
    });

    const [assigned] = await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, member.id), eq(userRoles.workspaceId, workspace.id)))
      .limit(1);

    assert(assigned?.roleId === editorRole.id, "Member assigned to Security Officer role");

    // Suite 3: Audit Logging Trail
    console.log("\nSuite 3: Immutable Audit Logging");
    await logAction({
      workspaceId: workspace.id,
      userId: owner.id,
      action: "role_created",
      targetType: "role",
      targetId: editorRole.id,
      details: { roleName: editorRole.name },
    });

    await logAction({
      workspaceId: workspace.id,
      userId: member.id,
      action: "security_scan_invoked",
      targetType: "agent",
      targetId: "agent_42",
      details: { severity: "high" },
    });

    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspace.id));

    assert(logs.length === 2, "Recorded 2 audit log entries for workspace");
    assert(logs.some((l) => l.action === "role_created"), "Recorded role_created action");
    assert(logs.some((l) => l.action === "security_scan_invoked"), "Recorded security_scan_invoked action");
    assert(logs[0].details !== null, "Audit details JSONB payload persisted");

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  } finally {
    // Teardown
    await db.delete(auditLogs).where(eq(auditLogs.workspaceId, workspace.id));
    await db.delete(userRoles).where(eq(userRoles.workspaceId, workspace.id));
    await db.delete(roles).where(eq(roles.workspaceId, workspace.id));
    await db.delete(workspaces).where(eq(workspaces.id, workspace.id));
    await db.delete(users).where(eq(users.id, owner.id));
    await db.delete(users).where(eq(users.id, member.id));
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

