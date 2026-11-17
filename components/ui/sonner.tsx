"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface-1 group-[.toaster]:text-foreground group-[.toaster]:border-border-subtle group-[.toaster]:shadow-lg font-sans text-xs rounded-xl",
          description: "group-[.toast]:text-muted-foreground text-[11px]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium text-xs",
          cancelButton:
            "group-[.toast]:bg-surface-2 group-[.toast]:text-muted-foreground text-xs",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
