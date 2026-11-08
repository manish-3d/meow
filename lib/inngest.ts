import { inngest } from "./inngest/client";

export { inngest };

export interface ContinuationContext {
  conversationId: string;
  turnId: string;
  agentId: string;
}

export async function scheduleBackgroundJob(
  name: string,
  payload: Record<string, unknown>,
  cron?: string,
  delaySeconds?: number,
) {
  if (process.env.INNGEST_EVENT_KEY) {
    return await inngest.send({
      name,
      data: payload,
      ...(cron ? { cron } : { delay: `${delaySeconds ?? 0}s` }),
    });
  }
  return { ids: [`local_mock_${Date.now()}`] };
}
