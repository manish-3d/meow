import { inngest } from "./client";
import { db } from "@/db";
import { routines, executionLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { runAgentRoutineLogic } from "./routine-runner";

/**
 * Autonomous Agent Routine Execution Job
 * Triggered by:
 * 1. Event: 'agent/routine.execute' (Manual "Run Now" from UI)
 * 2. Scheduled Inngest Cron
 */
export const executeAgentRoutineJob = inngest.createFunction(
  {
    id: "execute-agent-routine",
    name: "Execute Autonomous Agent Routine",
    retries: 2,
  },
  { event: "agent/routine.execute" },
  async ({ event, step }) => {
    const { routineId, agentId, userEmail } = event.data;
    const executionId = event.data.executionId || `exec_${Date.now()}`;

    // Step 1: Ensure initial 'running' log exists
    await step.run("init-routine-execution", async () => {
      const existing = await db
        .select()
        .from(executionLogs)
        .where(eq(executionLogs.executionId, executionId));

      if (!existing.length) {
        await db.insert(executionLogs).values({
          executionId,
          routineId,
          agentId,
          userEmail,
          status: "running",
          startedAt: new Date(),
        });
      }
      return { executionId };
    });

    try {
      // Step 2: Execute routine using tools and reasoning
      const result = await step.run("execute-routine-reasoning", async () => {
        const summary = await runAgentRoutineLogic({
          routineId,
          agentId,
          userEmail,
          executionId,
        });
        return { summary };
      });

      return {
        success: true,
        executionId,
        summary: result.summary,
      };
    } catch (routineError: any) {
      // Step 3: Handle error and mark log as failed
      await step.run("record-routine-failure", async () => {
        await db
          .update(executionLogs)
          .set({
            status: "failed",
            error: routineError?.message || "Routine execution failed",
            completedAt: new Date(),
          })
          .where(eq(executionLogs.executionId, executionId));
      });

      throw routineError;
    }
  }
);

/**
 * Daily Scheduled Cron Routine
 * Runs every day at 08:00 AM UTC across all active agent routines
 */
export const dailyAgentRoutinesCronJob = inngest.createFunction(
  {
    id: "daily-agent-routines-cron",
    name: "Daily Agent Routines Cron Job",
  },
  { cron: "0 8 * * *" }, // Runs every day at 08:00 AM UTC
  async ({ step }) => {
    const activeRoutines = await step.run("fetch-all-active-routines", async () => {
      const records = await db
        .select()
        .from(routines)
        .where(eq(routines.isActive, true));

      return records.map((r) => ({
        routineId: r.routineId,
        agentId: r.agentId,
        userEmail: r.userEmail,
      }));
    });

    // Enqueue an execution event for each active routine
    for (const routine of activeRoutines) {
      await step.sendEvent(`trigger-${routine.routineId}`, {
        name: "agent/routine.execute",
        data: {
          routineId: routine.routineId,
          agentId: routine.agentId,
          userEmail: routine.userEmail,
        },
      });
    }

    return {
      triggeredRoutinesCount: activeRoutines.length,
    };
  }
);
