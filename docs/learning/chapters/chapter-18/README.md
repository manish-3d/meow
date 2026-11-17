# Chapter 18: Tool Marketplace Hub & Agent Settings (Lifecycle & Danger Zone)

## 1. Chapter Objectives
1. Build a centralized **Tool & Integration Marketplace** dialog accessible across the entire SaaS workspace.
2. Implement bidirectional OAuth account revocation (`POST /api/tools/disconnect`) via the Composio SDK.
3. Design and enforce an **Agent Lifecycle State Machine** (`isActive: boolean`) that instantly pauses chat conversations and halts background Inngest routines.
4. Implement the **Agent Danger Zone**: a safe, sequential cascading deletion transaction that purges child tables (`agent_chat_history`, `execution_logs`, `routines`) and pauses microVM sandboxes before deleting the parent `agent_config` row.
5. Prevent PostgreSQL **Foreign Key Constraint Violations (`code 23503`)** through strict reverse-dependency execution.

---

## 2. Problem Statement

### A. Fragmented Tool Discovery and Missing Revocation
In earlier versions, tools were only visible in a sub-tab of an individual agent. Users could not browse available tools globally or disconnect a connected service if they changed OAuth accounts.
* **The Solution:** A global `MarketplaceDialog` component wired to the sidebar footer that lists all tools, categories (Communication, Productivity, Social Media, Developer), live connection status badges, and one-click Connect / Disconnect actions.

### B. The Need for a Master Agent Kill-Switch
Autonomous agents running recurring Inngest cron jobs can trigger expensive API calls or send unintended emails if misconfigured. Users need an instant kill-switch to pause an agent without destroying its configured routines.
* **The Solution:** Adding an `is_active` boolean column to `agent_config`. When toggled to `false`:
  - `app/api/agent/chat/route.ts` rejects new chat prompts with HTTP 403.
  - `lib/inngest/routine-runner.ts` skips scheduled cron runs and logs an informational notice.
  - The UI displays an amber `Paused` status banner and disables message input.

### C. Foreign Key Violations on Agent Deletion
In PostgreSQL, `agent_config.agent_id` is referenced as a foreign key by:
- `routines` (`agent_id`)
- `agent_chat_history` (`agent_id`)
- `execution_logs` (`agent_id` and `routine_id`)

Executing a direct `DELETE FROM agent_config WHERE agent_id = '...'` triggers an immediate PostgreSQL foreign key constraint violation (`code 23503`).
* **The Solution:** An ordered cascading deletion API (`DELETE /api/agent?agentId=...`) that deletes descendant records in reverse dependency order before removing the root agent.

---

## 3. Core Theoretical Concepts

### A. Referential Integrity & Foreign Key Constraints
A foreign key constraint enforces that a column's values must exist in the primary key of another table:
$$\text{Child Table Foreign Key} \implies \text{Parent Table Primary Key}$$
If an application attempts to delete a parent row while child rows still reference it:
$$\text{DELETE Parent} \quad \xrightarrow{\text{Foreign Key Reference Exists}} \quad \text{ABORT with SQL 23503}$$

#### Resolution Strategies:
1. **DB-Level Cascade (`ON DELETE CASCADE`):** The database handles child deletions automatically. However, this bypasses application business logic (such as terminating external E2B microVMs or logging audit trails).
2. **Application-Level Sequential Cascade:** The API route deletes children in strict reverse-dependency order:
   $$\text{MicroVM Pause} \rightarrow \text{execution\_logs} \rightarrow \text{routines} \rightarrow \text{agent\_chat\_history} \rightarrow \text{agent\_config}$$

### B. OAuth Refresh Token Revocation
Disconnecting a tool cannot merely clear a flag in the UI. The platform must invoke the OAuth provider's token revocation endpoint (via Composio's `connectedAccounts.delete`) so that the authorization server invalidates the refresh token.

### C. Agent State Machine
```
[Agent Initialized] ──► [Active (isActive: true)]
                             │        ▲
               User toggles  │        │ User toggles
               Pause switch  ▼        │ Resume switch
                        [Paused (isActive: false)]
                             │
                             ▼ User confirms Danger Zone
                        [Permanently Purged]
```

---

## 4. Architecture & Execution Flow

```
User Clicks "Delete Agent"
           │
           ▼
[Danger Zone Modal] ──► User types agent name to confirm
           │
           ▼ HTTP DELETE /api/agent?agentId=...
[Next.js API Gateway]
           │
           ├─► 1. Verify User Ownership via getServerSession
           ├─► 2. Pause/Stop E2B Cloud Sandbox (lib/e2b/client.ts)
           ├─► 3. DELETE FROM execution_logs WHERE agent_id = ...
           ├─► 4. DELETE FROM routines WHERE agent_id = ...
           ├─► 5. DELETE FROM agent_chat_history WHERE agent_id = ...
           └─► 6. DELETE FROM agent_config WHERE agent_id = ...
                       │
                       ▼ 200 OK
[Client Redirects to /workspace]
```

---

## 5. File Walkthrough

### 1. `db/schema.ts` & `types/agent.ts`
- Added `isActive: boolean("is_active").default(true).notNull()` to `agentConfig`.
- Pushed to Neon PostgreSQL via `npm run db:push`.
- Updated TypeScript interface `AgentConfigType` with `isActive?: boolean`.

### 2. `app/api/agent/route.ts`
- **`PUT` Endpoint:** Supports updating `isActive` alongside `name`, `description`, and `agentImage`.
- **`DELETE` Endpoint:** Validates ownership and executes reverse-dependency deletion:
  1. Pauses E2B microVM if active.
  2. Purges `executionLogs` by `agentId`.
  3. Purges `routines` by `agentId`.
  4. Purges `agentChatHistory` by `agentId`.
  5. Purges `agentConfig` by `agentId` and `userEmail`.

### 3. `lib/composio/client.ts` & `app/api/tools/disconnect/route.ts`
- Implemented `disconnectUserConnection(userId, toolkitSlug)`.
- Added `POST /api/tools/disconnect` route handler to revoke connected accounts on demand.

### 4. `components/custom/workspace/marketplace-dialog.tsx`
- Full-screen catalog modal displaying all 15 platform tools.
- Real-time search by keyword and category filters (`All`, `Connected`, `Communication`, `Productivity`, `Social Media`, `Developer`).
- Live Connect / Disconnect buttons with asynchronous feedback.

### 5. `components/custom/agent-space/setting-tab.tsx`
- **Status Toggle Switch:** Allows toggling between `Active` and `Paused`.
- **Danger Zone Section:** Red destructive card with a double-confirmation modal requiring the user to type the agent name before deletion.

### 6. `components/custom/agent-space/chat-panel.tsx`
- Displays an amber warning banner when the agent is paused.
- Disables message textarea and prompt chips to prevent interaction with paused agents.

### 7. `lib/inngest/routine-runner.ts`
- Checks `agent.isActive` before invoking Gemini.
- If paused, logs a completion notice in `execution_logs` and halts execution without making LLM calls.

---

## 6. Testing & Verification
1. **TypeScript Build:** `npx tsc --noEmit` exited with code 0 (zero errors).
2. **Database Push:** `npm run db:push` verified column `is_active` applied to Neon PostgreSQL.
3. **Integration Test Script (`scripts/test-chapter18.cjs`):**
   - Verified toggling `is_active` (`true` $\rightarrow$ `false` $\rightarrow$ `true`).
   - Verified tool catalog retrieval (15 active integrations).
   - Created a temporary agent with child routines, logs, and chat messages, then executed the cascading deletion sequence, verifying zero orphan records remained.

---

## 7. Engineering Trade-offs
1. **Soft Delete vs. Hard Cascading Delete:**
   - Soft deletes (`deleted_at: timestamp`) preserve historical data for audit/compliance.
   - For a SaaS agent platform, users expect "Delete Agent" to purge API tokens, conversation secrets, and automated tasks completely. We implemented hard cascading deletion with double confirmation to guarantee complete privacy and zero orphan cron executions.
2. **Client-Side vs. Database-Level Cascade:**
   - DB-level cascades (`ON DELETE CASCADE`) are faster but cannot execute side-effects (like pausing cloud microVMs).
   - Application-level cascades allow coordinating third-party cloud infrastructure (E2B sandbox teardown) before committing SQL deletions.
