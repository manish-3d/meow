import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { provider, apiKey } = await req.json();

    if (!provider || !apiKey?.trim()) {
      return NextResponse.json(
        { valid: false, status: "invalid", error: "Provider and API Key are required" },
        { status: 400 }
      );
    }

    const key = apiKey.trim();
    const startTime = Date.now();

    // 1. Anthropic Verification
    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 1,
          messages: [{ role: "user", content: "ping" }],
        }),
      });

      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({ valid: true, status: "valid", latencyMs });
      }

      const data = await res.json().catch(() => ({}));
      const errorMsg = data?.error?.message || res.statusText;

      if (res.status === 429 || errorMsg.toLowerCase().includes("quota") || errorMsg.toLowerCase().includes("credit")) {
        return NextResponse.json({
          valid: false,
          status: "exhausted",
          error: "Anthropic quota exhausted or rate limit reached. Please check your credit balance at console.anthropic.com.",
        });
      }

      return NextResponse.json({
        valid: false,
        status: "invalid",
        error: `Anthropic rejected key: ${errorMsg}`,
      });
    }

    // 2. OpenAI Verification
    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({ valid: true, status: "valid", latencyMs });
      }

      const data = await res.json().catch(() => ({}));
      const errorMsg = data?.error?.message || res.statusText;

      if (res.status === 429 || errorMsg.toLowerCase().includes("quota") || errorMsg.toLowerCase().includes("billing")) {
        return NextResponse.json({
          valid: false,
          status: "exhausted",
          error: "OpenAI quota exhausted or credit balance zero. Please check your billing at platform.openai.com.",
        });
      }

      return NextResponse.json({
        valid: false,
        status: "invalid",
        error: `OpenAI rejected key: ${errorMsg}`,
      });
    }

    // 3. Google Gemini Verification
    if (provider === "google") {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`
      );

      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({ valid: true, status: "valid", latencyMs });
      }

      const data = await res.json().catch(() => ({}));
      const errorMsg = data?.error?.message || res.statusText;

      if (res.status === 429 || errorMsg.toLowerCase().includes("quota")) {
        return NextResponse.json({
          valid: false,
          status: "exhausted",
          error: "Google Gemini API quota exhausted. Please check your Google AI Studio quota limits.",
        });
      }

      return NextResponse.json({
        valid: false,
        status: "invalid",
        error: `Google rejected key: ${errorMsg}`,
      });
    }

    // 4. DeepSeek Verification
    if (provider === "deepseek") {
      const res = await fetch("https://api.deepseek.com/models", {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({ valid: true, status: "valid", latencyMs });
      }

      const data = await res.json().catch(() => ({}));
      const errorMsg = data?.error?.message || res.statusText;

      if (res.status === 429 || errorMsg.toLowerCase().includes("balance") || errorMsg.toLowerCase().includes("insufficient")) {
        return NextResponse.json({
          valid: false,
          status: "exhausted",
          error: "DeepSeek account balance depleted or quota limit reached at platform.deepseek.com.",
        });
      }

      return NextResponse.json({
        valid: false,
        status: "invalid",
        error: `DeepSeek rejected key: ${errorMsg}`,
      });
    }

    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  } catch (err: any) {
    console.error("Error in /api/models/verify:", err);
    return NextResponse.json(
      { valid: false, status: "invalid", error: err.message || "Failed to verify key" },
      { status: 500 }
    );
  }
}
