# 01 — System Architecture & Two-Plane Model

This document specifies the high-level system topology, the two-plane architectural separation, C4 architecture models, and request lifecycles for **Meow**.

---

## 1. The Core Architectural Division: Control Plane vs. Execution Plane

Meow is structured into two fundamental planes to guarantee reliability, responsiveness, and safety.

```mermaid
flowchart TB
    subgraph ControlPlane["CONTROL PLANE (Next.js Application)"]
        direction TB
        UI["Web Dashboard & React Client"]
        AUTH["Identity, NextAuth & Session Engine"]
        WS["Workspaces & Granular RBAC"]
        AGENT_MGR["Agent Catalog & Immutable Versioning"]
        REGISTRY["Tool Registry & Permission Validator"]
        EVENT_HUB["Real-time Event Broker (SSE)"]
        BILLING["Usage Metering & Account Quotas"]
    end

    subgraph Channel["COMMUNICATION & COORDINATION LAYER"]
        direction LR
        QUEUE["Inngest Durable Job Bus"]
        WS_GATEWAY["WebSocket Gateway (wss://api.meow.app)"]
        SSE_STREAM["Server-Sent Events Pipeline"]
    end

    subgraph ExecutionPlane["EXECUTION PLANE (Workers & Runtimes)"]
        direction TB
        AI_ENGINE["AI Provider Reasoning Engine"]
        TOOL_EXEC["Tool Execution Guard & Sandbox Router"]
        CLOUD_BOX["Ephemeral Cloud Container Fleet (Browser/Code)"]
        LOCAL_RUNNER["Meow Runner (User Workstation Daemon)"]
        SCHEDULER["Durable Cron & Event Scheduler"]
    end

    subgraph Persistence["PERSISTENCE & INFRASTRUCTURE TIER"]
        direction LR
        NEON["Neon Serverless PostgreSQL"]
        S3["Object Storage (S3 / R2)"]
        KMS["KMS Credential Vault"]
    end

    UI --> AUTH
    AUTH --> WS
    WS --> AGENT_MGR
    AGENT_MGR --> REGISTRY
    
    ControlPlane -->|"Enqueue Task"| QUEUE
    ControlPlane -->|"Forward Runner Jobs"| WS_GATEWAY
    EVENT_HUB -->|"Stream Telemetry"| SSE_STREAM
    SSE_STREAM --> UI

    QUEUE --> AI_ENGINE
    AI_ENGINE --> TOOL_EXEC
    TOOL_EXEC -->|"Cloud Target"| CLOUD_BOX
    WS_GATEWAY -->|"Local Target"| LOCAL_RUNNER
    SCHEDULER --> QUEUE

    ControlPlane --- NEON
    ExecutionPlane --- NEON
    ExecutionPlane --- S3
    ControlPlane --- KMS
```

### Control Plane Responsibilities:
- **Tenant Isolation:** Enforces that every user request is verified against the workspace membership table.
- **Configuration Management:** Manages agent system instructions, hyperparameters, and connected credentials.
- **Fast HTTP Responses:** Never blocks on long-running LLM inferences, browser automation, or code execution.
- **Audit Logging:** Records administrative actions and approval events.

### Execution Plane Responsibilities:
- **Non-blocking Durable Execution:** Handles multi-minute tasks, retries, and step-level execution via Inngest.
- **Model Invocations:** Orchestrates streaming calls to OpenAI, Google Gemini, Anthropic, or local models.
- **Tool Execution:** Executes tool actions either in isolated cloud containers (Docker/gVisor) or on user workstations via the Meow Runner.
- **Enforcing Sandboxes:** Confines agent file operations and code execution strictly to allowed directories.

---

## 2. C4 Architecture Models

### Level 1: System Context Diagram

```mermaid
flowchart TB
    USER["User / Developer (Browser / CLI)"]
    MEOW["Meow Agent Platform (SaaS)"]
    LLM_PROV["External AI Providers (OpenAI, Gemini, Anthropic)"]
    EXT_SERV["Third-Party Services (GitHub, Google Workspace, Slack)"]
    LOCAL_PC["User's Local Workstation (Meow Runner)"]

    USER -->|"Creates agents, chats, starts automations"| MEOW
    MEOW -->|"Dispatches reasoning requests"| LLM_PROV
    MEOW -->|"Executes approved API actions"| EXT_SERV
    MEOW <-->|"Dispatches local file & shell jobs over WebSocket"| LOCAL_PC
```

---

### Level 2: Container Diagram

```mermaid
flowchart TD
    subgraph ClientContainer["Client Tier"]
        BROWSER["Next.js React Client (TypeScript, Tailwind, Shadcn UI)"]
        RUNNER_CLI["Meow Runner CLI / Daemon (Local Host Process)"]
    end

    subgraph CloudContainer["Meow Cloud Application"]
        NEXT_SERVER["Next.js App Router (Node.js Serverless / Edge)"]
        INNGEST_WORKER["Inngest Background Worker Pool"]
        WS_SERVER["WebSocket Ingress Server (Node.js / ws)"]
    end

    subgraph DataContainer["Storage & Services"]
        PG["Neon Serverless PostgreSQL (Drizzle ORM)"]
        BLOB["S3 Compatible Object Storage (Cloudflare R2 / AWS S3)"]
        KEY_VAULT["Encryption Key Service (AWS KMS / GCP KMS)"]
    end

    BROWSER -->|"HTTPS (REST & SSE)"| NEXT_SERVER
    RUNNER_CLI <-->|"TLS WebSocket (wss://)"| WS_SERVER
    NEXT_SERVER -->|"Dispatches jobs"| INNGEST_WORKER
    WS_SERVER -->|"Coordinates tasks"| INNGEST_WORKER

    NEXT_SERVER -->|"SQL Queries (pooled)"| PG
    INNGEST_WORKER -->|"State & Telemetry Updates"| PG
    INNGEST_WORKER -->|"Reads/Writes Artifacts"| BLOB
    NEXT_SERVER -->|"Decrypts Tokens"| KEY_VAULT
```

---

## 3. End-to-End Request Lifecycles

### Flow A: Interactive Chat with Tool Calling (Synchronous + SSE Streaming)

```mermaid
sequenceDiagram
    autonumber
    actor User as Browser / User
    participant Web as Next.js Server (/api/conversations/[id]/messages)
    participant RBAC as requireWorkspaceAccess()
    participant AI as AIProvider (Gemini / OpenAI)
    participant Tool as Tool Executor
    participant DB as Neon Database

    User->>Web: POST /api/conversations/conv-123/messages { content: "Find AI news" }
    Web->>RBAC: Verify user belongs to workspace
    RBAC-->>Web: Authorized (Role: member/admin/owner)
    Web->>DB: INSERT INTO messages (role: 'user', content: "Find AI news")
    
    Web-->>User: Open SSE Stream (/api/conversations/conv-123/stream)
    Web->>AI: stream({ model, messages, tools: [web_search, read_url] })
    
    AI-->>Web: Token: "I will"
    Web-->>User: event: token { delta: "I will" }
    AI-->>Web: Token: " search for that."
    Web-->>User: event: token { delta: " search for that." }
    
    AI-->>Web: ToolCallRequested: web_search({ query: "AI frameworks 2026" })
    Web-->>User: event: tool_start { name: "web_search", callId: "c1" }
    
    Web->>Tool: Execute web_search in native worker
    Tool-->>Web: Results: [Article 1, Article 2]
    Web->>DB: INSERT INTO tool_calls (callId: "c1", status: "completed")
    Web-->>User: event: tool_finish { callId: "c1", status: "completed" }
    
    Web->>AI: Return Tool Result & Resume Generation
    AI-->>Web: Token: "Based on recent findings..."
    Web-->>User: event: token { delta: "Based on recent findings..." }
    Web-->>User: event: done { totalTokens: 640 }
```

---

### Flow B: Autonomous Long-Running Task (Asynchronous Inngest Workflow)

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Routine Trigger
    participant API as Next.js Control Plane (/api/runs)
    participant Q as Inngest Queue
    participant W as Inngest Worker
    participant Cloud as Cloud Sandbox
    participant DB as Neon Database

    User->>API: POST /api/runs { agentId: "agent-99", input: "Scrape pricing" }
    API->>DB: INSERT INTO runs (status: 'queued', agentId: "agent-99")
    API->>Q: inngest.send("agent/run.requested", { runId: "run_xyz" })
    API-->>User: HTTP 202 Accepted { runId: "run_xyz", status: "queued" }

    Q->>W: Process Step 1: Initialize Environment
    W->>DB: UPDATE runs SET status = 'running'
    W->>Cloud: Provision Headless Browser Sandbox
    Cloud-->>W: Sandbox Container Ready (ID: sbx_44)
    
    W->>W: Process Step 2: Reasoning & Navigation
    W->>Cloud: browser_navigate("https://competitor.com/pricing")
    Cloud-->>W: Screenshot & DOM text extracted
    
    W->>DB: INSERT INTO run_steps (stepNumber: 1, type: 'tool_call')
    W->>W: Process Step 3: Compile Report Artifact
    W->>DB: INSERT INTO artifacts (artifactType: 'report')
    W->>DB: UPDATE runs SET status = 'completed'
    W-->>User: Push SSE Event to Dashboard: "Run Completed"
```

---

### Flow C: Local Workstation Execution (Meow Runner)

```mermaid
sequenceDiagram
    autonumber
    actor User as User in Web Dashboard
    participant Cloud as Meow Cloud (Control Plane)
    participant WS as WebSocket Gateway
    participant Runner as Meow Runner Daemon (User's PC)
    participant FS as Local Filesystem

    User->>Cloud: "Edit file src/index.ts in my local project"
    Cloud->>Cloud: Identify Target = "local" (Device: MacBook Pro)
    Cloud->>WS: Dispatch "local_tool_execution" { tool: "write_file", path: "src/index.ts" }
    WS->>Runner: WebSocket JSON Frame: { taskId: "t_101", tool: "write_file", ... }
    
    Runner->>Runner: Check Path against allowedDirectories whitelist
    alt Path is Authorized
        Runner->>FS: Write changes to disk
        FS-->>Runner: Success (Exit Code 0)
        Runner->>WS: WebSocket Frame: { taskId: "t_101", status: "success" }
        WS->>Cloud: Update run step to 'completed'
        Cloud->>User: Display success diff in browser UI
    else Path is Forbidden (e.g. C:\Windows\System32)
        Runner->>WS: WebSocket Frame: { taskId: "t_101", status: "error", error: "Access Denied" }
        WS->>Cloud: Mark run step as 'failed'
        Cloud->>User: Display security alert in browser UI
    end
```

