"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WorkspaceUIContextType {
  isConfigOpen: boolean;
  toggleConfig: () => void;
  setConfigOpen: (open: boolean) => void;
}

const WorkspaceUIContext = createContext<WorkspaceUIContextType>({
  isConfigOpen: true,
  toggleConfig: () => {},
  setConfigOpen: () => {},
});

export function WorkspaceUIProvider({ children }: { children: React.ReactNode }) {
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meow_config_panel_open");
      if (saved !== null) {
        setIsConfigOpen(saved === "true");
      }
    } catch {}
  }, []);

  const toggleConfig = useCallback(() => {
    setIsConfigOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("meow_config_panel_open", String(next));
      } catch {}
      return next;
    });
  }, []);

  const setConfigOpen = useCallback((open: boolean) => {
    setIsConfigOpen(open);
    try {
      localStorage.setItem("meow_config_panel_open", String(open));
    } catch {}
  }, []);

  return (
    <WorkspaceUIContext.Provider value={{ isConfigOpen, toggleConfig, setConfigOpen }}>
      {children}
    </WorkspaceUIContext.Provider>
  );
}

export const useWorkspaceUI = () => useContext(WorkspaceUIContext);
