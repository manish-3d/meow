/**
 * Migration 0011: Workspace Integrations (Social Media & Dev Platforms)
 *
 * Applies:
 * 1. workspace_integrations table
 * 2. Indexes: workspaceIdx, uniqueProvider
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyIntegrationsMigration() {
  console.log("=== APPLYING MIGRATION 0011: WORKSPACE INTEGRATIONS ===\n");

  try {
    console.log("1. Creating workspace_integrations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "workspace_integrations" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "provider" text NOT NULL,
        "status" text DEFAULT 'connected' NOT NULL,
        "account_handle" text,
        "account_name" text,
        "credentials" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "workspace_integrations_workspace_id_idx" 
      ON "workspace_integrations" ("workspace_id");
    `);

    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "workspace_integrations_workspace_provider_unique" 
      ON "workspace_integrations" ("workspace_id", "provider");
    `);

    console.log("✓ workspace_integrations table and indexes successfully verified.");
    console.log("\n=== MIGRATION 0011 COMPLETED SUCCESSFULLY ===");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

applyIntegrationsMigration();
