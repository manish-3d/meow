import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { routines, executionLogs, agentConfig } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET /api/agent/schedule — List all routines and recent telemetry logs for an agent
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
    // 1. Verify agent ownership
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

    // 2. Fetch all routines belonging to this agent
    const agentRoutines = await db
      .select()
      .from(routines)
      .where(
        and(
          eq(routines.agentId, agentId),
          eq(routines.userEmail, session.user.email)
        )
      )
      .orderBy(desc(routines.createdAt));

    // 3. Fetch recent execution logs (last 15 runs)
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
      .limit(15);

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

// POST /api/agent/schedule — Create or Update a routine (Upsert)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      routineId,
      agentId,
      title,
      prompt,
      frequency,
      scheduledTime,
      timezone,
      runType,
      maxRuns,
      daysOfWeek,
      targetDate,
      isActive,
    } = body;

    if (!routineId) {
      return NextResponse.json({ error: "routineId is required" }, { status: 400 });
    }

    // Check if routine already exists
    const existing = await db
      .select()
      .from(routines)
      .where(
        and(
          eq(routines.routineId, routineId),
          eq(routines.userEmail, session.user.email)
        )
      );

    if (existing.length > 0) {
      // UPDATE existing routine
      await db
        .update(routines)
        .set({
          ...(title !== undefined && { title }),
          ...(prompt !== undefined && { prompt }),
          ...(frequency !== undefined && { frequency }),
          ...(scheduledTime !== undefined && { scheduledTime }),
          ...(timezone !== undefined && { timezone }),
          ...(runType !== undefined && { runType }),
          ...(maxRuns !== undefined && { maxRuns }),
          ...(daysOfWeek !== undefined && { daysOfWeek }),
          ...(targetDate !== undefined && { targetDate }),
          ...(isActive !== undefined && { isActive }),
        })
        .where(
          and(
            eq(routines.routineId, routineId),
            eq(routines.userEmail, session.user.email)
          )
        );

      return NextResponse.json({ success: true, action: "updated", routineId });
    }

    // INSERT new routine
    if (!agentId || !title || !prompt) {
      return NextResponse.json(
        { error: "agentId, title, and prompt are required to create a new routine" },
        { status: 400 }
      );
    }

    await db.insert(routines).values({
      routineId,
      agentId,
      userEmail: session.user.email,
      title,
      prompt,
      frequency: frequency || "daily",
      scheduledTime: scheduledTime || "08:00 AM UTC",
      timezone: timezone || "UTC",
      runType: runType || (frequency === "once" ? "once" : "recurring"),
      maxRuns: maxRuns !== undefined ? maxRuns : (runType === "once" ? 1 : null),
      currentRunCount: 0,
      daysOfWeek: daysOfWeek || null,
      targetDate: targetDate || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, action: "created", routineId });
  } catch (error: any) {
    console.error("Error in POST /api/agent/schedule:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/agent/schedule — Delete a routine and its child execution logs
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const routineId = searchParams.get("routineId");

  if (!routineId) {
    return NextResponse.json({ error: "routineId is required" }, { status: 400 });
  }

  try {
    // 1. Delete child execution logs
    await db
      .delete(executionLogs)
      .where(
        and(
          eq(executionLogs.routineId, routineId),
          eq(executionLogs.userEmail, session.user.email)
        )
      );

    // 2. Delete the routine record
    await db
      .delete(routines)
      .where(
        and(
          eq(routines.routineId, routineId),
          eq(routines.userEmail, session.user.email)
        )
      );

    return NextResponse.json({ success: true, deletedRoutineId: routineId });
  } catch (error: any) {
    console.error("Error in DELETE /api/agent/schedule:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete routine" },
      { status: 500 }
    );
  }
}
