import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Background Jobs table – stores scheduled/invoked async tasks.
export const backgroundJobs = pgTable(
  "background_jobs",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    // JSON payload that will be passed to the Inngest function.
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    // Optional cron expression for recurring jobs.
    cron: text("cron"),
    // Timestamp of the next scheduled run (computed by Inngest).
    nextRunAt: timestamp("next_run_at", { mode: "date" }),
    // Current status – pending, running, succeeded, failed.
    status: text("status").notNull().default("pending"),
    // Optional human readable description.
    description: text("description"),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    workspaceIdx: index("background_jobs_workspace_id_idx").on(t.workspaceId),
  })
);
