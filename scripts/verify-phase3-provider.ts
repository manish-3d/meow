/**
 * Phase 3 Verification Suite: Provider Abstraction Layer
 *
 * Verifies:
 * 1. AIProviderFactory model resolution, prefix matching, and fail-fast behavior.
 * 2. Singleton caching and dynamic mock provider registration.
 * 3. OpenAIAdapter message formatting and tool schema translation.
 * 4. OpenAIAdapter static generation response mapping (content, tool calls, usage).
 * 5. OpenAIAdapter SSE stream parsing with fragmented TCP packet reassembly.
 * 6. Error handling, HTTP status propagation, and retryable flag classification.
 */

import { AIProviderFactory } from "../lib/ai/factory";
import { OpenAIAdapter } from "../lib/ai/adapters/openai";
import { AIProvider, AIProviderError, ModelRequest, StreamChunk } from "../lib/ai/types";

async function runTests() {
  console.log("=== PHASE 3.1: PROVIDER ABSTRACTION VERIFICATION ===\n");

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

  // -------------------------------------------------------------
  // TEST 1: Model Resolution & Fail-Fast Behavior
  // -------------------------------------------------------------
  console.log("--- Group 1: Model Resolution & Fail-Fast ---");

  assert(
    "1.1 Resolves 'gpt-4o' to 'openai'",
    AIProviderFactory.resolveProviderId("gpt-4o") === "openai",
  );

  assert(
    "1.2 Resolves 'o1-mini' to 'openai'",
    AIProviderFactory.resolveProviderId("o1-mini") === "openai",
  );

  assert(
    "1.3 Resolves 'gemini-2.0-flash' to 'gemini'",
    AIProviderFactory.resolveProviderId("gemini-2.0-flash") === "gemini",
  );

  assert(
    "1.4 Resolves 'claude-3-5-sonnet' to 'anthropic'",
    AIProviderFactory.resolveProviderId("claude-3-5-sonnet") === "anthropic",
  );

  assert(
    "1.5 Resolves 'ollama/llama3' to 'ollama'",
    AIProviderFactory.resolveProviderId("ollama/llama3") === "ollama",
  );

  let caughtUnsupported = false;
  try {
    AIProviderFactory.resolveProviderId("unsupported-exotic-model");
  } catch (err: unknown) {
    if (err instanceof AIProviderError && err.status === 400 && !err.isRetryable) {
      caughtUnsupported = true;
    }
  }
  assert("1.6 Fails fast with AIProviderError 400 on unsupported model", caughtUnsupported);

  // -------------------------------------------------------------
  // TEST 2: Singleton Caching & Factory Registration
  // -------------------------------------------------------------
  console.log("\n--- Group 2: Singleton Caching & Dynamic Registration ---");

  const provider1 = AIProviderFactory.getProvider("gpt-4o");
  const provider2 = AIProviderFactory.getProvider("openai");
  assert("2.1 Singleton instance reused across calls", provider1 === provider2);

  // Mock Provider Registration
  class MockProvider implements AIProvider {
    public readonly id = "mock-provider";
    async generate() {
      return {
        content: "mock response",
        finishReason: "stop" as const,
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
      };
    }
    async *stream(): AsyncIterable<StreamChunk> {
      yield { type: "text_delta", text: "mock chunk" };
      yield {
        type: "done",
        finishReason: "stop",
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
      };
    }
  }

  AIProviderFactory.registerProvider("mock", () => new MockProvider());
  const resolvedMock = AIProviderFactory.getProvider("mock");
  assert("2.2 Custom provider registered and resolved", resolvedMock.id === "mock-provider");

  // -------------------------------------------------------------
  // TEST 3: OpenAI Adapter Ingress & Egress (Static Mock Fetch)
  // -------------------------------------------------------------
  console.log("\n--- Group 3: Adapter Generation & Data Normalization ---");

  const originalFetch = global.fetch;

  // Mock successful OpenAI response with a tool call
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const bodyStr = init?.body as string;
    const parsedBody = JSON.parse(bodyStr);

    // Verify ingress translation
    if (parsedBody.tools?.[0]?.type !== "function") {
      throw new Error("Ingress tools not formatted with type: 'function'");
    }

    const mockResponsePayload = {
      id: "chatcmpl-test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "I will check the weather for you.",
            tool_calls: [
              {
                id: "call_abc123",
                type: "function",
                function: {
                  name: "get_weather",
                  arguments: JSON.stringify({ location: "San Francisco", unit: "celsius" }),
                },
              },
            ],
          },
          finish_reason: "tool_calls",
        },
      ],
      usage: {
        prompt_tokens: 42,
        completion_tokens: 18,
        total_tokens: 60,
      },
    };

    return new Response(JSON.stringify(mockResponsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const adapter = new OpenAIAdapter({ apiKey: "test-key" });
  const request: ModelRequest = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "What is the weather in SF?" },
    ],
    tools: [
      {
        name: "get_weather",
        description: "Get current weather",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    ],
  };

  const result = await adapter.generate(request);

  assert(
    "3.1 Generated response content extracted",
    result.content === "I will check the weather for you.",
  );
  assert(
    "3.2 Tool call id and name preserved",
    result.toolCalls?.[0]?.id === "call_abc123" && result.toolCalls?.[0]?.name === "get_weather",
  );
  assert(
    "3.3 Tool call JSON arguments parsed into typed object",
    result.toolCalls?.[0]?.arguments?.location === "San Francisco" &&
      result.toolCalls?.[0]?.arguments?.unit === "celsius",
  );
  assert(
    "3.4 Finish reason mapped to 'tool_calls'",
    result.finishReason === "tool_calls",
  );
  assert(
    "3.5 Usage token counts mapped accurately",
    result.usage.totalTokens === 60 && result.usage.promptTokens === 42,
  );

  // -------------------------------------------------------------
  // TEST 4: SSE Streaming with Split TCP Packets & Multi-Event
  // -------------------------------------------------------------
  console.log("\n--- Group 4: SSE Streaming & Packet Reassembly ---");

  // Deliberately split lines across chunk boundaries to test line buffer reassembly
  const ssePackets = [
    'data: {"choices":[{"delta":{"content":"Hel',
    'lo"}}]}\n\ndata: {"choices":[{"delta":{"content":" world"}}]}\n\n',
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"call_999","function":{"name":"calc' +
      'ulator","arguments":"{\\"expr',
    '\\":\\"2+2\\"}"}}]}}]}\n\ndata: {"choices":[{"finish_reason":"tool_calls"}],"usage":{"prompt_tokens":15,"completion_tokens":10,"total_tokens":25}}\n\ndata: [DONE]\n\n',
  ];

  global.fetch = async (): Promise<Response> => {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for (const packet of ssePackets) {
          controller.enqueue(encoder.encode(packet));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
    });
  };

  const chunks: StreamChunk[] = [];
  for await (const chunk of adapter.stream(request)) {
    chunks.push(chunk);
  }

  const textDeltas = chunks
    .filter((c) => c.type === "text_delta")
    .map((c: any) => c.text)
    .join("");

  assert("4.1 Split SSE packets reassembled text cleanly ('Hello world')", textDeltas === "Hello world");

  const toolStart = chunks.find((c) => c.type === "tool_call_start") as any;
  assert("4.2 Emitted tool_call_start with id and name", toolStart?.id === "call_999" && toolStart?.name === "calculator");

  const toolFinish = chunks.find((c) => c.type === "tool_call_finish") as any;
  assert(
    "4.3 Reassembled split JSON arguments and parsed on tool_call_finish",
    toolFinish?.arguments?.expr === "2+2",
  );

  const doneChunk = chunks.find((c) => c.type === "done") as any;
  assert(
    "4.4 Emitted 'done' chunk with final usage & finishReason",
    doneChunk?.finishReason === "tool_calls" && doneChunk?.usage?.totalTokens === 25,
  );

  // -------------------------------------------------------------
  // TEST 5: Error Handling & Retryable Classification
  // -------------------------------------------------------------
  console.log("\n--- Group 5: Error Classification ---");

  // 5.1 Test Rate Limit (429) -> retryable
  global.fetch = async () =>
    new Response("Rate limit exceeded", { status: 429 });

  let rateLimitError: AIProviderError | null = null;
  try {
    await adapter.generate(request);
  } catch (err: any) {
    rateLimitError = err;
  }
  assert(
    "5.1 HTTP 429 Rate Limit marked as isRetryable: true",
    rateLimitError !== null && rateLimitError.isRetryable === true && rateLimitError.status === 429,
  );

  // 5.2 Test Auth Failure (401) -> NOT retryable
  global.fetch = async () =>
    new Response("Invalid API Key", { status: 401 });

  let authError: AIProviderError | null = null;
  try {
    await adapter.generate(request);
  } catch (err: any) {
    authError = err;
  }
  assert(
    "5.2 HTTP 401 Unauthorized marked as isRetryable: false",
    authError !== null && authError.isRetryable === false && authError.status === 401,
  );

  // Restore real fetch
  global.fetch = originalFetch;
  AIProviderFactory.reset();

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Unhandled error in test suite:", err);
  process.exit(1);
});

