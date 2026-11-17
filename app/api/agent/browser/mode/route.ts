import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setAgentBrowserMode } from "@/lib/browser/client";

// POST /api/agent/browser/mode — Updates agent's preferred browser mode (browserbase vs local)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentId, browserMode } = await req.json();

    if (!agentId || !browserMode) {
      return NextResponse.json(
        { error: "agentId and browserMode are required" },
        { status: 400 }
      );
    }

    if (browserMode !== "browserbase" && browserMode !== "local") {
      return NextResponse.json(
        { error: "browserMode must be 'browserbase' or 'local'" },
        { status: 400 }
      );
    }

    await setAgentBrowserMode(agentId, session.user.email, browserMode);

    return NextResponse.json({
      success: true,
      browserMode,
      message: `Preferred browser mode set to ${browserMode}`,
    });
  } catch (error: any) {
    console.error("Error setting browser mode:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update browser mode" },
      { status: 500 }
    );
  }
}
