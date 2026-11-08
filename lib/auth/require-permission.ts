import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { permissions, rolePermissions, userRoles, workspaceMembers, workspaces } from "@/db/schema";
import { requireWorkspaceAccess } from "./require-workspace-access";

export interface PermissionCheckResult {
  authorized: boolean;
  status: number;
  message?: string;
  userId?: string;
}

/**
 * Validates that the current session user has a specific RBAC permission
 * within the given workspace. Workspace owners automatically possess all permissions.
 */
export async function requirePermission(
  workspaceId: string,
  permissionName: string,
): Promise<PermissionCheckResult> {
  const access = await requireWorkspaceAccess(workspaceId);
  if (!access.authorized || !access.userId) {
    return {
      authorized: false,
      status: access.status ?? 403,
      message: access.message ?? "Unauthorized",
    };
  }

  // Workspace owners automatically have complete superuser clearance
  if (access.role === "owner" || access.role === "admin") {
    return { authorized: true, status: 200, userId: access.userId };
  }

  // 1. Locate the permission definition
  const [perm] = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(eq(permissions.name, permissionName))
    .limit(1);

  if (!perm) {
    return {
      authorized: false,
      status: 403,
      message: `Permission '${permissionName}' is not recognized in the system`,
    };
  }

  // 2. Query user roles joined with role permissions
  const matchingAssignment = await db
    .select({ roleId: userRoles.roleId })
    .from(userRoles)
    .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
    .where(
      and(
        eq(userRoles.userId, access.userId),
        eq(userRoles.workspaceId, workspaceId),
        eq(rolePermissions.permissionId, perm.id),
      ),
    )
    .limit(1);

  if (matchingAssignment.length === 0) {
    return {
      authorized: false,
      status: 403,
      message: `User lacks required permission: ${permissionName}`,
    };
  }

  return { authorized: true, status: 200, userId: access.userId };
}
