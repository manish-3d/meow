import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { disconnectUserConnection } from "@/lib/composio/client";

// POST /api/tools/disconnect — Revoke and disconnect an OAuth tool for the authenticated user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { toolSlug } = await req.json();

    if (!toolSlug) {
      return NextResponse.json(
        { error: "toolSlug is required" },
        { status: 400 }
      );
    }

    await disconnectUserConnection(session.user.email, toolSlug);

    return NextResponse.json({
      success: true,
      message: `Tool ${toolSlug} disconnected successfully`,
    });
  } catch (error: any) {
    console.error("Error disconnecting tool:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to disconnect tool" },
      { status: 500 }
    );
  }
}
