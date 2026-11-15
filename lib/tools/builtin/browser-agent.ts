/**
 * Autonomous Browser Agent Tool
 * Enables LLM agents to operate websites like a human using Browserbase, Stagehand, and Playwright.
 */

import { RegisteredTool, ToolContext } from "../types";
import { browserbaseClient } from "@/lib/automation/browserbase";

export const browserAutonomousTaskTool: RegisteredTool = {
  id: "browser_autonomous_task",
  name: "Autonomous Browser Agent",
  description:
    "Launches an autonomous cloud browser session via Browserbase and Stagehand. Navigates pages, observes DOM state, executes actions via Playwright, and halts for human approval before dangerous or write operations.",
  executionType: "native",
  permissionLevel: "write",
  requiresApproval: true,
  parameters: {
    type: "object",
    properties: {
      instruction: {
        type: "string",
        description:
          "The complete human directive for the browser agent (e.g. 'Open my X account, research trending AI topics, draft a post about NVIDIA, and publish after my approval').",
      },
      agentRole: {
        type: "string",
        enum: ["social", "research", "shopping", "job", "qa", "custom"],
        description: "Specialized role archetype for the autonomous browser agent.",
      },
      targetUrl: {
        type: "string",
        description: "Initial target URL to navigate to.",
      },
    },
    required: ["instruction"],
  },
  execute: async (args: Record<string, unknown>, _context: ToolContext): Promise<Record<string, unknown>> => {
    const instruction = String(args.instruction || "").trim();
    if (!instruction) {
      return { error: "Parameter 'instruction' is required." };
    }

    const agentRole = (args.agentRole as any) || "social";
    const targetUrl = args.targetUrl ? String(args.targetUrl) : undefined;

    try {
      const result = await browserbaseClient.runAutonomousTask({
        instruction,
        agentRole,
        targetUrl,
        requiresApproval: true,
      });

      return {
        taskId: result.taskId,
        sessionId: result.sessionId,
        status: result.status,
        agentRole: result.agentRole,
        stepsExecuted: result.steps.length,
        steps: result.steps,
        draftOrOutput: result.finalOutput,
        pendingApproval: result.pendingApproval,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Autonomous browser execution failed";
      return { error: msg };
    }
  },
};

