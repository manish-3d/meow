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
      <div className="w-full h-[260px] sm:h-[300px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
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
      <div className="w-full h-[260px] sm:h-[300px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
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
      <div className="w-full h-[260px] sm:h-[300px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
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
      <div className="w-full h-[260px] sm:h-[300px] flex items-center justify-center bg-neutral-50/50 rounded-2xl">
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
      className="py-24 sm:py-32 bg-white text-[#131316] relative overflow-hidden select-none"
    >
      {/* Background Subtle Gradient Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(56,189,248,0.06),transparent_75%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-6xl lg:text-[68px] font-sans font-normal tracking-tight text-[#131316] leading-[1.05]">
            how each agent gets its own <span className="font-bold">cloud.</span>
          </h2>
          <p className="mt-5 text-base sm:text-xl text-neutral-600 font-sans leading-relaxed">
            Zero API limits, zero shared resources. Each AI agent is provisioned with its own
            dedicated, sandboxed cloud computer.
          </p>
        </div>

        {/* ── 4-STEP PIPELINE MAIN CONTAINER ── */}
        <div className="relative">
          {/* ── DESKTOP CONNECTING ARROWS & DASHED CURVES (Hidden on mobile) ── */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
            {/* Arrow 1 -> 2 */}
            <div className="absolute left-[24%] top-[130px] -translate-x-1/2">
              <PixelMarchingArrow />
            </div>
            {/* Dashed Arc 1 -> 2 with Cat Chip */}
            <div className="absolute left-[24%] top-[185px] -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none" className="overflow-visible">
                <path
                  d="M 10 5 Q 50 38 90 5"
                  stroke="#cbd5e1"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="-mt-3.5">
                <PixelCatChip />
              </div>
            </div>

            {/* Arrow 2 -> 3 */}
            <div className="absolute left-[50%] top-[130px] -translate-x-1/2">
              <PixelMarchingArrow />
            </div>
            {/* Dashed Arc 2 -> 3 with Calico Cat Chip */}
            <div className="absolute left-[50%] top-[185px] -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none" className="overflow-visible">
                <path
                  d="M 10 5 Q 50 38 90 5"
                  stroke="#cbd5e1"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="-mt-3.5">
                <PixelCatChip orangeEar />
              </div>
            </div>

            {/* Arrow 3 -> 4 */}
            <div className="absolute left-[75%] top-[130px] -translate-x-1/2">
              <PixelMarchingArrow />
            </div>
            {/* Dashed Arc 3 -> 4 with CPU Chip */}
            <div className="absolute left-[75%] top-[185px] -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none" className="overflow-visible">
                <path
                  d="M 10 5 Q 50 38 90 5"
                  stroke="#cbd5e1"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="-mt-3.5">
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
                  <div className="mt-3 flex flex-col items-center space-y-2.5 max-w-[240px]">
                    {/* Step Number Badge */}
                    <div className="size-8 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#84cc16] group-hover:text-black transition-all">
                      {step.num}
                    </div>

                    {/* Step Title */}
                    <h3 className="font-sans font-bold text-lg sm:text-xl text-neutral-900 tracking-tight leading-tight">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-[13px] text-neutral-600 font-sans leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CORNER PIXEL CAT MASCOTS ── */}
          <div className="hidden lg:flex items-center justify-between mt-6 px-4 pointer-events-none">
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
