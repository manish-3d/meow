import React from "react";
import { LandingNavbar } from "@/components/custom/landing/landing-navbar";
import { HeroSection } from "@/components/custom/landing/hero-section";
import { InteractiveSimulator } from "@/components/custom/landing/interactive-simulator";
import { IntegrationsGrid } from "@/components/custom/landing/integrations-grid";
import { BentoFeatures } from "@/components/custom/landing/bento-features";
import { TeamGovernance } from "@/components/custom/landing/team-governance";
import { SecurityMatrix } from "@/components/custom/landing/security-matrix";
import { FrameworksSection } from "@/components/custom/landing/frameworks-section";
import { FaqSection } from "@/components/custom/landing/faq-section";
import { FinalCtaBanner } from "@/components/custom/landing/final-cta";
import { LandingFooter } from "@/components/custom/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#0F0F0F] selection:bg-[#00D26A] selection:text-black">
      {/* Floating Pill Capsule Navigation */}
      <LandingNavbar />

      <main>
        {/* Dark Hero Section with Rotating Slot Keyword & Logo Marquee */}
        <HeroSection />

        {/* #use-cases: Make your AI finish what you ask (3-column Interactive Simulator) */}
        <InteractiveSimulator />

        {/* #agents: Works with any AI (8-card Grid with one-click copy & install) */}
        <IntegrationsGrid />

        {/* #harder-jobs: Don’t settle for AI that stops halfway (3 Bento Cards) */}
        <BentoFeatures />

        {/* #teams: One setup for your whole team (Shared Accounts, Skills, Budget) */}
        <TeamGovernance />

        {/* #trust: Secure access, always in your control (OAuth scopes & Policy Guardrails) */}
        <SecurityMatrix />

        {/* #build & #frameworks: Build it into your agent (Framework Tabs & Quickstart Code) */}
        <FrameworksSection />

        {/* #faq: Frequently Asked Questions (Expandable Accordion) */}
        <FaqSection />

        {/* #start: Give your AI what it needs to finish the job (Final CTA Banner) */}
        <FinalCtaBanner />
      </main>

      {/* Footer with Newsletter Subscription & Directory Links */}
      <LandingFooter />
    </div>
  );
}