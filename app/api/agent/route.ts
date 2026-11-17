import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";
import { agentConfig, routines, executionLogs, agentChatHistory } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { pauseAgentSandbox } from "@/lib/e2b/client";

// POST /api/agent — Create a new agent configuration
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentId, name, description, agentImage } = await req.json();

    if (!agentId || !name) {
      return NextResponse.json(
        { error: "agentId and name are required" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(agentConfig)
      .values({
        agentId,
        name,
        description: description || "",
        agentImage: agentImage || "",
        userEmail: session.user.email,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Agent config saved successfully",
        agent: result[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/agent — Fetch user agents list OR single agent by query param ?agentId=...
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agentId = req.nextUrl.searchParams.get("agentId");

    // If specific agentId requested
    if (agentId) {
      const result = await db
        .select()
        .from(agentConfig)
        .where(
          and(
            eq(agentConfig.agentId, agentId),
            eq(agentConfig.userEmail, session.user.email)
          )
        );

      if (!result.length) {
        return NextResponse.json(
          { error: "Agent not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0]);
    }

    // Otherwise, fetch all agents owned by this user (newest first)
    const agents = await db
      .select()
      .from(agentConfig)
      .where(eq(agentConfig.userEmail, session.user.email))
      .orderBy(desc(agentConfig.createdAt));

    return NextResponse.json(agents);
  } catch (error: any) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/agent — Update existing agent configuration (name, description, agentImage, isActive)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentId, name, description, agentImage, isActive } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: "agentId is required for update" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(agentConfig)
      .set({
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(agentImage !== undefined && { agentImage }),
        ...(isActive !== undefined && { isActive }),
      })
      .where(
        and(
          eq(agentConfig.agentId, agentId),
          eq(agentConfig.userEmail, session.user.email)
        )
      )
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { error: "Agent not found or unauthorized to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Agent configuration updated successfully",
      agent: updated[0],
    });
  } catch (error: any) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/agent — Danger Zone: Cascading deletion of an agent and all associated records
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json(
      { error: "agentId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // 1. Verify agent ownership
    const existing = await db
      .select()
      .from(agentConfig)
      .where(
        and(
          eq(agentConfig.agentId, agentId),
          eq(agentConfig.userEmail, session.user.email)
        )
      );

    if (!existing.length) {
      return NextResponse.json(
        { error: "Agent not found or unauthorized to delete" },
        { status: 404 }
      );
    }

    // 2. Pause/cleanup active E2B microVM sandbox if running
    try {
      await pauseAgentSandbox(agentId, session.user.email);
    } catch (vmErr) {
      console.warn("Could not pause sandbox during agent deletion:", vmErr);
    }

    // 3. Find all routines belonging to this agent
    const agentRoutines = await db
      .select({ routineId: routines.routineId })
      .from(routines)
      .where(eq(routines.agentId, agentId));

    const routineIds = agentRoutines.map((r) => r.routineId);

    // 4. Cascade delete execution logs for this agent
    await db
      .delete(executionLogs)
      .where(eq(executionLogs.agentId, agentId));

    // 5. Cascade delete routines
    await db.delete(routines).where(eq(routines.agentId, agentId));

    // 6. Cascade delete conversational chat history
    await db
      .delete(agentChatHistory)
      .where(eq(agentChatHistory.agentId, agentId));

    // 7. Finally, delete the agent configuration record
    const deleted = await db
      .delete(agentConfig)
      .where(
        and(
          eq(agentConfig.agentId, agentId),
          eq(agentConfig.userEmail, session.user.email)
        )
      )
      .returning();

    return NextResponse.json({
      success: true,
      message: `Agent "${deleted[0]?.name || agentId}" and all associated data permanently deleted`,
      deletedAgent: deleted[0],
    });
  } catch (error: any) {
    console.error("Error deleting agent in danger zone:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete agent" },
      { status: 500 }
    );
  }
}
