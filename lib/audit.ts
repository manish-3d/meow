import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { sql } from "drizzle-orm";
import type { Record } from "@/lib/types";

/**
 * Helper to insert an audit log entry.
 * All privileged actions (dangerous tools, role changes, background job creation, etc.)
 * should call this function so we have a complete trail per workspace.
 */
export async function logAction(params: {
  workspaceId: string;
  userId: string;
  action: string; // e.g. "create_background_job"
  targetType?: string; // optional entity type ("background_job", "role", ...)
  targetId?: string; // id of the target entity
  details?: Record<string, unknown>;
}) {
  const { workspaceId, userId, action, targetType, targetId, details } = params;
  await db
    .insert(auditLogs)
    .values({
      workspaceId,
      userId,
      action,
      targetType: targetType ?? null,
      targetId: targetId ?? null,
      details: details ?? {},
    })
    .execute();
}
