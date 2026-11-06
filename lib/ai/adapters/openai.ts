/**
 * OpenAI / OpenAI-Compatible Provider Adapter
 *
 * Implements the universal AIProvider contract for OpenAI, Groq,
 * Ollama, DeepSeek, and any provider implementing the /v1/chat/completions spec.
 */

import {
  AIProvider,
  AIProviderError,
  FinishReason,
  ModelMessage,
  ModelRequest,
  ModelResponse,
  StreamChunk,
  ToolCall,
  ToolDefinition,
} from "../types";

export interface OpenAIAdapterConfig {
  apiKey?: string;
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

export class OpenAIAdapter implements AIProvider {
  public readonly id = "openai";
  private apiKey: string;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config?: OpenAIAdapterConfig) {
    this.apiKey = config?.apiKey || process.env.OPENAI_API_KEY || "";
    this.baseUrl = (config?.baseUrl || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
      /\/+$/,
      "",
    );
    this.defaultHeaders = config?.defaultHeaders || {};
  }

  /**
   * Translates Meow tool definitions to the OpenAI format.
   */
  private formatTools(tools?: ToolDefinition[]): Array<Record<string, unknown>> | undefined {
    if (!tools || tools.length === 0) return undefined;

    return tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));
  }

  /**
   * Translates Meow universal messages into OpenAI chat messages.
   */
  private formatMessages(messages: ModelMessage[]): Array<Record<string, unknown>> {
    return messages.map((m) => {
      const msg: Record<string, unknown> = {
        role: m.role,
        content: m.content,
      };

      if (m.name) {
        msg.name = m.name;
      }

      if (m.role === "tool" && m.toolCallId) {
        msg.tool_call_id = m.toolCallId;
      }

      if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
        msg.tool_calls = m.toolCalls.map((tc) => ({
          id: tc.id,
          type: "function",
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.arguments),
          },
        }));
      }

      return msg;
    });
  }

  /**
   * Maps OpenAI finish_reason to Meow FinishReason.
   */
  private mapFinishReason(reason: string | null | undefined): FinishReason {
    switch (reason) {
      case "stop":
        return "stop";
      case "tool_calls":
      case "function_call":
        return "tool_calls";
      case "length":
        return "length";
      default:
        return "stop";
    }
  }

  /**
   * Static non-streaming generation
   */
  public async generate(request: ModelRequest): Promise<ModelResponse> {
    const payload: Record<string, unknown> = {
      model: request.model,
      messages: this.formatMessages(request.messages),
      temperature: request.temperature ?? 0.7,
      stream: false,
    };

    if (request.maxTokens) {
      payload.max_tokens = request.maxTokens;
    }

    if (request.stopSequences && request.stopSequences.length > 0) {
      payload.stop = request.stopSequences;
    }

    const tools = this.formatTools(request.tools);
    if (tools) {
      payload.tools = tools;
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          ...this.defaultHeaders,
        },
        body: JSON.stringify(payload),
      });
    } catch (err: unknown) {
      throw new AIProviderError(
        `Network request failed: ${err instanceof Error ? err.message : String(err)}`,
        this.id,
        undefined,
        true, // Network errors are usually retryable
        err,
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      const isRetryable = response.status === 429 || response.status >= 500;
      throw new AIProviderError(
        `API returned error (HTTP ${response.status}): ${errorText}`,
        this.id,
        response.status,
        isRetryable,
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) {
      throw new AIProviderError("Response missing choice data", this.id, 502, false);
    }

    const toolCalls: ToolCall[] = [];
    if (choice.message?.tool_calls) {
      for (const tc of choice.message.tool_calls) {
        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = JSON.parse(tc.function?.arguments || "{}");
        } catch {
          parsedArgs = { _raw: tc.function?.arguments };
        }
        toolCalls.push({
          id: tc.id,
          name: tc.function?.name || "",
          arguments: parsedArgs,
        });
      }
    }

    return {
      content: choice.message?.content || "",
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      finishReason: this.mapFinishReason(choice.finish_reason),
      usage: {
        promptTokens: data.usage?.prompt_tokens ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
        totalTokens: data.usage?.total_tokens ?? 0,
      },
    };
  }

  /**
   * Real-time SSE streaming generation
   */
  public async *stream(request: ModelRequest): AsyncIterable<StreamChunk> {
    const payload: Record<string, unknown> = {
      model: request.model,
      messages: this.formatMessages(request.messages),
      temperature: request.temperature ?? 0.7,
      stream: true,
      stream_options: { include_usage: true },
    };

    if (request.maxTokens) {
      payload.max_tokens = request.maxTokens;
    }

    if (request.stopSequences && request.stopSequences.length > 0) {
      payload.stop = request.stopSequences;
    }

    const tools = this.formatTools(request.tools);
    if (tools) {
      payload.tools = tools;
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          ...this.defaultHeaders,
        },
        body: JSON.stringify(payload),
      });
    } catch (err: unknown) {
      throw new AIProviderError(
        `Network request failed: ${err instanceof Error ? err.message : String(err)}`,
        this.id,
        undefined,
        true,
        err,
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      const isRetryable = response.status === 429 || response.status >= 500;
      throw new AIProviderError(
        `Streaming API returned error (HTTP ${response.status}): ${errorText}`,
        this.id,
        response.status,
        isRetryable,
      );
    }

    if (!response.body) {
      throw new AIProviderError("Response body is null", this.id, 502, false);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let finalFinishReason: FinishReason = "stop";
    let tokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

    // Track active tool calls being assembled chunk by chunk
    const activeToolCalls = new Map<
      number,
      { id: string; name: string; argumentsBuffer: string }
    >();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":")) continue; // Skip empty lines and SSE comments

          if (trimmed === "data: [DONE]") {
            continue;
          }

          if (trimmed.startsWith("data: ")) {
            const jsonStr = trimmed.slice(6);
            let parsed: any;
            try {
              parsed = JSON.parse(jsonStr);
            } catch {
              continue; // Skip malformed chunks safely
            }

            // Capture usage if emitted by provider
            if (parsed.usage) {
              tokenUsage = {
                promptTokens: parsed.usage.prompt_tokens ?? tokenUsage.promptTokens,
                completionTokens: parsed.usage.completion_tokens ?? tokenUsage.completionTokens,
                totalTokens: parsed.usage.total_tokens ?? tokenUsage.totalTokens,
              };
            }

            const choice = parsed.choices?.[0];
            if (!choice) continue;

            if (choice.finish_reason) {
              finalFinishReason = this.mapFinishReason(choice.finish_reason);
            }

            const delta = choice.delta;
            if (!delta) continue;

            // 1. Text Delta
            if (delta.content) {
              yield { type: "text_delta", text: delta.content };
            }

            // 2. Tool Calls Delta
            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                const index = tc.index ?? 0;

                if (!activeToolCalls.has(index)) {
                  activeToolCalls.set(index, {
                    id: tc.id || `tc_${Date.now()}_${index}`,
                    name: tc.function?.name || "",
                    argumentsBuffer: "",
                  });

                  yield {
                    type: "tool_call_start",
                    id: activeToolCalls.get(index)!.id,
                    name: activeToolCalls.get(index)!.name,
                  };
                }

                const current = activeToolCalls.get(index)!;

                if (tc.function?.name && !current.name) {
                  current.name = tc.function.name;
                }

                if (tc.function?.arguments) {
                  current.argumentsBuffer += tc.function.arguments;
                  yield {
                    type: "tool_call_delta",
                    id: current.id,
                    chunk: tc.function.arguments,
                  };
                }
              }
            }
          }
        }
      }

      // Finalize any assembled tool calls
      for (const [, toolCall] of activeToolCalls.entries()) {
        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = JSON.parse(toolCall.argumentsBuffer || "{}");
        } catch {
          parsedArgs = { _raw: toolCall.argumentsBuffer };
        }

        yield {
          type: "tool_call_finish",
          id: toolCall.id,
          name: toolCall.name,
          arguments: parsedArgs,
        };
      }

      // Yield completion signal
      yield {
        type: "done",
        finishReason: finalFinishReason,
        usage: tokenUsage,
      };
    } finally {
      reader.releaseLock();
    }
  }
}

