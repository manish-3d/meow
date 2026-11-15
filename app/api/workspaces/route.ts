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

    const userId = session?.user?.id || "default-user";
    const userName = session?.user?.name || "Meow Default";
    const userEmail = session?.user?.email || "default@meow.ai";

    // Ensure the user has at least their personal workspace provisioned
    let personalWorkspace = null;
    try {
      personalWorkspace = await ensurePersonalWorkspace({
        id: userId,
        name: userName,
        email: userEmail,
      });
    } catch (e) {
      console.warn("Could not ensure personal workspace, querying existing:", e);
      try {
        const [anyWs] = await db.select().from(workspaces).limit(1);
        if (anyWs) personalWorkspace = anyWs;
      } catch (dbErr) {
        console.error("DB query failed:", dbErr);
      }
    }

    if (!personalWorkspace) {
      personalWorkspace = {
        id: "default-workspace",
        name: "Meow Production Workspace",
        slug: "default",
        ownerUserId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Query all workspaces where user is owner or member
    let memberships: Array<{
      id: string;
      workspaceId: string;
      role: string;
      workspaceName: string;
      workspaceSlug: string;
      ownerUserId: string;
      createdAt: Date;
    }> = [];

    try {
      memberships = await db
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
    } catch (queryErr) {
      console.warn("Could not query memberships:", queryErr);
    }

    if (!memberships || memberships.length === 0) {
      memberships = [
        {
          id: personalWorkspace.id,
          workspaceId: personalWorkspace.id,
          role: "owner",
          workspaceName: personalWorkspace.name,
          workspaceSlug: personalWorkspace.slug,
          ownerUserId: personalWorkspace.ownerUserId,
          createdAt: personalWorkspace.createdAt || new Date(),
        },
      ];
    }

    return NextResponse.json({
      activeWorkspace: personalWorkspace,
      workspaces: memberships,
    });
  } catch (error: unknown) {
    console.error("GET /api/workspaces error:", error);
    return NextResponse.json({
      activeWorkspace: {
        id: "default-workspace",
        name: "Meow Production Workspace",
        slug: "default",
        ownerUserId: "default-user",
      },
      workspaces: [
        {
          id: "default-workspace",
          workspaceId: "default-workspace",
          role: "owner",
          workspaceName: "Meow Production Workspace",
          workspaceSlug: "default",
          ownerUserId: "default-user",
          createdAt: new Date(),
        },
      ],
    });
  }
}

