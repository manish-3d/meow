import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
export type AgentStatus = "active" | "archived";

export const agents = pgTable(
  "agents",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),

    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    description: text("description"),

    status: text("status")
      .$type<AgentStatus>()
      .notNull()
      .default("active"),

    createdBy: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceIndex: index("agents_workspace_id_idx").on(
      table.workspaceId,
    ),
    statusCheck: check(
      "agents_status_check",
      sql`${table.status} in ('active', 'archived')`,
    ),
  }),
);

export const agentVersions = pgTable(
  "agent_versions",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),

    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),

    version: integer("version").notNull(),

    instructions: text("instructions").notNull(),

    model: text("model").notNull(),

    config: jsonb("config")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdBy: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agentVersionUnique: uniqueIndex(
      "agent_versions_agent_version_unique",
    ).on(table.agentId, table.version),

    agentIndex: index("agent_versions_agent_id_idx").on(
      table.agentId,
    ),

    versionCheck: check(
      "agent_versions_version_check",
      sql`${table.version} > 0`,
    ),
  }),
);

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;

export type AgentVersion = typeof agentVersions.$inferSelect;
export type NewAgentVersion = typeof agentVersions.$inferInsert;
export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerAccountPk: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
    userIdIndex: index("accounts_user_id_idx").on(table.userId),
  }),
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    tokenPk: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);

export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    ownerUserIdIndex: index("workspaces_owner_user_id_idx").on(table.ownerUserId),
  }),
);

export type WorkspaceRole = "owner" | "admin" | "member";

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").$type<WorkspaceRole>().notNull().default("member"),
    joinedAt: timestamp("joined_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    memberPk: primaryKey({ columns: [table.workspaceId, table.userId] }),
    roleCheck: check(
      "workspace_members_role_check",
      sql`${table.role} in ('owner', 'admin', 'member')`,
    ),
    userIdIndex: index("workspace_members_user_id_idx").on(table.userId),
  }),
);

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
