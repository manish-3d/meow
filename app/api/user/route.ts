import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const name = session.user.name || email.split("@")[0];

    // Check if user exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json({ message: "User already exists", user: existing }, { status: 200 });
    }

    // Insert new user with default 5 credits
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        credits: 5,
      })
      .returning();

    return NextResponse.json({ message: "User saved successfully", user: newUser }, { status: 201 });
  } catch (err: unknown) {
    console.error("API /api/user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
