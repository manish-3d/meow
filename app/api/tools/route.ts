import { NextResponse } from "next/server";
import { db } from "@/db";
import { tools } from "@/db/schema";
import { ToolRegistry } from "@/lib/tools/registry";

export async function GET() {
  try {
    // Ensure built-in tools are registered & synchronized with database
    await ToolRegistry.syncCatalogToDatabase();

    const catalogTools = await db.select().from(tools);

    return NextResponse.json({ tools: catalogTools });
  } catch (error: unknown) {
    console.error("GET /api/tools error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools catalog" },
      { status: 500 },
    );
  }
}

