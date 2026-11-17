import { Figtree } from "next/font/google";
import { AuthProvider } from "@/components/session-provider";
import { Toaster as BaseUiToaster } from "@/components/ui/toast";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import "./globals.css";
import type { Metadata } from "next";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meow Bot - AI Agent Platform",
  description: "Autonomous AI Agents with Cloud VM Desktop and Multi-Tool Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={figtree.className} style={{ margin: 0, padding: 0 }}>
        <div data-vaul-drawer-wrapper="" className="min-h-screen bg-background">
          <AuthProvider>
            {children}
            <BaseUiToaster />
            <SonnerToaster />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
