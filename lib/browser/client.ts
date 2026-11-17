import type { Browser, BrowserContext, Page } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";
import { db } from "@/db";
import { agentConfig } from "@/db/schema";
import { eq, and } from "drizzle-orm";

async function getChromium() {
  const { chromium } = await import("playwright-core");
  return chromium;
}

function getBrowserbaseApiKey(): string {
  return process.env.BROWSERBASE_API_KEY || "";
}

function getBrowserbaseProjectId(): string {
  return process.env.BROWSERBASE_PROJECT_ID || "";
}

/**
 * Checks whether Browserbase Cloud is configured
 */
export function isBrowserbaseConfigured(): boolean {
  const key = getBrowserbaseApiKey();
  return !!key && key.trim().length > 0;
}

export interface BrowserSessionState {
  sessionId: string;
  mode: "browserbase" | "local";
  configuredMode?: "browserbase" | "local";
  status: "idle" | "running" | "interrupted" | "closed";
  streamUrl: string | null;
  lastScreenshot?: string | null;
  currentUrl?: string;
  lastActive: string;
}

// In-memory registry for active local or cloud browser instances
const activeSessions = new Map<
  string,
  {
    browser: Browser;
    context: BrowserContext;
    page: Page;
    mode: "browserbase" | "local";
    streamUrl: string | null;
    status: "idle" | "running" | "interrupted" | "closed";
    lastScreenshot: string | null;
    currentUrl: string;
    lastActive: number;
    sessionId: string;
  }
>();

/**
 * Finds a suitable local Chromium/Chrome/Edge executable on the host
 */
async function launchLocalBrowser(headless = true): Promise<Browser> {
  const chromium = await getChromium();
  // Try system Google Chrome first, fallback to Microsoft Edge on Windows
  try {
    return await chromium.launch({
      headless,
      channel: "chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  } catch (chromeErr) {
    try {
      return await chromium.launch({
        headless,
        channel: "msedge",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
    } catch (edgeErr) {
      // Fallback to default bundled executable if installed
      return await chromium.launch({
        headless,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
  }
}

/**
 * Updates agent's preferred browser execution mode (Cloud Browserbase vs Local Playwright)
 */
export async function setAgentBrowserMode(
  agentId: string,
  userEmail: string,
  browserMode: "browserbase" | "local"
): Promise<void> {
  await db
    .update(agentConfig)
    .set({
      browserMode,
    })
    .where(
      and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
    );

  // If there's an active session with a different mode, close it cleanly
  const sessionKey = `${userEmail}:${agentId}`;
  const existing = activeSessions.get(sessionKey);
  if (existing && existing.mode !== browserMode) {
    try {
      await existing.browser.close();
    } catch (e) {
      // ignore
    }
    activeSessions.delete(sessionKey);
  }
}

/**
 * Gets or initializes an active browser session for an agent.
 * Respects user's preferred mode (Cloud vs Local) and intelligently routes
 * background routines to Browserbase so they succeed even if the user's PC is offline.
 */
export async function getOrCreateBrowserSession(
  agentId: string,
  userEmail: string,
  headless = true,
  preferredMode?: "browserbase" | "local",
  isBackgroundRoutine = false
): Promise<{
  page: Page;
  mode: "browserbase" | "local";
  streamUrl: string | null;
  sessionId: string;
}> {
  const sessionKey = `${userEmail}:${agentId}`;
  const existing = activeSessions.get(sessionKey);

  // Determine which mode to use
  let modeToUse: "browserbase" | "local" = preferredMode || "browserbase";
  if (!preferredMode) {
    try {
      const records = await db
        .select({ browserMode: agentConfig.browserMode })
        .from(agentConfig)
        .where(
          and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
        );
      if (records[0]?.browserMode) {
        modeToUse = records[0].browserMode as "browserbase" | "local";
      }
    } catch (e) {
      modeToUse = isBrowserbaseConfigured() ? "browserbase" : "local";
    }
  }

  // Offline / Background Routine Guard:
  // If running in background worker (e.g. Inngest scheduled routine while PC is off),
  // automatically route to cloud Browserbase!
  if (isBackgroundRoutine && isBrowserbaseConfigured()) {
    modeToUse = "browserbase";
  }

  // Return existing session if open, healthy, and matching the requested mode
  if (
    existing &&
    existing.mode === modeToUse &&
    existing.browser.isConnected() &&
    !existing.page.isClosed()
  ) {
    existing.lastActive = Date.now();
    return {
      page: existing.page,
      mode: existing.mode,
      streamUrl: existing.streamUrl,
      sessionId: existing.sessionId,
    };
  } else if (existing) {
    // If mode changed (e.g. user toggled from cloud to local), close previous instance
    try {
      await existing.browser.close();
    } catch (e) {
      // ignore
    }
    activeSessions.delete(sessionKey);
  }

  // 1. Browserbase Cloud Execution (Default Cloud Sandbox)
  if (modeToUse === "browserbase" && isBrowserbaseConfigured()) {
    try {
      const bb = new Browserbase({ apiKey: getBrowserbaseApiKey() });
      const projectId = getBrowserbaseProjectId();
      const session = await bb.sessions.create({
        projectId: projectId || undefined,
      });

      const chromium = await getChromium();
      const browser = await chromium.connectOverCDP(session.connectUrl);
      const context = browser.contexts()[0] || (await browser.newContext());
      const page = context.pages()[0] || (await context.newPage());

      // Fetch live interactive debugger URL for the UI iframe
      let streamUrl: string | null = null;
      try {
        const liveUrls = await bb.sessions.debug(session.id);
        streamUrl = liveUrls.debuggerFullscreenUrl || liveUrls.debuggerUrl || null;
      } catch (debugErr) {
        console.warn("Could not fetch Browserbase live debug URL:", debugErr);
      }

      activeSessions.set(sessionKey, {
        browser,
        context,
        page,
        mode: "browserbase",
        streamUrl,
        status: "idle",
        lastScreenshot: null,
        currentUrl: "about:blank",
        lastActive: Date.now(),
        sessionId: session.id,
      });

      // Update database status
      await db
        .update(agentConfig)
        .set({
          e2bSandboxId: session.id,
          vmStatus: "active",
          vmLastActive: new Date(),
          browserMode: "browserbase",
        })
        .where(
          and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
        );

      return {
        page,
        mode: "browserbase",
        streamUrl,
        sessionId: session.id,
      };
    } catch (bbErr: any) {
      console.warn("Browserbase cloud session initialization failed, falling back to local Playwright:", bbErr?.message);
    }
  }

  // 2. Local Playwright Execution (Free Host Chrome/Edge, Zero Quota Consumption)
  try {
    const browser = await launchLocalBrowser(headless);
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();
    const localSessionId = `local-${Date.now()}`;

    activeSessions.set(sessionKey, {
      browser,
      context,
      page,
      mode: "local",
      streamUrl: null, // Local mode streams real screenshots to UI
      status: "idle",
      lastScreenshot: null,
      currentUrl: "about:blank",
      lastActive: Date.now(),
      sessionId: localSessionId,
    });

    // Update DB state
    await db
      .update(agentConfig)
      .set({
        e2bSandboxId: localSessionId,
        vmStatus: "active",
        vmLastActive: new Date(),
        browserMode: "local",
      })
      .where(
        and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
      );

    return {
      page,
      mode: "local",
      streamUrl: null,
      sessionId: localSessionId,
    };
  } catch (localErr: any) {
    // If local execution fails (e.g., serverless Vercel host without Chrome) and Browserbase is configured, fall back to cloud
    if (isBrowserbaseConfigured()) {
      console.warn(
        "Local browser launch failed, automatically falling back to Browserbase Cloud:",
        localErr?.message
      );
      return await getOrCreateBrowserSession(
        agentId,
        userEmail,
        headless,
        "browserbase",
        true
      );
    }
    throw new Error(
      `Browser launch failed: ${localErr?.message || "Local browser unavailable"}. Ensure Google Chrome is installed or configure BROWSERBASE_API_KEY.`
    );
  }
}

/**
 * Autonomous Browser Automation Runner
 * Opens URL, extracts visible text, captures a screenshot, and supports user takeover.
 */
export async function runPlaywrightBrowserTask(
  agentId: string,
  userEmail: string,
  targetUrl: string,
  objective?: string,
  preferredMode?: "browserbase" | "local",
  isBackgroundRoutine = false
): Promise<{
  success: boolean;
  summary: string;
  screenshotUrl?: string;
  mode: "browserbase" | "local";
  currentUrl: string;
}> {
  const sessionKey = `${userEmail}:${agentId}`;
  const { page, mode } = await getOrCreateBrowserSession(
    agentId,
    userEmail,
    true,
    preferredMode,
    isBackgroundRoutine
  );

  try {
    const session = activeSessions.get(sessionKey);
    if (session) {
      session.status = "running";
      session.currentUrl = targetUrl;
    }

    // 1. Navigate to target URL
    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Brief stabilization wait for dynamic client-side rendering
    await page.waitForTimeout(2000);

    // 2. Capture screenshot for UI viewport
    const screenshotBuffer = await page.screenshot({
      type: "png",
      fullPage: false,
    });
    const screenshotBase64 = screenshotBuffer.toString("base64");
    const screenshotUrl = `data:image/png;base64,${screenshotBase64}`;

    if (session) {
      session.lastScreenshot = screenshotUrl;
      session.status = "idle";
      session.currentUrl = page.url();
      session.lastActive = Date.now();
    }

    // 3. Extract readable textual content from page
    const pageTitle = await page.title();
    const extractedText = await page.evaluate(() => {
      // Remove scripts, styles, and SVG icons to keep LLM context clean
      const clone = document.body.cloneNode(true) as HTMLElement;
      const elementsToRemove = clone.querySelectorAll("script, style, svg, noscript");
      elementsToRemove.forEach((el) => el.remove());
      const rawText = clone.innerText || clone.textContent || "";
      return rawText.replace(/\s+/g, " ").trim().slice(0, 4000);
    });

    return {
      success: true,
      summary: `Successfully navigated to "${pageTitle}" (${page.url()}).\n\nPage Content Preview:\n${extractedText}`,
      screenshotUrl,
      mode,
      currentUrl: page.url(),
    };
  } catch (err: any) {
    if (sessionKey && activeSessions.has(sessionKey)) {
      activeSessions.get(sessionKey)!.status = "idle";
    }
    return {
      success: false,
      summary: `Browser task failed: ${err?.message || "Navigation error"}`,
      mode,
      currentUrl: targetUrl,
    };
  }
}

/**
 * Human-In-The-Loop: Interrupt the agent and allow the user to take over the browser
 */
export async function interruptBrowserSession(
  agentId: string,
  userEmail: string
): Promise<{ success: boolean; status: string; message: string }> {
  const sessionKey = `${userEmail}:${agentId}`;
  const session = activeSessions.get(sessionKey);

  if (!session) {
    return {
      success: false,
      status: "closed",
      message: "No active browser session found to interrupt.",
    };
  }

  session.status = "interrupted";

  return {
    success: true,
    status: "interrupted",
    message: "Browser session interrupted. User now has full manual control.",
  };
}

/**
 * Resumes automated agent control after user interruption
 */
export async function resumeBrowserSession(
  agentId: string,
  userEmail: string
): Promise<{ success: boolean; status: string }> {
  const sessionKey = `${userEmail}:${agentId}`;
  const session = activeSessions.get(sessionKey);

  if (!session) {
    return { success: false, status: "closed" };
  }

  session.status = "idle";
  session.lastActive = Date.now();

  return { success: true, status: "idle" };
}

/**
 * Closes an active browser session to free up system resources
 */
export async function closeBrowserSession(
  agentId: string,
  userEmail: string
): Promise<void> {
  const sessionKey = `${userEmail}:${agentId}`;
  const session = activeSessions.get(sessionKey);

  if (session) {
    try {
      await session.browser.close();
    } catch (e) {
      // ignore
    }
    activeSessions.delete(sessionKey);
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
 * Retrieves the current session status and live viewport information
 */
export async function getBrowserSessionStatus(
  agentId: string,
  userEmail: string
): Promise<BrowserSessionState> {
  const sessionKey = `${userEmail}:${agentId}`;
  const session = activeSessions.get(sessionKey);

  // Fetch persisted configuredMode from agentConfig
  let configuredMode: "browserbase" | "local" = "browserbase";
  let lastActiveTimestamp: string = new Date().toISOString();
  let dbStatus = "idle";
  let dbSandboxId = "none";

  try {
    const records = await db
      .select()
      .from(agentConfig)
      .where(
        and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail))
      )
      .limit(1);

    if (records.length > 0) {
      configuredMode = (records[0].browserMode as "browserbase" | "local") || "browserbase";
      dbStatus = records[0].vmStatus || "idle";
      dbSandboxId = records[0].e2bSandboxId || "none";
      if (records[0].vmLastActive) {
        lastActiveTimestamp = new Date(records[0].vmLastActive).toISOString();
      }
    }
  } catch (err) {
    console.warn("Could not read agent browser config:", err);
  }

  if (session && session.browser.isConnected() && !session.page.isClosed()) {
    return {
      sessionId: session.sessionId,
      mode: session.mode,
      configuredMode,
      status: session.status,
      streamUrl: session.streamUrl,
      lastScreenshot: session.lastScreenshot,
      currentUrl: session.currentUrl,
      lastActive: new Date(session.lastActive).toISOString(),
    };
  }

  return {
    sessionId: dbSandboxId,
    mode: configuredMode,
    configuredMode,
    status: dbStatus as any,
    streamUrl: null,
    lastScreenshot: null,
    currentUrl: undefined,
    lastActive: lastActiveTimestamp,
  };
}
