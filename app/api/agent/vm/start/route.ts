import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOrCreateAgentSandbox } from "@/lib/e2b/client";

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
  } catch (error: any) {
    console.error("Error starting VM:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to start VM sandbox" },
      { status: 500 }
    );
  }
}
