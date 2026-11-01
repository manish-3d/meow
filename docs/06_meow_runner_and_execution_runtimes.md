# 06 — Meow Runner & Execution Runtimes

Meow operates a hybrid execution plane: tasks can run either in **ephemeral cloud container sandboxes** or directly on a user's local machine via the **Meow Runner**.

---

## 1. Meow Runner — Local Daemon Architecture

The Meow Runner allows agents to safely interact with local code repositories, run developer tools (Git, npm, compiler suites), and edit local files without exposing the user's host system to arbitrary network vulnerabilities.

```mermaid
flowchart TD
    subgraph MeowCloud["Meow Cloud Control Plane"]
        GATEWAY["WebSocket Gateway (wss://api.meow.app/runners/ws)"]
        AUTH_ROUTER["Runner Auth & Workspace Verifier"]
        TASK_DISPATCH["Task Dispatcher & Heartbeat Tracker"]
    end

    subgraph HostMachine["User Workstation (Local Operating System)"]
        WS_CLIENT["Meow Runner Daemon (Rust / Node.js)"]
        PATH_GUARD["Path Traversal & Allowed Dirs Guard"]
        CMD_GUARD["Command Whitelist & Execution Guard"]
        FS["Authorized Local Workspace Folders"]
        TERMINAL["Sandboxed Local Shell (bash/powershell)"]
    end

    WS_CLIENT -->|"1. Outbound TLS WebSocket Connection"| GATEWAY
    GATEWAY --> AUTH_ROUTER
    TASK_DISPATCH -->|"2. JSON Task Frame"| GATEWAY
    GATEWAY -->|"3. Stream Task"| WS_CLIENT

    WS_CLIENT --> PATH_GUARD
    WS_CLIENT --> CMD_GUARD
    PATH_GUARD -->|"Allowed Paths Only"| FS
    CMD_GUARD -->|"Allowed Shell Commands Only"| TERMINAL
```

### Security Rule: Outbound Connections Only
Traditional developer tools often ask users to open local ports or run `ngrok`. This is insecure.
The Meow Runner connects **outward** to Meow Cloud using standard WSS (WebSocket over TLS). It never binds to local listening ports (`0.0.0.0`), preventing inbound network attacks.

---

## 2. Pairing & Device Authorization Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User in Dashboard
    participant Cloud as Meow Cloud
    participant Runner as Meow Runner CLI on Laptop
    participant DB as Neon Database

    User->>Cloud: Click "Add Local Runner" in Dashboard
    Cloud->>DB: INSERT INTO pairing_codes (code: "MEOW-8941", expiresAt: now() + 10m)
    Cloud-->>User: Display Pairing Code: "MEOW-8941"
    
    User->>Runner: meow-runner link --code MEOW-8941
    Runner->>Cloud: POST /api/runners/pair { code: "MEOW-8941", deviceName: "MacBook Pro" }
    Cloud->>DB: Validate code and bind to workspace_id
    Cloud->>DB: INSERT INTO runner_devices (token_hash, allowed_paths)
    Cloud-->>Runner: Return device_token (Ed25519 signed JWT)
    
    Runner->>Cloud: Connect wss://api.meow.app/runners/ws (Bearer device_token)
    Cloud-->>Runner: 101 Switching Protocols (Connected!)
    Cloud->>User: Dashboard updates: "MacBook Pro Online (Green)"
```

---

## 3. Local Filesystem Sandboxing & Path Whitelisting

The runner configuration file (`~/.meow/runner.json`) enforces strict local directory boundaries:

```json
{
  "version": 1,
  "deviceId": "dev_01jbc55x",
  "allowedDirectories": [
    "C:\\Users\\manis\\workspace\\meow-agent-projects",
    "C:\\Users\\manis\\documents\\approved-reports"
  ],
  "allowShellExecution": false,
  "maxFileSizeBytes": 52428800
}
```

### Path Traversal Defense Algorithm:
Before reading or writing any file:
```typescript
export function validateLocalPath(requestedPath: string, allowedDirs: string[]): string {
  const resolved = path.resolve(requestedPath);

  const isAllowed = allowedDirs.some((allowedDir) => {
    const resolvedAllowed = path.resolve(allowedDir);
    const relative = path.relative(resolvedAllowed, resolved);
    return !relative.startsWith("..") && !path.isAbsolute(relative);
  });

  if (!isAllowed) {
    throw new SecurityException(`Path "${resolved}" is outside authorized workspace directories.`);
  }

  return resolved;
}
```
Attempts to access `C:\Windows\System32`, `~/.ssh/id_rsa`, or `/etc/shadow` are rejected on the client side before any disk I/O occurs.

---

## 4. Cloud Container Sandbox Fleet

For autonomous background tasks, web scraping, and code execution that do not require local machine access, Meow provisions disposable cloud sandboxes.

```mermaid
flowchart LR
    TASK["Execution Request"] --> POOL["Sandbox Pool Manager"]
    POOL -->|"Cold start < 300ms"| CONTAINER["gVisor Sandboxed Micro-Container"]
    
    subgraph ContainerEnvironment["Ephemeral Container Boundaries"]
        VIRT_FS["Isolated Temporary Filesystem (RAM Disk)"]
        CHROME["Headless Chromium Browser (Puppeteer/Playwright)"]
        NODE["Node.js & Python 3.12 Runtimes"]
    end

    CONTAINER --- VIRT_FS
    CONTAINER --- CHROME
    CONTAINER --- NODE

    CONTAINER -->|"Extract Artifacts"| S3["Upload to S3 Storage"]
    CONTAINER -->|"Terminate Container"| DESTROY["Destroy Instance on Completion"]
```

### Container Resource Bounds:
- **CPU:** 1.0 vCPU limit.
- **RAM:** 1024 MB RAM limit (OOM killed on exceed).
- **Execution Lifetime:** Hard termination after 15 minutes.
- **Network Egress:** Restricted to standard HTTP/HTTPS ports (80/443). Internal cloud metadata endpoints (`169.254.169.254`) are blocked via iptables.

---

## 5. Execution Target Routing Matrix

| Execution Target | When Chosen | Behavior |
|---|---|---|
| **`cloud`** | Always cloud | Dispatches job to Inngest cloud container fleet. Works 24/7 even if user's PC is powered off. |
| **`local`** | Explicitly local | Dispatches job to the active Meow Runner WebSocket. If runner is offline, job enters `waiting_for_runner`. |
| **`auto`** | Dynamic evaluation | If task requires local tools (`read_file` on host directory) $\rightarrow$ routes to **local**. If task is web research or cron $\rightarrow$ routes to **cloud**. |

