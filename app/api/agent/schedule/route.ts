import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { routines } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    const list = await db
      .select()
      .from(routines)
      .where(and(eq(routines.agentId, agentId), eq(routines.userEmail, userEmail)));

    return NextResponse.json({ routines: list });
  } catch (err) {
    console.error("GET /api/agent/schedule error:", err);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
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
    const { agentId, title, instruction, frequency, time, timezone } = body;

    if (!agentId || !title?.trim() || !instruction?.trim()) {
      return NextResponse.json({ error: "agentId, title, and instruction are required" }, { status: 400 });
    }

    const [newRoutine] = await db
      .insert(routines)
      .values({
        agentId,
        userEmail,
        title: title.trim(),
        instruction: instruction.trim(),
        frequency: frequency || "daily",
        time: time || "08:00 AM",
        timezone: timezone || "UTC",
        status: "active",
      })
      .returning();

    return NextResponse.json({ message: "Routine created successfully", routine: newRoutine }, { status: 201 });
  } catch (err) {
    console.error("POST /api/agent/schedule error:", err);
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
  }
}
