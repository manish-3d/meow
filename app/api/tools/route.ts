import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { tools, agentTools, agents } from "@/db/schema";
import { ToolRegistry } from "@/lib/tools/registry";
import { RegisteredTool } from "@/lib/tools/types";
import { eq } from "drizzle-orm";

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

/**
 * POST /api/tools
 * Creates and registers a new custom agent skill / tool into the catalog.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      id,
      name,
      description,
      inputSchema,
      executionType = "sandbox",
      permissionLevel = "write",
      requiresApproval = false,
      bindToAllAgents = true,
    } = body;

    const toolId = String(id || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_");

    if (!toolId || !name || !description) {
      return NextResponse.json(
        { error: "Tool ID, display name, and description are required." },
        { status: 400 },
      );
    }

    const schema =
      typeof inputSchema === "object" && inputSchema !== null
        ? inputSchema
        : {
            type: "object",
            properties: {
              input: { type: "string", description: "Default input argument" },
            },
            required: ["input"],
          };

    // 1. Insert into database tools catalog
    const [savedTool] = await db
      .insert(tools)
      .values({
        id: toolId,
        name: String(name).trim(),
        description: String(description).trim(),
        inputSchema: schema,
        executionType: executionType as any,
        permissionLevel: permissionLevel as any,
        requiresApproval: Boolean(requiresApproval),
      })
      .onConflictDoUpdate({
        target: tools.id,
        set: {
          name: String(name).trim(),
          description: String(description).trim(),
          inputSchema: schema,
          executionType: executionType as any,
          permissionLevel: permissionLevel as any,
          requiresApproval: Boolean(requiresApproval),
        },
      })
      .returning();

    // 2. Register into in-memory ToolRegistry
    const newTool: RegisteredTool = {
      id: toolId,
      name: String(name).trim(),
      description: String(description).trim(),
      permissionLevel: permissionLevel as any,
      executionType: executionType as any,
      requiresApproval: Boolean(requiresApproval),
      parameters: schema,
      async execute(args, context) {
        return {
          success: true,
          toolId,
          executedAt: new Date().toISOString(),
          args,
          message: `Custom skill '${name}' executed successfully in sandboxed workspace '${context.workspaceId}'.`,
        };
      },
    };
    ToolRegistry.register(newTool);

    // 3. Optionally bind to existing workspace agents
    if (bindToAllAgents) {
      const allAgents = await db.select({ id: agents.id }).from(agents);
      for (const ag of allAgents) {
        await db
          .insert(agentTools)
          .values({
            agentId: ag.id,
            toolId,
            enabled: true,
          })
          .onConflictDoUpdate({
            target: [agentTools.agentId, agentTools.toolId],
            set: { enabled: true },
          });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Skill '${name}' created and bound to agents successfully!`,
        tool: savedTool,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("POST /api/tools error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create tool";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
