import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized user" },
      { status: 401 }
    );
  }

  try {
    const result = await db
      .insert(users)
      .values({
        name: session.user.name || "",
        email: session.user.email,
      })
      .onConflictDoNothing({ target: users.email })
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      message: "User saved successfully",
      user: result[0],
    });
  } catch (error: any) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
