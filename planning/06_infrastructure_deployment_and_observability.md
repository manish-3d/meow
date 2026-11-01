# 06 — Infrastructure, Deployment & Observability Blueprint

This document specifies the deployment infrastructure, database connection pooling, secrets management, observability telemetry, and failure-handling strategies for **Meow**.

---

## 1. Production Deployment Topology

Meow avoids premature microservices complexity. The control plane runs as a modular Next.js application, while durable background workflows are orchestrated via Inngest and executed across isolated runtimes.

```mermaid
flowchart TD
    subgraph Edge["Global Edge Network"]
        CDN["Cloudflare CDN & DDoS Shield"]
    end

    subgraph ControlPlane["Control Plane Tier"]
        NEXT["Next.js App Router (Node.js 20+ / Vercel Enterprise)"]
        AUTH_MODULE["NextAuth v4 Session Engine"]
        REST_API["REST & SSE Endpoints"]
    end

    subgraph DataStorage["Persistence & Cloud Services"]
        NEON["Neon Serverless PostgreSQL (pg_bouncer Pool)"]
        S3["AWS S3 / Cloudflare R2 (Files & Artifacts)"]
        KMS["Cloud KMS (Token Encryption Vault)"]
    end

    subgraph ExecutionPlane["Execution Plane Tier"]
        INNGEST_SRV["Inngest Cloud Workflow Engine"]
        AI_WORKERS["Inngest Serverless Workers (AI Loops & Retries)"]
        CLOUD_SANDBOX["Ephemeral Docker Sandbox Fleet (Browser / Code)"]
        LOCAL_DAEMON["Meow Runner (User Workstation)"]
    end

    CDN --> NEXT
    NEXT --- AUTH_MODULE
    NEXT --- REST_API

    NEXT -->|Pooled SQL| NEON
    NEXT -->|Signed URLs| S3
    NEXT -->|Decrypt Tokens| KMS
    NEXT -->|Dispatch Events| INNGEST_SRV

    INNGEST_SRV --> AI_WORKERS
    AI_WORKERS -->|Cloud Tasks| CLOUD_SANDBOX
    AI_WORKERS -->|Local Tasks (WebSocket)| LOCAL_DAEMON
    AI_WORKERS -->|Step Telemetry| NEON
```

---

## 2. Database Connection Management (Neon + postgres.js)

In serverless and auto-scaling container environments, naive PostgreSQL connections can quickly exhaust connection pool limits (e.g. `max_connections`).

### Connection Configuration Standard:
As established in [`db/index.ts`](file:///c:/Users/manis/meow/db/index.ts):
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

const databaseUrl = process.env.DATABASE_URL!;

// Critical parameters for serverless & pooled PostgreSQL:
const client = postgres(databaseUrl, {
  prepare: false,      // Required when connecting through PgBouncer or Neon pooled endpoints
  max: 10,             // Maximum connections per serverless container instance
  idle_timeout: 20,    // Close idle connections after 20 seconds
  connect_timeout: 10, // Fail fast on connection stalls
});

export const db = drizzle({ client, schema });
```
> [!IMPORTANT]
> `prepare: false` prevents PgBouncer / Neon transaction-mode connection poolers from failing due to prepared statement naming conflicts across pooled server connections.

---

## 3. Structured Observability & Run Tracing

Debugging multi-step autonomous AI agents requires tracing every prompt, tool call, latency increment, and error stack trace.

### Structured Log Format
All log output is structured as machine-parseable JSON:
```json
{
  "timestamp": "2026-11-01T08:45:12.384Z",
  "level": "INFO",
  "service": "agent-runtime",
  "workspaceId": "ws_8f9a2b",
  "runId": "run_01jbc45x",
  "agentId": "agent_7721",
  "step": 2,
  "event": "tool_executed",
  "tool": "web_search",
  "durationMs": 420,
  "tokens": {
    "prompt": 650,
    "completion": 85,
    "total": 735
  },
  "status": "success"
}
```

### Telemetry Tracked per Autonomous Run:
1. **End-to-End Latency:** Wall-clock time from task initiation to completion.
2. **Step Count:** Number of model reasoning and tool-calling loops executed.
3. **Token Usage:** Accurate breakdown of prompt vs completion tokens across every LLM call.
4. **Estimated Cost (USD):** Calculated per run using provider pricing tables and recorded in `usage_records`.
5. **Tool Call Status:** Duration, inputs, outputs, and HTTP error codes of external APIs.

---

## 4. Failure Modes & Fault Tolerance

Agent systems encounter operational failures distinct from standard web apps. The system handles them gracefully:

| Failure Mode | Root Cause | System Response |
|---|---|---|
| **LLM Provider Outage** | OpenAI/Anthropic 500 error | Inngest pauses the step, switches to fallback provider (e.g. Gemini), or retries with exponential backoff. |
| **Invalid Tool JSON** | LLM outputs malformed arguments | Type guard rejects payload; validation error string is returned back to the model to self-correct. |
| **Tool Execution Error** | External API rate limit (HTTP 429) | Tool reports transient failure; runtime halts or waits according to retry policy. |
| **Local Runner Disconnect** | User closes laptop / Wi-Fi drops | Run enters `waiting_for_runner` state. If reconnection does not occur within 15 minutes, run is marked `failed`. |
| **Infinite Tool Loop** | Model repeatedly calls same tool | Hard safety limits (`maxSteps = 10`, `maxExecutionTimeMs = 600000`) terminate the run safely with status `timed_out`. |
| **Concurrent DB Contention** | Multiple simultaneous sign-ins | Handled by `pg_advisory_xact_lock`, serializing workspace creation safely. |

---

## 5. Backup & Disaster Recovery

1. **Database Point-in-Time Recovery (PITR):** Neon provides continuous WAL archiving with instant point-in-time recovery up to 30 days.
2. **Object Storage Durability:** S3 / R2 buckets configured with versioning enabled and cross-region replication for uploaded files and artifacts.
3. **Stateless Compute:** All Next.js and Inngest worker instances are stateless and can be redeployed to any region within minutes.

