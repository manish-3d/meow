import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { executionLogs } from "@/db/schema";
import { inngest } from "@/lib/inngest/client";
import { runAgentRoutineLogic } from "@/lib/inngest/routine-runner";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { routineId, agentId } = await req.json();

    if (!routineId || !agentId) {
      return NextResponse.json(
        { error: "routineId and agentId are required" },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const executionId = `exec_${Date.now()}`;

    // 1. Record the running state in database immediately
    await db.insert(executionLogs).values({
      executionId,
      routineId,
      agentId,
      userEmail,
      status: "running",
      startedAt: new Date(),
    });

    // 2. Dispatch via Inngest durable queue
    let inngestDispatched = false;
    try {
      await inngest.send({
        name: "agent/routine.execute",
        data: {
          routineId,
          agentId,
          userEmail,
          executionId,
        },
      });
      inngestDispatched = true;
    } catch (inngestErr: any) {
      console.warn(
        "Inngest dev server not reachable locally, running via background worker:",
        inngestErr?.message
      );
    }

    // 3. If Inngest daemon wasn't active locally, execute directly in background
    if (!inngestDispatched) {
      (async () => {
        try {
          await runAgentRoutineLogic({
            routineId,
            agentId,
            userEmail,
            executionId,
          });
        } catch (err: any) {
          console.error("Direct routine execution error:", err?.message);
        }
      })();
    }

    return NextResponse.json({
      success: true,
      executionId,
      inngestDispatched,
      message: "Routine triggered successfully",
    });
  } catch (error: any) {
    console.error("Error in POST /api/agent/schedule/run-now:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
