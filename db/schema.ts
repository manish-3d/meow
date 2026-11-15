import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ─── Users Table (Chapter 4) ──────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  name: text("name"),
  email: text("email").notNull().unique(),
  credits: integer("credits").default(5).notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

// ─── Agent Config Table (Chapter 6) ───────────────────────────
export const agentConfig = pgTable("agent_config", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  agentImage: text("agent_image"),
  userEmail: text("user_email")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

// ─── Tools Table (Chapter 10) ─────────────────────────────────
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
});

// ─── Routines / Schedule Table (Inngest Crons) ────────────────
export const routines = pgTable("routines", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  agentId: text("agent_id")
    .notNull()
    .references(() => agentConfig.agentId, { onDelete: "cascade" }),
  userEmail: text("user_email").notNull(),
  title: text("title").notNull(),
  instruction: text("instruction").notNull(),
  frequency: text("frequency").default("daily").notNull(),
  time: text("time").default("08:00 AM").notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  status: text("status").default("active").notNull(),
  lastRunAt: timestamp("last_run_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

// ─── Messages History Table (Chapter 9) ───────────────────────
export const messages = pgTable("messages", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  agentId: text("agent_id")
    .notNull()
    .references(() => agentConfig.agentId, { onDelete: "cascade" }),
  userEmail: text("user_email").notNull(),
  role: text("role").notNull(), // 'user' | 'agent' | 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});
