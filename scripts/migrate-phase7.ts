/**
 * Migration 0007: Phase 7 Schema (RBAC & Audit Logs)
 *
 * Applies:
 * 1. roles table
 * 2. permissions table
 * 3. role_permissions junction table
 * 4. user_roles junction table
 * 5. audit_logs table
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyPhase7Migration() {
  console.log("=== APPLYING MIGRATION 0007: PHASE 7 RBAC & AUDIT LOGS ===\n");

  try {
    // 1. Roles
    console.log("1. Creating roles table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "roles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "name" text NOT NULL,
        "description" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "roles_workspace_name_unique" UNIQUE ("workspace_id", "name")
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "roles_workspace_id_idx" ON "roles" ("workspace_id");
    `);
    console.log("✓ roles table verified.");

    // 2. Permissions
    console.log("\n2. Creating permissions table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "permissions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL UNIQUE,
        "description" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✓ permissions table verified.");

    // 3. Role Permissions junction
    console.log("\n3. Creating role_permissions table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "role_permissions" (
        "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        "permission_id" uuid NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
        PRIMARY KEY ("role_id", "permission_id")
      );
    `);
    console.log("✓ role_permissions table verified.");

    // 4. User Roles junction
    console.log("\n4. Creating user_roles table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_roles" (
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        PRIMARY KEY ("user_id", "workspace_id")
      );
    `);
    console.log("✓ user_roles table verified.");

    // 5. Audit Logs
    console.log("\n5. Creating audit_logs table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "action" text NOT NULL,
        "target_type" text,
        "target_id" text,
        "details" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "timestamp" timestamp DEFAULT now() NOT NULL
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "audit_logs_workspace_id_idx" ON "audit_logs" ("workspace_id");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs" ("user_id");
    `);
    console.log("✓ audit_logs table verified.");

    // Seed default baseline permissions
    console.log("\n6. Seeding core baseline permissions...");
    const corePerms = [
      ["manage_agents", "Create, edit, version and delete agents"],
      ["manage_tools", "Enable and disable tools for agents"],
      ["manage_plugins", "Install, configure, and toggle workspace plugins"],
      ["create_background_job", "Enqueue background and scheduled async workers"],
      ["manage_memories", "Add and remove persistent agent memories"],
      ["view_audit_logs", "Inspect security and execution audit trails"],
    ];

    for (const [name, desc] of corePerms) {
      await db.execute(sql`
        INSERT INTO "permissions" ("name", "description")
        VALUES (${name}, ${desc})
        ON CONFLICT ("name") DO NOTHING;
      `);
    }
    console.log("✓ Baseline permissions seeded.");

    console.log("\n=== MIGRATION 0007 SUCCESSFUL ===");
  } catch (error) {
    console.error("Migration 0007 failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  applyPhase7Migration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

