"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Check, 
  X, 
  AlertTriangle, 
  Eye, 
  Send, 
  Trash2, 
  UserCheck 
} from "lucide-react";

export function SecurityMatrix() {
  return (
    <section id="security" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 mb-2 font-semibold">
            ZERO-LEAK ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            Enterprise-grade security and action guardrails
          </h2>
          <p className="mt-4 max-w-xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Full control over what your Meow Bot agents can read, execute, and modify.
            OAuth tokens are encrypted in hardware vaults and never exposed to the LLM.
          </p>
        </div>

        {/* 2 Column Security Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Card: Account Rules */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 border border-black/8 text-neutral-800">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-sans text-neutral-900 tracking-tight">
                    Your accounts, your rules
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans">
                    OAuth 2.0 PKCE • Tokens never passed in model context
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed mb-6">
                Your AI agent never sees a raw API key or password. You choose granular scopes for each tool,
                and Meow Bot executes actions through sandboxed microservices with full auditability.
              </p>

              {/* Scopes Box */}
              <div className="rounded-2xl border border-black/8 bg-neutral-50 p-4 flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-black/6">
                  <span className="font-semibold text-neutral-700">WORKSPACE PERMISSION MATRIX</span>
                  <span className="text-[10px] text-neutral-400">granularity: per-action</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Eye className="size-3.5 text-neutral-500" />
                    <span className="text-neutral-800">Read emails & calendar events</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="size-3" /> ALLOWED
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Send className="size-3.5 text-neutral-500" />
                    <span className="text-neutral-800">Send automated email or message</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <AlertTriangle className="size-3" /> CONFIRMATION REQ.
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Trash2 className="size-3.5 text-neutral-500" />
                    <span className="text-neutral-800">Delete threads or repository data</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    <X className="size-3" /> BLOCKED
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 text-xs text-neutral-500 font-mono">
              Tokens stored in AES-256 encrypted Supabase vaults.
            </div>
          </div>

          {/* Right Card: Intercept Audit Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-sans text-neutral-900 tracking-tight">
                    Human-in-the-loop gatekeeper
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans">
                    Action interceptor & security policy compliance
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed mb-6">
                When an autonomous agent is instructed to perform high-stakes operations or access restricted endpoints,
                Meow Bot intercepts the call before execution.
              </p>

              {/* Intercept Audit Card */}
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 flex flex-col gap-2.5 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-red-200/60">
                  <span className="text-red-700 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />
                    INTERCEPTED AT RUNTIME
                  </span>
                  <span className="text-neutral-500 text-[10px]">10:34:12 PM IST</span>
                </div>

                <div className="text-neutral-800 text-[11px] leading-relaxed">
                  <span className="text-neutral-500">Attempted Tool Call:</span> gmail.delete_thread
                </div>
                <div className="text-neutral-800 text-[11px] leading-relaxed">
                  <span className="text-neutral-500">Agent:</span> social media bot (c23d1bfe)
                </div>
                <div className="text-red-700 font-semibold text-[11px] leading-relaxed bg-white/80 p-2 rounded-lg border border-red-200">
                  "Action Blocked: Organization Policy prohibits automatic message deletion without manual supervisor 2FA sign-off."
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 flex items-center justify-between font-mono text-xs text-neutral-500">
              <span>Telemetry retention: 365 days</span>
              <span className="text-neutral-900 font-semibold">SOC 2 Type II Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}