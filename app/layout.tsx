import { figtree, instrumentSerif, playfair, plusJakarta } from "@/app/fonts";
import { AuthProvider } from "@/components/session-provider";
import { Toaster as BaseUiToaster } from "@/components/ui/toast";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meow Bot - AI Agent Platform",
  description: "Autonomous AI Agents with Cloud VM Desktop and Multi-Tool Automation",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden max-w-full">
      <body
        className={`${figtree.className} ${instrumentSerif.variable} ${playfair.variable} ${plusJakarta.variable} overflow-x-hidden max-w-full`}
        style={{ margin: 0, padding: 0 }}
      >
        <div data-vaul-drawer-wrapper="" className="min-h-screen bg-background overflow-x-hidden max-w-full">
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
