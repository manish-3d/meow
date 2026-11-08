import { db } from "@/db";
import { sql } from "drizzle-orm";
import { backgroundJobs } from "@/db/migrations/0006_background_jobs";

/**
 * Phase 6 migration – creates the `background_jobs` table for async task scheduling.
 */
export async function migratePhase6() {
  // Ensure the pgvector extension is already present (from phase 5).
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // Run the table creation – Drizzle will generate the appropriate CREATE TABLE.
  await db.runMigrations({ migrationsFolder: "./migrations" });
}

if (require.main === module) {
  migratePhase6()
    .then(() => console.log("Phase 6 migration completed"))
    .catch(console.error)
    .finally(() => process.exit());
}
