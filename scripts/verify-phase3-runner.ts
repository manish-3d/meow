/**
 * Phase 3 Verification Suite: Autonomous ReAct Runner
 *
 * Verifies:
 * 1. Multi-step reasoning loop (Model calls tool -> tool executes -> model receives observation -> model outputs final answer).
 * 2. Hard step limit enforcement (maxSteps cutoff and finishReason: 'max_steps_exceeded').
 * 3. Infinite loop detection (3 consecutive identical failing calls triggers finishReason: 'stuck_in_loop').
 * 4. Untrusted tool output quarantine (<untrusted_tool_data> tags).
 * 5. Aggregate token usage calculation across multi-step execution.
 * 6. Step finish lifecycle callbacks (onStepFinish).
 */

import { AgentRunner, ExecutableTool, ExecutedStep } from "../lib/ai/runner";
import { AIProvider, ModelRequest, ModelResponse } from "../lib/ai/types";

async function runRunnerTests() {
  console.log("=== PHASE 3.3: REACT RUNNER VERIFICATION ===\n");

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${name} ${details ? `(${details})` : ""}`);
      failed++;
    }
  }

  const sampleAgentVersion = {
    model: "gpt-4o",
    instructions: "You are a customer assistant.",
    config: { temperature: 0.5 },
  };

  const sampleWorkspace = {
    id: "ws_test_99",
    name: "Meow Labs",
  };

  // -------------------------------------------------------------
  // TEST 1: Multi-Step Tool Execution Loop
  // -------------------------------------------------------------
  console.log("--- Group 1: Multi-Step ReAct Execution ---");

  let stepCallCount = 0;

  // Mock Provider that calls a tool on Step 1, and gives final answer on Step 2
  const multiStepMockProvider: AIProvider = {
    id: "mock-ai",
    async generate(req: ModelRequest): Promise<ModelResponse> {
      stepCallCount++;

      if (stepCallCount === 1) {
        return {
          content: "I will lookup the user details.",
          toolCalls: [
            {
              id: "call_lookup_1",
              name: "get_user",
              arguments: { userId: "user_42" },
            },
          ],
          finishReason: "tool_calls",
          usage: { promptTokens: 50, completionTokens: 20, totalTokens: 70 },
        };
      }

      // Step 2: Model sees tool result and outputs final answer
      return {
        content: "User 42 is Alice and her account is active.",
        finishReason: "stop",
        usage: { promptTokens: 80, completionTokens: 15, totalTokens: 95 },
      };
    },
    async *stream() {
      // not used in static executeTurn
    },
  };

  let toolExecuted = false;
  const sampleTools: ExecutableTool[] = [
    {
      name: "get_user",
      description: "Get user details by ID",
      parameters: { type: "object" },
      async execute(args) {
        toolExecuted = true;
        return { id: args.userId, name: "Alice", status: "active" };
      },
    },
  ];

  const recordedSteps: ExecutedStep[] = [];

  const result = await AgentRunner.executeTurn({
    agentVersion: sampleAgentVersion,
    workspace: sampleWorkspace,
    history: [{ role: "user", content: "Who is user 42?" }],
    activeTools: sampleTools,
    provider: multiStepMockProvider,
    onStepFinish: (step) => {
      recordedSteps.push(step);
    },
  });

  assert("1.1 Completed in 2 steps", result.totalSteps === 2);
  assert("1.2 Tool was executed during Step 1", toolExecuted);
  assert(
    "1.3 Final content produced on Step 2",
    result.finalContent === "User 42 is Alice and her account is active.",
  );
  assert("1.4 Finish reason is 'stop'", result.finishReason === "stop");
  assert(
    "1.5 Total usage aggregated across steps (70 + 95 = 165)",
    result.totalUsage.totalTokens === 165,
  );
  assert("1.6 onStepFinish captured both steps", recordedSteps.length === 2);

  // Check quarantine in generated messages
  const toolMsg = result.newMessages.find((m) => m.role === "tool");
  assert(
    "1.7 Tool output quarantined in <untrusted_tool_data> tags",
    toolMsg !== undefined &&
      toolMsg.content.includes("<untrusted_tool_data>") &&
      toolMsg.content.includes('"Alice"'),
  );

  // -------------------------------------------------------------
  // TEST 2: Hard Step Limit Enforcement (maxSteps)
  // -------------------------------------------------------------
  console.log("\n--- Group 2: Hard Step Limit (maxSteps) ---");

  // Provider that keeps asking to call a tool forever
  const infiniteMockProvider: AIProvider = {
    id: "mock-infinite",
    async generate(): Promise<ModelResponse> {
      return {
        content: "Still working...",
        toolCalls: [
          {
            id: `call_${Date.now()}`,
            name: "random_tool",
            arguments: { counter: Math.random() },
          },
        ],
        finishReason: "tool_calls",
        usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 },
      };
    },
    async *stream() {},
  };

  const infiniteTools: ExecutableTool[] = [
    {
      name: "random_tool",
      description: "Infinite loop tool",
      parameters: {},
      async execute() {
        return { ok: true };
      },
    },
  ];

  const maxStepResult = await AgentRunner.executeTurn({
    agentVersion: sampleAgentVersion,
    workspace: sampleWorkspace,
    history: [{ role: "user", content: "Run forever please" }],
    activeTools: infiniteTools,
    maxSteps: 4, // Cut off after 4 steps
    provider: infiniteMockProvider,
  });

  assert("2.1 Cut off at maxSteps = 4", maxStepResult.totalSteps === 4);
  assert(
    "2.2 Finish reason is 'max_steps_exceeded'",
    maxStepResult.finishReason === "max_steps_exceeded",
  );

  // -------------------------------------------------------------
  // TEST 3: Infinite Loop Detection (3 Identical Failures)
  // -------------------------------------------------------------
  console.log("\n--- Group 3: Stuck-in-Loop Detection ---");

  // Provider that repeats the exact same failing tool call
  const loopMockProvider: AIProvider = {
    id: "mock-stuck",
    async generate(): Promise<ModelResponse> {
      return {
        content: "Trying to connect to broken service...",
        toolCalls: [
          {
            id: "call_broken_1",
            name: "broken_api",
            arguments: { endpoint: "/failing" },
          },
        ],
        finishReason: "tool_calls",
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
      };
    },
    async *stream() {},
  };

  const brokenTools: ExecutableTool[] = [
    {
      name: "broken_api",
      description: "Always throws error",
      parameters: {},
      async execute() {
        throw new Error("Connection refused (ECONNREFUSED)");
      },
    },
  ];

  const loopResult = await AgentRunner.executeTurn({
    agentVersion: sampleAgentVersion,
    workspace: sampleWorkspace,
    history: [{ role: "user", content: "Call the broken API" }],
    activeTools: brokenTools,
    maxSteps: 10,
    provider: loopMockProvider,
  });

  assert(
    "3.1 Aborted on Step 3 due to identical consecutive failures",
    loopResult.totalSteps === 3,
  );
  assert(
    "3.2 Finish reason marked as 'stuck_in_loop'",
    loopResult.finishReason === "stuck_in_loop",
  );
  assert(
    "3.3 Informative error message returned to user",
    loopResult.finalContent.includes("Agent detected an infinite loop"),
  );

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runRunnerTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

