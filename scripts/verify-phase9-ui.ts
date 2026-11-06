/**
 * Phase 9 Verification Suite: UI Endpoints & Tool Catalog APIs
 *
 * Verifies:
 * 1. GET /api/tools: Returns synchronized catalog with correct security tiers.
 * 2. GET /api/workspaces: Enforces auth guard, returns active tenancy context.
 * 3. End-to-end Agent management lifecycle (Creation, Tool toggles, Version bump, Archival).
 * 4. Automatic cleanup.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

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
import { GET as getTools } from "../app/api/tools/route";
import { GET as getWorkspaces } from "../app/api/workspaces/route";
import { POST as createAgent, GET as getAgents } from "../app/api/agents/route";
import { GET as getAgentTools, PUT as putAgentTools } from "../app/api/agents/[id]/tools/route";
import { PATCH as updateAgent, DELETE as deleteAgent, GET as getAgent } from "../app/api/agents/[id]/route";

// Mock NextAuth session
const nextAuthNext = require("next-auth/next");
let currentSession: { user?: { id?: string; name?: string; email?: string } } | null = null;
nextAuthNext.getServerSession = async () => currentSession;

function setSessionUser(user: { id: string; name?: string; email?: string } | null) {
  currentSession = user ? { user } : null;
}

async function runPhase9Verification() {
  console.log("=== PHASE 9: FRONTEND UI & CATALOG APIS VERIFICATION ===\n");

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
  const testUserId = `user_ui_${timestamp}`;
  let createdWorkspaceId = "";
  let createdAgentId = "";

  try {
    // -------------------------------------------------------------
    // Test Group 1: Global Tool Catalog API (/api/tools)
    // -------------------------------------------------------------
    console.log("--- 1. Testing GET /api/tools ---");

    const toolsRes = await getTools();
    assert("1.1 GET /api/tools returns HTTP 200", toolsRes.status === 200);

    const toolsData = await toolsRes.json();
    assert("1.2 Response contains tools array", Array.isArray(toolsData.tools));
    assert("1.3 At least 5 tools registered in database catalog", toolsData.tools.length >= 5);

    const toolMap = new Map<string, any>();
    toolsData.tools.forEach((t: any) => toolMap.set(t.id, t));

    assert(
      "1.4 'web_search' exists and has permissionLevel 'read'",
      toolMap.get("web_search")?.permissionLevel === "read",
    );
    assert(
      "1.5 'write_file' exists and has permissionLevel 'write'",
      toolMap.get("write_file")?.permissionLevel === "write",
    );
    assert(
      "1.6 'execute_code' exists with permissionLevel 'dangerous' and requiresApproval true",
      toolMap.get("execute_code")?.permissionLevel === "dangerous" &&
        toolMap.get("execute_code")?.requiresApproval === true,
    );
    assert(
      "1.7 'read_url' includes valid JSON parameter schema",
      typeof toolMap.get("read_url")?.inputSchema === "object" &&
        toolMap.get("read_url")?.inputSchema !== null,
    );

    // -------------------------------------------------------------
    // Test Group 2: Workspaces API (/api/workspaces)
    // -------------------------------------------------------------
    console.log("\n--- 2. Testing GET /api/workspaces ---");

    // Unauthenticated
    setSessionUser(null);
    const unauthWsRes = await getWorkspaces();
    assert("2.1 Unauthenticated request returns HTTP 401", unauthWsRes.status === 401);

    // Authenticated
    await db.insert(users).values({
      id: testUserId,
      name: "UI Test User",
      email: `ui_test_${timestamp}@meow.local`,
    });

    setSessionUser({
      id: testUserId,
      name: "UI Test User",
      email: `ui_test_${timestamp}@meow.local`,
    });

    const authWsRes = await getWorkspaces();
    assert("2.2 Authenticated request returns HTTP 200", authWsRes.status === 200);

    const authWsData = await authWsRes.json();
    assert(
      "2.3 Returns provisioned activeWorkspace",
      authWsData.activeWorkspace && authWsData.activeWorkspace.ownerUserId === testUserId,
    );
    assert(
      "2.4 Returns workspaces memberships array with owner role",
      Array.isArray(authWsData.workspaces) &&
        authWsData.workspaces.some((w: any) => w.role === "owner"),
    );

    createdWorkspaceId = authWsData.activeWorkspace.id;

    // -------------------------------------------------------------
    // Test Group 3: Agent Creation Wizard Flow (POST /api/agents + PUT /api/agents/[id]/tools)
    // -------------------------------------------------------------
    console.log("\n--- 3. Testing Agent Creation Flow ---");

    const createReq = new NextRequest("http://localhost:3000/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: createdWorkspaceId,
        name: "Research & Code Specialist",
        description: "Created via Phase 9 UI Wizard",
        model: "gpt-4o",
        instructions: "You are a specialized AI assistant. Use web search and code execution.",
      }),
    });

    const createRes = await createAgent(createReq);
    assert("3.1 Agent creation returns HTTP 201", createRes.status === 201);

    const createData = await createRes.json();
    createdAgentId = createData.agent.id;
    assert("3.2 Created agent has initial version v1", createData.version.version === 1);

    // Attach tools via PUT /api/agents/[id]/tools
    const putToolsReq = new NextRequest(`http://localhost:3000/api/agents/${createdAgentId}/tools`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tools: [
          { toolId: "web_search", enabled: true },
          { toolId: "execute_code", enabled: true },
        ],
      }),
    });

    const putToolsRes = await putAgentTools(putToolsReq, {
      params: Promise.resolve({ id: createdAgentId }),
    });
    assert("3.3 PUT /api/agents/[id]/tools returns HTTP 200", putToolsRes.status === 200);

    // Verify GET /api/agents/[id]/tools reflects assignments
    const getAgentToolsRes = await getAgentTools(
      new NextRequest(`http://localhost:3000/api/agents/${createdAgentId}/tools`),
      { params: Promise.resolve({ id: createdAgentId }) },
    );
    const getAgentToolsData = await getAgentToolsRes.json();
    const activeToolIds = getAgentToolsData.tools
      .filter((t: any) => t.enabled)
      .map((t: any) => t.id);

    assert(
      "3.4 Agent tools reflect enabled state ('web_search' & 'execute_code')",
      activeToolIds.includes("web_search") && activeToolIds.includes("execute_code"),
    );

    // -------------------------------------------------------------
    // Test Group 4: Version Bumper & Archival (PATCH & DELETE /api/agents/[id])
    // -------------------------------------------------------------
    console.log("\n--- 4. Testing Version Bumping & Archival ---");

    // Bumping instructions
    const patchReq = new NextRequest(`http://localhost:3000/api/agents/${createdAgentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instructions: "Updated instructions: Always double check search queries.",
        model: "claude-3-5-sonnet",
      }),
    });

    const patchRes = await updateAgent(patchReq, {
      params: Promise.resolve({ id: createdAgentId }),
    });
    assert("4.1 PATCH with new instructions returns HTTP 200", patchRes.status === 200);

    const patchData = await patchRes.json();
    assert(
      "4.2 Immutable version bumped to v2",
      patchData.version && patchData.version.version === 2,
    );
    assert(
      "4.3 Updated model reflected in version 2",
      patchData.version.model === "claude-3-5-sonnet",
    );

    // Verify both versions exist in history via GET /api/agents/[id]
    const getAgentRes = await getAgent(
      new NextRequest(`http://localhost:3000/api/agents/${createdAgentId}`),
      { params: Promise.resolve({ id: createdAgentId }) },
    );
    const getAgentData = await getAgentRes.json();
    assert(
      "4.4 GET /api/agents/[id] returns all historical versions (v2, v1)",
      getAgentData.versions.length === 2 &&
        getAgentData.versions[0].version === 2 &&
        getAgentData.versions[1].version === 1,
    );

    // Archiving agent
    const deleteRes = await deleteAgent(
      new NextRequest(`http://localhost:3000/api/agents/${createdAgentId}`),
      { params: Promise.resolve({ id: createdAgentId }) },
    );
    assert("4.5 DELETE archives agent with HTTP 200", deleteRes.status === 200);
    const deleteData = await deleteRes.json();
    assert("4.6 Agent status is now 'archived'", deleteData.agent.status === "archived");

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  } finally {
    // -------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------
    console.log("\n--- Cleanup Test Fixtures ---");
    try {
      if (createdAgentId) {
        await db.delete(agentTools).where(eq(agentTools.agentId, createdAgentId));
        await db.delete(agentVersions).where(eq(agentVersions.agentId, createdAgentId));
        await db.delete(agents).where(eq(agents.id, createdAgentId));
      }
      if (createdWorkspaceId) {
        await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, createdWorkspaceId));
        await db.delete(workspaces).where(eq(workspaces.id, createdWorkspaceId));
      }
      if (testUserId) {
        await db.delete(users).where(eq(users.id, testUserId));
      }
      console.log("✓ Cleanup finished safely");
    } catch (cleanupErr) {
      console.error("Cleanup warning:", cleanupErr);
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase9Verification().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
