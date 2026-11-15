"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Settings, ChevronDown, User, Shield } from "lucide-react";

export function UserProfileMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "Founder";
  const displayEmail = user?.email || "workspace@meow.ai";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="h-8 w-24 rounded-full bg-[#FAFAF9] animate-pulse border border-[#ebe8e4]" />
    );
  }

  if (!session) {
    return (
      <Link
        href="/sign-in"
        className="rounded-full border border-[#ebe8e4] bg-white px-3.5 py-1.5 text-xs font-medium text-black hover:bg-[#FAFAF9] transition-colors shadow-xs"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-[#ebe8e4] bg-white hover:bg-[#FAFAF9] px-2.5 py-1 transition-all text-left cursor-pointer group shadow-xs"
      >
        {/* User Avatar */}
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-xs">
          {initials}
        </div>

        {/* User Meta */}
        <span className="text-xs font-medium text-black max-w-[120px] truncate">
          {displayName}
        </span>

        <ChevronDown className="h-3 w-3 text-[#777169] transition-transform duration-200 group-hover:text-black" />
      </button>

      {/* Profile Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#ebe8e4] bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Header Info */}
          <div className="flex items-center gap-3 p-3 border-b border-[#ebe8e4]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-black truncate">{displayName}</span>
              <span className="text-[11px] text-[#777169] truncate font-mono">{displayEmail}</span>
            </div>
          </div>

          {/* Quick Menu Actions */}
          <div className="py-1">
            <Link
              href="/settings/workspace"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black hover:bg-[#FAFAF9] transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-[#777169]" />
              <span>Engine Settings</span>
            </Link>

            <Link
              href="/automation"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black hover:bg-[#FAFAF9] transition-colors"
            >
              <User className="h-3.5 w-3.5 text-[#777169]" />
              <span>Browser Studio</span>
            </Link>
          </div>

          {/* Sign Out CTA */}
          <div className="pt-1 border-t border-[#ebe8e4]">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-[#777169]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
