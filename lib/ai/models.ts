export interface ModelDefinition {
  id: string;
  name: string;
  provider: "google" | "anthropic" | "openai" | "deepseek";
  providerName: string;
  isFree: boolean;
  description: string;
  badge: string;
  contextWindow: string;
  pricing: {
    inputPerMillion: number; // in USD
    outputPerMillion: number; // in USD
  };
  recommendedFor: string;
  supportsEffort: boolean;
}

export type ReasoningEffort = "low" | "medium" | "high";

export const EFFORT_CONFIG: Record<
  ReasoningEffort,
  { label: string; bars: string; multiplier: number; description: string; instruction: string }
> = {
  low: {
    label: "Low Effort",
    bars: "▮▯▯",
    multiplier: 0.75,
    description: "Fast turnaround, concise code, low token consumption",
    instruction: "Respond with concise, direct execution. Minimize boilerplate and conversational filler.",
  },
  medium: {
    label: "Medium Effort",
    bars: "▮▮▯",
    multiplier: 1.0,
    description: "Balanced reasoning, standard step-by-step thinking",
    instruction: "Use structured step-by-step reasoning. Validate your assumptions before outputting.",
  },
  high: {
    label: "High Effort",
    bars: "▮▮▮",
    multiplier: 1.85,
    description: "Deep reasoning, thorough multi-pass code analysis, maximum depth",
    instruction: "Perform deep multi-pass reasoning, comprehensive edge-case analysis, and architectural verification before generating output.",
  },
};

export const AVAILABLE_MODELS: ModelDefinition[] = [
  // 1. Google Gemini (Meow Default Free Tier)
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "google",
    providerName: "Google",
    isFree: true,
    description: "Provided free by Meow Bot out-of-the-box. Ultra-fast, highly capable coding and reasoning agent.",
    badge: "Meow Default (Free)",
    contextWindow: "1M tokens",
    pricing: {
      inputPerMillion: 0.0,
      outputPerMillion: 0.0,
    },
    recommendedFor: "General coding, daily routines, fast browser automation",
    supportsEffort: true,
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    provider: "google",
    providerName: "Google",
    isFree: false,
    description: "Google's most powerful reasoning model with a massive 2 million token context window.",
    badge: "Frontier 2M Context",
    contextWindow: "2M tokens",
    pricing: {
      inputPerMillion: 1.25,
      outputPerMillion: 5.0,
    },
    recommendedFor: "Massive codebases, whole-repo refactoring, multi-file analysis",
    supportsEffort: true,
  },

  // 2. Anthropic (BYOK)
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "anthropic",
    providerName: "Anthropic",
    isFree: false,
    description: "Anthropic's flagship hybrid model with dynamic extended thinking and state-of-the-art coding benchmark scores.",
    badge: "Frontier Coding Flagship",
    contextWindow: "200k tokens",
    pricing: {
      inputPerMillion: 3.0,
      outputPerMillion: 15.0,
    },
    recommendedFor: "Complex software engineering, algorithmic debugging, architecture",
    supportsEffort: true,
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    providerName: "Anthropic",
    isFree: false,
    description: "Industry-standard coding model with exceptional craft, frontend design comprehension, and tool usage.",
    badge: "Coding Benchmark",
    contextWindow: "200k tokens",
    pricing: {
      inputPerMillion: 3.0,
      outputPerMillion: 15.0,
    },
    recommendedFor: "Frontend crafting, Next.js, TypeScript, system design",
    supportsEffort: true,
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    providerName: "Anthropic",
    isFree: false,
    description: "Lightning-fast agent model with unmatched price-to-performance for rapid tool execution.",
    badge: "High Speed Agent",
    contextWindow: "200k tokens",
    pricing: {
      inputPerMillion: 0.8,
      outputPerMillion: 4.0,
    },
    recommendedFor: "Quick tasks, continuous routines, high frequency automation",
    supportsEffort: false,
  },

  // 3. OpenAI (BYOK)
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    providerName: "OpenAI",
    isFree: false,
    description: "OpenAI's flagship omni model combining fast multimodal intelligence with strong tool calling.",
    badge: "Frontier Omni",
    contextWindow: "128k tokens",
    pricing: {
      inputPerMillion: 2.5,
      outputPerMillion: 10.0,
    },
    recommendedFor: "Multimodal workflows, general intelligence, API orchestration",
    supportsEffort: false,
  },
  {
    id: "gpt-4.5",
    name: "GPT-4.5 Preview",
    provider: "openai",
    providerName: "OpenAI",
    isFree: false,
    description: "OpenAI's largest world-knowledge and deep synthesis frontier model for broad problem-solving.",
    badge: "Frontier Synthesis",
    contextWindow: "128k tokens",
    pricing: {
      inputPerMillion: 75.0,
      outputPerMillion: 150.0,
    },
    recommendedFor: "Creative synthesis, broad world knowledge, complex strategy",
    supportsEffort: false,
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "openai",
    providerName: "OpenAI",
    isFree: false,
    description: "Specialized competitive coding and reasoning model with configurable thinking effort.",
    badge: "Reasoning Specialist",
    contextWindow: "200k tokens",
    pricing: {
      inputPerMillion: 1.1,
      outputPerMillion: 4.4,
    },
    recommendedFor: "Competitive coding, math, complex logic, debugging algorithms",
    supportsEffort: true,
  },

  // 4. DeepSeek (BYOK)
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "deepseek",
    providerName: "DeepSeek",
    isFree: false,
    description: "Frontier open-weights reasoning model with exceptional logic, math, and code synthesis.",
    badge: "Open Reasoning",
    contextWindow: "64k tokens",
    pricing: {
      inputPerMillion: 0.55,
      outputPerMillion: 2.19,
    },
    recommendedFor: "Deep chain-of-thought, mathematical proofs, low-cost reasoning",
    supportsEffort: true,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "deepseek",
    providerName: "DeepSeek",
    isFree: false,
    description: "Ultra-fast mixture-of-experts model optimized for code completion and tool execution.",
    badge: "Ultra Low Cost",
    contextWindow: "64k tokens",
    pricing: {
      inputPerMillion: 0.27,
      outputPerMillion: 1.1,
    },
    recommendedFor: "High volume processing, code refactoring, budget efficiency",
    supportsEffort: false,
  },
];

export function getModelById(id: string): ModelDefinition {
  const normalizedId =
    id === "gemini-2.5-flash"
      ? "gemini-3-flash"
      : id === "gemini-2.5-pro"
      ? "gemini-3-pro"
      : id;
  return AVAILABLE_MODELS.find((m) => m.id === normalizedId || m.id === id) || AVAILABLE_MODELS[0];
}
