"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Settings, CreditCard, ChevronDown, User, Shield } from "lucide-react";

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
  const userImage = user?.image;
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="h-8 w-24 rounded-lg bg-white/5 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <Link
        href="/sign-in"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
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
        className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] px-2.5 py-1.5 transition-all text-left cursor-pointer group"
      >
        {/* User Avatar */}
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-[11px] font-bold text-white shadow-xs overflow-hidden">
          {userImage ? (
            <img src={userImage} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* User Info (Desktop) */}
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-white leading-tight group-hover:text-indigo-300 transition-colors">
            {displayName}
          </span>
          <span className="text-[10px] font-mono text-white/40 leading-none">
            Pro Plan
          </span>
        </div>

        <ChevronDown className={`h-3 w-3 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/[0.1] bg-[#0c0d10] p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-white/[0.06]">
            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
            <p className="text-[11px] font-mono text-white/40 truncate">{displayEmail}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                <Shield className="h-2.5 w-2.5" />
                Workspace Admin
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/billing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5 text-white/40" />
              <span>Billing & Subscriptions</span>
            </Link>
            <Link
              href="/settings/workspace"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-white/40" />
              <span>Workspace Settings</span>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="pt-1 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

