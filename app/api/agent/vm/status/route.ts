import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBrowserSessionStatus, isBrowserbaseConfigured } from "@/lib/browser/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  try {
    const status = await getBrowserSessionStatus(agentId, session.user.email);
    return NextResponse.json({
      ...status,
      isConfigured: true, // Always configured because local Playwright runs out-of-the-box!
      isBrowserbase: isBrowserbaseConfigured(),
    });
  } catch (error: any) {
    console.error("Error checking VM status:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check VM status" },
      { status: 500 }
    );
  }
}
