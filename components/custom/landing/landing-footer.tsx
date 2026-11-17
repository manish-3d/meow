"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Disc as Discord, ArrowRight, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="py-16 bg-[#F7F7F5] text-[#131316] border-t border-black/8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-black/8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center size-8 rounded-full overflow-hidden ring-1 ring-black/10 bg-black">
                <Image
                  src="/logo.png"
                  alt="meow bot"
                  width={32}
                  height={32}
                  className="object-cover size-full"
                />
              </div>
              <span className="font-sans font-bold text-base tracking-tight text-neutral-900">
                meow bot
              </span>
            </Link>
            <p className="text-xs text-neutral-500 font-sans max-w-sm">
              your own personal ai crew. made with care for busy people. the bots did most of it.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-600">
            <Link href="/workspace" className="hover:text-black transition-colors">
              workspace
            </Link>
            <Link href="#pricing" className="hover:text-black transition-colors">
              pricing
            </Link>
            <Link href="#bots" className="hover:text-black transition-colors">
              bots
            </Link>
            <Link href="#faq" className="hover:text-black transition-colors">
              faq
            </Link>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4 text-neutral-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
              aria-label="Discord"
            >
              <Discord className="size-4" />
            </a>
          </div>
        </div>

        {/* Bottom Credits & Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Meow Bot Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-black/5 text-neutral-600 text-[11px]">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>all systems purring normally</span>
          </div>
        </div>
      </div>
    </footer>
  );
}