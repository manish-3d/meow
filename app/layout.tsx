import { Figtree } from "next/font/google";
import { AuthProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/toast";
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
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
