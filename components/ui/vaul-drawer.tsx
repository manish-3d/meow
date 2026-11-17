"use client";

import * as React from "react";
import { Drawer as VaulPrimitive } from "vaul";
import { cn } from "@/lib/utils";

const VaulDrawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof VaulPrimitive.Root>) => (
  <VaulPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
VaulDrawer.displayName = "VaulDrawer";

const VaulDrawerTrigger = VaulPrimitive.Trigger;

const VaulDrawerPortal = VaulPrimitive.Portal;

const VaulDrawerClose = VaulPrimitive.Close;

const VaulDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <VaulPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-xs", className)}
    {...props}
  />
));
VaulDrawerOverlay.displayName = VaulPrimitive.Overlay.displayName;

const VaulDrawerContent = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <VaulDrawerPortal>
    <VaulDrawerOverlay />
    <VaulPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[20px] border border-border-subtle bg-surface-1",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted-foreground/25" />
      {children}
    </VaulPrimitive.Content>
  </VaulDrawerPortal>
));
VaulDrawerContent.displayName = "VaulDrawerContent";

const VaulDrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
VaulDrawerHeader.displayName = "VaulDrawerHeader";

const VaulDrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
VaulDrawerFooter.displayName = "VaulDrawerFooter";

const VaulDrawerTitle = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Title>
>(({ className, ...props }, ref) => (
  <VaulPrimitive.Title
    ref={ref}
    className={cn(
      "text-base font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
VaulDrawerTitle.displayName = VaulPrimitive.Title.displayName;

const VaulDrawerDescription = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Description>
>(({ className, ...props }, ref) => (
  <VaulPrimitive.Description
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
VaulDrawerDescription.displayName = VaulPrimitive.Description.displayName;

export {
  VaulDrawer,
  VaulDrawerPortal,
  VaulDrawerOverlay,
  VaulDrawerTrigger,
  VaulDrawerClose,
  VaulDrawerContent,
  VaulDrawerHeader,
  VaulDrawerFooter,
  VaulDrawerTitle,
  VaulDrawerDescription,
};
