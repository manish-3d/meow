"use client";

import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { StagePhase } from "./types";

interface ScrubberProps {
  currentPhase: StagePhase;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSelectPhase: (phase: StagePhase) => void;
}

export function StageScrubber({
  currentPhase,
  isPlaying,
  onTogglePlay,
  onRestart,
  onSelectPhase,
}: ScrubberProps) {
  const frames: { phase: StagePhase; label: string; time: string }[] = [
    { phase: 1, label: "F1: Idle Cat", time: "0s" },
    { phase: 2, label: "F2: Sparkle", time: "1.5s" },
    { phase: 3, label: "F3: Research Bot + VM", time: "2.2s" },
    { phase: 4, label: "F4: 4 Bots Spawn", time: "3.2s" },
    { phase: 5, label: "F5: Data Flow", time: "4.0s" },
    { phase: 6, label: "F6: Live Simulation", time: "4.8s+" },
  ];

  return (
    <div className="w-full px-4 py-2.5 border-t border-black/[0.06] bg-white/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none">
      {/* 1. Play / Pause / Replay Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 text-white hover:bg-black transition-all active:scale-95 shadow-2xs font-semibold"
          title={isPlaying ? "Pause simulation" : "Play simulation"}
        >
          {isPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="p-1 rounded-lg border border-black/10 bg-white hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Restart from Frame 1"
        >
          <RotateCcw className="size-3.5" />
        </button>

        <span className="text-[10px] text-neutral-400 hidden sm:inline">
          Frame {currentPhase}/6 &bull; {currentPhase === 6 ? "Active Live Simulation" : "Progressing..."}
        </span>
      </div>

      {/* 2. Interactive Frame Pills */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        {frames.map((f) => {
          const isActive = currentPhase === f.phase;
          return (
            <button
              key={f.phase}
              type="button"
              onClick={() => onSelectPhase(f.phase)}
              className={`px-2 py-0.5 rounded-md text-[10px] transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#7C5CFC] text-white font-bold shadow-2xs scale-105"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
