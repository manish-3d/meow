import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { routines, executionLogs, agentConfig } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  try {
    // 1. Verify agent exists and belongs to user
    const agentRecords = await db
      .select()
      .from(agentConfig)
      .where(
        and(
          eq(agentConfig.agentId, agentId),
          eq(agentConfig.userEmail, session.user.email)
        )
      );

    if (!agentRecords.length) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 2. Fetch routines for this agent
    let agentRoutines = await db
      .select()
      .from(routines)
      .where(
        and(
          eq(routines.agentId, agentId),
          eq(routines.userEmail, session.user.email)
        )
      );

    // If no routine exists yet, seed an initial daily routine
    if (agentRoutines.length === 0) {
      const initialRoutine = {
        routineId: `routine_${agentId.slice(0, 8)}`,
        agentId,
        userEmail: session.user.email,
        title: "Daily Unread Email Summary",
        prompt:
          "Fetch my unread emails using Gmail, categorize them by importance (Security Alerts, Service Notifications, Updates), and generate an executive summary with action items.",
        frequency: "daily",
        scheduledTime: "08:00 AM UTC",
        timezone: "UTC",
        isActive: true,
      };

      await db.insert(routines).values(initialRoutine);
      agentRoutines = await db
        .select()
        .from(routines)
        .where(eq(routines.routineId, initialRoutine.routineId));
    }

    // 3. Fetch recent execution logs (last 10 runs)
    const logs = await db
      .select()
      .from(executionLogs)
      .where(
        and(
          eq(executionLogs.agentId, agentId),
          eq(executionLogs.userEmail, session.user.email)
        )
      )
      .orderBy(desc(executionLogs.startedAt))
      .limit(10);

    return NextResponse.json({
      routines: agentRoutines,
      logs,
    });
  } catch (error: any) {
    console.error("Error in GET /api/agent/schedule:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { routineId, title, prompt, frequency, scheduledTime, isActive } = body;

    if (!routineId) {
      return NextResponse.json({ error: "routineId is required" }, { status: 400 });
    }

    await db
      .update(routines)
      .set({
        ...(title !== undefined && { title }),
        ...(prompt !== undefined && { prompt }),
        ...(frequency !== undefined && { frequency }),
        ...(scheduledTime !== undefined && { scheduledTime }),
        ...(isActive !== undefined && { isActive }),
      })
      .where(
        and(
          eq(routines.routineId, routineId),
          eq(routines.userEmail, session.user.email)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in POST /api/agent/schedule:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
