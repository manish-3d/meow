import { Sandbox } from "@e2b/desktop";
import { db } from "@/db";
import { agentConfig } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const e2bApiKey = process.env.E2B_API_KEY || "";

/**
 * Checks whether E2B Cloud Sandbox is configured
 */
export function isE2BConfigured(): boolean {
  return !!e2bApiKey && e2bApiKey.trim().length > 0;
}

export interface VMSessionInfo {
  sandboxId: string | null;
  status: "active" | "paused" | "inactive";
  streamUrl: string | null;
  lastActive: string | null;
  isConfigured: boolean;
  message?: string;
}

/**
 * Connects to an existing agent sandbox or provisions a fresh cloud desktop sandbox.
 * Enforces 2-minute auto-timeout to preserve compute credits.
 */
export async function getOrCreateAgentSandbox(
  agentId: string,
  userEmail: string
): Promise<{ sandbox: Sandbox; streamUrl: string; sandboxId: string }> {
  if (!isE2BConfigured()) {
    throw new Error(
      "E2B_API_KEY is not configured in .env. Please add your free E2B API key from https://e2b.dev to enable cloud VM desktops."
    );
  }

  // 1. Fetch current agent config
  const records = await db
    .select()
    .from(agentConfig)
    .where(
      and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
    );

  if (!records.length) {
    throw new Error(`Agent ${agentId} not found`);
  }

  const currentAgent = records[0];
  let sandbox: Sandbox | null = null;
  let sandboxId = currentAgent.e2bSandboxId;

  // 2. Attempt to reconnect to existing sandbox if ID exists
  if (sandboxId) {
    try {
      sandbox = await Sandbox.connect(sandboxId, {
        apiKey: e2bApiKey,
      });
      // Extend timeout by 2 minutes on activity
      await sandbox.setTimeout(120_000);
    } catch (connectErr: any) {
      console.warn(`Sandbox ${sandboxId} could not be reconnected (likely expired):`, connectErr?.message);
      sandbox = null;
    }
  }

  // 3. Create fresh sandbox if reconnect failed or first time
  if (!sandbox) {
    sandbox = await Sandbox.create({
      apiKey: e2bApiKey,
      timeoutMs: 120_000, // 2-minute auto-pause
    });
    sandboxId = sandbox.sandboxId;

    // Save persistent sandboxId to agent configuration
    await db
      .update(agentConfig)
      .set({
        e2bSandboxId: sandboxId,
        vmStatus: "active",
        vmLastActive: new Date(),
      })
      .where(
        and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
      );
  } else {
    // Update status to active
    await db
      .update(agentConfig)
      .set({
        vmStatus: "active",
        vmLastActive: new Date(),
      })
      .where(
        and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
      );
  }

  // Port 6080 hosts the noVNC remote desktop web viewer
  const host = sandbox.getHost(6080);
  const streamUrl = `https://${host}/vnc.html?autoconnect=true&resize=remote`;

  return {
    sandbox,
    streamUrl,
    sandboxId: sandbox.sandboxId,
  };
}

/**
 * Pauses an agent's active sandbox to save credits
 */
export async function pauseAgentSandbox(agentId: string, userEmail: string): Promise<void> {
  const records = await db
    .select()
    .from(agentConfig)
    .where(
      and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
    );

  if (!records.length) return;
  const current = records[0];

  if (current.e2bSandboxId && isE2BConfigured()) {
    try {
      const sandbox = await Sandbox.connect(current.e2bSandboxId, { apiKey: e2bApiKey });
      await sandbox.pause();
    } catch (e: any) {
      console.warn("Could not pause remote sandbox:", e?.message);
    }
  }

  await db
    .update(agentConfig)
    .set({
      vmStatus: "paused",
    })
    .where(
      and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
    );
}

/**
 * Retrieves the current VM status and stream URL for an agent
 */
export async function getAgentVMStatus(agentId: string, userEmail: string): Promise<VMSessionInfo> {
  const isConfigured = isE2BConfigured();

  const records = await db
    .select()
    .from(agentConfig)
    .where(
      and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
    );

  if (!records.length) {
    return {
      sandboxId: null,
      status: "inactive",
      streamUrl: null,
      lastActive: null,
      isConfigured,
      message: "Agent not found",
    };
  }

  const current = records[0];
  const lastActive = current.vmLastActive ? new Date(current.vmLastActive).toISOString() : null;

  // Check if status is still active or timed out (>2 minutes)
  let status = current.vmStatus as "active" | "paused" | "inactive";
  let streamUrl: string | null = null;

  if (status === "active" && current.vmLastActive) {
    const elapsedMs = Date.now() - new Date(current.vmLastActive).getTime();
    if (elapsedMs > 120_000) {
      status = "paused";
    }
  }

  if (status === "active" && current.e2bSandboxId && isConfigured) {
    streamUrl = `https://${current.e2bSandboxId}-6080.e2b.dev/vnc.html?autoconnect=true&resize=remote`;
  }

  return {
    sandboxId: current.e2bSandboxId || null,
    status,
    streamUrl,
    lastActive,
    isConfigured,
  };
}

/**
 * Autonomous Browser Automation Runner
 * Opens the browser on the cloud desktop, navigates to target URL, and returns text content.
 */
export async function runAgentBrowserTask(
  agentId: string,
  userEmail: string,
  targetUrl: string,
  objective?: string
): Promise<{ success: boolean; summary: string; screenshotUrl?: string }> {
  const { sandbox } = await getOrCreateAgentSandbox(agentId, userEmail);

  try {
    // 1. Launch browser to the target URL
    const launchCommand = `google-chrome --no-sandbox "${targetUrl}" > /dev/null 2>&1 &`;
    await (sandbox as any).commands?.run(launchCommand);

    // 2. Wait for page load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. Take screenshot of live desktop
    const screenshotBuffer = await sandbox.screenshot();
    const screenshotBase64 = Buffer.from(screenshotBuffer).toString("base64");
    const screenshotUrl = `data:image/png;base64,${screenshotBase64}`;

    // 4. Extract visible textual content using curl or headless reader
    const extractCmd = `curl -sL "${targetUrl}" | sed -e 's/<[^>]*>/ /g' | tr -s ' ' | head -n 100`;
    const extractRes = await (sandbox as any).commands?.run(extractCmd);
    const textOutput = extractRes?.stdout?.slice(0, 4000) || "Page opened on Cloud VM desktop.";

    return {
      success: true,
      summary: `Successfully navigated to ${targetUrl} on Cloud VM Desktop.\n\nExtracted Content Preview:\n${textOutput}`,
      screenshotUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      summary: `Failed to execute browser task on Cloud VM: ${err?.message || "Unknown error"}`,
    };
  }
}
