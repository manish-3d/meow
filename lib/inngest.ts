// Inngest SDK initialization for Meow
import { Inngest } from "inngest";

// The Inngest function name must be globally unique; we use a namespace based on the repo.
export const inngest = new Inngest({
  id: "meow",
  // In production you would set the environment via an env var.
  // For local development we default to "dev".
  env: process.env.INNGEST_ENV ?? "dev",
});

// Export a helper to create a background job that stores a reference to the
// continuation (conversationId, turnId) so the worker can resume the AgentRunner.
export interface ContinuationContext {
  conversationId: string;
  turnId: string; // UUID of the turn stored in DB (you could add a column later)
  agentId: string;
}

export function scheduleBackgroundJob(
  name: string,
  payload: Record<string, unknown>,
  cron?: string,
  delaySeconds?: number,
) {
  // If a cron expression is provided we create a recurring trigger,
  // otherwise we schedule a one‑shot timer.
  return inngest.send({
    name,
    data: payload,
    ...(cron ? { cron } : { delay: `${delaySeconds ?? 0}s` }),
  });
}
