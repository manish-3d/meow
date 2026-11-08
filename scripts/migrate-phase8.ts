/**
 * Migration 0008: Phase 8 Schema (Plugin Marketplace & Integrations)
 *
 * Applies:
 * 1. workspace_plugins table
 * 2. plugin_manifests table
 * 3. Seed default marketplace catalog
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyPhase8Migration() {
  console.log("=== APPLYING MIGRATION 0008: PHASE 8 PLUGIN MARKETPLACE ===\n");

  try {
    // 1. workspace_plugins
    console.log("1. Creating workspace_plugins table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "workspace_plugins" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "plugin_id" text NOT NULL,
        "enabled" boolean DEFAULT false NOT NULL,
        "config" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "installed_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "workspace_plugins_workspace_plugin_unique" UNIQUE ("workspace_id", "plugin_id")
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "workspace_plugins_workspace_id_idx" 
      ON "workspace_plugins" ("workspace_id");
    `);
    console.log("✓ workspace_plugins table verified.");

    // 2. plugin_manifests
    console.log("\n2. Creating plugin_manifests table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "plugin_manifests" (
        "plugin_id" text PRIMARY KEY,
        "name" text NOT NULL,
        "description" text NOT NULL,
        "version" text DEFAULT '1.0.0' NOT NULL,
        "category" text DEFAULT 'productivity' NOT NULL,
        "manifest" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "plugin_manifests_category_idx" 
      ON "plugin_manifests" ("category");
    `);
    console.log("✓ plugin_manifests table verified.");

    console.log("\n=== MIGRATION 0008 SUCCESSFUL ===");
  } catch (error) {
    console.error("Migration 0008 failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  applyPhase8Migration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

