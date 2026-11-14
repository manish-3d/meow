"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle, ArrowRight, Check, Mail, HelpCircle } from "lucide-react";

function SignUpContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/overview";
  const [authLoading, setAuthLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSignUp = async (userEmail: string, userName?: string) => {
    setAuthLoading("credentials");
    setError(null);
    try {
      const res = await signIn("credentials", {
        email: userEmail.trim() || "newuser@meow.ai",
        name: userName?.trim() || "Meow Explorer",
        callbackUrl,
        redirect: true,
      });
      if (res?.error) {
        setError(res.error);
        setAuthLoading(null);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
      setAuthLoading(null);
    }
  };

  const handleOAuthSignUp = (provider: "google" | "github") => {
    setAuthLoading(provider);
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
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Create your Account</h1>
            <p className="text-xs text-white/50 pt-1">
              Start orchestrating autonomous agents in your personal workspace.
            </p>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-2 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>Instant workspace provisioning with Neon DB</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>50,000 free tokens & 14 built-in agent tools</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>Social integrations with X/Twitter & GitHub</span>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Instant Sign Up */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() => handleCredentialsSignUp("founder@meow.ai", "Founder")}
            disabled={!!authLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg hover:scale-[1.01] disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 fill-indigo-600" />
            <span>{authLoading === "credentials" ? "Creating Workspace..." : "1-Click Instant Sign Up (Demo)"}</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto text-black/60" />
          </button>
        </div>

        {/* Email Sign Up Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) handleCredentialsSignUp(email, name);
          }}
          className="space-y-2.5 pt-1"
        >
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (e.g. Alex Doe)"
              className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50"
            />
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email (e.g. you@company.com)"
                className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
          {email.trim() && (
            <button
              type="submit"
              disabled={!!authLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Create Account for {email}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Or Use Social</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuthSignUp("google")}
            disabled={!!authLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{authLoading === "google" ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignUp("github")}
            disabled={!!authLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>{authLoading === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-white/[0.06]">
          <p className="text-xs text-white/40">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-white hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090a] flex items-center justify-center text-xs text-white/40 font-mono">
          Loading registration gateway...
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
