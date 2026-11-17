import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOrCreateBrowserSession } from "@/lib/browser/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentId, headless } = await req.json();

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    const { streamUrl, sessionId, mode } = await getOrCreateBrowserSession(
      agentId,
      session.user.email,
      headless ?? false
    );

    return NextResponse.json({
      success: true,
      status: "active",
      sessionId,
      streamUrl,
      mode,
    });
  } catch (error: any) {
    console.error("Error starting browser session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to start browser session" },
      { status: 500 }
    );
  }
}
