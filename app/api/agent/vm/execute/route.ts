import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { runAgentBrowserTask } from "@/lib/daytona/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentId, targetUrl, objective } = await req.json();

    if (!agentId || !targetUrl) {
      return NextResponse.json(
        { error: "agentId and targetUrl are required" },
        { status: 400 }
      );
    }

    const result = await runAgentBrowserTask(
      agentId,
      session.user.email,
      targetUrl,
      objective
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error executing VM task:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute browser task" },
      { status: 500 }
    );
  }
}
