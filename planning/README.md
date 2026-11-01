# Meow — Product Architecture & System Design Blueprint

Welcome to the comprehensive technical design and architectural planning repository for **Meow: The AI Agent Operating System**.

Meow is designed as a multi-tenant, cloud-and-local hybrid execution platform where individuals and teams can create AI agents, converse with them, grant them granular tool capabilities, connect external third-party services, and execute long-running tasks autonomously with robust security boundaries.

---

## Architecture Blueprint Index

This planning folder is organized into six foundational system specifications, following the architectural roadmap:

| Document | Title | Scope & Contents |
|---|---|---|
| [`01_database_erd_and_schema.md`](./01_database_erd_and_schema.md) | **Database ERD & Domain Schema Specification** | Full 8-domain relational model: identity, tenancy, agents, conversations, tools, routines/runs, execution targets, files/artifacts, and usage/billing. Complete Drizzle definitions, constraints, indexes, and deletion rules. |
| [`02_agent_runtime_and_execution_engine.md`](./02_agent_runtime_and_execution_engine.md) | **Agent Runtime & Execution Engine** | AI provider abstraction (OpenAI, Gemini, Anthropic), prompt compilation, memory injection, multi-step tool execution loop, state machines, and context window budgets. |
| [`03_tool_registry_and_integrations.md`](./03_tool_registry_and_integrations.md) | **Tool Registry, Integrations & Security** | Tool declaration interfaces, Zod schema validation, OAuth 2.0 integration pipelines, KMS credential encryption, human-in-the-loop approval gates, and prompt injection mitigation. |
| [`04_automation_and_runner_architecture.md`](./04_automation_and_runner_architecture.md) | **Automations & Local/Cloud Runner Architecture** | Inngest durable job orchestration, cron/webhook triggers, Meow Runner outbound WebSocket daemon, local sandbox directory sandboxing, and execution routing (Cloud vs Local vs Auto). |
| [`05_api_and_frontend_contracts.md`](./05_api_and_frontend_contracts.md) | **API Specifications & Frontend Contracts** | REST endpoint contracts, Server-Sent Events (SSE) streaming protocols, Next.js App Router layout, UI component hierarchy, and real-time execution step feeds. |
| [`06_infrastructure_deployment_and_observability.md`](./06_infrastructure_deployment_and_observability.md) | **Infrastructure, Observability & Scaling** | Deployment topology, Neon PostgreSQL connection pooling, structured JSON telemetry, run tracing, token metering, failure modes, retries, and disaster recovery. |

---

## Key Frozen Architectural Invariants

Before implementation begins, the following architectural decisions are established as platform invariants:

1. **Two-Plane Division:**
   - **Control Plane (Next.js App Router):** Manages identity, workspaces, RBAC, agent versioning, tool definitions, permissions, and billing. Does not execute untrusted agent code or block on long-running tasks.
   - **Execution Plane (Inngest Workers & Isolated Runners):** Executes LLM loops, tool calls, browser tasks, and sandboxed code. Enforces access policies issued by the control plane.
2. **Tenant Boundary:**
   - Everything belongs to a `workspace_id`. A single user identity can belong to multiple workspaces with distinct roles (`owner`, `admin`, `member`). Every database query and API route validates workspace scoping.
3. **Immutable Agent Versioning:**
   - Prompts, model selections, and hyperparameter configurations are immutable. Any behavioral change produces an incremented `agent_versions` row (`version = N + 1`). Historic runs are bound to historical versions for reproducibility.
4. **Provider-Agnostic AI Interface:**
   - The application core interacts only with the `AIProvider` contract (`generate` and `stream`), abstracting away OpenAI, Anthropic, Google Gemini, and local models.
5. **Human-in-the-Loop & Safety Boundaries:**
   - Tools are categorized as `read`, `write`, or `dangerous`. Dangerous tools require explicit user approval before execution. The model is treated as an untrusted client requesting capabilities through a server-side permission gate.
6. **Outbound-Only Local Execution:**
   - The local runner initiates an outbound, authenticated WebSocket connection to Meow Cloud. It never listens on open inbound network ports and restricts filesystem access to user-authorized directories.

---

## Phase Rollout Schedule

- **Phase 1 (Complete):** Identity & Workspace Schemas, OAuth Authentication.
- **Phase 2 (Complete):** Personal Workspace Provisioning, Agent Foundation, Immutable Versioning, 37 Integration Tests.
- **Phase 3 (Next):** UI & Conversational AI (Chat Interface, Provider Abstraction, Streaming SSE).
- **Phase 4:** Tool Registry & Multi-step Execution Loop.
- **Phase 5:** Memory, Context Windows & Document Retrieval.
- **Phase 6:** Autonomous Execution & Inngest Background Workers.
- **Phase 7:** Routines, Automation Schedules & Webhook Triggers.
- **Phase 8:** External Integrations & KMS Credential Vault.
- **Phase 9:** Meow Runner (Local Execution Daemon) & Cloud Compute Sandboxes.
- **Phase 10:** Production Hardening, Metering, Observability & Enterprise RBAC.

