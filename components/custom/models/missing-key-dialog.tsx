"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModelUsage } from "@/context/model-usage-context";
import { ModelDefinition } from "@/lib/ai/models";
import { KeyRound, Sparkles, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface MissingKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetModel: ModelDefinition;
  isExhausted?: boolean;
}

export function MissingKeyDialog({
  open,
  onOpenChange,
  targetModel,
  isExhausted = false,
}: MissingKeyDialogProps) {
  const { apiKeys, setApiKey, verifyApiKey, setSelectedModelId } = useModelUsage();
  const provider = targetModel.provider;

  const [inputKey, setInputKey] = useState(apiKeys[provider] || "");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid?: boolean;
    error?: string;
  } | null>(null);

  const handleSaveAndVerify = async () => {
    if (!inputKey.trim()) return;

    setApiKey(provider, inputKey.trim());
    setVerifying(true);
    setVerificationResult(null);

    const res = await verifyApiKey(provider);
    setVerifying(false);

    if (res.valid) {
      setVerificationResult({ valid: true });
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    } else {
      setVerificationResult({ valid: false, error: res.error });
    }
  };

  const handleSwitchToFree = () => {
    setSelectedModelId("gemini-3-flash");
    onOpenChange(false);
  };

  const providerNames: Record<string, string> = {
    anthropic: "Anthropic",
    openai: "OpenAI",
    google: "Google Gemini",
    deepseek: "DeepSeek",
  };

  const providerKeyHints: Record<string, string> = {
    anthropic: "sk-ant-api03-...",
    openai: "sk-proj-...",
    google: "AIzaSy...",
    deepseek: "sk-...",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className={`size-8 rounded-lg flex items-center justify-center ${isExhausted ? "bg-amber-500/10 text-amber-500" : "bg-sky-500/10 text-sky-500"}`}>
              {isExhausted ? <AlertTriangle className="size-4" /> : <KeyRound className="size-4" />}
            </div>
            <DialogTitle className="text-base font-bold">
              {isExhausted ? "API Quota Exhausted" : "API Key Required"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isExhausted ? (
              <>
                Your API key for <span className="font-semibold text-foreground">{targetModel.name}</span> has run out of credits or reached its rate limit. Please add a valid key or switch to Meow&apos;s free model.
              </>
            ) : (
              <>
                <span className="font-semibold text-foreground">{targetModel.name}</span> requires your own {providerNames[provider] || provider} API key (BYOK). Meow Bot provides <span className="font-semibold text-emerald-600 dark:text-emerald-400">Gemini 3 Flash</span> for free out-of-the-box.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">
                {providerNames[provider] || provider} API Key
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">
                Stored securely in your browser
              </span>
            </div>
            <Input
              type="password"
              placeholder={providerKeyHints[provider] || "sk-..."}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="text-xs font-mono h-9"
            />
          </div>

          {/* Verification feedback */}
          {verificationResult && (
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                verificationResult.valid
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              {verificationResult.valid ? (
                <>
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>Key verified successfully! Connecting to {targetModel.name}...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span className="truncate">{verificationResult.error || "Key validation failed."}</span>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSwitchToFree}
            className="text-xs gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 w-full sm:w-auto"
          >
            <Sparkles className="size-3.5" />
            <span>Use Gemini 3 Flash (Free)</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveAndVerify}
            disabled={!inputKey.trim() || verifying}
            className="text-xs gap-1.5 w-full sm:w-auto"
          >
            {verifying ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Save & Verify Key</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
