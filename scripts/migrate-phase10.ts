/**
 * Migration 0009: Phase 10 Schema (Usage Records & Workspace Limits)
 *
 * Applies:
 * 1. usage_records table (Token & execution duration metering)
 * 2. workspace_limits table (Monthly token & spend budgets)
 * 3. Indexes on workspace_id, agent_id, created_at
 */

import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyPhase10Migration() {
  console.log("=== APPLYING MIGRATION 0009: PHASE 10 USAGE & OBSERVABILITY ===\n");

  try {
    // 1. usage_records
    console.log("1. Creating usage_records table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "usage_records" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "agent_id" text REFERENCES "agents"("id") ON DELETE SET NULL,
        "conversation_id" text REFERENCES "conversations"("id") ON DELETE SET NULL,
        "model" text NOT NULL,
        "prompt_tokens" integer NOT NULL,
        "completion_tokens" integer NOT NULL,
        "total_tokens" integer NOT NULL,
        "estimated_cost_usd" numeric(10, 6) NOT NULL,
        "duration_ms" integer DEFAULT 0 NOT NULL,
        "status" text DEFAULT 'success' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "usage_records_workspace_id_idx" 
      ON "usage_records" ("workspace_id");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "usage_records_agent_id_idx" 
      ON "usage_records" ("agent_id");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "usage_records_created_at_idx" 
      ON "usage_records" ("created_at");
    `);
    console.log("✓ usage_records table and indexes verified.");

    // 2. workspace_limits
    console.log("\n2. Creating workspace_limits table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "workspace_limits" (
        "workspace_id" text PRIMARY KEY REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "monthly_token_budget" integer DEFAULT 2000000 NOT NULL,
        "monthly_spend_limit_usd" numeric(10, 2) DEFAULT 50.00 NOT NULL,
        "current_month_tokens" integer DEFAULT 0 NOT NULL,
        "current_month_spend_usd" numeric(10, 6) DEFAULT 0.000000 NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✓ workspace_limits table verified.");

    console.log("\n=== MIGRATION 0009 SUCCESSFUL ===");
  } catch (error) {
    console.error("Migration 0009 failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  applyPhase10Migration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

