import React from "react";
import { LandingNavbar } from "@/components/custom/landing/landing-navbar";
import { HeroSection } from "@/components/custom/landing/hero-section";
import { MinecraftBotsSection } from "@/components/custom/landing/minecraft-bots-section";
import { StageSimulationSection } from "@/components/custom/landing/stage-simulation/stage-simulation-section";
import { IntegrationsCarousel } from "@/components/custom/landing/integrations-carousel";
import { ComputerShowcase } from "@/components/custom/landing/computer-showcase";
import { IntegrationsStrip } from "@/components/custom/landing/integrations-strip";
import { AgentCloudPipelineSection } from "@/components/custom/landing/agent-cloud-pipeline/agent-cloud-pipeline-section";
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
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Different Bots. Different Superpowers. (Procedural 3D Minecraft Voxel Bots Section) */}
        <MinecraftBotsSection />

        {/* 4. Active Agent Stage-Show: Live Desktop & Multi-Agent Simulation */}
        <StageSimulationSection />

        {/* 5. Cinematic 3D Lens Carousel: integration is simple (Connect with the AI models you already love) */}
        <IntegrationsCarousel />

        {/* 5. Each bot gets its own computer (Live Cloud VM & Interactive Takeover) */}
        <ComputerShowcase />

        {/* 6. Plugs into 60+ existing apps (Gmail, Slack, Calendar, Spotify, WhatsApp, GitHub) */}
        <IntegrationsStrip />

        {/* 7. How each agent gets its own cloud (1-Click Spawn -> Provisioning -> Deploy Bot -> Autonomous Work) */}
        <AgentCloudPipelineSection />

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
