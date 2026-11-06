# Meow — Phase 4: Tool Registry, Security & Human-in-the-Loop Verification Report

**Date:** November 6, 2026  
**Environment:** Next.js 16 + Neon PostgreSQL (PostgreSQL 18.6) + Drizzle ORM + Node `vm` Sandbox  
**Status:** **ALL CHECKS PASSED (34/34 Tests Passed)**

---

## 1. Files Created & Updated

| File | Change Type | Purpose |
|---|---|---|
| [`db/schema.ts`](db/schema.ts) | **Updated** | Added Domain D tables: `tools` (catalog with `permission_level`, `execution_type`, `requires_approval`) and `agent_tools` (junction table with unique constraint `(agent_id, tool_id)`). |
| [`lib/tools/types.ts`](lib/tools/types.ts) | **Created** | Core tool system contracts: `RegisteredTool`, `ToolContext`, permission tiers (`read`, `write`, `dangerous`), and execution targets. |
| [`lib/tools/builtin/web-search.ts`](lib/tools/builtin/web-search.ts) | **Created** | Live internet search tool (`permissionLevel: 'read'`) with structured snippet output. |
| [`lib/tools/builtin/read-url.ts`](lib/tools/builtin/read-url.ts) | **Created** | Webpage fetcher and HTML sanitizer: strips scripts/styles/navs and converts HTML to clean Markdown with token length caps. |
| [`lib/tools/builtin/file-ops.ts`](lib/tools/builtin/file-ops.ts) | **Created** | `read_file` and `write_file` operating strictly inside workspace sandboxed storage (`storage/workspaces/[ws]/`) with path traversal armor. |
| [`lib/tools/builtin/execute-code.ts`](lib/tools/builtin/execute-code.ts) | **Created** | Safe script execution inside an isolated Node `vm` context with console capture and 5000ms timeout ceiling (`permissionLevel: 'dangerous'`, `requiresApproval: true`). |
| [`lib/tools/registry.ts`](lib/tools/registry.ts) | **Created** | Central tool catalog singleton: handles PostgreSQL database synchronization (`syncCatalogToDatabase`) and dynamic agent tool resolution (`getActiveToolsForAgent`). |
| [`lib/ai/runner.ts`](lib/ai/runner.ts) | **Updated** | Added human-in-the-loop turn suspension: halts reasoning loop with `finishReason: "approval_required"` when a tool requires approval. |
| [`app/api/chat/route.ts`](app/api/chat/route.ts) | **Updated** | Connected `ToolRegistry.getActiveToolsForAgent` to dynamically pass enabled tools to the runner, and persist tool call records with status `requested`. |
| [`app/api/chat/approve/route.ts`](app/api/chat/approve/route.ts) | **Created** | `POST` endpoint to resume agent turns upon human `approved` or `rejected` decisions, updating `tool_calls` audit rows. |
| [`app/api/agents/[id]/tools/route.ts`](app/api/agents/[id]/tools/route.ts) | **Created** | `GET` to list tools with enabled flags; `PUT` to atomically toggle tools on/off for an agent. |
| [`app/(dashboard)/agents/[id]/chat/page.tsx`](app/(dashboard)/agents/[id]/chat/page.tsx) | **Updated** | Interactive Chat Canvas: renders visual `ToolApprovalCard` with parameter inspector and `[Approve & Execute]` / `[Reject]` action buttons. |

---

## 2. Test Suites & Verification Results

### Test Suite 1: Tool Registry & Built-in Capabilities (`scripts/verify-phase4-tools.ts`)
- **14/14 Tests Passed**
- Proved tool metadata and permission level configurations (`read`, `write`, `dangerous`).
- Proved sandboxed file operations: writing to workspace storage, reading back content.
- Proved Path Traversal Defense: attempts to escape sandbox via `../../secret.env` blocked with explicit security errors.
- Proved isolated script execution in Node `vm` with `console.log` capture.
- Proved Neon PostgreSQL catalog synchronization (`tools` table).
- Proved dynamic agent tool resolution via `agent_tools` junction table.
- Proved end-to-end multi-step chat turn where the model calls a tool and incorporates the observation into the final reply.

### Test Suite 2: Human-in-the-Loop Approval Workflow (`scripts/verify-phase4-approvals.ts`)
- **11/11 Tests Passed**
- Proved dangerous actions halt the turn with `finishReason: "approval_required"`.
- Proved `tool_calls` row inserted with `status: "requested"`.
- Proved `POST /api/chat/approve` with `decision: "approved"` executes tool, marks `completed`, and continues reasoning loop.
- Proved `decision: "rejected"` marks status `rejected`, feeds refusal observation, and lets model respond gracefully.
- Proved idempotency: re-approving a completed tool call rejected with HTTP 400.
- Proved unauthenticated approval requests rejected with HTTP 401.

### Test Suite 3: Tool Management APIs (`scripts/verify-phase4-management.ts`)
- **9/9 Tests Passed**
- Proved unauthenticated requests return 401 across `GET` and `PUT` `/api/agents/[id]/tools`.
- Proved `GET` returns full catalog with per-agent enabled flags.
- Proved `PUT` atomically enables tools in `agent_tools` junction table.
- Proved `ToolRegistry.getActiveToolsForAgent` immediately reflects enabled tools in real-time.
- Proved disabling a tool dynamically updates active tools returned to the runner.

---

## 3. Key Architectural Decisions & Security Invariants

1. **Path Traversal Defense (`resolveWorkspacePath`):**
   - User inputs can never specify arbitrary paths. The resolver verifies that `path.resolve(baseDir, relativePath).startsWith(baseDir)` before allowing file system access.
2. **Security Guard Ordering Rule:**
   - Authentication and workspace authorization checks must **always** precede business logic validations. Checking state before auth creates information disclosure vulnerabilities (CWE-200).
3. **Stateful Approval Resumption in PostgreSQL:**
   - Approvals are never stored in ephemeral server memory or promises. The state is written to the `tool_calls` table, allowing users to inspect code and approve minutes or days later without losing context.

