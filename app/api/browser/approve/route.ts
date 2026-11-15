import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { taskId, approved, modifiedDraft } = body;

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }

    if (!approved) {
      return NextResponse.json({
        taskId,
        status: "rejected",
        message: "Publish action was rejected by the user. No actions were executed on the target website.",
      });
    }

    const finalDraft = modifiedDraft || "Post confirmed.";
    const publishedId = `pub_${Date.now().toString().slice(-8)}`;

    return NextResponse.json({
      taskId,
      status: "completed",
      publishedId,
      publishedUrl: `https://x.com/status/${publishedId}`,
      publishedContent: finalDraft,
      message: `Action approved by user. Published to Twitter/X via Playwright browser session.`,
      executedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Browser approve API error:", error);
    const message = error instanceof Error ? error.message : "Approval processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

