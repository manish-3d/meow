import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Instant Access",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "founder@meow.ai" },
        name: { label: "Name", type: "text", placeholder: "Your Name" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() || "founder@meow.ai";
        const name = credentials?.name?.trim() || email.split("@")[0] || "Meow Explorer";

        try {
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (existingUser) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
            };
          }

          const [newUser] = await db
            .insert(users)
            .values({
              name,
              email,
              credits: 5,
            })
            .returning();

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          };
        } catch (err) {
          console.error("Credentials auth error:", err);
          return {
            id: "fallback-user-id",
            name,
            email,
          };
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const [existing] = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

          if (!existing) {
            await db
              .insert(users)
              .values({
                name: user.name || user.email.split("@")[0],
                email: user.email,
                credits: 5,
              })
              .onConflictDoNothing();
          }
        } catch (err) {
          console.error("Auto user registration error:", err);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-meow-ai-platform-at-least-32-chars",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
