import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { initiateToolConnection } from "@/lib/composio/client";

// POST /api/tools/connect — Initiate Composio OAuth connection for a tool
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Tool slug is required" }, { status: 400 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const callbackUrl = `${protocol}://${host}/workspace`;

    const { redirectUrl, connectionId } = await initiateToolConnection(
      session.user.email,
      slug,
      callbackUrl
    );

    return NextResponse.json({
      success: true,
      redirectUrl,
      connectionId,
    });
  } catch (error: any) {
    console.error("Error initiating Composio connection:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate tool connection" },
      { status: 500 }
    );
  }
}
