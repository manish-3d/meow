import { inngest } from "@/lib/inngest";
import { db } from "@/db";
import { backgroundJobs } from "@/db/schema";
import { RegisteredTool, ToolContext } from "@/lib/tools/types";

/**
 * Background Task Tool – enqueues a job that will be executed asynchronously.
 * The LLM can request this tool when it needs to perform a long‑running operation
 * (e.g., data backup, large web scrape, batch code generation).
 *
 * The tool returns a jobId that can be referenced later for status checks.
 */
export const backgroundTaskTool: RegisteredTool = {
  id: "background_task",
  name: "background_task",
  description: "Schedule an asynchronous background job (one‑shot or recurring).",
  permissionLevel: "dangerous",
  requiresApproval: true,
  executionType: "native",
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
    const name = String(args.name ?? "unnamed_task");
    const payload = (args.payload as Record<string, unknown>) ?? {};
    const cron = args.cron ? String(args.cron) : null;
    const delaySeconds = typeof args.delaySeconds === "number" ? args.delaySeconds : undefined;

    // 1. Insert tracking record in database
    const [job] = await db
      .insert(backgroundJobs)
      .values({
        workspaceId: ctx.workspaceId,
        name,
        payload,
        cron,
        status: "pending",
        description: `${name} scheduled via backgroundTaskTool`,
      })
      .returning({ id: backgroundJobs.id });

    // 2. Dispatch to Inngest scheduler (safe in local dev without remote key)
    try {
      if (process.env.INNGEST_EVENT_KEY) {
        await inngest.send({
          name: "meow/background-job",
          data: { jobId: job.id },
          ...(cron ? { cron } : { delay: `${delaySeconds ?? 0}s` }),
        });
      } else {
        console.log(`[Inngest Local Mode] Event staged for background job: ${job.id}`);
      }
    } catch (inngestErr) {
      console.warn("[Inngest] Event dispatch warning (continuing with DB record):", inngestErr);
    }

    return { jobId: job.id, status: "scheduled", name };
  },
};
