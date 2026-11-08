# Meow — Engineering Learning Log

A persistent record of software engineering concepts, design decisions, architectural trade-offs, and lessons learned during the development of Meow.

---

## Phase 3: Agent Runtime & Reasoning Engine

### Module 3.1: Provider Abstraction Layer
- **Iteration 1: Universal Contract Definition (`lib/ai/types.ts`)**
  - **Concepts Learned**: Interface-driven architecture, Data Normalization, Discriminated Unions for streaming events.
  - **Key Decisions**:
    - Normalized tool arguments to `Record<string, unknown>` at the adapter boundary rather than raw JSON strings.
    - Used discriminated union for `StreamChunk` (`text_delta`, `tool_call_start`, `tool_call_delta`, `tool_call_finish`, `done`).
    - Standardized domain errors via `AIProviderError` with explicit `isRetryable` flags for intelligent backoff.
  - **Status**: Implemented & verified via TypeScript compiler (`tsc --noEmit`).

- **Iteration 2: Provider Factory & Registry (`lib/ai/factory.ts`)**
  - **Concepts Learned**: Registry Pattern, Open-Closed Principle, Lazy Singleton Caching, Fail-Fast Architecture.
  - **Key Decisions**:
    - Model resolution based on prefix pattern matching (`gemini-*`, `gpt-*`, `claude-*`, `ollama/*`).
    - Inversion of Control: Factory allows dynamic provider registration (`registerProvider`) enabling mock injection in tests without hitting third-party APIs.
    - Never silently substitute unknown models; throws explicit `AIProviderError` with HTTP 400/501 status hints.
  - **Status**: Implemented & verified via TypeScript compiler (`tsc --noEmit`).

- **Iteration 3: OpenAI-Compatible Adapter & SSE Stream Engine (`lib/ai/adapters/openai.ts`)**
  - **Concepts Learned**: Universal Wire Protocol (`/v1/chat/completions`), Server-Sent Events (SSE), TCP packet fragmentation & line buffering, Discriminated stream events, HTTP error classification.
  - **Key Decisions**:
    - Built via native `fetch` with `ReadableStream` and `AsyncIterable` generator: zero new external packages, 100% Edge and Node compatible.
    - Implemented TCP line buffer to reliably reconstruct split SSE lines across network packet boundaries.
    - Added automated verification suite ([`scripts/verify-phase3-provider.ts`](scripts/verify-phase3-provider.ts)) testing model resolution, mock provider registration, tool ingress/egress, split-packet SSE reassembly, and HTTP status code retryability.
  - **Status**: Complete & Verified (19/19 tests passed).

### Module 3.2: Dynamic Prompt Compilation Pipeline (`lib/ai/compiler.ts`)
- **Iteration 1: 5-Layer Prompt Synthesis Engine**
  - **Concepts Learned**: Dynamic Context Assembly, Indirect Prompt Injection Defense (`<untrusted_tool_data>`), Semantic Memory Categorization, Sliding-Window Token Budgeting.
  - **Key Decisions**:
    - Separated raw user inputs from system guidelines and quarantined tool outputs.
    - Structured agent memories into prefixed tags (`[PREFERENCE]`, `[FACT]`) for high model adherence.
    - Added sliding window truncation to keep the most recent N messages without losing the primary system instructions.
    - Output conforms directly to the universal `ModelRequest` contract required by `AIProvider`.
  - **Status**: Complete & Verified via [`scripts/verify-phase3-compiler.ts`](scripts/verify-phase3-compiler.ts) (14/14 tests passed).

### Module 3.3: Domain C Database Schema (Migration 0003)
- **Concepts Learned**: 1:N Relational Chat Modeling, Foreign Key Cascades, Index Optimization for Message Feeds, State Tracking for Tool Calls.
- **Key Tables Added**:
  - `conversations`: Scoped to workspace, agent, agentVersion, and user.
  - `messages`: Chronological conversation turns with role check (`user`, `assistant`, `system`, `tool`) and JSONB metadata.
  - `tool_calls`: Audit log of function calls, parameters, status (`requested`, `completed`, `failed`), and results.
- **Status**: Pushed to Neon PostgreSQL & Verified via live queries.

### Module 3.4: Autonomous ReAct Runner (`lib/ai/runner.ts`)
- **Concepts Learned**: Multi-Turn Execution Loops, Infinite Loop Detection, Step Budgets, Security Sandboxing.
- **Key Mechanisms Built**:
  - Multi-step ReAct state machine (`Reason -> Act -> Observe -> Reflect`).
  - Loop detector tracks signature `${tool.name}:${JSON.stringify(args)}` across consecutive failures and aborts at 3 to prevent token drain.
  - Hard step ceiling (`maxSteps: 10`) stops runaway recursions.
  - Automatic wrapping of tool execution results in `<untrusted_tool_data>` tags for indirect prompt injection defense.
  - Multi-step token usage accumulator.
- **Status**: Complete & Verified via [`scripts/verify-phase3-runner.ts`](scripts/verify-phase3-runner.ts) (12/12 tests passed).

### Module 3.5: Conversation & Chat API Endpoints
- **Concepts Learned**: Multi-tenant RBAC in Next.js App Router, Conversation Thread Pinning, Two-Phase Message Commit, Database Connection Pool Management (`idle_timeout: 20s`).
- **Endpoints Built**:
  - `POST /api/conversations`: Creates thread pinned to active `agentVersionId`.
  - `GET /api/conversations`: Lists threads filtered by workspace and agent.
  - `GET /api/conversations/[id]/messages`: Chronological thread history with hydrated tool calls.
  - `POST /api/chat`: Orchestrates agent turn, persists user & assistant turns, tracks usage.
- **Status**: Complete & Verified via [`scripts/verify-phase3-api.ts`](scripts/verify-phase3-api.ts) (12/12 tests passed).

### Module 3.6: Frontend Chat Canvas
- **Concepts Learned**: Optimistic UI Updates, Client State Reconciliation, Cascading React Effects, Auto-scroll DOM Refs.
- **Pages Built**:
  - `app/(dashboard)/layout.tsx`: Persistent workspace shell.
  - `app/(dashboard)/agents/[id]/chat/page.tsx`: Interactive chat canvas with thread sidebar, message bubbles, and tool badges.
- **Status**: Complete & Typechecked (`tsc --noEmit` code 0).

---

## Phase 4: Tool Registry & Integrations

### Module 4.1: Database Schema (Migration 0004)
- **Concepts Learned**: Many-to-Many (`M:N`) Relational Junction Modeling, Dynamic Capability Scoping, Database-Driven Feature Toggles, Granular Permission Constraints.
- **Key Tables Added**:
  - `tools`: Global catalog of built-in and third-party capabilities with `permission_level` (`read`, `write`, `dangerous`), `execution_type` (`native`, `integration`, `sandbox`), and `requires_approval` boolean.
  - `agent_tools`: Junction table binding tools to agents with composite unique index `(agent_id, tool_id)`, individual enable/disable flags, and JSONB `config_override`.
- **Status**: Complete & Verified live against Neon PostgreSQL.

### Module 4.2: Tool Registry & Core Built-in Suite
- **Concepts Learned**: Dynamic Capability Resolution, Path Traversal Defense, Isolated `vm` Script Sandboxing, Ingress Schema Mapping, Database Catalog Synchronization.
- **Tools Built**:
  - `web_search`: Live search execution with structured snippets (`permissionLevel: 'read'`).
  - `read_url`: Webpage reader stripping scripts/styles/HTML into clean Markdown (`permissionLevel: 'read'`).
  - `read_file` & `write_file`: Workspace sandboxed filesystem with `path.normalize` path traversal defense (`permissionLevel: 'read'` / `'write'`).
  - `execute_code`: Isolated Node `vm` script evaluation with console logging (`permissionLevel: 'dangerous'`, `requiresApproval: true`).
  - `ToolRegistry`: Auto-synchronizes catalog to Postgres and resolves active tools per agent for the ReAct runner.
- **Status**: Complete & Verified via [`scripts/verify-phase4-tools.ts`](scripts/verify-phase4-tools.ts) (14/14 tests passed).

### Module 4.3: Human-in-the-Loop Approval Workflow
- **Concepts Learned**: Stateful Turn Suspension, Information Exposure Defense (Auth before State validation), Rejection Observation Feeding, Idempotent Approval Operations.
- **Key Mechanisms**:
  - Halts turn with `finishReason: "approval_required"` and commits `tool_calls` row with `status: 'requested'`.
  - Endpoint `POST /api/chat/approve` supports `approved` (executes action, resumes loop) and `rejected` (feeds refusal observation, model apologizes/adapts).
- **Status**: Complete & Verified via [`scripts/verify-phase4-approvals.ts`](scripts/verify-phase4-approvals.ts) (11/11 tests passed).

### Module 4.4: Tool Management APIs & Interactive Approval Cards
- **Concepts Learned**: Atomic Junction Table Upserts, Declarative Capability Scoping, Interactive UI Approval Cards with Parameter Inspection.
- **Endpoints & UI**:
  - `GET /api/agents/[id]/tools`: Merges system catalog with agent-specific assignment state.
  - `PUT /api/agents/[id]/tools`: Atomically toggles tools in `agent_tools` table.
  - Interactive UI card in [`chat/page.tsx`](../app/(dashboard)/agents/[id]/chat/page.tsx) with `[Approve & Execute]` and `[Reject]` buttons.
- **Status**: Complete & Verified via [`scripts/verify-phase4-management.ts`](scripts/verify-phase4-management.ts) (9/9 tests passed).

---

## Phase 4 Completion Milestone
- **Total Tests Passed in Phase 4**: **34 / 34 Tests Passed**
- **Documentation**: Generated [`PHASE4_VERIFICATION_REPORT.md`](../PHASE4_VERIFICATION_REPORT.md).
- **Outcome**: Meow agents can now safely execute tools (web search, webpage scraping, sandboxed files, code execution) with granular workspace permissions and human-in-the-loop approval gates.







### Architectural Pivot: Vercel AI SDK Standardization (`ai`)
- **Rationale**: For production-grade Next.js systems and modern CSE portfolio standards, standardizing on the official **Vercel AI SDK (`ai`)** ecosystem (`@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/react`, `zod`) eliminates redundant HTTP boilerplate and connects directly to React client streaming hooks (`useChat`).
- **Installed Packages**: `ai`, `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/react`, `zod`.
- **Integrated Pipeline**:
  - Model resolution via `resolveModel()` returning `LanguageModelV1`.
  - Multi-step tool execution via `streamText({ maxSteps: 10 })`.
  - Real-time streaming response via `toDataStreamResponse()`.
  - Database persistence via `onFinish` hooks directly writing into PostgreSQL.

---

## Phase 9 (Spec 09): Frontend Architecture & UI Design System

### Module 9.1: Global Dashboard Shell & Multi-Tenant Context
- **Concepts Learned**: Route Groups `(dashboard)`, DOM tree stability across layout navigations, Viewport budgeting (`overflow-y-auto` vs full-height chat), Dynamic Active Route Highlighting via `usePathname()`.
- **Implementations**:
  - `app/api/workspaces/route.ts`: Multi-tenant session resolver returning active workspace with advisory lock auto-provisioning.
  - `components/dashboard/sidebar-nav.tsx`: Persistent client sidebar navigation with real-time active link indicators and system health pill.
  - `app/(dashboard)/layout.tsx`: Desktop sidebar with brand header, RBAC tenancy status bar, and responsive navigation.
  - `app/(dashboard)/page.tsx`: Workspace Mission Control dashboard featuring fleet metrics (Active Agents, Native Tools, Safety Boundary Tier 3, ReAct Engine status) and agent quick-launch cards.

### Module 9.2: Agent Fleet Gallery & Detail Dossier
- **Concepts Learned**: Debounced Client-side Search, Lifecycle Status Filtering, Parameter Extraction in Next.js 16 (`React.use(params)`), Multi-Column Entity Dossiers.
- **Implementations**:
  - `app/(dashboard)/agents/page.tsx`: Filterable card grid of workspace agents with model badges, lifecycle pills (`active`, `archived`), and direct links to chat or settings.
  - `app/(dashboard)/agents/[id]/page.tsx`: Full agent dossier inspecting Layer 1 prompt instructions, active tool matrix, runtime telemetry, and complete immutable version history.

### Module 9.3: Agent Creation Wizard & Version/Tool Toggles
- **Concepts Learned**: Multi-Step Provisioning Flows, Controlled Forms, Inversion of Control for prompt templates, Atomic Tool Junction Upserts, Immutable Version Bumping.
- **Implementations**:
  - `app/(dashboard)/agents/new/page.tsx`: 4-step wizard (Identity, AI Model Selector, System Prompt with templates, Tool Enablement Checkboxes).
  - `app/(dashboard)/agents/[id]/edit/page.tsx`: Agent editor that automatically bumps `agent_versions` to `v2`, `v3` upon instruction or model edits, while exposing optimistic live toggle switches for tool permissions and a danger zone for agent archiving.

### Module 9.4: Global Tool Catalog Directory & Schema Inspector
- **Concepts Learned**: Centralized Capability Discovery, Security Tier Categorization (`read`, `write`, `dangerous`), JSON Parameter Schema Reflection.
- **Implementations**:
  - `app/api/tools/route.ts`: Synchronizes in-memory tools (`web_search`, `read_url`, `read_file`, `write_file`, `execute_code`) to PostgreSQL `tools` table and returns catalog records.
  - `app/(dashboard)/tools/page.tsx`: Comprehensive tool directory displaying permission badges, execution targets, approval gates, and collapsible JSON parameter schema inspectors.

---

## Phase 9 Completion Milestone
- **Total Tests Passed in Phase 9**: **21 / 21 Tests Passed** ([`scripts/verify-phase9-ui.ts`](../scripts/verify-phase9-ui.ts))
- **TypeScript Check**: `npx tsc --noEmit` passed with **0 errors**.
- **Deliverable**: A complete, modern, multi-tenant UI dashboard allowing users to view workspaces, provision agents, edit system prompts with version history, toggle tool permissions, and chat with autonomous agents.

---

## Phase 5: Memory, Context Windows & Document Retrieval (RAG)

### Module 5.1: Database Schema & Migration 0005 (`agent_memories`, `files`, `document_chunks`)
- **Concepts Learned**: PostgreSQL `pgvector` C-extension, 1,536-dimensional vector columns, HNSW (Hierarchical Navigable Small World) graph indexing with `vector_cosine_ops`, ACID cascade deletion for vector records.
- **Implementations**:
  - `db/schema.ts`: Added `agentMemories`, `files`, and `documentChunks` tables with `vector(1536)` embedding column and HNSW index.
  - `scripts/migrate-phase5.ts`: Migration 0005 applying extension, tables, constraints, and indexes to Neon PostgreSQL.

### Module 5.2: Tier 2 Long-Term Agent Memory & Dynamic Prompt Injection
- **Concepts Learned**: Cross-conversation user facts and preferences, in-memory deduplication, Layer 3 Prompt Compiler memory assembly (`[PREFERENCE]`, `[FACT]`, `[INSTRUCTION]`).
- **Implementations**:
  - `lib/memory/manager.ts`: Core `MemoryManager` class providing `addMemory`, `getMemoriesForAgent`, deduplication checks, and prompt compilation formatting.
  - `app/api/agents/[id]/memories/route.ts`: Secure REST endpoints (`GET`, `POST`, `DELETE`) with multi-tenant RBAC validation.
  - `app/api/chat/route.ts` & `app/api/chat/approve/route.ts`: Automatically injects stored agent memories into the active conversational ReAct turn.

### Module 5.3: Tier 3 Recursive Text Chunker & Semantic Search Pipeline
- **Concepts Learned**: Semantic document boundaries, Sliding-window overlap to prevent sentence fragmentation, Unit vector L2 normalization, Cosine Distance (`<=>`) in SQL.
- **Implementations**:
  - `lib/knowledge/chunker.ts`: Recursive character chunker splitting by Markdown headers, paragraphs, and punctuation with configurable chunk size and overlap.
  - `lib/knowledge/embeddings.ts`: 1,536-dimensional vector generator connecting to OpenAI `text-embedding-3-small` with deterministic L2-normalized semantic vector fallback for offline testing.
  - `lib/knowledge/retriever.ts`: Document ingestion pipeline and SQL cosine distance retriever (`ORDER BY embedding <=> query_vector ASC LIMIT K`).

### Module 5.4: Autonomous RAG Tool (`search_knowledge`)
- **Concepts Learned**: Autonomous capability delegation, Parameter validation via JSON Schema, Safe read tier classification.
- **Implementations**:
  - `lib/tools/builtin/search-knowledge.ts`: Native tool allowing autonomous agents to query workspace document chunks during chat turns.
  - `lib/tools/registry.ts`: Registered `search_knowledge` tool into the central catalog.

---

## Phase 5 Completion Milestone
- **Total Tests Passed in Phase 5**: **24 / 24 Tests Passed** ([`scripts/verify-phase5-memory.ts`](../scripts/verify-phase5-memory.ts))
- **TypeScript Check**: `npx tsc --noEmit` passed with **0 errors**.
- **Deliverable**: Full 3-tier memory engine (short-term conversation history, long-term cross-thread preferences, and enterprise pgvector RAG document search).

---

## Phase 6: Durable Background Workers & Task Queues
- **Concepts Learned**: Asynchronous event dispatching, Inngest durable workflows, non-blocking agent operations, cron job definitions, graceful offline/local dev fallback.
- **Implementations**:
  - `db/schema.ts` & `scripts/migrate-phase6.ts`: `background_jobs` table tracking async worker execution, cron schedules, and lifecycle states.
  - `lib/inngest.ts`: Inngest SDK initialization and `scheduleBackgroundJob` helper.
  - `lib/tools/builtin/background-task.ts`: Dangerous-tier `background_task` tool with human approval, persisting to database and staging to Inngest.
  - `lib/tools/registry.ts`: Tool registration in the central registry.
- **Verification**: `scripts/verify-phase6-background.ts` passed **10 / 10 tests**.

---

## Phase 7: Role-Based Access Control (RBAC) & Audit Trails
- **Concepts Learned**: Workspace-scoped roles, granular permission matrices, multi-tenant permission verification, immutable audit logging with JSONB change tracking.
- **Implementations**:
  - `db/schema.ts` & `scripts/migrate-phase7.ts`: Added `roles`, `permissions`, `role_permissions`, `user_roles`, and `audit_logs` tables.
  - `lib/audit.ts`: Global `logAction` helper for compliance recording across all privileged operations.
  - `lib/auth/require-permission.ts`: Route guard validating user roles and permissions with automatic owner bypass.
- **Verification**: `scripts/verify-phase7-rbac.ts` passed **10 / 10 tests**.

---

## Phase 8: Plugin Marketplace & Extensibility Ecosystem
- **Concepts Learned**: Dynamic integration architecture, third-party connector cataloging, workspace plugin enablement, UI-driven toggle switches, and strict cross-tenant isolation.
- **Implementations**:
  - `db/schema.ts` & `scripts/migrate-phase8.ts`: Added `workspace_plugins` and `plugin_manifests` tables.
  - `lib/plugins/manager.ts`: Core `PluginManager` handling catalog sync, installation, enable/disable toggling, and uninstall with audit logging.
  - `app/api/plugins/route.ts` & `app/api/plugins/[id]/route.ts`: REST API endpoints for marketplace catalog, installation, and toggling.
  - `app/api/workspaces/[id]/plugins/route.ts`: Endpoint listing installed plugins for a specific workspace.
  - `app/(dashboard)/plugins/page.tsx`: Full interactive Marketplace UI with catalog search, category filters, and installation management.
  - `components/dashboard/sidebar-nav.tsx`: Added Plugins navigation entry in persistent sidebar.
- **Verification**: `scripts/verify-phase8-plugins.ts` passed **16 / 16 tests**.






