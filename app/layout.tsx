import { AuthProvider } from "@/components/session-provider";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meow — The AI Agent Operating System",
  description:
    "Autonomous multi-tenant AI agent runtime with tool sandboxing, human-in-the-loop approvals, and immutable versioning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
