import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { getModelById, ReasoningEffort } from "./models";

// Fallback Google instance using server environment variable
const serverGoogleKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const defaultGoogle = createGoogleGenerativeAI({
  apiKey: serverGoogleKey,
});

export function getLanguageModel({
  modelId,
  apiKey,
  effort = "medium",
}: {
  modelId: string;
  apiKey?: string;
  effort?: ReasoningEffort;
}) {
  const modelDef = getModelById(modelId);

  // 1. Google Gemini Models
  if (modelDef.provider === "google") {
    // If it's free Gemini 2.5 Flash, use server key unless user supplied their own
    const effectiveKey = apiKey?.trim() || (modelDef.isFree ? serverGoogleKey : "");
    if (!effectiveKey) {
      throw new Error(`API key required for ${modelDef.name}. Please configure your Google Gemini API key in Settings.`);
    }

    const googleClient = apiKey?.trim()
      ? createGoogleGenerativeAI({ apiKey: apiKey.trim() })
      : defaultGoogle;

    // Map internal ID to Google model name supported by Google API
    const googleModelName =
      modelId === "gemini-2.5-pro"
        ? "gemini-3.1-pro-preview"
        : "gemini-3-flash-preview";

    return googleClient(googleModelName);
  }

  // 2. Anthropic Models
  if (modelDef.provider === "anthropic") {
    if (!apiKey?.trim()) {
      throw new Error(`API key required for ${modelDef.name}. Please configure your Anthropic API key in Settings.`);
    }

    const anthropic = createAnthropic({
      apiKey: apiKey.trim(),
    });

    const anthropicModelMap: Record<string, string> = {
      "claude-3-7-sonnet": "claude-3-7-sonnet-20250219",
      "claude-3-5-sonnet": "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku": "claude-3-5-haiku-20241022",
    };

    const targetModel = anthropicModelMap[modelId] || "claude-3-7-sonnet-20250219";
    return anthropic(targetModel);
  }

  // 3. OpenAI Models
  if (modelDef.provider === "openai") {
    if (!apiKey?.trim()) {
      throw new Error(`API key required for ${modelDef.name}. Please configure your OpenAI API key in Settings.`);
    }

    const openai = createOpenAI({
      apiKey: apiKey.trim(),
    });

    const openaiModelMap: Record<string, string> = {
      "gpt-4o": "gpt-4o",
      "gpt-4.5": "gpt-4.5-preview",
      "o3-mini": "o3-mini",
    };

    const targetModel = openaiModelMap[modelId] || "gpt-4o";
    return openai(targetModel);
  }

  // 4. DeepSeek Models (OpenAI-compatible endpoint)
  if (modelDef.provider === "deepseek") {
    if (!apiKey?.trim()) {
      throw new Error(`API key required for ${modelDef.name}. Please configure your DeepSeek API key in Settings.`);
    }

    const deepseek = createOpenAI({
      apiKey: apiKey.trim(),
      baseURL: "https://api.deepseek.com",
    });

    const deepseekModelMap: Record<string, string> = {
      "deepseek-r1": "deepseek-reasoner",
      "deepseek-v3": "deepseek-chat",
    };

    const targetModel = deepseekModelMap[modelId] || "deepseek-chat";
    return deepseek(targetModel);
  }

  // Fallback to default Gemini Flash
  return defaultGoogle("gemini-2.5-flash");
}
