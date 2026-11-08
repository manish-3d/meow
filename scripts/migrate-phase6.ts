/**
 * Migration 0006: Phase 6 Schema (Background Jobs Table)
 *
 * Applies:
 * 1. background_jobs table for Inngest asynchronous background task queues
 * 2. Indexes for workspace_id lookups
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyPhase6Migration() {
  console.log("=== APPLYING MIGRATION 0006: PHASE 6 BACKGROUND JOBS ===\n");

  try {
    console.log("1. Creating background_jobs table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "background_jobs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "name" text NOT NULL,
        "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "cron" text,
        "next_run_at" timestamp,
        "status" text DEFAULT 'pending' NOT NULL,
        "description" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "background_jobs_workspace_id_idx" 
      ON "background_jobs" ("workspace_id");
    `);

    console.log("✓ background_jobs table and indexes verified.");

    const checkResult = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'background_jobs';
    `);
    console.log(`\nVerified ${checkResult.length} columns in 'background_jobs'.`);
    console.log("\n=== MIGRATION 0006 SUCCESSFUL ===");
  } catch (error) {
    console.error("Migration 0006 failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  applyPhase6Migration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
