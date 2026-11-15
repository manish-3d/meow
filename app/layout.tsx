import { AuthProvider } from "@/components/session-provider";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meow — Autonomous AI Browser Agent Engine",
  description:
    "Operate websites like a human using cloud browsers, Stagehand DOM observation, Playwright automation, and human-in-the-loop safety.",
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
    <html lang="en">
      <body className="antialiased selection:bg-black/10 selection:text-black" style={{ margin: 0, padding: 0 }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
