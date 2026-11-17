"use client";

import React, { useState, useEffect } from "react";
import { Globe, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TimezoneOption {
  id: string; // IANA name, e.g. "Asia/Calcutta"
  label: string; // "India (IST)"
  offset: string; // "UTC+5:30"
  region: string; // "New Delhi, Mumbai, Bengaluru"
}

export interface ContinentGroup {
  name: string;
  icon: string;
  zones: TimezoneOption[];
}

export const CONTINENT_TIMEZONES: ContinentGroup[] = [
  {
    name: "Asia",
    icon: "🌏",
    zones: [
      { id: "Asia/Calcutta", label: "India (IST)", offset: "UTC+5:30", region: "New Delhi, Mumbai, Bengaluru" },
      { id: "Asia/Dubai", label: "UAE & Gulf (GST)", offset: "UTC+4:00", region: "Dubai, Abu Dhabi, Doha" },
      { id: "Asia/Singapore", label: "Singapore & Malaysia (SGT)", offset: "UTC+8:00", region: "Singapore, Kuala Lumpur" },
      { id: "Asia/Tokyo", label: "Japan & Korea (JST)", offset: "UTC+9:00", region: "Tokyo, Osaka, Seoul" },
      { id: "Asia/Shanghai", label: "China (CST)", offset: "UTC+8:00", region: "Beijing, Shanghai, Shenzhen" },
      { id: "Asia/Bangkok", label: "Southeast Asia (ICT)", offset: "UTC+7:00", region: "Bangkok, Jakarta, Hanoi" },
      { id: "Asia/Dhaka", label: "Bangladesh (BST)", offset: "UTC+6:00", region: "Dhaka, Chittagong" },
      { id: "Asia/Karachi", label: "Pakistan (PKT)", offset: "UTC+5:00", region: "Karachi, Islamabad, Lahore" },
    ],
  },
  {
    name: "Americas",
    icon: "🌎",
    zones: [
      { id: "America/New_York", label: "US Eastern (EST/EDT)", offset: "UTC-5:00", region: "New York, Miami, Boston, Atlanta" },
      { id: "America/Chicago", label: "US Central (CST/CDT)", offset: "UTC-6:00", region: "Chicago, Dallas, Austin, Houston" },
      { id: "America/Denver", label: "US Mountain (MST/MDT)", offset: "UTC-7:00", region: "Denver, Phoenix, Salt Lake City" },
      { id: "America/Los_Angeles", label: "US Pacific (PST/PDT)", offset: "UTC-8:00", region: "San Francisco, Los Angeles, Seattle" },
      { id: "America/Toronto", label: "Canada Eastern", offset: "UTC-5:00", region: "Toronto, Montreal, Ottawa" },
      { id: "America/Sao_Paulo", label: "Brazil (BRT)", offset: "UTC-3:00", region: "São Paulo, Rio de Janeiro" },
      { id: "America/Buenos_Aires", label: "Argentina (ART)", offset: "UTC-3:00", region: "Buenos Aires, Cordoba" },
    ],
  },
  {
    name: "Europe",
    icon: "🌍",
    zones: [
      { id: "Europe/London", label: "UK & Ireland (GMT/BST)", offset: "UTC+0:00", region: "London, Dublin, Edinburgh" },
      { id: "Europe/Paris", label: "Central Europe (CET)", offset: "UTC+1:00", region: "Paris, Berlin, Rome, Amsterdam, Madrid" },
      { id: "Europe/Athens", label: "Eastern Europe (EET)", offset: "UTC+2:00", region: "Athens, Bucharest, Helsinki" },
      { id: "Europe/Moscow", label: "Moscow (MSK)", offset: "UTC+3:00", region: "Moscow, St. Petersburg" },
    ],
  },
  {
    name: "Australia & Pacific",
    icon: "🦘",
    zones: [
      { id: "Australia/Sydney", label: "Eastern Australia (AEST)", offset: "UTC+10:00", region: "Sydney, Melbourne, Brisbane, Canberra" },
      { id: "Australia/Perth", label: "Western Australia (AWST)", offset: "UTC+8:00", region: "Perth" },
      { id: "Pacific/Auckland", label: "New Zealand (NZST)", offset: "UTC+12:00", region: "Auckland, Wellington" },
    ],
  },
  {
    name: "UTC",
    icon: "🌐",
    zones: [
      { id: "UTC", label: "Coordinated Universal Time (UTC)", offset: "UTC+0:00", region: "Global Server & Inngest Standard" },
    ],
  },
];

interface TimezoneSelectProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export function TimezoneContinentSelect({ value, onChange, label = "Timezone (Continent & Country)" }: TimezoneSelectProps) {
  // Detect local timezone
  const [detectedZone, setDetectedZone] = useState<string>("");

  // Determine initial continent from currently selected value or detected local zone
  const getContinentForZone = (zoneId: string): string => {
    for (const group of CONTINENT_TIMEZONES) {
      if (group.zones.some((z) => z.id.toLowerCase() === zoneId.toLowerCase())) {
        return group.name;
      }
    }
    if (zoneId.startsWith("Asia/")) return "Asia";
    if (zoneId.startsWith("America/")) return "Americas";
    if (zoneId.startsWith("Europe/")) return "Europe";
    if (zoneId.startsWith("Australia/") || zoneId.startsWith("Pacific/")) return "Australia & Pacific";
    return "Asia"; // Default friendly continent
  };

  const [activeContinent, setActiveContinent] = useState<string>("Asia");

  useEffect(() => {
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (local) {
        setDetectedZone(local);
        if (!value || value === "UTC") {
          setActiveContinent(getContinentForZone(local));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (value) {
      setActiveContinent(getContinentForZone(value));
    }
  }, [value]);

  const currentContinentGroup =
    CONTINENT_TIMEZONES.find((c) => c.name === activeContinent) || CONTINENT_TIMEZONES[0];

  // Helper to find selected zone metadata
  const selectedZoneMeta = CONTINENT_TIMEZONES.flatMap((c) => c.zones).find(
    (z) => z.id.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Globe className="size-3 text-primary" />
          <span>{label}</span>
        </label>

        {/* 1-Click Detect Button */}
        {detectedZone && value !== detectedZone && (
          <button
            type="button"
            onClick={() => {
              onChange(detectedZone);
              setActiveContinent(getContinentForZone(detectedZone));
            }}
            className="text-[9px] text-primary hover:underline font-medium flex items-center gap-1"
          >
            <Sparkles className="size-2.5" />
            <span>Use My Location ({detectedZone.split("/")[1] || detectedZone})</span>
          </button>
        )}
      </div>

      {/* 1. Continent Selector Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-muted/60 border border-border/50">
        {CONTINENT_TIMEZONES.map((group) => {
          const isActive = activeContinent === group.name;
          return (
            <button
              key={group.name}
              type="button"
              onClick={() => setActiveContinent(group.name)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                isActive
                  ? "bg-background text-foreground font-semibold shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              <span>{group.icon}</span>
              <span>{group.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Country / Region Cards under the Selected Continent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 border border-border/40 rounded-lg bg-background/50">
        {currentContinentGroup.zones.map((zone) => {
          const isSelected = value.toLowerCase() === zone.id.toLowerCase();

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onChange(zone.id)}
              className={`flex items-start justify-between p-2 rounded-md border text-left transition-all ${
                isSelected
                  ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary/40 font-semibold"
                  : "bg-card/40 border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={isSelected ? "text-primary font-bold" : "text-foreground font-medium"}>
                    {zone.label}
                  </span>
                  {isSelected && <Check className="size-3 text-primary stroke-[3]" />}
                </div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">
                  {zone.region}
                </div>
              </div>

              <Badge
                variant="outline"
                className={`text-[9px] font-mono px-1 py-0 shrink-0 ${
                  isSelected ? "bg-primary/20 text-primary border-primary/30" : "bg-muted"
                }`}
              >
                {zone.offset}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Current Active Selection Summary */}
      <div className="flex items-center justify-between px-2 py-1 rounded bg-muted/30 border border-border/30 text-[10px] text-muted-foreground">
        <span>Selected Timezone:</span>
        <span className="font-mono text-foreground font-semibold">
          {selectedZoneMeta ? `${selectedZoneMeta.label} (${selectedZoneMeta.offset})` : value}
        </span>
      </div>
    </div>
  );
}
