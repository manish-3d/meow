/**
 * Phase 3 Verification Suite: Prompt Compiler Pipeline
 *
 * Verifies:
 * 1. 5-Layer prompt assembly (Instructions, Workspace, Security, Memories, History).
 * 2. Untrusted tool data quarantine injection (<untrusted_tool_data> guardrails).
 * 3. Structured memory categorization ([PREFERENCE], [FACT]).
 * 4. Sliding conversation history windowing (maxHistoryMessages cutoff).
 * 5. Execution configuration propagation (temperature, model, maxTokens).
 * 6. Tool schema attachment into ModelRequest.
 */

import { compilePrompt, AgentMemoryItem } from "../lib/ai/compiler";
import { ModelMessage, ToolDefinition } from "../lib/ai/types";

async function runCompilerTests() {
  console.log("=== PHASE 3.2: PROMPT COMPILER VERIFICATION ===\n");

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
    instructions: "You are an autonomous customer support lead for Meow.",
    config: {
      temperature: 0.2,
      maxTokens: 2048,
      stopSequences: ["<END>"],
    },
  };

  const sampleWorkspace = {
    id: "ws_acme_123",
    name: "Acme Corp",
    guidelines: [
      "Always be polite and professional.",
      "Never share employee personal phone numbers.",
    ],
  };

  const sampleMemories: AgentMemoryItem[] = [
    { memoryType: "preference", content: "Client prefers email responses over SMS." },
    { memoryType: "fact", content: "Acme refund window is 30 days." },
  ];

  const sampleTools: ToolDefinition[] = [
    {
      name: "lookup_invoice",
      description: "Lookup customer invoice by ID",
      parameters: {
        type: "object",
        properties: { invoiceId: { type: "string" } },
        required: ["invoiceId"],
      },
    },
  ];

  const sampleHistory: ModelMessage[] = [
    { role: "user", content: "Hi, I have a question about my invoice." },
    { role: "assistant", content: "Hello! I can help you with that. What is your invoice ID?" },
    { role: "user", content: "It's INV-9901." },
  ];

  // -------------------------------------------------------------
  // TEST 1: Full Layered Compilation
  // -------------------------------------------------------------
  console.log("--- Group 1: 5-Layer Prompt Synthesis ---");

  const compiled = compilePrompt({
    agentVersion: sampleAgentVersion,
    workspace: sampleWorkspace,
    memories: sampleMemories,
    activeTools: sampleTools,
    history: sampleHistory,
  });

  assert("1.1 Propagates target model 'gpt-4o'", compiled.model === "gpt-4o");
  assert("1.2 Propagates temperature from config (0.2)", compiled.temperature === 0.2);
  assert("1.3 Propagates maxTokens from config (2048)", compiled.maxTokens === 2048);
  assert("1.4 Attaches tools to ModelRequest", compiled.tools?.length === 1 && compiled.tools[0].name === "lookup_invoice");

  const systemMsg = compiled.messages[0];
  assert("1.5 Message 0 is role: 'system'", systemMsg.role === "system");

  assert(
    "1.6 Layer 1: Injects base instructions",
    systemMsg.content.includes("You are an autonomous customer support lead for Meow."),
  );

  assert(
    "1.7 Layer 2: Injects workspace name and ID",
    systemMsg.content.includes("Acme Corp") && systemMsg.content.includes("ws_acme_123"),
  );

  assert(
    "1.8 Layer 2: Injects workspace operating guidelines",
    systemMsg.content.includes("Always be polite and professional.") &&
      systemMsg.content.includes("Never share employee personal phone numbers."),
  );

  assert(
    "1.9 Layer 3: Injects prompt injection security guardrails (<untrusted_tool_data>)",
    systemMsg.content.includes("<untrusted_tool_data>"),
  );

  assert(
    "1.10 Layer 4: Injects categorized memories ([PREFERENCE], [FACT])",
    systemMsg.content.includes("[PREFERENCE]: Client prefers email responses over SMS.") &&
      systemMsg.content.includes("[FACT]: Acme refund window is 30 days."),
  );

  assert(
    "1.11 Layer 5: Appends conversation history in chronological order",
    compiled.messages.length === 4 &&
      compiled.messages[1].content === "Hi, I have a question about my invoice." &&
      compiled.messages[3].content === "It's INV-9901.",
  );

  // -------------------------------------------------------------
  // TEST 2: Sliding Conversation Window
  // -------------------------------------------------------------
  console.log("\n--- Group 2: History Windowing & Token Budgeting ---");

  // Create 15 messages
  const longHistory: ModelMessage[] = [];
  for (let i = 1; i <= 15; i++) {
    longHistory.push({
      role: i % 2 === 1 ? "user" : "assistant",
      content: `Message ${i}`,
    });
  }

  // Restrict to max 5 history messages
  const windowedResult = compilePrompt({
    agentVersion: sampleAgentVersion,
    workspace: sampleWorkspace,
    history: longHistory,
    maxHistoryMessages: 5,
  });

  // Total messages should be 1 system message + 5 windowed history = 6
  assert(
    "2.1 Truncates history to maxHistoryMessages (5 + 1 system = 6 total)",
    windowedResult.messages.length === 6,
  );

  assert(
    "2.2 Preserves the most recent messages (Message 11 through Message 15)",
    windowedResult.messages[1].content === "Message 11" &&
      windowedResult.messages[5].content === "Message 15",
  );

  // -------------------------------------------------------------
  // TEST 3: Custom Security Overrides
  // -------------------------------------------------------------
  console.log("\n--- Group 3: Security Policy Customization ---");

  const customSecResult = compilePrompt({
    agentVersion: sampleAgentVersion,
    workspace: sampleWorkspace,
    securityPolicy: {
      customSecurityNotice: "Zero data retention policy enabled.",
    },
  });

  const secMsg = customSecResult.messages[0].content;
  assert("3.1 Injects custom security notice", secMsg.includes("Zero data retention policy enabled."));

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCompilerTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

