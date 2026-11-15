import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { agentConfig, messages as dbMessages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { browserbaseClient } from "@/lib/automation/browserbase";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { agentId, messages } = body;

    if (!agentId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "agentId and messages are required" }, { status: 400 });
    }

    // 1. Fetch Agent Profile
    const [agent] = await db
      .select()
      .from(agentConfig)
      .where(and(eq(agentConfig.agentId, agentId), eq(agentConfig.userEmail, userEmail)))
      .limit(1);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || "";

    // Save user message to database
    await db.insert(dbMessages).values({
      agentId,
      userEmail,
      role: "user",
      content: latestUserMessage,
    });

    const lower = latestUserMessage.toLowerCase();
    const requiresBrowser =
      lower.includes("vm desktop") ||
      lower.includes("browser") ||
      lower.includes("flipkart") ||
      lower.includes("amazon") ||
      lower.includes("price") ||
      lower.includes("news") ||
      lower.includes("google news") ||
      lower.includes("twitter") ||
      lower.includes("post on x") ||
      lower.includes("website") ||
      lower.includes("scrape");

    let responseText = "";
    let browserTaskResult: any = null;

    if (requiresBrowser) {
      // 2. Execute on Cloud Browser / VM Desktop (Stagehand + Playwright)
      browserTaskResult = await browserbaseClient.runAutonomousTask({
        instruction: latestUserMessage,
        agentRole: "custom",
      });

      if (browserTaskResult.status === "waiting_approval") {
        responseText = `I opened the cloud browser session and researched **${latestUserMessage}**.\n\nI have prepared the draft below and paused for your review:\n\n> ${browserTaskResult.finalOutput}\n\nPlease click **Approve** or **Reject** in the approval card.`;
      } else {
        responseText = `I executed the browser automation task directly on the cloud VM desktop:\n\n${browserTaskResult.finalOutput}`;
      }
    } else {
      // 3. Regular AI Reasoning
      try {
        if (process.env.GEMINI_API_KEY) {
          const aiRes = await generateText({
            model: google("gemini-2.5-flash"),
            system: `You are "${agent.name}", an autonomous AI agent with tool and browser execution capabilities.
Your core instructions:
${agent.description || "Help the user automate web tasks and answer queries concisely."}
Keep answers clear, helpful, structured, and action-oriented.`,
            prompt: latestUserMessage,
          });
          responseText = aiRes.text;
        } else {
          responseText = `Hello! I am ${agent.name}. I received your instruction: "${latestUserMessage}". You can ask me to search the web, track prices on Flipkart or Amazon, or use the Cloud VM Desktop anytime!`;
        }
      } catch (aiErr) {
        console.warn("AI generation fallback:", aiErr);
        responseText = `Hello! I am ${agent.name}. I processed your request: "${latestUserMessage}". How can I help you automate further?`;
      }
    }

    // Save agent response to database
    await db.insert(dbMessages).values({
      agentId,
      userEmail,
      role: "agent",
      content: responseText,
    });

    return NextResponse.json({
      response: responseText,
      agentId,
      browserSessionUrl: browserTaskResult?.liveStreamUrl,
      browserTaskResult,
    });
  } catch (err: unknown) {
    console.error("POST /api/agent/chat error:", err);
    const msg = err instanceof Error ? err.message : "Chat processing failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
