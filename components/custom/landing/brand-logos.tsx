"use client";

import React from "react";
import {
  siAnthropic,
  siGooglegemini,
  siX,
  siOllama,
  siDeepseek,
  siGoogle,
  siGithub,
  siNotion,
  siStripe,
  siSpotify,
  siWhatsapp,
  siGooglecalendar,
  siGmail,
  siLinear,
  siFigma,
  siDiscord,
  siZoom,
} from "simple-icons";

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// 1. ChatGPT / OpenAI Logo (Official Spiral Flower)
export function ChatGptLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <path
        fill="#10A37F"
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.674 8.105v-5.683a.79.79 0 0 0-.409-.682zm2.01-3.023-.141-.085-4.779-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l2.02-1.164 4.796 2.769v2.336l-2.02 1.164-4.796-2.769zm1.18-2.043 2.02-1.168 4.796 2.772v2.336l-2.02 1.168-4.796-2.772zm3.82-3.141 2.02 1.168v5.543l-2.02-1.168z"
      />
    </svg>
  );
}

export const OpenAiLogo = ChatGptLogo;

// 2. Claude / Anthropic Logo (Official Terracotta Starburst)
export function ClaudeLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#D97757"
      className={`shrink-0 ${className}`}
    >
      <path d={siAnthropic.path} />
    </svg>
  );
}

export const AnthropicLogo = ClaudeLogo;

// 3. Google Gemini Logo (Official 4-Color Gradient Star)
export function GeminiLogo({ size = 16, className = "" }: IconProps) {
  const gradientId = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1BA1E3" />
          <stop offset="35%" stopColor="#5454F5" />
          <stop offset="70%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12Z"
      />
    </svg>
  );
}

// 4. Grok / xAI Logo (Official Slash-X Mark)
export function GrokLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={siX.path} />
    </svg>
  );
}

export const XAiLogo = GrokLogo;

// 5. Ollama Logo (Official Alpaca)
export function OllamaLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={siOllama.path} />
    </svg>
  );
}

// 6. DeepSeek Logo (Official Dolphin / Whale in Blue)
export function DeepSeekLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#0066FF"
      className={`shrink-0 ${className}`}
    >
      <path d={siDeepseek.path} />
    </svg>
  );
}

// 7. Google Gmail Logo (Official 4-Color Envelope)
export function GmailLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#EA4335"
      className={`shrink-0 ${className}`}
    >
      <path d={siGmail.path} />
    </svg>
  );
}

// 8. Google Calendar Logo (Official Calendar Icon)
export function GoogleCalendarLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#4285F4"
      className={`shrink-0 ${className}`}
    >
      <path d={siGooglecalendar.path} />
    </svg>
  );
}

// 9. Slack Logo (Official 4-Color Hashtag)
export function SlackLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <path
        fill="#36C5F0"
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
      />
      <path
        fill="#2EB67D"
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
      />
      <path
        fill="#ECB22E"
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
      />
      <path
        fill="#E01E5A"
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      />
    </svg>
  );
}

// 10. Notion Logo (Official Notion N)
export function NotionLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={siNotion.path} />
    </svg>
  );
}

// 11. GitHub Logo (Official Octocat)
export function GitHubLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={siGithub.path} />
    </svg>
  );
}

// 12. Spotify Logo (Official Soundwaves in #1DB954)
export function SpotifyLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#1DB954"
      className={`shrink-0 ${className}`}
    >
      <path d={siSpotify.path} />
    </svg>
  );
}

// 13. WhatsApp Logo (Official Phone in #25D366)
export function WhatsAppLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#25D366"
      className={`shrink-0 ${className}`}
    >
      <path d={siWhatsapp.path} />
    </svg>
  );
}

// 14. Google Chrome Logo (Official 4-Color Wheel)
export function ChromeLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <circle cx="12" cy="12" r="10" fill="#EA4335" />
      <path
        d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L3.34 7A10 10 0 0 1 12 2Z"
        fill="#EA4335"
      />
      <path
        d="M20.66 7a10 10 0 0 1 0 10H12a5 5 0 0 0 4.33-2.5L20.66 7Z"
        fill="#FBBC05"
      />
      <path
        d="M12 22a10 10 0 0 1-8.66-5h8.66a5 5 0 0 0 4.33-2.5l-4.33 7.5Z"
        fill="#34A853"
      />
      <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
      <circle cx="12" cy="12" r="3.5" fill="#4285F4" />
    </svg>
  );
}

// 15. Linear Logo (Official Linear Constellation)
export function LinearLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#5E6AD2"
      className={`shrink-0 ${className}`}
    >
      <path d={siLinear.path} />
    </svg>
  );
}

// 16. Figma Logo (Official 5-Color FIGMA Mark)
export function FigmaLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <path d="M8 24c2.209 0 4-1.791 4-4v-4H8c-2.209 0-4 1.791-4 4s1.791 4 4 4z" fill="#0ACF83" />
      <path d="M4 12c0-2.209 1.791-4 4-4h4v8H8c-2.209 0-4-1.791-4-4z" fill="#A259FF" />
      <path d="M4 4c0-2.209 1.791-4 4-4h4v8H8C5.791 8 4 6.209 4 4z" fill="#F24E1E" />
      <path d="M12 0h4c2.209 0 4 1.791 4 4s-1.791 4-4 4h-4V0z" fill="#FF7262" />
      <path d="M20 12c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4z" fill="#1ABCFE" />
    </svg>
  );
}

// 17. Discord Logo (Official Blurple Clyde)
export function DiscordLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#5865F2"
      className={`shrink-0 ${className}`}
    >
      <path d={siDiscord.path} />
    </svg>
  );
}

// 18. Zoom Logo (Official Blue Camera)
export function ZoomLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#2D8CFF"
      className={`shrink-0 ${className}`}
    >
      <path d={siZoom.path} />
    </svg>
  );
}

// 19. Stripe Logo (Official Stripe Purple)
export function StripeLogo({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#635BFF"
      className={`shrink-0 ${className}`}
    >
      <path d={siStripe.path} />
    </svg>
  );
}

// Universal Brand Icon Resolver by name
export function BrandIcon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
  const n = name.toLowerCase();
  if (n.includes("chatgpt") || n.includes("openai") || n.includes("gpt")) {
    return <ChatGptLogo size={size} className={className} />;
  }
  if (n.includes("claude") || n.includes("anthropic")) {
    return <ClaudeLogo size={size} className={className} />;
  }
  if (n.includes("gemini") || n.includes("google ai")) {
    return <GeminiLogo size={size} className={className} />;
  }
  if (n.includes("grok") || n === "x" || n.includes("xai")) {
    return <GrokLogo size={size} className={className} />;
  }
  if (n.includes("ollama")) {
    return <OllamaLogo size={size} className={className} />;
  }
  if (n.includes("deepseek")) {
    return <DeepSeekLogo size={size} className={className} />;
  }
  if (n.includes("gmail") || n.includes("mail")) {
    return <GmailLogo size={size} className={className} />;
  }
  if (n.includes("calendar")) {
    return <GoogleCalendarLogo size={size} className={className} />;
  }
  if (n.includes("slack")) {
    return <SlackLogo size={size} className={className} />;
  }
  if (n.includes("notion")) {
    return <NotionLogo size={size} className={className} />;
  }
  if (n.includes("github")) {
    return <GitHubLogo size={size} className={className} />;
  }
  if (n.includes("spotify")) {
    return <SpotifyLogo size={size} className={className} />;
  }
  if (n.includes("whatsapp")) {
    return <WhatsAppLogo size={size} className={className} />;
  }
  if (n.includes("chrome") || n.includes("browser")) {
    return <ChromeLogo size={size} className={className} />;
  }
  if (n.includes("linear")) {
    return <LinearLogo size={size} className={className} />;
  }
  if (n.includes("figma")) {
    return <FigmaLogo size={size} className={className} />;
  }
  if (n.includes("discord")) {
    return <DiscordLogo size={size} className={className} />;
  }
  if (n.includes("zoom")) {
    return <ZoomLogo size={size} className={className} />;
  }
  if (n.includes("stripe")) {
    return <StripeLogo size={size} className={className} />;
  }
  return null;
}
