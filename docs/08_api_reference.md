# 08 — Complete REST API & Streaming Reference

This document provides the definitive API reference for the Meow Control Plane, detailing endpoint paths, HTTP verbs, RBAC roles, request bodies, response payloads, error schemas, and Server-Sent Events (SSE) protocols.

---

## 1. Authentication & Common Headers

All API endpoints (except public webhooks) authenticate requests using the **NextAuth session cookie** (`__Secure-next-auth.session-token` in production, `next-auth.session-token` in development).

### Common Headers:
```http
Content-Type: application/json
Accept: application/json
```

### Universal Error Response Schema:
```json
{
  "error": "Error description message",
  "code": "UNAUTHORIZED | FORBIDDEN | NOT_FOUND | INVALID_BODY | INTERNAL_ERROR",
  "details": {}
}
```

---

## 2. Workspaces Endpoints

### `GET /api/workspaces`
Lists all workspaces the authenticated user belongs to.
- **RBAC:** Any authenticated user.
- **Response (200 OK):**
  ```json
  {
    "workspaces": [
      {
        "id": "ws_12345",
        "name": "Alice's Workspace",
        "slug": "alice-owner",
        "role": "owner",
        "createdAt": "2026-11-01T08:00:00.000Z"
      }
    ]
  }
  ```

### `POST /api/workspaces`
Creates a new team workspace.
- **RBAC:** Any authenticated user.
- **Request Body:**
  ```json
  {
    "name": "Acme Engineering",
    "slug": "acme-engineering"
  }
  ```
- **Response (201 Created):** Returns created workspace object.

---

## 3. Agents Endpoints

### `GET /api/agents`
Lists all agents in a workspace.
- **Query Params:** `workspaceId` (string, required).
- **RBAC:** `owner`, `admin`, `member`.
- **Response (200 OK):**
  ```json
  {
    "agents": [
      {
        "id": "agent_abc123",
        "workspaceId": "ws_12345",
        "name": "Research Assistant",
        "description": "Performs web and document analysis",
        "status": "active",
        "createdBy": "user_789",
        "createdAt": "2026-11-01T08:10:00.000Z",
        "updatedAt": "2026-11-01T08:10:00.000Z"
      }
    ]
  }
  ```

### `POST /api/agents`
Creates a new agent and inserts initial Version 1.
- **RBAC:** `owner`, `admin`.
- **Request Body:**
  ```json
  {
    "workspaceId": "ws_12345",
    "name": "Support Bot",
    "description": "Answers customer inquiries",
    "instructions": "You are a courteous support agent.",
    "model": "gemini-2.0-flash",
    "config": { "temperature": 0.5 }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "agent": { "id": "agent_abc123", "name": "Support Bot", "status": "active" },
    "version": { "id": "ver_001", "version": 1, "model": "gemini-2.0-flash" }
  }
  ```

### `GET /api/agents/:id`
Retrieves agent details and version history.
- **RBAC:** `owner`, `admin`, `member`.
- **Response (200 OK):**
  ```json
  {
    "agent": { "id": "agent_abc123", "name": "Support Bot" },
    "versions": [
      { "id": "ver_002", "version": 2, "instructions": "Updated prompt", "model": "gpt-4o" },
      { "id": "ver_001", "version": 1, "instructions": "Initial prompt", "model": "gemini-2.0-flash" }
    ]
  }
  ```

### `PATCH /api/agents/:id`
Updates agent metadata or appends a new immutable version.
- **RBAC:** `owner`, `admin`.
- **Request Body:**
  ```json
  {
    "name": "Support Assistant v2",
    "instructions": "Updated system instructions",
    "model": "claude-3-5-sonnet"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "agent": { "id": "agent_abc123", "name": "Support Assistant v2" },
    "version": { "id": "ver_003", "version": 3, "model": "claude-3-5-sonnet" }
  }
  ```

### `DELETE /api/agents/:id`
Soft-deletes (archives) an agent.
- **RBAC:** `owner`, `admin`.
- **Response (200 OK):**
  ```json
  {
    "message": "Agent archived successfully",
    "agent": { "id": "agent_abc123", "status": "archived" }
  }
  ```

---

## 4. Conversations & Interactive Chat Endpoints

### `POST /api/conversations`
Starts a new conversation thread.
- **Request Body:**
  ```json
  {
    "workspaceId": "ws_12345",
    "agentId": "agent_abc123",
    "title": "Competitor Analysis"
  }
  ```
- **Response (201 Created):** Returns conversation object.

### `POST /api/conversations/:id/messages`
Submits a user message turn.
- **Request Body:**
  ```json
  {
    "content": "Compare OpenAI and Google AI pricing models."
  }
  ```
- **Response (201 Created):** Returns created message object.

---

## 5. Server-Sent Events (SSE) Streaming Protocol

### `GET /api/conversations/:id/stream`
Streams assistant tokens and tool events in real time.
- **Headers:** `Accept: text/event-stream`
- **Stream Format:**
  ```
  event: start
  data: {"conversationId":"conv_123","messageId":"msg_456"}

  event: token
  data: {"delta":"Here"}

  event: token
  data: {"delta":" is the analysis"}

  event: tool_start
  data: {"callId":"call_01","name":"web_search","arguments":{"query":"AI pricing 2026"}}

  event: tool_finish
  data: {"callId":"call_01","status":"completed"}

  event: token
  data: {"delta":": OpenAI pricing starts at..."}

  event: done
  data: {"usage":{"promptTokens":420,"completionTokens":85,"totalTokens":505}}
  ```

---

## 6. Autonomous Runs & Routines Endpoints

### `POST /api/runs`
Dispatches an autonomous agent execution.
- **Request Body:**
  ```json
  {
    "agentId": "agent_abc123",
    "input": "Find 20 sales leads and export to CSV",
    "executionTarget": "auto"
  }
  ```
- **Response (202 Accepted):**
  ```json
  {
    "runId": "run_01jbc66x",
    "status": "queued",
    "message": "Task queued for autonomous execution"
  }
  ```

### `GET /api/runs/:id`
Fetches run status, steps, and generated artifacts.
- **Response (200 OK):**
  ```json
  {
    "run": {
      "id": "run_01jbc66x",
      "status": "completed",
      "startedAt": "2026-11-01T08:20:00.000Z",
      "completedAt": "2026-11-01T08:21:15.000Z"
    },
    "steps": [
      { "stepNumber": 1, "stepType": "tool_call", "status": "completed", "durationMs": 420 },
      { "stepNumber": 2, "stepType": "final_answer", "status": "completed" }
    ],
    "artifacts": [
      { "id": "art_11", "artifactType": "report", "downloadUrl": "https://s3.meow.app/..." }
    ]
  }
  ```

### `POST /api/runs/:id/approve`
Approves or rejects a held dangerous tool call.
- **Request Body:**
  ```json
  {
    "callId": "call_01",
    "approved": true
  }
  ```
- **Response (200 OK):** `{ "status": "resumed" }`

