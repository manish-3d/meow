"use client";

import React from "react";

interface BrandLogoProps {
  slug?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function BrandLogo({ slug = "", name = "", size = 20, className = "" }: BrandLogoProps) {
  const s = slug.toUpperCase();
  const n = name.toLowerCase();

  // 1. Gmail
  if (s === "GMAIL" || n.includes("gmail")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <path fill="#4285F4" d="M22 6.5v11a2.5 2.5 0 0 1-2.5 2.5H18V9.5L12 14 6 9.5V20H4.5A2.5 2.5 0 0 1 2 17.5v-11a2.5 2.5 0 0 1 4.14-1.89L12 9.4l5.86-4.79A2.5 2.5 0 0 1 22 6.5Z" />
        <path fill="#EA4335" d="M12 9.4 6.14 4.61a2.5 2.5 0 0 0-4.14 1.89v1.23L12 14l10-6.27V6.5a2.5 2.5 0 0 0-4.14-1.89L12 9.4Z" />
        <path fill="#FBBC05" d="m2 7.73 4 3.07V20H4.5A2.5 2.5 0 0 1 2 17.5V7.73Z" />
        <path fill="#34A853" d="m22 7.73-4 3.07V20h1.5a2.5 2.5 0 0 0 2.5-2.5V7.73Z" />
      </svg>
    );
  }

  // 2. Slack
  if (s === "SLACK" || n.includes("slack")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <path fill="#36C5F0" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
        <path fill="#2EB67D" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
        <path fill="#ECB22E" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
        <path fill="#E01E5A" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    );
  }

  // 3. Outlook
  if (s === "OUTLOOK" || n.includes("outlook")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#0078D4" />
        <path d="M22 8.5L12 14.5L2 8.5V6.5L12 12.5L22 6.5V8.5Z" fill="#50E6FF" opacity="0.9" />
        <circle cx="8" cy="12" r="3.5" fill="#FFFFFF" />
        <text x="8" y="14" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#0078D4" fontFamily="sans-serif">O</text>
      </svg>
    );
  }

  // 4. GitHub
  if (s === "GITHUB" || n.includes("github")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  // 5. Notion
  if (s === "NOTION" || n.includes("notion")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`}>
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.69c-.466-.373-.84-.373-1.726-.327L3.106 2.39c-.466.047-.56.28-.373.466l1.726 1.352zm-.513 3.638v13.99c0 .793.373 1.073 1.213.98l14.288-.84c.84-.046 1.073-.56 1.073-1.26V6.773c0-.653-.28-.933-.886-.886l-14.755.84c-.606.046-.933.373-.933 1.119zm13.445.653c.093.42 0 .84-.42.887l-.746.14-2.8 4.292 3.127 5.783.886.14c.373.047.467.373.374.793l-.28 1.166c-.093.373-.466.42-.793.42h-3.684c-.373 0-.56-.233-.7-.606l-2.193-4.2-2.1 3.966c-.187.327-.42.84-.793.84H4.552c-.373 0-.56-.28-.42-.746l.793-2.473c.093-.28.28-.42.606-.467l1.027-.14 3.033-5.226-2.8-4.76c-.186-.326-.42-.466-.746-.466H4.786c-.373 0-.467-.28-.374-.7l.374-1.26c.093-.326.373-.42.746-.42l4.805-.28c.42 0 .7.186.887.56l2.193 3.78 1.866-3.827c.187-.373.467-.513.793-.513l3.686-.233c.373 0 .56.14.653.513l-.28 1.12z" />
      </svg>
    );
  }

  // 6. Google Calendar
  if (s === "GOOGLECALENDAR" || n.includes("calendar")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <rect x="3" y="4" width="18" height="17" rx="3" fill="#4285F4" />
        <rect x="3" y="4" width="18" height="5" fill="#1967D2" />
        <circle cx="8" cy="3" r="1.5" fill="#5F6368" />
        <circle cx="16" cy="3" r="1.5" fill="#5F6368" />
        <rect x="7" y="12" width="10" height="6" rx="1" fill="#FFFFFF" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#1967D2" fontFamily="sans-serif">31</text>
      </svg>
    );
  }

  // 7. Google Drive
  if (s === "GOOGLEDRIVE" || n.includes("drive")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <path d="M8.2 3.5h7.6L22 14.5l-3.8 6.5H10.6L8.2 3.5z" fill="#0066DA" />
        <path d="M1.8 14.5 5.6 8l7.6 13H5.6L1.8 14.5z" fill="#00AC47" />
        <path d="M8.2 3.5 12 10 4.4 23H.6l7.6-13-3.8-6.5h3.8z" fill="#EA4335" opacity="0.1" />
        <path d="M8.2 3.5 15.8 3.5 12 10 4.4 23 .6 16.5 8.2 3.5z" fill="#FFBA00" />
      </svg>
    );
  }

  // 8. Discord
  if (s === "DISCORD" || n.includes("discord")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#5865F2" className={`shrink-0 ${className}`}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    );
  }

  // 9. Jira / Atlassian
  if (s === "JIRA" || n.includes("jira")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <path d="M11.53 2c0 5.26 4.27 9.53 9.53 9.53V2h-9.53z" fill="#0052CC" />
        <path d="M2 11.53c0 5.26 4.27 9.53 9.53 9.53v-9.53H2z" fill="#2684FF" />
        <path d="M11.53 11.53c0 5.26 4.27 9.53 9.53 9.53v-9.53h-9.53z" fill="#0052CC" opacity="0.8" />
      </svg>
    );
  }

  // 10. Linear
  if (s === "LINEAR" || n.includes("linear")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#5E6AD2" className={`shrink-0 ${className}`}>
        <path d="M3.242 12.242A8.994 8.994 0 0 1 12 3c4.97 0 9 4.03 9 9 0 4.97-4.03 9-9 9a8.994 8.994 0 0 1-8.758-6.758L12 12l-8.758.242z" />
      </svg>
    );
  }

  // 11. Trello
  if (s === "TRELLO" || n.includes("trello")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <rect width="24" height="24" rx="4" fill="#0079BF" />
        <rect x="4" y="4" width="6.5" height="13" rx="1.5" fill="#FFFFFF" />
        <rect x="13.5" y="4" width="6.5" height="8" rx="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // 12. Reddit
  if (s === "REDDIT" || n.includes("reddit")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <circle cx="12" cy="12" r="11" fill="#FF4500" />
        <ellipse cx="12" cy="13.5" rx="6.5" ry="4" fill="#FFFFFF" />
        <circle cx="9.5" cy="13" r="1.2" fill="#FF4500" />
        <circle cx="14.5" cy="13" r="1.2" fill="#FF4500" />
        <path d="M10 15.5c.6.6 3.4.6 4 0" stroke="#FF4500" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="4.5" cy="12.5" r="1.8" fill="#FFFFFF" />
        <circle cx="19.5" cy="12.5" r="1.8" fill="#FFFFFF" />
        <path d="M12 9.5l1.5-4 3 1" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="6.5" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  // 13. Twitter / X
  if (s === "TWITTER" || s === "X" || n.includes("twitter") || n === "x") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  // 14. LinkedIn
  if (s === "LINKEDIN" || n.includes("linkedin")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" className={`shrink-0 ${className}`}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m1.37 9.74v-8.37H5.1v8.37h2.73z" />
      </svg>
    );
  }

  // 15. Instagram
  if (s === "INSTAGRAM" || n.includes("instagram")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="30%" stopColor="#F77737" />
            <stop offset="60%" stopColor="#F56040" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
        <rect width="20" height="20" x="2" y="2" rx="5" fill="url(#ig-grad)" />
        <rect width="14" height="14" x="5" y="5" rx="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="16" cy="8" r="0.8" fill="#FFFFFF" />
      </svg>
    );
  }

  // 16. Hacker News / Y Combinator
  if (s === "HACKERNEWS" || n.includes("hacker") || n.includes("ycombinator")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <rect width="24" height="24" rx="3" fill="#FF6600" />
        <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FFFFFF" fontFamily="monospace">Y</text>
      </svg>
    );
  }

  // 17. Spotify
  if (s === "SPOTIFY" || n.includes("spotify")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954" className={`shrink-0 ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#1DB954" />
        <path d="M17.5 10.5c-3-.6-6.5-.4-9.5 1m10 3c-2.5-.5-5.5-.3-8 .8m7 3c-2-.4-4.5-.2-6.5.6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 18. E2B / Cloud VM
  if (s === "E2B" || n.includes("e2b") || n.includes("vm")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#18181B" />
        <path d="m7 9 3 3-3 3M12 15h5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Fallback: Clean abstract logo badge with first letter
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-lg bg-neutral-100 border border-black/[0.08] flex items-center justify-center text-[10px] font-bold text-foreground font-mono shrink-0 ${className}`}
    >
      {(slug?.[0] || name?.[0] || "T").toUpperCase()}
    </div>
  );
}
