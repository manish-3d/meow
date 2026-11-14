
import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

// ─── Agent Types ──────────────────────────────────────────────

export type AgentStatus = "active" | "archived";

export type WorkspaceRole = "owner" | "admin" | "member";

export type MessageRole = "user" | "assistant" | "system" | "tool";

export type ToolCallStatus =
  | "requested"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rejected";

export type ToolExecutionType = "native" | "integration" | "sandbox";

export type PermissionLevel = "read" | "write" | "dangerous";

export type MemoryType = "fact" | "preference" | "instruction" | "summary";

// ─── Users ────────────────────────────────────────────────────                            

export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

// ─── OAuth Accounts ───────────────────────────────────────────

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

// ─── Database Sessions ────────────────────────────────────────

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ─── Verification Tokens ─────────────────────────────────────

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    tokenPk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  }),
);

// ─── Workspaces ───────────────────────────────────────────────

export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    ownerUserId: text("owner_user_id")
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
    ownerUserIdIndex: index("workspaces_owner_user_id_idx").on(
      table.ownerUserId,
    ),
  }),
);

// ─── Workspace Membership ─────────────────────────────────────

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
    joinedAt: timestamp("joined_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    memberPk: primaryKey({
      columns: [table.workspaceId, table.userId],
    }),
    roleCheck: check(
      "workspace_members_role_check",
      sql`${table.role} in ('owner', 'admin', 'member')`,
    ),
    userIdIndex: index("workspace_members_user_id_idx").on(table.userId),
  }),
);

// ─── Agents ───────────────────────────────────────────────────

export const agents = pgTable(
  "agents",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

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
    workspaceIndex: index("agents_workspace_id_idx").on(table.workspaceId),
    statusCheck: check(
      "agents_status_check",
      sql`${table.status} in ('active', 'archived')`,
    ),
  }),
);

// ─── Agent Versions ───────────────────────────────────────────

export const agentVersions = pgTable(
  "agent_versions",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

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

    agentIndex: index("agent_versions_agent_id_idx").on(table.agentId),

    versionCheck: check(
      "agent_versions_version_check",
      sql`${table.version} > 0`,
    ),
  }),
);

// ─── Conversations ────────────────────────────────────────────

export const conversations = pgTable(
  "conversations",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),

    agentVersionId: text("agent_version_id")
      .notNull()
      .references(() => agentVersions.id, { onDelete: "restrict" }),

    title: text("title").notNull().default("New Conversation"),

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
    workspaceIndex: index("conversations_workspace_id_idx").on(
      table.workspaceId,
    ),
    agentIndex: index("conversations_agent_id_idx").on(table.agentId),
    createdByIndex: index("conversations_created_by_idx").on(table.createdBy),
  }),
);

// ─── Messages ─────────────────────────────────────────────────

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),

    role: text("role").$type<MessageRole>().notNull(),

    content: text("content").notNull(),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    conversationIndex: index("messages_conversation_id_idx").on(
      table.conversationId,
    ),
    createdAtIndex: index("messages_created_at_idx").on(table.createdAt),
    roleCheck: check(
      "messages_role_check",
      sql`${table.role} in ('user', 'assistant', 'system', 'tool')`,
    ),
  }),
);

// ─── Tool Calls ───────────────────────────────────────────────

export const toolCalls = pgTable(
  "tool_calls",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

    messageId: text("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),

    callId: text("call_id").notNull(),

    name: text("name").notNull(),

    arguments: jsonb("arguments")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    result: jsonb("result").$type<Record<string, unknown>>(),

    status: text("status")
      .$type<ToolCallStatus>()
      .notNull()
      .default("completed"),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    messageIndex: index("tool_calls_message_id_idx").on(table.messageId),
    statusCheck: check(
      "tool_calls_status_check",
      sql`${table.status} in ('requested', 'approved', 'executing', 'completed', 'failed', 'rejected')`,
    ),
  }),
);

// ─── Tools Catalog ────────────────────────────────────────────

export const tools = pgTable(
  "tools",
  {
    id: text("id").primaryKey(), // e.g. 'web_search', 'read_url', 'execute_code'

    name: text("name").notNull(),

    description: text("description").notNull(),

    inputSchema: jsonb("input_schema")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    executionType: text("execution_type")
      .$type<ToolExecutionType>()
      .notNull()
      .default("native"),

    permissionLevel: text("permission_level")
      .$type<PermissionLevel>()
      .notNull()
      .default("read"),

    requiresApproval: boolean("requires_approval").notNull().default(false),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    executionTypeCheck: check(
      "tools_execution_type_check",
      sql`${table.executionType} in ('native', 'integration', 'sandbox')`,
    ),
    permissionLevelCheck: check(
      "tools_permission_level_check",
      sql`${table.permissionLevel} in ('read', 'write', 'dangerous')`,
    ),
  }),
);

// ─── Agent Tool Bindings (Junction Table) ─────────────────────

export const agentTools = pgTable(
  "agent_tools",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),

    toolId: text("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),

    enabled: boolean("enabled").notNull().default(true),

    configOverride: jsonb("config_override")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agentToolUnique: uniqueIndex("agent_tools_agent_id_tool_id_unique").on(
      table.agentId,
      table.toolId,
    ),
    agentIndex: index("agent_tools_agent_id_idx").on(table.agentId),
    toolIndex: index("agent_tools_tool_id_idx").on(table.toolId),
  }),
);

// ─── Agent Memories (Domain B - Tier 2 Long-Term Cross-Thread) ─

export const agentMemories = pgTable(
  "agent_memories",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),

    memoryType: text("memory_type")
      .$type<MemoryType>()
      .notNull(),

    content: text("content").notNull(),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agentIdIdx: index("agent_memories_agent_id_idx").on(table.agentId),
    memoryTypeIdx: index("agent_memories_memory_type_idx").on(table.memoryType),
    memoryTypeCheck: check(
      "agent_memories_memory_type_check",
      sql`${table.memoryType} IN ('fact', 'preference', 'instruction', 'summary')`,
    ),
  }),
);

// ─── Files (Domain G - Workspace File Storage) ────────────────

export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    storageKey: text("storage_key").notNull().unique(),

    originalFilename: text("original_filename").notNull(),

    mimeType: text("mime_type").notNull(),

    sizeBytes: integer("size_bytes").notNull(),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("files_workspace_id_idx").on(table.workspaceId),
  }),
);

// ─── Document Chunks (Domain G - Vector Embeddings for RAG) ───

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),

    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    fileId: text("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    chunkIndex: integer("chunk_index").notNull(),

    content: text("content").notNull(),

    embedding: vector("embedding", { dimensions: 1536 }).notNull(),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("document_chunks_workspace_id_idx").on(table.workspaceId),
    fileIdIdx: index("document_chunks_file_id_idx").on(table.fileId),
    embeddingHnswIdx: index("document_chunks_embedding_hnsw_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

// ─── Background Jobs Table – stores async tasks (Phase 6)
export const backgroundJobs = pgTable(
  "background_jobs",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    cron: text("cron"),
    nextRunAt: timestamp("next_run_at", { mode: "date" }),
    status: text("status").notNull().default("pending"),
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

// ─── Existing Posts Table ─────────────────────────────────────

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

// ─── Inferred Types ───────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;

export type AgentVersion = typeof agentVersions.$inferSelect;
export type NewAgentVersion = typeof agentVersions.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type ToolCallRecord = typeof toolCalls.$inferSelect;
export type NewToolCallRecord = typeof toolCalls.$inferInsert;

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;

export type AgentTool = typeof agentTools.$inferSelect;
export type NewAgentTool = typeof agentTools.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type AgentMemory = typeof agentMemories.$inferSelect;
export type NewAgentMemory = typeof agentMemories.$inferInsert;

export type FileRecord = typeof files.$inferSelect;
export type NewFileRecord = typeof files.$inferInsert;

export type DocumentChunk = typeof documentChunks.$inferSelect;
export type NewDocumentChunk = typeof documentChunks.$inferInsert;

export type BackgroundJob = typeof backgroundJobs.$inferSelect;
export type NewBackgroundJob = typeof backgroundJobs.$inferInsert;

// ─── RBAC: Roles, Permissions, Assignments ────────────────────────────────────────
export const roles = pgTable(
  "roles",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    workspaceIdx: index("roles_workspace_id_idx").on(t.workspaceId),
    uniqueName: uniqueIndex("roles_workspace_name_unique").on(t.workspaceId, t.name),
  })
);

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({})
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  })
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.workspaceId] }),
  })
);

// ─── Audit Logs ────────────────────────────────────────────────────────
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    details: jsonb("details")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    timestamp: timestamp("timestamp", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    workspaceIdx: index("audit_logs_workspace_id_idx").on(t.workspaceId),
    userIdx: index("audit_logs_user_id_idx").on(t.userId),
  })
);

// ─── Inferred Types for RBAC & Audits ────────────────────────────────────
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

// ─── Workspace Plugins (Phase 8 - Plugin Marketplace) ────────────

export const workspacePlugins = pgTable(
  "workspace_plugins",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    pluginId: text("plugin_id").notNull(),
    enabled: boolean("enabled").notNull().default(false),
    config: jsonb("config")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    installedAt: timestamp("installed_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    workspaceIdx: index("workspace_plugins_workspace_id_idx").on(t.workspaceId),
    pluginUnique: uniqueIndex("workspace_plugins_workspace_plugin_unique").on(
      t.workspaceId,
      t.pluginId,
    ),
  }),
);

export const pluginManifests = pgTable(
  "plugin_manifests",
  {
    pluginId: text("plugin_id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    version: text("version").notNull().default("1.0.0"),
    category: text("category").notNull().default("productivity"),
    manifest: jsonb("manifest")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    categoryIdx: index("plugin_manifests_category_idx").on(t.category),
  }),
);

export type WorkspacePlugin = typeof workspacePlugins.$inferSelect;
export type NewWorkspacePlugin = typeof workspacePlugins.$inferInsert;
export type PluginManifest = typeof pluginManifests.$inferSelect;
export type NewPluginManifest = typeof pluginManifests.$inferInsert;

// ─── Usage, Metering & Observability (Phase 10) ──────────────────

export const usageRecords = pgTable(
  "usage_records",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    agentId: text("agent_id").references(() => agents.id, { onDelete: "set null" }),
    conversationId: text("conversation_id").references(() => conversations.id, { onDelete: "set null" }),
    model: text("model").notNull(),
    promptTokens: integer("prompt_tokens").notNull(),
    completionTokens: integer("completion_tokens").notNull(),
    totalTokens: integer("total_tokens").notNull(),
    estimatedCostUsd: numeric("estimated_cost_usd", { precision: 10, scale: 6 }).notNull(),
    durationMs: integer("duration_ms").notNull().default(0),
    status: text("status").notNull().default("success"),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    workspaceIdx: index("usage_records_workspace_id_idx").on(t.workspaceId),
    agentIdx: index("usage_records_agent_id_idx").on(t.agentId),
    createdAtIdx: index("usage_records_created_at_idx").on(t.createdAt),
  }),
);

export const workspaceLimits = pgTable(
  "workspace_limits",
  {
    workspaceId: text("workspace_id")
      .primaryKey()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    monthlyTokenBudget: integer("monthly_token_budget").notNull().default(2000000),
    monthlySpendLimitUsd: numeric("monthly_spend_limit_usd", { precision: 10, scale: 2 })
      .notNull()
      .default("50.00"),
    currentMonthTokens: integer("current_month_tokens").notNull().default(0),
    currentMonthSpendUsd: numeric("current_month_spend_usd", { precision: 10, scale: 6 })
      .notNull()
      .default("0.000000"),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
);

export type UsageRecord = typeof usageRecords.$inferSelect;
export type NewUsageRecord = typeof usageRecords.$inferInsert;
export type WorkspaceLimit = typeof workspaceLimits.$inferSelect;
export type NewWorkspaceLimit = typeof workspaceLimits.$inferInsert;

// ─── Billing, Subscriptions & Workspace Settings ──────────────

export type SubscriptionPlan = "free" | "pro" | "enterprise";
export type SubscriptionStatus = "active" | "past_due" | "canceled";

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id")
      .notNull()
      .unique()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    plan: text("plan").$type<SubscriptionPlan>().notNull().default("free"),
    status: text("status").$type<SubscriptionStatus>().notNull().default("active"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    currentPeriodStart: timestamp("current_period_start", { mode: "date" })
      .defaultNow()
      .notNull(),
    currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    workspaceIdx: index("subscriptions_workspace_id_idx").on(t.workspaceId),
  }),
);

export const invoices = pgTable(
  "invoices",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull(),
    amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("paid"),
    description: text("description").notNull(),
    paidAt: timestamp("paid_at", { mode: "date" }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    workspaceIdx: index("invoices_workspace_id_idx").on(t.workspaceId),
  }),
);

export const workspaceSettings = pgTable(
  "workspace_settings",
  {
    workspaceId: text("workspace_id")
      .primaryKey()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    defaultModel: text("default_model").notNull().default("gemini-1.5-flash"),
    enforceSafetyGuardrails: boolean("enforce_safety_guardrails").notNull().default(true),
    allowPublicSharing: boolean("allow_public_sharing").notNull().default(false),
    notificationEmail: text("notification_email"),
    webhookUrl: text("webhook_url"),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
);

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type WorkspaceSettings = typeof workspaceSettings.$inferSelect;
export type NewWorkspaceSettings = typeof workspaceSettings.$inferInsert;



