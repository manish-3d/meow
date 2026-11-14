/**
 * Migration 0010: Subscriptions, Invoices & Workspace Settings
 *
 * Applies:
 * 1. subscriptions table
 * 2. invoices table
 * 3. workspace_settings table
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyBillingMigration() {
  console.log("=== APPLYING MIGRATION 0010: BILLING, PLANS & SETTINGS ===\n");

  try {
    // 1. Subscriptions
    console.log("1. Creating subscriptions table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "workspace_id" text NOT NULL UNIQUE REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "plan" text DEFAULT 'free' NOT NULL,
        "status" text DEFAULT 'active' NOT NULL,
        "stripe_customer_id" text,
        "stripe_subscription_id" text,
        "current_period_start" timestamp DEFAULT now() NOT NULL,
        "current_period_end" timestamp,
        "cancel_at_period_end" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "subscriptions_workspace_id_idx" 
      ON "subscriptions" ("workspace_id");
    `);
    console.log("✓ subscriptions table verified.");

    // 2. Invoices
    console.log("\n2. Creating invoices table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "invoices" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "invoice_number" text NOT NULL,
        "amount_usd" numeric(10, 2) NOT NULL,
        "status" text DEFAULT 'paid' NOT NULL,
        "description" text NOT NULL,
        "paid_at" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "invoices_workspace_id_idx" 
      ON "invoices" ("workspace_id");
    `);
    console.log("✓ invoices table verified.");

    // 3. Workspace Settings
    console.log("\n3. Creating workspace_settings table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "workspace_settings" (
        "workspace_id" text PRIMARY KEY REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "default_model" text DEFAULT 'gemini-1.5-flash' NOT NULL,
        "enforce_safety_guardrails" boolean DEFAULT true NOT NULL,
        "allow_public_sharing" boolean DEFAULT false NOT NULL,
        "notification_email" text,
        "webhook_url" text,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✓ workspace_settings table verified.");

    console.log("\n=== MIGRATION 0010 SUCCESSFUL ===");
  } catch (error) {
    console.error("Migration 0010 failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  applyBillingMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

