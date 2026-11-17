import React from "react";
import { LandingNavbar } from "@/components/custom/landing/landing-navbar";
import { HeroSection } from "@/components/custom/landing/hero-section";
import { MinecraftBotsSection } from "@/components/custom/landing/minecraft-bots-section";
import { ComputerShowcase } from "@/components/custom/landing/computer-showcase";
import { MultiKeySection } from "@/components/custom/landing/multi-key-section";
import { IntegrationsStrip } from "@/components/custom/landing/integrations-strip";
import { HostingSection } from "@/components/custom/landing/hosting-section";
import { PricingSection } from "@/components/custom/landing/pricing-section";
import { OnboardingSteps } from "@/components/custom/landing/onboarding-steps";
import { LandingFaq } from "@/components/custom/landing/landing-faq";
import { LandingFooter } from "@/components/custom/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#131316] selection:bg-[#7C5CFC] selection:text-white">
      {/* 1. Header Navigation */}
      <LandingNavbar />

      <main>
        {/* 2. Hero Section (Reference Image 2 Restructure: meet [Character with Laptop] meow bot, 4-provider pill, dual CTAs) */}
        <HeroSection />

        {/* 3. Different Bots. Different Superpowers. (Procedural 3D Minecraft Voxel Bots Section) */}
        <MinecraftBotsSection />

        {/* 4. Each bot gets its own computer (Live Cloud VM & Interactive Takeover) */}
        <ComputerShowcase />

        {/* 5. Bring your own keys (BYOK Multi-Model: Gemini, Claude, OpenAI, DeepSeek, Ollama) */}
        <MultiKeySection />

        {/* 6. Plugs into 60+ existing apps (Gmail, Slack, Calendar, Spotify, WhatsApp, GitHub) */}
        <IntegrationsStrip />

        {/* 7. Where your bots live (Your computer vs. Meow Cloud 24/7) */}
        <HostingSection />

        {/* 8. Pricing with the Sleeping Pixel Cat Mascot ($0 Free, Plus, Pro) */}
        <PricingSection />

        {/* 9. Ready in under two minutes (4-Step Frictionless Onboarding) */}
        <OnboardingSteps />

        {/* 10. Plainspoken FAQ */}
        <LandingFaq />
      </main>

      {/* 11. Minimal Lovable Footer */}
      <LandingFooter />
    </div>
  );
}
