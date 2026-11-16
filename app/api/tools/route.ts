import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { tools } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getActiveUserConnections } from "@/lib/composio/client";

// GET /api/tools — Fetch all active tools with live user connection status
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [allTools, activeConnections] = await Promise.all([
      db.select().from(tools).where(eq(tools.isActive, true)),
      getActiveUserConnections(session.user.email),
    ]);

    const enrichedTools = allTools.map((t) => ({
      ...t,
      connected: activeConnections.has(t.slug.toUpperCase()),
    }));

    return NextResponse.json(enrichedTools);
  } catch (error: any) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
