import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { interruptBrowserSession, resumeBrowserSession } from "@/lib/browser/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentId, action } = await req.json();

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    if (action === "resume") {
      const result = await resumeBrowserSession(agentId, session.user.email);
      return NextResponse.json(result);
    } else {
      const result = await interruptBrowserSession(agentId, session.user.email);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error("Error toggling browser interruption:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to toggle browser interruption" },
      { status: 500 }
    );
  }
}
