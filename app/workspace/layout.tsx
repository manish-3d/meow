import React from "react";
import { AppSidebar } from "@/components/custom/workspace/app-sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FDFCFC] text-black font-sans antialiased selection:bg-black/10 selection:text-black">
      <AppSidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
