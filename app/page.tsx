import React from "react";
import { LandingNavbar } from "@/components/custom/landing/landing-navbar";
import { HeroSection } from "@/components/custom/landing/hero-section";
import { MinecraftBotsSection } from "@/components/custom/landing/minecraft-bots-section";
import { StageSimulationSection } from "@/components/custom/landing/stage-simulation/stage-simulation-section";
import { IntegrationsCarousel } from "@/components/custom/landing/integrations-carousel";
import { AgentCloudPipelineSection } from "@/components/custom/landing/agent-cloud-pipeline/agent-cloud-pipeline-section";
import { IntegrationsStrip } from "@/components/custom/landing/integrations-strip";
import { HostingSection } from "@/components/custom/landing/hosting-section";
import { PricingSection } from "@/components/custom/landing/pricing-section";
import { LandingFaq } from "@/components/custom/landing/landing-faq";
import { LandingFooter } from "@/components/custom/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip overflow-x-hidden bg-white text-[#131316] selection:bg-[#7C5CFC] selection:text-white">
      {/* 1. Header Navigation */}
      <LandingNavbar />

      <main className="w-full max-w-full overflow-x-clip overflow-x-hidden">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Different Bots. Different Superpowers. (Procedural 3D Minecraft Voxel Bots Section) */}
        <MinecraftBotsSection />

        {/* 4. Active Agent Stage-Show: Live Desktop & Multi-Agent Simulation */}
        <StageSimulationSection />

        {/* 5. Cinematic 3D Lens Carousel: integration is simple (Connect with the AI models you already love) */}
        <IntegrationsCarousel />

        {/* 6. How each agent gets its own cloud (1-Click Spawn -> Provisioning -> Deploy Bot -> Autonomous Work) */}
        <AgentCloudPipelineSection />

        {/* 7. Plugs into 60+ existing apps (Gmail, Slack, Calendar, Spotify, WhatsApp, GitHub) */}
        <IntegrationsStrip />

        {/* 8. Where your bots live (Instant Web Workspace vs 24/7 Cloud Workers) */}
        <HostingSection />

        {/* 9. Pricing with the Sleeping Pixel Cat Mascot ($0 Free, Plus, Pro) */}
        <PricingSection />

        {/* 10. Plainspoken FAQ */}
        <LandingFaq />
      </main>

      {/* 12. Minimal Lovable Footer */}
      <LandingFooter />
    </div>
  );
}
