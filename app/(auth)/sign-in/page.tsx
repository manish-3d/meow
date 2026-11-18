"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CatBotCharacter } from "@/components/custom/auth/cat-bot-character";
import { OceanBackground } from "@/components/custom/auth/ocean-background";
import { PixelClouds } from "@/components/custom/auth/pixel-clouds";
import { LoginCard } from "@/components/custom/auth/login-card";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspace";
  const urlError = searchParams.get("error");

  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [isHappy, setIsHappy] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === "OAuthSignin" || urlError === "OAuthCallback"
      ? "Error connecting with OAuth provider. Please check your credentials."
      : null
  );

  const handleOAuthSignIn = (provider: "google" | "github") => {
    setOauthLoading(provider);
    setError(null);
    setIsHappy(true);

    // Trigger OAuth sign in with preserved callbackUrl
    signIn(provider, { callbackUrl });
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f6fd] to-[#e4f1fe] flex flex-col items-center justify-center px-4 select-none">
      {/* Discreet Back to Home Link (Top Left) */}
      <Link
        href="/"
        aria-label="Back to home"
        className="fixed top-6 left-6 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-neutral-400 hover:text-neutral-700 text-xs font-mono border border-sky-100/90 shadow-2xs backdrop-blur-xs transition-all duration-200"
      >
        <ArrowLeft className="size-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Floating Pastel Pixel Clouds in Sky */}
      <PixelClouds />

      {/* Centerpiece: Cute Cat Bot sitting directly atop the Login Card */}
      <div className="relative flex flex-col items-center z-20 w-full max-w-[460px] pt-4 pb-20 sm:pb-28">
        {/* The Cat Bot (Eyes follow cursor, ears, paws resting on card) */}
        <div className="-mb-10 sm:-mb-12 relative z-20">
          <CatBotCharacter isHappy={isHappy} />
        </div>

        {/* Minimal Login Card */}
        <LoginCard
          oauthLoading={oauthLoading}
          error={error}
          onSignIn={handleOAuthSignIn}
        />
      </div>

      {/* Bottom Minecraft-Style Ocean with Waves, Lighthouse & Islands */}
      <OceanBackground />
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] text-neutral-400 font-mono text-xs">
          Loading Meow Bot sign-in...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
