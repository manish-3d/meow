import { db } from "@/db";
import { routines, executionLogs, agentConfig, agentChatHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateText, isStepCount, tool } from "ai";
import { z } from "zod";
import { defaultGeminiModel } from "@/lib/ai/gemini";
import { composio, getActiveUserConnections } from "@/lib/composio/client";
import { runPlaywrightBrowserTask } from "@/lib/browser/client";

export async function runAgentRoutineLogic({
  routineId,
  agentId,
  userEmail,
  executionId,
}: {
  routineId: string;
  agentId: string;
  userEmail: string;
  executionId: string;
}) {
  // 1. Fetch routine
  const foundRoutines = await db
    .select()
    .from(routines)
    .where(eq(routines.routineId, routineId));

  if (!foundRoutines.length) {
    throw new Error(`Routine ${routineId} not found.`);
  }
  const routine = foundRoutines[0];

  // 2. Fetch agent
  const foundAgents = await db
    .select()
    .from(agentConfig)
    .where(eq(agentConfig.agentId, agentId));

  const agent = foundAgents[0] || {
    name: "Meow Agent",
    description: "Autonomous assistant",
    isActive: true,
  };

  // Skip execution if agent is paused (Chapter 18)
  if (agent.isActive === false) {
    console.log(`[Inngest] Routine ${routineId} skipped: Agent ${agentId} is currently paused.`);
    await db
      .update(executionLogs)
      .set({
        status: "completed",
        resultSummary: `Execution skipped because agent "${agent.name}" is currently paused. Resume agent in Settings to re-enable automated execution.`,
        completedAt: new Date(),
      })
      .where(eq(executionLogs.executionId, executionId));
    return;
  }

  // 3. Load active tools
  let dynamicTools: Record<string, any> = {};
  let connectedToolsList: string[] = [];

  try {
    const activeToolkits = await getActiveUserConnections(userEmail);
    if (activeToolkits.size > 0) {
      connectedToolsList = Array.from(activeToolkits);
      const toolkitSlugs = connectedToolsList.map((t) => t.toLowerCase());
      const rawTools = await composio.tools.get(userEmail, {
        toolkits: toolkitSlugs,
      });

      for (const [key, toolDef] of Object.entries(rawTools)) {
        const originalExecute = (toolDef as any).execute;
        if (typeof originalExecute === "function") {
          dynamicTools[key] = {
            ...toolDef,
            execute: async (args: any, context: any) => {
              try {
                const res = await originalExecute(args, context);
                // Sanitize and trim heavy email payloads to protect LLM context token quota
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
                return {
                  error: `Tool ${key} execution error: ${executeErr?.message || "Execution failed"}`,
                };
              }
            },
          };
        } else {
          dynamicTools[key] = toolDef;
        }
      }
    }
  } catch (err: any) {
    console.warn("Could not load dynamic tools in routine runner:", err?.message);
  }

    // Register Cloud VM Desktop Browser tool
    try {
      dynamicTools["cloud_browser"] = tool({
        description:
          "Autonomous Cloud VM Desktop Browser tool. Use this tool to browse the live web, navigate to a URL, read online documentation, articles, or scrape dynamic web content.",
        inputSchema: z.object({
          url: z.string().describe("The full web URL to navigate to"),
          objective: z
            .string()
            .optional()
            .describe("What information to extract or analyze from the webpage"),
        }),
        execute: async ({ url, objective }: { url: string; objective?: string }) => {
          // Inngest background routine runs autonomously in the cloud even when PC is off
          return await runPlaywrightBrowserTask(
            agentId,
            userEmail,
            url,
            objective,
            "browserbase",
            true
          );
        },
      });
    } catch (e2bErr) {
      console.warn("Could not register Cloud VM browser tool in routine runner:", e2bErr);
    }

  const toolSummary =
    connectedToolsList.length > 0
      ? `Active authenticated tools available: ${connectedToolsList.join(", ")}. In addition, you have the Cloud VM Desktop browser tool ("cloud_browser").`
      : "No active external OAuth tools connected, but Cloud VM Desktop browser tool ('cloud_browser') is available.";

  const systemPrompt = `You are "${agent.name}", an autonomous AI agent executing a scheduled background routine on the Meow Bot SaaS platform.

### Core Persona & Mission:
${agent.description || "You are an autonomous executive assistant capable of analyzing data and synthesizing high-value briefs."}

### Platform Capabilities:
- ${toolSummary}
- You have native reasoning and summarization capabilities.
- Fetch necessary data using your tools, analyze the information, and write a structured, clear markdown report.

Execute the routine prompt thoroughly.`;

  const hasTools = Object.keys(dynamicTools).length > 0;
  const result = await generateText({
    model: defaultGeminiModel,
    system: systemPrompt,
    prompt: routine.prompt,
    ...(hasTools && {
      tools: dynamicTools,
      stopWhen: isStepCount(5),
    }),
  });

  const summary =
    result.text || "Routine executed successfully with no textual output.";

  // 4. Update execution log to completed
  await db
    .update(executionLogs)
    .set({
      status: "completed",
      resultSummary: summary,
      completedAt: new Date(),
    })
    .where(eq(executionLogs.executionId, executionId));

  // 5. Update routine lastRunAt, increment currentRunCount, and check maxRuns
  const nextRunCount = (routine.currentRunCount || 0) + 1;
  const isTargetRunsReached =
    Boolean(routine.maxRuns && nextRunCount >= routine.maxRuns) ||
    routine.runType === "once";

  await db
    .update(routines)
    .set({
      lastRunAt: new Date(),
      currentRunCount: nextRunCount,
      ...(isTargetRunsReached && { isActive: false }),
    })
    .where(eq(routines.routineId, routineId));

  // 6. Deliver routine summary directly into user's chat history
  try {
    const statusNote = isTargetRunsReached
      ? `\n\n*(🏁 Completed target execution count: ${nextRunCount}/${routine.maxRuns || 1} runs. Routine automatically concluded.)*`
      : "";
    await db.insert(agentChatHistory).values({
      agentId,
      userEmail,
      role: "agent",
      content: `### 🤖 Autonomous Routine Completed: ${routine.title}\n\n${summary}${statusNote}`,
    });
  } catch (chatHistErr) {
    console.warn("Could not append routine summary to chat history:", chatHistErr);
  }

  return summary;
}
