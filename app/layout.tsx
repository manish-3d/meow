import { AuthProvider } from "@/components/session-provider";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meow — The AI Agent Operating System",
  description:
    "Autonomous multi-tenant AI agent runtime with tool sandboxing, human-in-the-loop approvals, and immutable versioning. Inspired by Linear.",
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
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className="bg-[#08090a] text-[#f7f8f8] antialiased selection:bg-indigo-500/30 selection:text-white" style={{ margin: 0, padding: 0 }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
