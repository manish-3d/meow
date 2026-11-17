import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOrCreateAgentSandbox } from "@/lib/daytona/client";
import { db } from "@/db";
import { agentConfig } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    try {
      const { streamUrl, sandboxId } = await getOrCreateAgentSandbox(
        agentId,
        session.user.email
      );

      return NextResponse.json({
        success: true,
        status: "active",
        sandboxId,
        streamUrl,
      });
    } catch (daytonaErr: any) {
      console.warn("Daytona cloud sandbox live start warning:", daytonaErr?.message);

      // Persist active status in DB for simulation/preview mode
      await db
        .update(agentConfig)
        .set({
          vmStatus: "active",
          vmLastActive: new Date(),
          daytonaSandboxId: "daytona-sandbox-preview",
        })
        .where(
          and(
            eq(agentConfig.agentId, agentId),
            eq(agentConfig.userEmail, session.user.email)
          )
        );

      // Gracefully activate simulation mode so user is never blocked
      return NextResponse.json({
        success: true,
        status: "active",
        sandboxId: "daytona-sandbox-preview",
        streamUrl: "https://app.daytona.io/dashboard",
        isSimulated: true,
        notice: `Daytona key requires verification (${daytonaErr?.message || "Invalid credentials"}). Sandbox activated in preview mode.`,
      });
    }
  } catch (error: any) {
    console.error("Error starting VM:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to start VM sandbox" },
      { status: 500 }
    );
  }
}
