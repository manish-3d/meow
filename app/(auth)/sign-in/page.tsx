"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspace";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    urlError ? "Authentication failed. Please verify your credentials or try email sign-in." : null
  );

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading("email");
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        callbackUrl,
        redirect: true,
      });
      if (res?.error) {
        setError("Unable to authenticate with this email. Please try again.");
        setLoading(null);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(null);
    }
  };

  const handleOAuthSignIn = (provider: "google" | "github") => {
    setLoading(provider);
    setError(null);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFC] text-black flex flex-col items-center justify-center p-6 relative font-sans selection:bg-black/10 selection:text-black antialiased">
      {/* Back to product navigation */}
      <div className="w-full max-w-sm mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#777169] hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>meow.ai</span>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-sm rounded-2xl border border-[#ebe8e4] bg-white p-8 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.04)] space-y-6">
        {/* Brand Identity */}
        <div className="text-center space-y-2.5">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-black text-white font-bold text-sm shadow-xs">
            M
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-normal tracking-tight text-black">Log in to Meow</h1>
            <p className="text-xs text-[#777169]">
              Enter your email to access your autonomous agent workspace.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Primary Email Sign In */}
        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <div className="space-y-1.5">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-[#ebe8e4] bg-white px-3.5 py-2.5 text-xs text-black placeholder:text-[#9E988F] focus:border-black focus:outline-none transition-all shadow-[0_1px_1px_rgba(0,0,0,0.02)]"
            />
          </div>
          <button
            type="submit"
            disabled={!email.trim() || !!loading}
            className="w-full rounded-xl bg-black text-white py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#374151] active:scale-[0.99] transition-all disabled:opacity-40 disabled:hover:scale-100 shadow-xs cursor-pointer"
          >
            {loading === "email" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Continue with Email</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#ebe8e4]" />
          <span className="bg-white px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#9E988F] absolute">
            or continue with
          </span>
        </div>

        {/* Enterprise OAuth Providers */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={!!loading}
            className="w-full py-2.5 px-4 rounded-xl border border-[#ebe8e4] bg-white hover:bg-[#F5F4F0] text-black text-xs font-medium flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 shadow-[0_1px_1px_rgba(0,0,0,0.04)] cursor-pointer"
          >
            {loading === "google" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-black/60" />
            ) : (
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            disabled={!!loading}
            className="w-full py-2.5 px-4 rounded-xl border border-[#ebe8e4] bg-white hover:bg-[#F5F4F0] text-black text-xs font-medium flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 shadow-[0_1px_1px_rgba(0,0,0,0.04)] cursor-pointer"
          >
            {loading === "github" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-black/60" />
            ) : (
              <svg className="h-4 w-4 shrink-0 fill-black" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[11px] text-center text-[#9E988F] leading-relaxed pt-2">
          By signing in, you agree to our{" "}
          <span className="text-[#777169] hover:underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="text-[#777169] hover:underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFCFC] flex items-center justify-center text-xs text-[#777169] font-mono">
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
