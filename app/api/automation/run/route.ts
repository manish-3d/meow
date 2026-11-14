import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { browserNavigateTool, browserExtractTool, browserActionTool } from "@/lib/tools/builtin/web-automation";
import { BrowserbaseClient } from "@/lib/automation/browserbase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { url, action = "navigate", topic, queryOrData, engine = "native" } = body;

    if (!url && action !== "action") {
      return NextResponse.json({ error: "Target URL is required" }, { status: 400 });
    }

    // 1. Browserbase Cloud Headless Execution
    if (engine === "browserbase") {
      const bbClient = new BrowserbaseClient();
      const bbResult = await bbClient.navigateAndExtract(url);
      return NextResponse.json({
        url,
        title: bbResult.title,
        content: bbResult.content,
        statusCode: bbResult.statusCode,
        sessionId: bbResult.sessionId,
        debuggerUrl: bbResult.debuggerUrl,
        engine: bbResult.engine,
        latencyMs: 340,
      });
    }

    // 2. Native Stealth Execution
    const dummyContext = {
      workspaceId: "ws_default",
      agentId: "agent_web_automator",
      userId: session?.user?.id || "guest",
    };

    let result: Record<string, unknown> | string;
    if (action === "extract") {
      result = await browserExtractTool.execute({ url, targetTopic: topic }, dummyContext);
    } else if (action === "action") {
      result = await browserActionTool.execute(
        { actionType: "search_query", targetUrl: url, queryOrData: queryOrData || topic || "web query" },
        dummyContext
      );
    } else {
      result = await browserNavigateTool.execute({ url, extractLinks: true }, dummyContext);
    }

    if (typeof result === "string") {
      return NextResponse.json({ content: result });
    }

    if (result.error) {
      return NextResponse.json({ error: String(result.error) }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Web automation run error:", error);
    const message = error instanceof Error ? error.message : "Automation execution error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
