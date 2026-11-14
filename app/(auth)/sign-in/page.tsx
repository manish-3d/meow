"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/overview";
  const urlError = searchParams.get("error");

  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(
    urlError === "OAuthSignin" || urlError === "OAuthCallback"
      ? "Error connecting with OAuth provider. Please try again."
      : null
  );

  const handleOAuthSignIn = (provider: "google" | "github") => {
    setOauthLoading(provider);
    setError(null);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(120,119,198,0.12),transparent_70%)] pointer-events-none -z-10" />

      <div className="w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#0c0d10] p-8 shadow-2xl space-y-6 relative">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center">
            <img
              src="/logo.png"
              alt="Meow Logo"
              className="h-14 w-14 rounded-full border border-white/20 shadow-md object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome to Meow</h1>
            <p className="text-xs text-white/50 pt-1">
              Sign in to orchestrate autonomous AI agents and sandboxed tools.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={!!oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{oauthLoading === "google" ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            disabled={!!oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>{oauthLoading === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[11px] font-mono text-white/40 uppercase">Or Continue As Guest</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Guest / Direct Demo Access */}
        <Link
          href="/overview"
          className="w-full py-2.5 px-4 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-sm"
        >
          <span>Launch Workspace Directly</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-white/[0.06]">
          <p className="text-xs text-white/40">
            New to Meow?{" "}
            <Link href="/sign-up" className="text-white hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090a] flex items-center justify-center text-xs text-white/40 font-mono">
          Loading authentication gateway...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
