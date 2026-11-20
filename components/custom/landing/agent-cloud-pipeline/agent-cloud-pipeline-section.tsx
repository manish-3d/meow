"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  PixelMarchingArrow,
  PixelCatChip,
  PixelCpuChip,
  SittingPixelCat,
} from "./pipeline-connectors";

// Dynamically import procedural Three.js canvases with SSR disabled
const Scene1Spawn3D = dynamic(
  () => import("./scene1-spawn-3d").then((mod) => mod.Scene1Spawn3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
        <span className="size-2 rounded-full bg-[#84cc16] animate-ping" />
      </div>
    ),
  }
);

const Scene2Provisioning3D = dynamic(
  () => import("./scene2-provisioning-3d").then((mod) => mod.Scene2Provisioning3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
        <span className="size-2 rounded-full bg-[#84cc16] animate-ping" />
      </div>
    ),
  }
);

const Scene3Deploy3D = dynamic(
  () => import("./scene3-deploy-3d").then((mod) => mod.Scene3Deploy3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
        <span className="size-2 rounded-full bg-[#84cc16] animate-ping" />
      </div>
    ),
  }
);

const Scene4Autonomous3D = dynamic(
  () => import("./scene4-autonomous-3d").then((mod) => mod.Scene4Autonomous3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
        <span className="size-2 rounded-full bg-[#84cc16] animate-ping" />
      </div>
    ),
  }
);

export function AgentCloudPipelineSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: "1-click spawn",
      desc: "Request an AI agent",
      Component: Scene1Spawn3D,
    },
    {
      num: "02",
      title: "provisoning",
      desc: "A private cloud computer is instantly spun up.",
      Component: Scene2Provisioning3D,
    },
    {
      num: "03",
      title: "deploy bot",
      desc: "Agent takes control with a dedicated browser and storage.",
      Component: Scene3Deploy3D,
    },
    {
      num: "04",
      title: "autonomous work",
      desc: "Agent operates 24/7 in the cloud without using your computer.",
      Component: Scene4Autonomous3D,
    },
  ];

  return (
    <section
      id="cloud-architecture"
      className="pt-10 sm:pt-16 pb-10 sm:pb-16 bg-white text-[#131316] relative overflow-hidden select-none"
    >
      {/* Background Subtle Gradient Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(56,189,248,0.06),transparent_75%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="max-w-2xl mx-auto text-center mb-4 sm:mb-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-sans font-normal tracking-tight text-[#131316] leading-[1.08]">
            how each agent gets its own <span className="font-bold">cloud.</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-neutral-500 font-sans leading-relaxed max-w-xl mx-auto">
            Zero API limits, zero shared resources. Each AI agent is provisioned with its own
            dedicated, sandboxed cloud computer.
          </p>
        </div>

        {/* ── 4-STEP PIPELINE MAIN CONTAINER ── */}
        <div className="relative">
          {/* ── DESKTOP CONNECTING ARROWS & DASHED CURVES (Hidden on mobile) ── */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
            {/* Arrow 1 -> 2 */}
            <div className="absolute left-[24%] top-[92px] -translate-x-1/2">
              <PixelMarchingArrow />
            </div>
            {/* Dashed Arc 1 -> 2 with Cat Chip */}
            <div className="absolute left-[24%] top-[134px] -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <svg width="86" height="32" viewBox="0 0 86 32" fill="none" className="overflow-visible">
                <path
                  d="M 8 4 Q 43 28 78 4"
                  stroke="#cbd5e1"
                  strokeWidth="1.6"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="-mt-3">
                <PixelCatChip />
              </div>
            </div>

            {/* Arrow 2 -> 3 */}
            <div className="absolute left-[50%] top-[92px] -translate-x-1/2">
              <PixelMarchingArrow />
            </div>
            {/* Dashed Arc 2 -> 3 with Calico Cat Chip */}
            <div className="absolute left-[50%] top-[134px] -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <svg width="86" height="32" viewBox="0 0 86 32" fill="none" className="overflow-visible">
                <path
                  d="M 8 4 Q 43 28 78 4"
                  stroke="#cbd5e1"
                  strokeWidth="1.6"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="-mt-3">
                <PixelCatChip orangeEar />
              </div>
            </div>

            {/* Arrow 3 -> 4 */}
            <div className="absolute left-[75%] top-[92px] -translate-x-1/2">
              <PixelMarchingArrow />
            </div>
            {/* Dashed Arc 3 -> 4 with CPU Chip */}
            <div className="absolute left-[75%] top-[134px] -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <svg width="86" height="32" viewBox="0 0 86 32" fill="none" className="overflow-visible">
                <path
                  d="M 8 4 Q 43 28 78 4"
                  stroke="#cbd5e1"
                  strokeWidth="1.6"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="-mt-3">
                <PixelCpuChip />
              </div>
            </div>
          </div>

          {/* ── 4 COLUMNS GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 items-start relative z-0">
            {steps.map((step, idx) => {
              const StepCanvas = step.Component;
              const isHovered = hoveredStep === idx;

              return (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* 3D Scene Viewport */}
                  <div className="w-full flex items-center justify-center relative">
                    <StepCanvas />
                  </div>

                  {/* Step Description Cluster */}
                  <div className="mt-1.5 flex flex-col items-center space-y-1.5 max-w-[220px]">
                    {/* Step Number Badge */}
                    <div className="size-7 rounded-full bg-black text-white font-mono font-bold text-[11px] sm:text-xs flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#84cc16] group-hover:text-black transition-all">
                      {step.num}
                    </div>

                    {/* Step Title */}
                    <h3 className="font-sans font-bold text-base sm:text-lg text-neutral-900 tracking-tight leading-tight">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-[13px] text-neutral-500 font-sans leading-snug font-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CORNER PIXEL CAT MASCOTS ── */}
          <div className="hidden lg:flex items-center justify-between mt-3 px-4 pointer-events-none">
            {/* Left Corner Cat */}
            <div className="flex items-center gap-2">
              <SittingPixelCat />
            </div>
            {/* Right Corner Cat */}
            <div className="flex items-center gap-2">
              <SittingPixelCat flip />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
