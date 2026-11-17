import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { isBrowserbaseConfigured } from "@/lib/browser/client";

export const dynamic = "force-dynamic";

/**
 * Production Health Check API Endpoint
 * GET /api/health
 *
 * Verifies system readiness, database connectivity, and integrated cloud services
 * for deployment monitors (Vercel, BetterStack, Datadog).
 */
export async function GET() {
  const startTime = Date.now();
  let dbStatus = "unknown";
  let dbLatencyMs = 0;

  // 1. Check PostgreSQL Database Connectivity
  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "connected";
  } catch (err: any) {
    dbStatus = `error: ${err?.message || "connection failed"}`;
  }

  // 2. Audit Cloud Integrations
  const isAuthReady = Boolean(process.env.NEXTAUTH_SECRET);
  const isGeminiReady = Boolean(process.env.GEMINI_API_KEY);
  const isComposioReady = Boolean(process.env.COMPOSIO_API_KEY);
  const isBrowserbaseReady = isBrowserbaseConfigured();
  const isInngestReady = Boolean(
    process.env.INNGEST_EVENT_KEY || process.env.INNGEST_SIGNING_KEY
  );

  const isHealthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      uptimeSeconds: Math.floor(process.uptime()),
      totalLatencyMs: Date.now() - startTime,
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      services: {
        auth: isAuthReady ? "configured" : "missing_secret",
        geminiAi: isGeminiReady ? "configured" : "missing_key",
        composioTools: isComposioReady ? "configured" : "missing_key",
        browserbaseCdp: isBrowserbaseReady ? "configured" : "unconfigured",
        inngestScheduler: isInngestReady ? "configured" : "unconfigured",
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
