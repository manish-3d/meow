# Meow — Complete Product Documentation & Engineering Specification

Welcome to the official engineering and architectural documentation for **Meow: The AI Agent Operating System**.

Meow is a multi-tenant platform designed for individuals and teams to build, configure, converse with, and deploy autonomous AI agents capable of executing tasks across cloud sandboxes and local developer workstations.

---

## Documentation Directory Structure

```
docs/
├── README.md                                      <- Master index and documentation guide
├── 01_system_architecture.md                     <- Two-plane architecture, C4 models & request flow
├── 02_database_and_data_model.md                 <- 8-domain schema, complete ERD, Drizzle code & dictionary
├── 03_agent_runtime_and_reasoning_engine.md      <- AIProvider, prompt compiler, ReAct loop & state machines
├── 04_tools_and_integrations.md                  <- Tool registry, Zod schemas, KMS vault & approval gates
├── 05_automation_and_inngest_workflows.md       <- Durable background execution, routines & Inngest jobs
├── 06_meow_runner_and_execution_runtimes.md      <- Local runner WebSocket daemon & cloud Docker sandboxes
├── 07_memory_and_knowledge_retrieval.md          <- Conversation memory, agent memory & pgvector RAG
├── 08_api_reference.md                           <- Complete REST API reference, request/response schemas & SSE
├── 09_frontend_architecture_and_ui.md            <- Next.js App Router, component tree & dashboard wireframes
├── 10_security_compliance_and_rbac.md            <- RBAC matrix, tenant isolation, prompt injection & audit
└── 11_devops_deployment_and_observability.md     <- Topology, connection pooling, telemetry & disaster recovery
```

---

## Architectural Principles & System Invariants

### 1. Control Plane vs. Execution Plane Separation
Meow splits responsibilities into two distinct architectural planes:
- **Control Plane (Next.js App Router):** Manages identity, tenancy, RBAC, agent versioning, tool metadata, and billing. It does not execute arbitrary code or block on long-running LLM loops.
- **Execution Plane (Inngest Workers, Cloud Sandboxes, Local Runner):** Executes AI reasoning loops, runs browser automations, executes terminal commands, and streams execution events back to the control plane.

### 2. Multi-Tenant Relational Isolation
Every persistent resource (agents, conversations, routines, files, integrations) belongs strictly to a `workspace_id`. Cross-tenant data leakage is prevented through application-level RBAC and database foreign key cascades.

### 3. Immutable Versioning
Agent prompts, model parameters, and tool configurations are stored in an append-only ledger (`agent_versions`). Once created, a version is never mutated in place. Historic runs remain permanently reproducible.

### 4. Zero-Trust Local Execution
The `Meow Runner` local daemon operates over an **outbound-only authenticated WebSocket connection** to Meow Cloud. It never opens inbound network ports, enforces strict filesystem directory sandboxing, and requires explicit user consent before executing destructive commands.

---

## Navigation & Reading Order

- **New Engineers:** Start with [`01_system_architecture.md`](./01_system_architecture.md) and [`02_database_and_data_model.md`](./02_database_and_data_model.md).
- **AI & Runtime Developers:** Read [`03_agent_runtime_and_reasoning_engine.md`](./03_agent_runtime_and_reasoning_engine.md), [`04_tools_and_integrations.md`](./04_tools_and_integrations.md), and [`07_memory_and_knowledge_retrieval.md`](./07_memory_and_knowledge_retrieval.md).
- **Backend & Infrastructure Engineers:** Read [`05_automation_and_inngest_workflows.md`](./05_automation_and_inngest_workflows.md), [`06_meow_runner_and_execution_runtimes.md`](./06_meow_runner_and_execution_runtimes.md), and [`11_devops_deployment_and_observability.md`](./11_devops_deployment_and_observability.md).
- **Frontend & Product Developers:** Read [`08_api_reference.md`](./08_api_reference.md) and [`09_frontend_architecture_and_ui.md`](./09_frontend_architecture_and_ui.md).
- **Security & Compliance Auditors:** Read [`10_security_compliance_and_rbac.md`](./10_security_compliance_and_rbac.md).

