# 04 — Automation & Local/Cloud Runner Architecture

Meow supports both scalable cloud automation and local workstation execution. This document details the durable background orchestration powered by Inngest, the Meow Runner local daemon, and intelligent target routing.

---

## 1. Automation & Background Orchestration (Inngest)

Autonomous agent runs and scheduled routines cannot run within standard Next.js HTTP request-response cycles due to serverless timeouts and connection drops. Meow leverages **Inngest** for durable execution.

```mermaid
flowchart TD
    subgraph Triggers["Trigger Sources"]
        CRON["Cron Schedule (e.g. 9 AM Mon-Fri)"]
        HOOK["Incoming Webhook (GitHub, Stripe)"]
        MANUAL["User Clicks 'Run Now' in Dashboard"]
    end

    subgraph Orchestration["Inngest Durable Engine"]
        INNGEST["Inngest Event Bus & Workflow Engine"]
        STEP1["step.run('load-agent-and-config')"]
        STEP2["step.run('execute-reasoning-step-1')"]
        STEP3["step.run('dispatch-tool-call')"]
        STEP4["step.run('save-artifacts-and-complete')"]
    end

    subgraph Targets["Execution Targets"]
        CLOUD["Cloud Sandbox Container"]
        LOCAL["Meow Local Runner (WebSocket)"]
    end

    CRON --> INNGEST
    HOOK --> INNGEST
    MANUAL --> INNGEST

    INNGEST --> STEP1
    STEP1 --> STEP2
    STEP2 --> STEP3
    STEP3 -->|Target: Cloud| CLOUD
    STEP3 -->|Target: Local| LOCAL
    CLOUD --> STEP4
    LOCAL --> STEP4
```

### Why Inngest?
1. **Durable Steps (`step.run`):** If a network timeout occurs during step 3, Inngest does not restart the entire 15-minute workflow. It resumes exactly from the failed step with cached outputs from steps 1 and 2.
2. **Idempotency Keys:** Every run is assigned an `idempotencyKey: "routine_${routineId}_${timestamp}"`. If an external webhook sends duplicate POST requests, Inngest deduplicates them automatically.
3. **Automatic Exponential Retries:** Transient API rate limits (e.g. LLM 429 errors) are retried with jitter without writing complex retry loops in business logic.

---

## 2. Cloud Execution vs. Local Workstation Execution

Meow classifies tasks into two execution domains:

| Dimension | Cloud Execution | Local Execution (Meow Runner) |
|---|---|---|
| **Where it runs** | Managed cloud micro-VM / headless container | The user's personal desktop or server |
| **Availability** | Always-on, 24/7 background availability | Only when user's machine is awake & connected |
| **Use cases** | Web scraping, scheduled competitor reports, API integrations | Editing local files, compiling Git repos, running local Bash scripts, interacting with desktop apps |
| **Filesystem access** | Ephemeral cloud workspace directory | Explicitly authorized host folders (e.g. `~/Projects/Meow`) |
| **Network profile** | Clean data-center IP / Cloud proxy | User's residential/corporate network (can access internal intranets) |

---

## 3. Meow Runner — Local Execution Daemon

The Meow Runner is a lightweight open-source daemon (written in Node.js / Rust) that runs on macOS, Windows, or Linux.

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer / User
    participant App as Meow Cloud Dashboard
    participant Runner as Meow Local Runner Daemon
    participant Host as User's Operating System

    User->>App: Click "Add Local Runner"
    App-->>User: Display 8-digit Pairing Code (e.g. "MEOW-7842")
    User->>Runner: meow-runner link --code MEOW-7842
    Runner->>App: POST /api/runners/pair { code, deviceSpecs }
    App-->>Runner: Return device_token + workspace_id
    Note over Runner,App: Outbound Persistent WebSocket Established (wss://api.meow.app/runners/ws)
    Runner->>App: Send Heartbeat (Every 30s)
    
    Note over App: Agent initiates local file edit
    App->>Runner: WS Event: "run_task" { taskId, tool: "write_file", path, content }
    Runner->>Runner: Verify path is inside allowedPaths whitelist
    Runner->>Host: Atomic write to authorized folder
    Host-->>Runner: File written OK
    Runner->>App: WS Event: "task_complete" { taskId, status: "success" }
    App->>User: Display success in Web Dashboard
```

### Critical Security Invariants for Meow Runner:
1. **Outbound Connections Only:** The runner initiates an outbound TLS WebSocket connection to Meow Cloud. It **never opens inbound listening ports**, eliminating firewall and router configuration issues.
2. **Path Whitelisting:** The runner configuration file (`runner.config.json`) defines strict allowed directories:
   ```json
   {
     "allowedDirectories": [
       "C:\\Users\\manis\\workspace\\project-a",
       "C:\\Users\\manis\\documents\\reports"
     ],
     "allowTerminalExecution": false,
     "maxFileSizeMb": 50
   }
   ```
   Any tool call attempting path traversal (e.g. `../../Windows/System32` or `/etc/passwd`) is blocked client-side by the runner before executing.
3. **Immediate Revocation:** If a laptop is lost, the user can click **Revoke Device** in the web dashboard. Meow Cloud terminates the WebSocket and invalidates the device token immediately.

---

## 4. Intelligent Execution Router

When an agent is configured with target `auto`, the execution router evaluates requirements before dispatching:

```mermaid
flowchart TD
    START["Agent Task Ready to Execute"] --> Q1{"Requires Local File / Dev Tool?"}
    Q1 -->|Yes| CHK_RUNNER{"Is Local Runner Online?"}
    Q1 -->|No| Q2{"Long-running or Scheduled Routine?"}

    CHK_RUNNER -->|Yes| LOCAL["Route to Local Runner"]
    CHK_RUNNER -->|No| PAUSE["Pause Run & Prompt User to Start Runner"]

    Q2 -->|Yes| CLOUD["Route to Cloud Container"]
    Q2 -->|No| PREF{"User Target Preference?"}

    PREF -->|Prefer Cloud| CLOUD
    PREF -->|Prefer Local & Online| LOCAL
```

