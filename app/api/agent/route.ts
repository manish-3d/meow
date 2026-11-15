import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { agentConfig } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    if (agentId) {
      const [agent] = await db
        .select()
        .from(agentConfig)
        .where(and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail)))
        .limit(1);

      if (!agent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }

      return NextResponse.json({ agent });
    }

    // Return list of all agents created by this user
    const agents = await db
      .select()
      .from(agentConfig)
      .where(eq(agentConfig.userEmail, userEmail))
      .orderBy(desc(agentConfig.createdAt));

    return NextResponse.json({ agents });
  } catch (err) {
    console.error("GET /api/agent error:", err);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { agentId, name, description, agentImage } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
    }

    const cleanAgentId = agentId || `agent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const [newAgent] = await db
      .insert(agentConfig)
      .values({
        agentId: cleanAgentId,
        name: name.trim(),
        description: description?.trim() || "Autonomous AI agent with browser automation capability.",
        agentImage: agentImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanAgentId}`,
        userEmail,
      })
      .returning();

    return NextResponse.json({ message: "Agent created successfully", agent: newAgent }, { status: 201 });
  } catch (err) {
    console.error("POST /api/agent error:", err);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { agentId, name, description, agentImage } = body;

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    const [updated] = await db
      .update(agentConfig)
      .set({
        name: name?.trim(),
        description: description?.trim(),
        agentImage,
      })
      .where(and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Agent not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Agent updated successfully", agent: updated });
  } catch (err) {
    console.error("PUT /api/agent error:", err);
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}
