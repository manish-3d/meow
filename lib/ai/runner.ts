/**
 * Meow Autonomous ReAct Runner (Execution Engine)
 *
 * Orchestrates multi-step agent reasoning loops:
 * Reason -> Act (Tool Call) -> Observe (Quarantine Data) -> Reflect
 *
 * Enforces production invariants:
 * 1. Hard step limit (maxSteps, default 10)
 * 2. Stuck-in-loop detection (aborts on 3 consecutive identical failing calls)
 * 3. Tool output quarantine (<untrusted_tool_data>)
 * 4. Token usage aggregation across all steps
 */

import { AgentVersion, Workspace } from "@/db/schema";
import { compilePrompt, AgentMemoryItem } from "./compiler";
import { AIProviderFactory } from "./factory";
import {
  AIProvider,
  AIProviderError,
  ModelMessage,
  TokenUsage,
  ToolCall,
  ToolDefinition,
} from "./types";

export interface ExecutableTool extends ToolDefinition {
  execute: (args: Record<string, unknown>) => Promise<Record<string, unknown> | string>;
  requiresApproval?: boolean;
}

export interface ExecutedToolRecord {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown> | string;
  status: "completed" | "failed" | "requested";
  error?: string;
  requiresApproval?: boolean;
}

export interface ExecutedStep {
  stepNumber: number;
  thought?: string;
  toolCalls?: ExecutedToolRecord[];
  usage: TokenUsage;
}

export interface RunnerExecutionOptions {
  agentVersion: Pick<AgentVersion, "model" | "instructions" | "config">;
  workspace: Pick<Workspace, "id" | "name"> & { guidelines?: string[] };
  history: ModelMessage[];
  activeTools?: ExecutableTool[];
  memories?: AgentMemoryItem[];
  maxSteps?: number;
  provider?: AIProvider; // Optional explicit provider (useful for tests or custom models)
  onStepFinish?: (step: ExecutedStep) => void | Promise<void>;
}

export interface RunnerResult {
  finalContent: string;
  newMessages: ModelMessage[];
  steps: ExecutedStep[];
  totalUsage: TokenUsage;
  totalSteps: number;
  finishReason: "stop" | "max_steps_exceeded" | "stuck_in_loop" | "approval_required" | "error";
}

export class AgentRunner {
  /**
   * Executes a multi-step autonomous turn for an agent.
   */
  public static async executeTurn(options: RunnerExecutionOptions): Promise<RunnerResult> {
    const maxSteps = options.maxSteps ?? 10;
    const activeTools = options.activeTools ?? [];
    const toolMap = new Map<string, ExecutableTool>();
    for (const tool of activeTools) {
      toolMap.set(tool.name, tool);
    }

    // Working conversation history that grows with each tool turn
    const workingHistory: ModelMessage[] = [...options.history];
    const initialHistoryLength = options.history.length;

    const totalUsage: TokenUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    const executedSteps: ExecutedStep[] = [];
    const consecutiveFailureCount = new Map<string, number>();

    let currentStep = 0;
    let finalContent = "";
    let finishReason: RunnerResult["finishReason"] = "stop";

    const provider =
      options.provider ?? AIProviderFactory.getProvider(options.agentVersion.model);

    while (currentStep < maxSteps) {
      currentStep++;

      // 1. Compile prompt context from current state
      const modelRequest = compilePrompt({
        agentVersion: options.agentVersion,
        workspace: options.workspace,
        activeTools: activeTools,
        memories: options.memories,
        history: workingHistory,
      });

      // 2. Request next action from the AI provider
      const response = await provider.generate(modelRequest);

      // Aggregate token usage
      totalUsage.promptTokens += response.usage.promptTokens;
      totalUsage.completionTokens += response.usage.completionTokens;
      totalUsage.totalTokens += response.usage.totalTokens;

      const currentStepRecord: ExecutedStep = {
        stepNumber: currentStep,
        thought: response.content || undefined,
        usage: response.usage,
      };

      // 3. Evaluate: Did model produce a final answer or tool calls?
      if (!response.toolCalls || response.toolCalls.length === 0) {
        // Model produced final answer
        finalContent = response.content;
        workingHistory.push({
          role: "assistant",
          content: response.content,
        });

        executedSteps.push(currentStepRecord);
        if (options.onStepFinish) {
          await options.onStepFinish(currentStepRecord);
        }

        finishReason = "stop";
        break;
      }

      // 4. Model emitted one or more tool calls
      const toolRecords: ExecutedToolRecord[] = [];

      // Append assistant's tool-call request to working history
      workingHistory.push({
        role: "assistant",
        content: response.content,
        toolCalls: response.toolCalls,
      });

      let loopDetected = false;

      for (const tc of response.toolCalls) {
        const toolSignature = `${tc.name}:${JSON.stringify(tc.arguments)}`;
        const tool = toolMap.get(tc.name);

        if (!tool) {
          // Tool not found
          const errorMsg = `Tool '${tc.name}' is not recognized or permitted in this workspace.`;
          toolRecords.push({
            id: tc.id,
            name: tc.name,
            arguments: tc.arguments,
            status: "failed",
            error: errorMsg,
          });

          workingHistory.push({
            role: "tool",
            name: tc.name,
            toolCallId: tc.id,
            content: `<untrusted_tool_data>\n{"error": "${errorMsg}"}\n</untrusted_tool_data>`,
          });
          continue;
        }

        // Check if tool requires explicit human approval before execution
        if (tool.requiresApproval) {
          toolRecords.push({
            id: tc.id,
            name: tc.name,
            arguments: tc.arguments,
            status: "requested",
            requiresApproval: true,
          });

          finishReason = "approval_required";
          finalContent =
            response.content ||
            `Action '${tool.name}' requires user authorization before proceeding.`;
          continue;
        }

        // Execute tool action safely
        let result: Record<string, unknown> | string;
        let isError = false;

        try {
          result = await tool.execute(tc.arguments);
        } catch (execErr: unknown) {
          isError = true;
          result = {
            error: execErr instanceof Error ? execErr.message : String(execErr),
          };
        }

        // Check for stuck-in-loop invariant (3 consecutive identical failures)
        if (isError) {
          const failures = (consecutiveFailureCount.get(toolSignature) || 0) + 1;
          consecutiveFailureCount.set(toolSignature, failures);

          if (failures >= 3) {
            loopDetected = true;
          }
        } else {
          // Reset failure counter on success
          consecutiveFailureCount.delete(toolSignature);
        }

        toolRecords.push({
          id: tc.id,
          name: tc.name,
          arguments: tc.arguments,
          result,
          status: isError ? "failed" : "completed",
          error: isError ? String((result as any).error) : undefined,
        });

        // 5. OBSERVE: Format observation inside security quarantine tags
        const observationString =
          typeof result === "string" ? result : JSON.stringify(result, null, 2);

        workingHistory.push({
          role: "tool",
          name: tc.name,
          toolCallId: tc.id,
          content: `<untrusted_tool_data>\n${observationString}\n</untrusted_tool_data>`,
        });
      }

      currentStepRecord.toolCalls = toolRecords;
      executedSteps.push(currentStepRecord);

      if (options.onStepFinish) {
        await options.onStepFinish(currentStepRecord);
      }

      // Check if any tool required human approval
      if (finishReason === "approval_required") {
        break;
      }

      // Check loop detection abort
      if (loopDetected) {
        finishReason = "stuck_in_loop";
        finalContent =
          "Execution halted: Agent detected an infinite loop with 3 consecutive identical failing tool calls.";
        break;
      }

      // If we reached maxSteps without producing a final answer
      if (currentStep >= maxSteps) {
        finishReason = "max_steps_exceeded";
        finalContent = response.content || "Execution stopped: Max step limit reached.";
        break;
      }
    }

    // Only return newly added messages from this turn
    const newMessages = workingHistory.slice(initialHistoryLength);

    return {
      finalContent,
      newMessages,
      steps: executedSteps,
      totalUsage,
      totalSteps: currentStep,
      finishReason,
    };
  }
}

