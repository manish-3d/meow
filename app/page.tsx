import React from "react";
import { LandingNavbar } from "@/components/custom/landing/landing-navbar";
import { HeroSection } from "@/components/custom/landing/hero-section";
import { IntegrationsGrid } from "@/components/custom/landing/integrations-grid";
import { BentoFeatures } from "@/components/custom/landing/bento-features";
import { InteractiveSimulator } from "@/components/custom/landing/interactive-simulator";
import { LandingFooter } from "@/components/custom/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-0 text-foreground selection:bg-primary selection:text-primary-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <IntegrationsGrid />
        <BentoFeatures />
        <InteractiveSimulator />
      </main>
      <LandingFooter />
    </div>
  );
}
