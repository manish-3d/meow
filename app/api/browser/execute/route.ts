import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { browserbaseClient } from "@/lib/automation/browserbase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { instruction, agentRole = "social", targetUrl, requiresApproval = true } = body;

    if (!instruction || typeof instruction !== "string") {
      return NextResponse.json({ error: "Instruction is required" }, { status: 400 });
    }

    const taskResult = await browserbaseClient.runAutonomousTask({
      instruction: instruction.trim(),
      agentRole,
      targetUrl,
      requiresApproval,
    });

    return NextResponse.json(taskResult);
  } catch (error: unknown) {
    console.error("Browser execute API error:", error);
    const message = error instanceof Error ? error.message : "Autonomous browser execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

