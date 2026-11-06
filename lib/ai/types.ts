/**
 * Meow AI Provider Abstraction Contracts
 *
 * Universal, vendor-agnostic type definitions for LLM communication,
 * tool declarations, and response streaming.
 */

export type ModelRole = "system" | "user" | "assistant" | "tool";

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ModelMessage {
  role: ModelRole;
  content: string;
  name?: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // Standard JSON Schema
}

export interface ModelRequest {
  model: string;
  messages: ModelMessage[];
  tools?: ToolDefinition[];
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export type FinishReason = "stop" | "tool_calls" | "length" | "error";

export interface ModelResponse {
  content: string;
  toolCalls?: ToolCall[];
  finishReason: FinishReason;
  usage: TokenUsage;
}

/**
 * Discriminated union representing incremental events during streaming.
 */
export type StreamChunk =
  | { type: "text_delta"; text: string }
  | { type: "tool_call_start"; id: string; name: string }
  | { type: "tool_call_delta"; id: string; chunk: string }
  | { type: "tool_call_finish"; id: string; name: string; arguments: Record<string, unknown> }
  | { type: "done"; finishReason: FinishReason; usage: TokenUsage };

/**
 * Universal contract that every LLM provider adapter must implement.
 */
export interface AIProvider {
  /** The unique identifier of this provider adapter (e.g. 'openai', 'gemini', 'anthropic') */
  readonly id: string;

  /** Standard static generation */
  generate(request: ModelRequest): Promise<ModelResponse>;

  /** Real-time token and tool-call streaming */
  stream(request: ModelRequest): AsyncIterable<StreamChunk>;
}

/**
 * Standardized AI Domain Error
 */
export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly status?: number,
    public readonly isRetryable: boolean = false,
    public readonly originalError?: unknown,
  ) {
    super(`[${provider}] ${message}`);
    this.name = "AIProviderError";
  }
}

