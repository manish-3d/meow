import { createGoogleGenerativeAI } from "@ai-sdk/google";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

if (!apiKey) {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not configured in .env");
}

export const google = createGoogleGenerativeAI({
  apiKey,
});

// Standard model used across Meow Bot agents
export const defaultGeminiModel = google("gemini-3-flash-preview");
