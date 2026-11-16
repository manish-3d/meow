# Chapter 16: Persistent Chat History & In-App Routine Delivery

## 1. Chapter Objectives
1. Understand how to implement conversational persistence in stateless Next.js App Router applications.
2. Build relational storage for chat threads using Neon PostgreSQL and Drizzle ORM (`agent_chat_history` table).
3. Connect frontend streaming with backend persistence without incurring per-chunk database write penalties.
4. Implement the "Agent Inbox" pattern: delivering Inngest background routine briefings directly into the conversation thread.
5. Provide client hydration and conversation reset functionality.

---

## 2. Problem Statement
In earlier iterations of Meow Bot, chat messages were held only in React local state (`useState`). This caused two critical product flaws:
1. **Volatile Conversations:** Refreshing the browser or switching between agents wiped the conversation.
2. **Disconnected Autonomous Execution:** When Inngest executed background routines, results were saved only to `execution_logs`. The user had to know to navigate to the Schedule tab to read the report.

**The Solution:**
1. A durable `agent_chat_history` table keyed to `agentId` and `userEmail`.
2. Automatic hydration on component mount (`GET /api/agent/chat/history`).
3. Single-transaction database writes upon stream completion (`onFinish`).
4. Dual-channel routine delivery: writing both to `execution_logs` (for audit) and `agent_chat_history` (for proactive briefing delivery).

---

## 3. Core Theoretical Concepts

### A. Stateless Next.js API Routes & Stream Persistence
In HTTP streaming (Vercel AI SDK `streamText`), tokens are generated incrementally over 2 to 10 seconds. Writing each token to the database would overload PostgreSQL with hundreds of single-character write operations.
* **The Pattern:** We buffer the stream in memory. When the stream finishes, the `onFinish: async ({ text }) => { ... }` lifecycle hook commits the aggregated text to PostgreSQL in a single atomic SQL `INSERT`.

### B. The Agent Inbox Pattern
Instead of forcing the user to poll audit logs, the autonomous background engine (`routine-runner.ts`) acts as a participant in the conversation. When an automated briefing completes at 8:00 AM, the runner writes an agent message directly into `agent_chat_history`. When the user logs in, the briefing is waiting at the bottom of the timeline.

---

## 4. Architecture & Data Flow

```
[User Browser]
      │
      ├─► 1. Mount: GET /api/agent/chat/history?agentId=...
      │       Hydrates past messages into timeline
      │
      ├─► 2. Send: User types "Summarize my emails"
      │       Optimistic UI render (0ms latency)
      │
      ▼ 3. POST /api/agent/chat
[Next.js route.ts]
      ├─► 4. Atomic INSERT: user message to agent_chat_history
      ├─► 5. Streams Gemini 3 Flash response to browser
      └─► 6. onFinish Hook: Atomic INSERT of assistant response
```

---

## 5. File Walkthrough

### 1. `db/schema.ts` (`agentChatHistory`)
```typescript
export const agentChatHistory = pgTable("agent_chat_history", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id", { length: 255 }).notNull().references(() => agentConfig.agentId),
  userEmail: text("user_email").notNull().references(() => users.email),
  role: varchar("role", { length: 50 }).notNull(), // 'user' | 'agent'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```
* **Foreign Keys:** References `agentConfig.agentId` and `users.email` to maintain relational integrity and tenant isolation.

### 2. `app/api/agent/chat/history/route.ts`
* **GET:** Authenticates session via `getServerSession`, queries `agentChatHistory` ordered by `createdAt ASC`, and formats timestamps.
* **DELETE:** Clears conversation history for the current agent and authenticated user.

### 3. `app/api/agent/chat/route.ts`
* Inserts the incoming user prompt before streaming.
* Uses `onFinish` in `streamText` to write the finalized assistant message once generation completes.

### 4. `lib/inngest/routine-runner.ts`
* Appends completed background briefings into `agent_chat_history` with title header `🤖 Autonomous Routine Completed: ...`.

### 5. `components/custom/agent-space/chat-panel.tsx`
* Hydrates messages on `agentId` change.
* Persists "Reset" actions via `DELETE /api/agent/chat/history`.

---

## 6. Testing & Verification
* **TypeScript Build:** `npx tsc --noEmit` exited with code 0 (zero errors).
* **Database Verification (`scripts/test-chat-history.cjs`):** Inserted and retrieved real user and agent records from Neon PostgreSQL, verifying order and timestamping.

---

## 7. Engineering Trade-offs
1. **Full Message History vs. Summary Windows:**
   * Currently, we fetch full conversation history for the active agent. At high scale (>1,000 messages), we would paginate with a cursor (`WHERE id < :cursor LIMIT 50`) or summarize older messages to save bandwidth and UI DOM memory.
2. **Client Polling vs. Server-Sent Events for Background Messages:**
   * Routine briefings are fetched when the user opens or refreshes the chat. For real-time updates while a user has the chat open during an execution, the Schedule tab auto-polls every 2.5 seconds.
