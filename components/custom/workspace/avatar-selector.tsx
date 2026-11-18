"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Search } from "lucide-react";
import { AVATARS, AvatarDefinition } from "@/lib/avatars";

interface AvatarSelectorProps {
  open: boolean;
  onClose: () => void;
  currentPath?: string;
  onSelect: (avatar: AvatarDefinition) => void;
}

export function AvatarSelector({ open, onClose, currentPath, onSelect }: AvatarSelectorProps) {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = AVATARS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 bg-white rounded-2xl shadow-2xl border border-black/[0.08] w-[520px] max-h-[580px] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-black/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Choose Avatar</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Select a character for your agent</p>
              </div>
              <button
                onClick={onClose}
                className="size-7 rounded-lg flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-black/[0.06]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-black/[0.08] bg-muted/40 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-6 gap-2">
                {filtered.map((avatar) => {
                  const isSelected = currentPath === avatar.path;
                  const isHov = hovered === avatar.id;

                  return (
                    <motion.button
                      key={avatar.id}
                      onClick={() => onSelect(avatar)}
                      onMouseEnter={() => setHovered(avatar.id)}
                      onMouseLeave={() => setHovered(null)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.12 }}
                      className={`relative flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? "border-black bg-black/[0.04] shadow-2xs"
                          : "border-transparent hover:border-black/[0.08] hover:bg-neutral-50"
                      }`}
                    >
                      <div className="relative size-14 rounded-lg overflow-hidden">
                        <img
                          src={avatar.path}
                          alt={avatar.name}
                          className="size-full object-contain"
                          loading="lazy"
                        />
                        {/* Selected outline */}
                        {isSelected && (
                          <div className="absolute inset-0 rounded-lg ring-2 ring-black" />
                        )}
                      </div>

                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 size-4 rounded-full bg-black flex items-center justify-center">
                          <Check className="size-2.5 text-white stroke-[3]" />
                        </div>
                      )}

                      <span className="text-[9px] font-medium text-muted-foreground leading-tight text-center truncate w-full">
                        {avatar.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No avatars match your search
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-black/[0.06] flex items-center justify-between bg-muted/20">
              <span className="text-[11px] text-muted-foreground">
                {AVATARS.length} avatars available
              </span>
              <button
                onClick={onClose}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
