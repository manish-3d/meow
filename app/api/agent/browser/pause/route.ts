import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { closeBrowserSession } from "@/lib/browser/client";

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

    await closeBrowserSession(agentId, session.user.email);

    return NextResponse.json({
      success: true,
      status: "closed",
    });
  } catch (error: any) {
    console.error("Error closing browser session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to close browser session" },
      { status: 500 }
    );
  }
}
