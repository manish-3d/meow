/**
 * Meow AI Provider Factory & Registry
 *
 * Implements the Registry and Factory patterns for dynamic,
 * lazy-loaded provider resolution with fail-fast validation.
 */

import { AIProvider, AIProviderError } from "./types";
import { OpenAIAdapter } from "./adapters/openai";

export type ProviderFactoryFn = () => AIProvider;

export class AIProviderFactory {
  private static registry = new Map<string, ProviderFactoryFn>();
  private static instances = new Map<string, AIProvider>();
  private static defaultsInitialized = false;

  private static ensureDefaults(): void {
    if (this.defaultsInitialized) return;
    this.defaultsInitialized = true;

    // Default OpenAI adapter
    if (!this.registry.has("openai")) {
      this.registry.set("openai", () => new OpenAIAdapter());
    }

    // Default Ollama adapter (reuses OpenAI-compatible protocol)
    if (!this.registry.has("ollama")) {
      this.registry.set(
        "ollama",
        () =>
          new OpenAIAdapter({
            baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
            apiKey: "ollama", // dummy key for local instance
          }),
      );
    }
  }

  /**
   * Register a provider adapter factory by its unique ID (e.g. 'gemini', 'openai').
   */
  public static registerProvider(providerId: string, factory: ProviderFactoryFn): void {
    this.ensureDefaults();
    this.registry.set(providerId.toLowerCase(), factory);
    // Invalidate cached instance if a new factory is registered (useful in tests)
    this.instances.delete(providerId.toLowerCase());
  }

  /**
   * Determine the provider identifier based on the model name.
   */
  public static resolveProviderId(model: string): string {
    const normalized = model.trim().toLowerCase();

    if (normalized.startsWith("gemini-")) {
      return "gemini";
    }

    if (
      normalized.startsWith("gpt-") ||
      normalized.startsWith("o1-") ||
      normalized.startsWith("o3-") ||
      normalized.startsWith("chatgpt-")
    ) {
      return "openai";
    }

    if (normalized.startsWith("claude-")) {
      return "anthropic";
    }

    if (
      normalized.startsWith("ollama/") ||
      normalized.startsWith("llama") ||
      normalized.startsWith("mistral") ||
      normalized.startsWith("qwen")
    ) {
      return "ollama";
    }

    throw new AIProviderError(
      `Unsupported or unrecognized model '${model}'. Ensure the model name starts with a supported provider prefix (e.g. 'gemini-', 'gpt-', 'claude-').`,
      "factory",
      400,
      false,
    );
  }

  /**
   * Get or lazily instantiate the AIProvider adapter for a given model or provider ID.
   */
  public static getProvider(modelOrProviderId: string): AIProvider {
    this.ensureDefaults();
    let providerId: string;

    // Check if the input is already a registered provider ID
    if (this.registry.has(modelOrProviderId.toLowerCase())) {
      providerId = modelOrProviderId.toLowerCase();
    } else {
      providerId = this.resolveProviderId(modelOrProviderId);
    }

    // Return cached singleton instance if available
    const cached = this.instances.get(providerId);
    if (cached) {
      return cached;
    }

    // Look up factory function
    const factory = this.registry.get(providerId);
    if (!factory) {
      throw new AIProviderError(
        `Provider '${providerId}' is recognized for model '${modelOrProviderId}' but has no registered adapter implementation.`,
        "factory",
        501,
        false,
      );
    }

    // Instantiate and cache singleton
    const instance = factory();
    this.instances.set(providerId, instance);
    return instance;
  }

  /**
   * Clear all registered providers and cached singletons (primarily used for test teardowns).
   */
  public static reset(): void {
    this.registry.clear();
    this.instances.clear();
    this.defaultsInitialized = false;
  }
}

