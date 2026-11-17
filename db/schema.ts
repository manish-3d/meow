import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  credits: integer("credits").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentConfig = pgTable("agent_config", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  agentImage: text("agent_image"),
  userEmail: text("user_email")
    .notNull()
    .references(() => users.email),
  // E2B Cloud VM Desktop Sandbox state (Chapter 17)
  e2bSandboxId: varchar("e2b_sandbox_id", { length: 255 }),
  vmStatus: varchar("vm_status", { length: 50 }).default("inactive").notNull(),
  vmLastActive: timestamp("vm_last_active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AgentConfig = typeof agentConfig.$inferSelect;
export type NewAgentConfig = typeof agentConfig.$inferInsert;

// Tools table — stores available Composio tool integrations
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  authType: varchar("auth_type", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;

// Routines table — scheduled automation routines configured for agents
export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  routineId: varchar("routine_id", { length: 255 }).notNull().unique(),
  agentId: varchar("agent_id", { length: 255 })
    .notNull()
    .references(() => agentConfig.agentId),
  userEmail: text("user_email")
    .notNull()
    .references(() => users.email),
  title: varchar("title", { length: 255 }).notNull(),
  prompt: text("prompt").notNull(),
  frequency: varchar("frequency", { length: 100 }).default("daily").notNull(),
  scheduledTime: varchar("scheduled_time", { length: 100 }).default("08:00 AM UTC").notNull(),
  timezone: varchar("timezone", { length: 100 }).default("UTC").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Routine = typeof routines.$inferSelect;
export type NewRoutine = typeof routines.$inferInsert;

// Execution logs table — historical records of background routine runs
export const executionLogs = pgTable("execution_logs", {
  id: serial("id").primaryKey(),
  executionId: varchar("execution_id", { length: 255 }).notNull().unique(),
  routineId: varchar("routine_id", { length: 255 }).notNull(),
  agentId: varchar("agent_id", { length: 255 }).notNull(),
  userEmail: text("user_email").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'running' | 'completed' | 'failed'
  resultSummary: text("result_summary"),
  error: text("error"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type ExecutionLog = typeof executionLogs.$inferSelect;
export type NewExecutionLog = typeof executionLogs.$inferInsert;

// Agent chat history table — persistent conversation messages per agent
export const agentChatHistory = pgTable("agent_chat_history", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id", { length: 255 })
    .notNull()
    .references(() => agentConfig.agentId),
  userEmail: text("user_email")
    .notNull()
    .references(() => users.email),
  role: varchar("role", { length: 50 }).notNull(), // 'user' | 'agent'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AgentChatHistory = typeof agentChatHistory.$inferSelect;
export type NewAgentChatHistory = typeof agentChatHistory.$inferInsert;
