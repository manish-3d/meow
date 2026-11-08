import { Inngest } from "inngest";
import { inngest } from "@/lib/inngest";
import { db } from "@/db";
import { backgroundJobs } from "@/db/schema";
import { AgentRunner } from "@/lib/ai/runner";
import { ToolContext } from "@/lib/tools/types";

/**
 * Background Task Tool – enqueues a job that will be executed asynchronously.
 * The LLM can request this tool when it needs to perform a long‑running operation
 * (e.g., data backup, large web scrape, batch code generation).
 *
 * The tool returns a jobId that can be referenced later for status checks.
 */
export const backgroundTaskTool = {
  id: "background_task",
  name: "background_task",
  description: "Schedule an asynchronous background job (one‑shot or recurring).",
  permissionLevel: "dangerous" as const,
  requiresApproval: true,
  executionType: "native" as const,
  // Simple JSON schema – name, payload, optional cron or delaySeconds
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "Human‑readable job name" },
      payload: { type: "object", description: "Arbitrary JSON passed to the worker" },
      cron: { type: "string", description: "Cron expression for recurring jobs (optional)" },
      delaySeconds: { type: "number", description: "Delay before first run (seconds, optional)" },
    },
    required: ["name", "payload"],
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext) {
    const { name, payload, cron, delaySeconds } = args as any;
    // Insert a record so we can track it in the UI.
    const [job] = await db
      .insert(backgroundJobs)
      .values({
        workspaceId: ctx.workspaceId,
        name,
        payload,
        cron: cron ?? null,
        status: "pending",
        description: `${name} scheduled via backgroundTaskTool`,
      })
      .returning({ id: backgroundJobs.id });

    // Fire the Inngest event – the worker will fetch the job record.
    await inngest.send({
      name: "meow/background-job",
      data: { jobId: job.id },
      ...(cron ? { cron } : { delay: `${delaySeconds ?? 0}s` }),
    });

    return { jobId: job.id };
  },
};
