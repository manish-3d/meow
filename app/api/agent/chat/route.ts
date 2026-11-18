import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { agentConfig, tools, agentChatHistory } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { streamText, isStepCount, tool } from "ai";
import { z } from "zod";
import { defaultGeminiModel } from "@/lib/ai/gemini";
import { getLanguageModel } from "@/lib/ai/model-factory";
import { getModelById, EFFORT_CONFIG, ReasoningEffort } from "@/lib/ai/models";
import { composio, getActiveUserConnections } from "@/lib/composio/client";
import { runPlaywrightBrowserTask } from "@/lib/browser/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    const { agentId, messages, message, timezone, modelId, customApiKey, effort } = await req.json();
    const userTimezone = timezone || "UTC";
    const activeModelId = modelId || "gemini-3-flash";
    const reasoningEffort: ReasoningEffort = effort || "medium";

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    // 0. Resolve language model instance based on user selection & keys
    let selectedModelInstance;
    try {
      selectedModelInstance = getLanguageModel({
        modelId: activeModelId,
        apiKey: customApiKey,
        effort: reasoningEffort,
      });
    } catch (modelErr: any) {
      return NextResponse.json(
        { error: modelErr.message || "Model initialization failed." },
        { status: 400 }
      );
    }

    // 1. Fetch agent configuration to extract instructions and persona
    const foundAgents = await db
      .select()
      .from(agentConfig)
      .where(
        and(
          eq(agentConfig.agentId, agentId),
          eq(agentConfig.userEmail, userEmail)
        )
      );

    if (!foundAgents.length) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const currentAgent = foundAgents[0];

    // Check if agent is paused (Chapter 18)
    if (currentAgent.isActive === false) {
      return NextResponse.json(
        {
          error:
            "This agent is currently paused. Please activate the agent in the Settings tab to resume conversations.",
        },
        { status: 403 }
      );
    }

    // 2. Fetch available tools catalog from DB
    let availableToolsList: Array<{ name: string; slug: string; description: string | null }> = [];
    try {
      availableToolsList = await db
        .select({
          name: tools.name,
          slug: tools.slug,
          description: tools.description,
        })
        .from(tools)
        .where(eq(tools.isActive, true));
    } catch (e) {
      console.warn("Could not fetch tools catalog from DB:", e);
    }

    // 3. Format conversation messages for Vercel AI SDK
    let chatMessages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      chatMessages = messages.map((m: any) => ({
        role: m.role === "agent" ? "assistant" : (m.role as "user" | "assistant"),
        content: m.content || "",
      }));
    } else if (message) {
      chatMessages = [{ role: "user", content: String(message) }];
    } else {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // 4. Dynamically load active Composio tools for this user
    let dynamicTools: Record<string, any> = {};
    let connectedToolkitNames: string[] = [];

    try {
      const activeToolkits = await getActiveUserConnections(userEmail);
      if (activeToolkits.size > 0) {
        connectedToolkitNames = Array.from(activeToolkits);
        const toolkitSlugs = connectedToolkitNames.map((t) => t.toLowerCase());
        const rawTools = await composio.tools.get(userEmail, {
          toolkits: toolkitSlugs,
        });

        // Wrap each tool execution in a resilient try/catch block so execution failures return feedback to Gemini
        for (const [key, toolDef] of Object.entries(rawTools)) {
          const originalExecute = (toolDef as any).execute;
          if (typeof originalExecute === "function") {
            dynamicTools[key] = {
              ...toolDef,
              execute: async (args: any, context: any) => {
                try {
                  const res = await originalExecute(args, context);
                  if (res && typeof res === "object") {
                    const str = JSON.stringify(res);
                    if (str.length > 25000) {
                      if (res?.data?.messages && Array.isArray(res.data.messages)) {
                        res.data.messages = res.data.messages.slice(0, 10).map((m: any) => ({
                          id: m.id,
                          threadId: m.threadId,
                          snippet: m.snippet,
                          subject: m.subject || m.payload?.headers?.find((h: any) => h.name === "Subject")?.value,
                          from: m.from || m.payload?.headers?.find((h: any) => h.name === "From")?.value,
                          date: m.date || m.payload?.headers?.find((h: any) => h.name === "Date")?.value,
                        }));
                      }
                    }
                  }
                  return res;
                } catch (executeErr: any) {
                  console.warn(`Tool ${key} execution warning:`, executeErr?.message);
                  return {
                    error: `Action ${key} failed: ${executeErr?.message || "Execution error"}. Please ensure your account is connected in the Tools tab.`,
                  };
                }
              },
            };
          } else {
            dynamicTools[key] = toolDef;
          }
        }
      }
    } catch (toolErr) {
      console.warn("Could not load dynamic Composio tools for chat:", toolErr);
    }

    // 4b. Register Cloud VM Desktop Browser tool
    try {
      dynamicTools["cloud_browser"] = tool({
        description:
          "Autonomous Cloud VM Desktop Browser tool. Use this tool when the user asks to browse the web, open a website, check live web pages (e.g. Google News, GitHub trending, blogs, documentation), or scrape/inspect external websites.",
        inputSchema: z.object({
          url: z
            .string()
            .describe(
              "The full HTTP or HTTPS URL to navigate to (e.g. 'https://news.google.com')"
            ),
          objective: z
            .string()
            .optional()
            .describe(
              "The specific goal or information to extract from the webpage"
            ),
        }),
        execute: async ({ url, objective }: { url: string; objective?: string }) => {
          return await runPlaywrightBrowserTask(agentId, userEmail, url, objective);
        },
      });
    } catch (e2bErr) {
      console.warn("Could not register Cloud VM browser tool:", e2bErr);
    }

    // 5. Formulate system persona and protocol
    const toolSummary =
      connectedToolkitNames.length > 0
        ? `You have ACTIVE live authenticated tools connected for: ${connectedToolkitNames.join(", ")}. In addition, you have an integrated Cloud VM Desktop browser tool ("cloud_browser"). Use them autonomously to fulfill user requests!`
        : "You have no external OAuth tools connected yet, but you DO have the Cloud VM Desktop browser tool ('cloud_browser') to browse live websites. If the user asks you to interact with Gmail, Slack, or GitHub, advise them to connect that tool in the Tools tab on the right.";

    const availableToolsDescription = availableToolsList
      .map((t) => `- ${t.name} (slug: "${t.slug}"): ${t.description || ""}`)
      .join("\n");

    const systemPrompt = `You are "${currentAgent.name}", an autonomous AI agent operating inside the Meow Bot SaaS platform.

### Core Persona & System Instructions:
${currentAgent.description || "You are a helpful, autonomous AI agent capable of answering questions, orchestrating workflows, and helping the user."}

### Platform Capabilities:
- Connected Live Tools: ${toolSummary}
- Available Tools Platform Catalog:
${availableToolsDescription}
- User Timezone: ${userTimezone}
- You have an integrated Cloud VM Desktop sandbox for live browser automation.
- You have automated background routine scheduling via Inngest cron tasks.
- You have native reasoning, synthesis, and summarization capabilities. When retrieving emails, issues, or documents from tools, read their contents and summarize them clearly and concisely for the user.

### PROTOCOL FOR ROUTINES & AUTOMATIONS:
When the user asks to schedule, automate, or set up a recurring task, routine, or alert (e.g. "summarize my emails every day at 8am", "send me a slack alert daily", "create a routine for...", "alert me on slack every morning"):
1. If the schedule time or frequency is missing, respond with a JSON block of type "clarification":
\`\`\`json
{
  "type": "clarification",
  "content": "At what time of day and how frequently would you like this routine to run?"
}
\`\`\`

2. If sufficient routine parameters are provided (or inferred like daily 08:00 AM UTC):
Respond with a JSON block of type "routine":
\`\`\`json
{
  "type": "routine",
  "content": "I have prepared the automated routine for you. Review the schedule and tool requirements below, then click Create Routine.",
  "routine": {
    "name": "Brief title (e.g. Daily Email Briefing & Slack Alert)",
    "goal": "High-level goal",
    "instruction": "Precise step-by-step autonomous instruction for the Inngest background runner",
    "frequency": "daily",
    "scheduledTime": "08:00 AM UTC",
    "timezone": "${userTimezone}",
    "tools": ["GMAIL", "SLACK"]
  }
}
\`\`\`

3. For all other standard conversational questions, immediate tool actions (e.g. "summarize my emails right now"), or general help:
Respond directly with clear, concise markdown text.`;

    // 5b. Append reasoning effort instructions to system prompt
    const effortConfig = EFFORT_CONFIG[reasoningEffort] || EFFORT_CONFIG.medium;
    const fullSystemPrompt = `${systemPrompt}\n\n### Reasoning & Workload Intensity (${effortConfig.label}):\n${effortConfig.instruction}`;

    // Persist incoming user message to chat history
    const lastUserMessage = chatMessages.filter((m) => m.role === "user").pop();
    if (lastUserMessage?.content) {
      try {
        await db.insert(agentChatHistory).values({
          agentId,
          userEmail,
          role: "user",
          content: lastUserMessage.content,
        });
      } catch (dbErr) {
        console.warn("Could not persist user message to history:", dbErr);
      }
    }

    // 6. Stream response using Vercel AI SDK + Resolved Language Model
    const hasTools = Object.keys(dynamicTools).length > 0;
    const result = streamText({
      model: selectedModelInstance,
      system: fullSystemPrompt,
      messages: chatMessages,
      ...(hasTools && {
        tools: dynamicTools,
        stopWhen: isStepCount(5),
      }),
      onFinish: async (event) => {
        if (event.text) {
          try {
            await db.insert(agentChatHistory).values({
              agentId,
              userEmail,
              role: "agent",
              content: event.text,
            });
          } catch (histErr) {
            console.warn("Could not persist assistant message to history:", histErr);
          }
        }
      },
    });

    const response = result.toTextStreamResponse();
    response.headers.set("x-model-id", activeModelId);
    response.headers.set("x-reasoning-effort", reasoningEffort);
    return response;
  } catch (error: any) {
    console.error("Error in /api/agent/chat:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
