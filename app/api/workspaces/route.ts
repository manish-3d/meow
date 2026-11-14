import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { workspaces, workspaceMembers } from "@/db/schema";
import { ensurePersonalWorkspace } from "@/lib/workspace/provision-workspace";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Ensure the user has at least their personal workspace provisioned
    const personalWorkspace = await ensurePersonalWorkspace({
      id: userId,
      name: session.user.name,
      email: session.user.email,
    });

    // Query all workspaces where user is owner or member
    const memberships = await db
      .select({
        id: workspaces.id,
        workspaceId: workspaceMembers.workspaceId,
        role: workspaceMembers.role,
        workspaceName: workspaces.name,
        workspaceSlug: workspaces.slug,
        ownerUserId: workspaces.ownerUserId,
        createdAt: workspaces.createdAt,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId));

    return NextResponse.json({
      activeWorkspace: personalWorkspace,
      workspaces: memberships,
    });
  } catch (error: unknown) {
    console.error("GET /api/workspaces error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 },
    );
  }
}

