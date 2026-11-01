import { getServerSession } from "next-auth";
import { eq, and } from "drizzle-orm";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { workspaceMembers, workspaces, WorkspaceRole } from "@/db/schema";

export async function requireWorkspaceAccess(workspaceId: string) {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  if (!userId) {
    return {
      authorized: false as const,
      status: 401,
      message: "Unauthorized",
    };
  }

  // Check if workspace exists and if user is direct owner
  const [workspace] = await db
    .select({
      ownerUserId: workspaces.ownerUserId,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) {
    return {
      authorized: false as const,
      status: 404,
      message: "Workspace not found",
    };
  }

  if (workspace.ownerUserId === userId) {
    return {
      authorized: true as const,
      userId,
      role: "owner" as WorkspaceRole,
    };
  }

  // Check membership table
  const [membership] = await db
    .select({
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId),
      ),
    )
    .limit(1);

  if (!membership) {
    return {
      authorized: false as const,
      status: 403,
      message: "You do not have access to this workspace",
    };
  }

  return {
    authorized: true as const,
    userId,
    role: membership.role,
  };
}
