import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { agents, agentVersions } from "@/db/schema";
import { requireWorkspaceAccess } from "@/lib/auth/require-workspace-access";

type RouteContext = {
    params: Promise<{ id: string }>;
};

async function getAuthorizedAgent(id: string) {
    const [agent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, id))
        .limit(1);

    if (!agent) return null;

    const access = await requireWorkspaceAccess(agent.workspaceId);

    if (!access.authorized) return null;

    return { agent, access };
}

// GET: Fetch agent and its versions
export async function GET(
    _request: NextRequest,
    context: RouteContext,
) {
    try {
        const { id } = await context.params;
        const result = await getAuthorizedAgent(id);

        if (!result) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 },
            );
        }

        const versions = await db
            .select()
            .from(agentVersions)
            .where(eq(agentVersions.agentId, id))
            .orderBy(desc(agentVersions.version));

        return NextResponse.json({
            agent: result.agent,
            versions,
        });
    } catch (error) {
        console.error("GET /api/agents/[id]:", error);

        return NextResponse.json(
            { error: "Failed to fetch agent" },
            { status: 500 },
        );
    }
}

// PATCH: Update agent and optionally create a new version
export async function PATCH(
    request: NextRequest,
    context: RouteContext,
) {
    try {
        const { id } = await context.params;
        const result = await getAuthorizedAgent(id);

        if (!result) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 },
            );
        }

        const { agent, access } = result;

        if (access.role === "member") {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 },
            );
        }

        const body = await request.json();

        const allowedKeys = [
            "name",
            "description",
            "status",
            "instructions",
            "model",
            "config",
        ];

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body) ||
            Object.keys(body).some((key) => !allowedKeys.includes(key)) ||
            Object.keys(body).length === 0
        ) {
            return NextResponse.json(
                { error: "Invalid update data" },
                { status: 400 },
            );
        }

        if (
            body.name !== undefined &&
            (typeof body.name !== "string" || !body.name.trim())
        ) {
            return NextResponse.json(
                { error: "Invalid agent name" },
                { status: 400 },
            );
        }

        if (
            body.description !== undefined &&
            body.description !== null &&
            typeof body.description !== "string"
        ) {
            return NextResponse.json(
                { error: "Invalid description" },
                { status: 400 },
            );
        }

        if (
            body.status !== undefined &&
            !["active", "archived"].includes(body.status)
        ) {
            return NextResponse.json(
                { error: "Invalid agent status" },
                { status: 400 },
            );
        }

        const hasVersionChanges =
            body.instructions !== undefined ||
            body.model !== undefined ||
            body.config !== undefined;

        if (
            body.instructions !== undefined &&
            (typeof body.instructions !== "string" || !body.instructions.trim())
        ) {
            return NextResponse.json(
                { error: "Invalid instructions" },
                { status: 400 },
            );
        }

        if (
            body.model !== undefined &&
            (typeof body.model !== "string" || !body.model.trim())
        ) {
            return NextResponse.json(
                { error: "Invalid model" },
                { status: 400 },
            );
        }

        if (
            body.config !== undefined &&
            (!body.config ||
                typeof body.config !== "object" ||
                Array.isArray(body.config))
        ) {
            return NextResponse.json(
                { error: "Invalid config" },
                { status: 400 },
            );
        }

        const updated = await db.transaction(async (tx) => {
            const [updatedAgent] = await tx
                .update(agents)
                .set({
                    ...(body.name !== undefined && { name: body.name.trim() }),
                    ...(body.description !== undefined && {
                        description: body.description?.trim() || null,
                    }),
                    ...(body.status !== undefined && { status: body.status }),
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(agents.id, id),
                        eq(agents.workspaceId, agent.workspaceId),
                    ),
                )
                .returning();

            let newVersion = null;

            if (hasVersionChanges) {
                const [latest] = await tx
                    .select()
                    .from(agentVersions)
                    .where(eq(agentVersions.agentId, id))
                    .orderBy(desc(agentVersions.version))
                    .limit(1);

                if (!latest) {
                    throw new Error("Agent has no initial version");
                }

                [newVersion] = await tx
                    .insert(agentVersions)
                    .values({
                        agentId: id,
                        version: latest.version + 1,
                        instructions: body.instructions ?? latest.instructions,
                        model: body.model ?? latest.model,
                        config: body.config ?? latest.config,
                        createdBy: access.userId,
                    })
                    .returning();
            }

            return { agent: updatedAgent, version: newVersion };
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/agents/[id]:", error);

        return NextResponse.json(
            { error: "Failed to update agent" },
            { status: 500 },
        );
    }
}

// DELETE: Soft delete by archiving
export async function DELETE(
    _request: NextRequest,
    context: RouteContext,
) {
    try {
        const { id } = await context.params;
        const result = await getAuthorizedAgent(id);

        if (!result) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 },
            );
        }

        if (result.access.role === "member") {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 },
            );
        }

        const [updated] = await db
            .update(agents)
            .set({
                status: "archived",
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(agents.id, id),
                    eq(agents.workspaceId, result.agent.workspaceId),
                ),
            )
            .returning();

        return NextResponse.json({
            message: "Agent archived successfully",
            agent: updated,
        });
    } catch (error) {
        console.error("DELETE /api/agents/[id]:", error);

        return NextResponse.json(
            { error: "Failed to archive agent" },
            { status: 500 },
        );
    }
}
