/**
 * Phase 4 Verification Suite: Tool Management APIs
 *
 * Verifies:
 * 1. GET /api/agents/[id]/tools (Auth enforcement, catalog merging, enabled flags).
 * 2. PUT /api/agents/[id]/tools (Atomic junction table upsert, enabling/disabling tools).
 * 3. Dynamic ToolRegistry reflection after tool assignment updates.
 * 4. Automatic cleanup.
 */

import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import { db } from "../db";
import {
  users,
  workspaces,
  workspaceMembers,
  agents,
  agentVersions,
  tools as dbTools,
  agentTools,
} from "../db/schema";
import { GET as getAgentTools, PUT as putAgentTools } from "../app/api/agents/[id]/tools/route";
import { ToolRegistry } from "../lib/tools/registry";

// Mock NextAuth session state
const nextAuthNext = require("next-auth/next");
let currentSession: { user?: { id?: string } } | null = null;
nextAuthNext.getServerSession = async () => currentSession;

function setSessionUser(userId: string | null) {
  currentSession = userId ? { user: { id: userId } } : null;
}

async function runManagementTests() {
  console.log("=== PHASE 4: TOOL MANAGEMENT APIS VERIFICATION ===\n");

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${name} ${details ? `(${details})` : ""}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testWorkspaceId = `ws_mgmt_${timestamp}`;
  const testUserId = `user_mgmt_${timestamp}`;
  const testAgentId = `agent_mgmt_${timestamp}`;
  const testVersionId = `ver_mgmt_${timestamp}`;

  try {
    // -------------------------------------------------------------
    // SETUP TEST FIXTURES
    // -------------------------------------------------------------
    await ToolRegistry.syncCatalogToDatabase();

    await db.insert(users).values({
      id: testUserId,
      name: "Management Test User",
      email: `${testUserId}@example.com`,
    });

    await db.insert(workspaces).values({
      id: testWorkspaceId,
      name: "Management Test Workspace",
      slug: `mgmt-ws-${timestamp}`,
      ownerUserId: testUserId,
    });

    await db.insert(workspaceMembers).values({
      workspaceId: testWorkspaceId,
      userId: testUserId,
      role: "owner",
    });

    await db.insert(agents).values({
      id: testAgentId,
      workspaceId: testWorkspaceId,
      name: "Configurable Agent",
      description: "Tests tool toggling.",
      status: "active",
      createdBy: testUserId,
    });

    await db.insert(agentVersions).values({
      id: testVersionId,
      agentId: testAgentId,
      version: 1,
      instructions: "Assist with tools.",
      model: "gpt-4o",
      createdBy: testUserId,
    });

    // -------------------------------------------------------------
    // 1. TEST GET /api/agents/[id]/tools
    // -------------------------------------------------------------
    console.log("--- Group 1: Tool Catalog Listing & Initial State ---");

    // 1.1 Unauthenticated GET
    setSessionUser(null);
    const unauthGetReq = new NextRequest(`http://localhost:3000/api/agents/${testAgentId}/tools`);
    const unauthGetRes = await getAgentTools(unauthGetReq, {
      params: Promise.resolve({ id: testAgentId }),
    });
    assert("1.1 GET /api/agents/[id]/tools returns 401 when unauthenticated", unauthGetRes.status === 401);

    // 1.2 Authenticated GET (Initial state: all tools disabled)
    setSessionUser(testUserId);
    const authGetReq = new NextRequest(`http://localhost:3000/api/agents/${testAgentId}/tools`);
    const authGetRes = await getAgentTools(authGetReq, {
      params: Promise.resolve({ id: testAgentId }),
    });
    assert("1.2 GET /api/agents/[id]/tools returns 200 OK", authGetRes.status === 200);

    const getData = await authGetRes.json();
    assert(
      "1.3 Returns full catalog with enabled: false initially",
      Array.isArray(getData.tools) &&
        getData.tools.length >= 5 &&
        getData.tools.every((t: any) => t.enabled === false),
    );

    // -------------------------------------------------------------
    // 2. TEST PUT /api/agents/[id]/tools (Enable Tools)
    // -------------------------------------------------------------
    console.log("\n--- Group 2: Enabling Tools via PUT ---");

    // 2.1 Unauthenticated PUT
    setSessionUser(null);
    const unauthPutReq = new NextRequest(`http://localhost:3000/api/agents/${testAgentId}/tools`, {
      method: "PUT",
      body: JSON.stringify({
        tools: [{ toolId: "web_search", enabled: true }],
      }),
    });
    const unauthPutRes = await putAgentTools(unauthPutReq, {
      params: Promise.resolve({ id: testAgentId }),
    });
    assert("2.1 PUT /api/agents/[id]/tools returns 401 when unauthenticated", unauthPutRes.status === 401);

    // 2.2 Authenticated PUT: Enable web_search and read_url
    setSessionUser(testUserId);
    const authPutReq = new NextRequest(`http://localhost:3000/api/agents/${testAgentId}/tools`, {
      method: "PUT",
      body: JSON.stringify({
        tools: [
          { toolId: "web_search", enabled: true },
          { toolId: "read_url", enabled: true },
        ],
      }),
    });
    const authPutRes = await putAgentTools(authPutReq, {
      params: Promise.resolve({ id: testAgentId }),
    });
    assert("2.2 PUT /api/agents/[id]/tools returns 200 OK", authPutRes.status === 200);

    // 2.3 Verify database rows in agent_tools table
    const dbAssignments = await db
      .select()
      .from(agentTools)
      .where(and(eq(agentTools.agentId, testAgentId), eq(agentTools.enabled, true)));

    assert(
      "2.3 agent_tools junction table updated with 2 enabled tools",
      dbAssignments.length === 2 &&
        dbAssignments.some((a) => a.toolId === "web_search") &&
        dbAssignments.some((a) => a.toolId === "read_url"),
    );

    // 2.4 Verify dynamic resolution via ToolRegistry
    const resolvedTools = await ToolRegistry.getActiveToolsForAgent(testAgentId, {
      workspaceId: testWorkspaceId,
    });
    assert(
      "2.4 ToolRegistry.getActiveToolsForAgent reflects enabled tools in real time",
      resolvedTools.length === 2 &&
        resolvedTools.some((t) => t.name === "web_search") &&
        resolvedTools.some((t) => t.name === "read_url"),
    );

    // -------------------------------------------------------------
    // 3. TEST DISABLING A TOOL (Toggle off)
    // -------------------------------------------------------------
    console.log("\n--- Group 3: Disabling a Tool ---");

    const disablePutReq = new NextRequest(`http://localhost:3000/api/agents/${testAgentId}/tools`, {
      method: "PUT",
      body: JSON.stringify({
        tools: [{ toolId: "web_search", enabled: false }],
      }),
    });
    const disablePutRes = await putAgentTools(disablePutReq, {
      params: Promise.resolve({ id: testAgentId }),
    });
    assert("3.1 PUT toggle off returns 200 OK", disablePutRes.status === 200);

    const updatedResolved = await ToolRegistry.getActiveToolsForAgent(testAgentId, {
      workspaceId: testWorkspaceId,
    });
    assert(
      "3.2 ToolRegistry now returns only 1 active tool (read_url)",
      updatedResolved.length === 1 && updatedResolved[0].name === "read_url",
    );
  } finally {
    // -------------------------------------------------------------
    // TEARDOWN TEST FIXTURES
    // -------------------------------------------------------------
    console.log("\n--- Cleaning up test fixtures ---");
    await db.delete(agentTools).where(eq(agentTools.agentId, testAgentId));
    await db.delete(agentVersions).where(eq(agentVersions.id, testVersionId));
    await db.delete(agents).where(eq(agents.id, testAgentId));
    await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, testWorkspaceId));
    await db.delete(workspaces).where(eq(workspaces.id, testWorkspaceId));
    await db.delete(users).where(eq(users.id, testUserId));
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runManagementTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

