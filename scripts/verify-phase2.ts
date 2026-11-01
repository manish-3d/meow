import { and, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import * as nextAuth from "next-auth";

import { db } from "@/db";
import {
  users,
  workspaces,
  workspaceMembers,
  agents,
  agentVersions,
} from "@/db/schema";
import { ensurePersonalWorkspace } from "@/lib/workspace/provision-workspace";
import { GET as getAgents, POST as postAgent } from "@/app/api/agents/route";
import {
  GET as getAgentDetail,
  PATCH as patchAgentDetail,
  DELETE as deleteAgentDetail,
} from "@/app/api/agents/[id]/route";

// Global mock state for getServerSession
const nextAuthNext = require("next-auth/next");
let currentSession: { user?: { id?: string } } | null = null;
nextAuthNext.getServerSession = async () => currentSession;

function setSessionUser(userId: string | null) {
  if (userId) {
    currentSession = { user: { id: userId } };
  } else {
    currentSession = null;
  }
}

async function runVerification() {
  console.log("=== STARTING PHASE 2 VERIFICATION SUITE ===\n");

  const results: { name: string; passed: boolean; details?: string }[] = [];

  function assert(name: string, condition: boolean, details?: string) {
    results.push({ name, passed: condition, details });
    if (condition) {
      console.log(`✓ PASS: ${name}`);
    } else {
      console.error(`✗ FAIL: ${name} - Details: ${details || "Assertion failed"}`);
    }
  }

  // Record baseline user counts
  const [initialUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  console.log(`Baseline user count: ${initialUsers.count}`);

  const testUserIds: string[] = [];
  const testWorkspaceIds: string[] = [];
  const testAgentIds: string[] = [];

  try {
    // -------------------------------------------------------------
    // SETUP TEST IDENTITIES
    // -------------------------------------------------------------
    const timestamp = Date.now();
    const userOwnerId = `test_owner_${timestamp}`;
    const userAdminId = `test_admin_${timestamp}`;
    const userMemberId = `test_member_${timestamp}`;
    const userOutsideId = `test_outside_${timestamp}`;

    testUserIds.push(userOwnerId, userAdminId, userMemberId, userOutsideId);

    for (const uid of testUserIds) {
      await db.insert(users).values({
        id: uid,
        name: `Test User ${uid}`,
        email: `${uid}@example.com`,
      });
    }

    // -------------------------------------------------------------
    // TASK 1: WORKSPACE PROVISIONING VERIFICATION
    // -------------------------------------------------------------
    console.log("\n--- TASK 1: Personal Workspace Provisioning ---");

    // 1.1 Initial workspace provisioning
    const ws1 = await ensurePersonalWorkspace({
      id: userOwnerId,
      name: "Alice Owner",
      email: `${userOwnerId}@example.com`,
    });
    testWorkspaceIds.push(ws1.id);

    assert(
      "1.1 Provisioning creates workspace and owner membership",
      ws1.ownerUserId === userOwnerId && ws1.slug.startsWith("alice-owner"),
      `wsId=${ws1.id}, slug=${ws1.slug}`,
    );

    const [ownerMember] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, ws1.id),
          eq(workspaceMembers.userId, userOwnerId),
        ),
      );
    assert(
      "1.1b workspace_members row created with role 'owner'",
      ownerMember?.role === "owner",
    );

    // 1.2 Repeated sign-in (idempotency)
    const ws1Repeat = await ensurePersonalWorkspace({
      id: userOwnerId,
      name: "Alice Owner",
      email: `${userOwnerId}@example.com`,
    });
    assert(
      "1.2 Repeated sign-in returns same workspace without duplicates",
      ws1Repeat.id === ws1.id,
    );

    const userWorkspaces = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerUserId, userOwnerId));
    assert(
      "1.2b User owns exactly one workspace in database",
      userWorkspaces.length === 1,
    );

    // 1.3 Concurrency test: 5 simultaneous calls
    const concurrentUser = `test_concurrent_${timestamp}`;
    testUserIds.push(concurrentUser);
    await db.insert(users).values({
      id: concurrentUser,
      name: "Concurrent Test",
      email: `${concurrentUser}@example.com`,
    });

    const concurrentResults = await Promise.all([
      ensurePersonalWorkspace({ id: concurrentUser, name: "Concurrent Test" }),
      ensurePersonalWorkspace({ id: concurrentUser, name: "Concurrent Test" }),
      ensurePersonalWorkspace({ id: concurrentUser, name: "Concurrent Test" }),
      ensurePersonalWorkspace({ id: concurrentUser, name: "Concurrent Test" }),
      ensurePersonalWorkspace({ id: concurrentUser, name: "Concurrent Test" }),
    ]);

    testWorkspaceIds.push(concurrentResults[0].id);

    const allSameId = concurrentResults.every((w) => w.id === concurrentResults[0].id);
    const concurrentWsRows = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerUserId, concurrentUser));

    assert(
      "1.3 Concurrent sign-in calls produce exactly 1 workspace",
      allSameId && concurrentWsRows.length === 1,
      `rows count = ${concurrentWsRows.length}`,
    );

    // 1.4 Stable and unique slug collision handling
    const collidingUser = `test_collision_${timestamp}`;
    testUserIds.push(collidingUser);
    await db.insert(users).values({
      id: collidingUser,
      name: "Alice Owner", // same name as userOwnerId
      email: `${collidingUser}@example.com`,
    });

    const wsCollision = await ensurePersonalWorkspace({
      id: collidingUser,
      name: "Alice Owner",
    });
    testWorkspaceIds.push(wsCollision.id);

    assert(
      "1.4 Slug collision generates a distinct, unique slug",
      wsCollision.slug !== ws1.slug && wsCollision.slug.startsWith("alice-owner"),
      `ws1.slug=${ws1.slug}, wsCollision.slug=${wsCollision.slug}`,
    );

    // 1.5 Missing membership self-repair
    await db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, wsCollision.id),
          eq(workspaceMembers.userId, collidingUser),
        ),
      );

    await ensurePersonalWorkspace({ id: collidingUser });

    const [repairedMember] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, wsCollision.id),
          eq(workspaceMembers.userId, collidingUser),
        ),
      );

    assert(
      "1.5 Self-repairs missing workspace_members row on re-sign-in",
      repairedMember?.role === "owner",
    );

    // -------------------------------------------------------------
    // TASK 2: AGENT API VERIFICATION
    // -------------------------------------------------------------
    console.log("\n--- TASK 2: Agent API Verification ---");

    // Add admin and member to ws1 for RBAC tests
    await db.insert(workspaceMembers).values([
      { workspaceId: ws1.id, userId: userAdminId, role: "admin" },
      { workspaceId: ws1.id, userId: userMemberId, role: "member" },
    ]);

    // 2.1 Unauthenticated requests
    setSessionUser(null);

    const unauthGet = await getAgents(
      new NextRequest(`http://localhost:3000/api/agents?workspaceId=${ws1.id}`),
    );
    assert(
      "2.1a Unauthenticated GET /api/agents returns 401",
      unauthGet.status === 401,
    );

    const unauthPost = await postAgent(
      new NextRequest("http://localhost:3000/api/agents", {
        method: "POST",
        body: JSON.stringify({
          workspaceId: ws1.id,
          name: "Agent 1",
          instructions: "Test",
          model: "gpt-4o",
        }),
      }),
    );
    assert(
      "2.1b Unauthenticated POST /api/agents returns 401",
      unauthPost.status === 401,
    );

    // 2.2 Agent creation by owner (inserts agent and version 1)
    setSessionUser(userOwnerId);

    const createReq = new NextRequest("http://localhost:3000/api/agents", {
      method: "POST",
      body: JSON.stringify({
        workspaceId: ws1.id,
        name: "Support Assistant",
        description: "Assists with support inquiries",
        instructions: "You are a polite support agent.",
        model: "gemini-2.0-flash",
        config: { temperature: 0.7 },
      }),
    });

    const createRes = await postAgent(createReq);
    const createData = await createRes.json();
    assert(
      "2.2a POST /api/agents returns 201 Created",
      createRes.status === 201 && !!createData.agent?.id && !!createData.version?.id,
    );

    const agentId = createData.agent.id;
    testAgentIds.push(agentId);

    assert(
      "2.2b Agent creation inserts version 1 with correct config",
      createData.version.version === 1 &&
        createData.version.model === "gemini-2.0-flash" &&
        createData.version.config?.temperature === 0.7 &&
        createData.version.createdBy === userOwnerId,
    );

    // 2.3 List workspace agents
    const listRes = await getAgents(
      new NextRequest(`http://localhost:3000/api/agents?workspaceId=${ws1.id}`),
    );
    const listData = await listRes.json();
    assert(
      "2.3 GET /api/agents?workspaceId=... returns workspace agents",
      listRes.status === 200 &&
        Array.isArray(listData.agents) &&
        listData.agents.some((a: any) => a.id === agentId),
    );

    // 2.4 Agent detail endpoint
    const detailRes = await getAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${agentId}`),
      { params: Promise.resolve({ id: agentId }) },
    );
    const detailData = await detailRes.json();
    assert(
      "2.4 GET /api/agents/[id] returns agent and versions",
      detailRes.status === 200 &&
        detailData.agent?.id === agentId &&
        detailData.versions?.length === 1 &&
        detailData.versions[0].version === 1,
    );

    // 2.5 Metadata-only update (does NOT create new version)
    const patchMetaReq = new NextRequest(
      `http://localhost:3000/api/agents/${agentId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: "Support Assistant Renamed",
          description: "Updated description",
        }),
      },
    );

    const patchMetaRes = await patchAgentDetail(patchMetaReq, {
      params: Promise.resolve({ id: agentId }),
    });
    const patchMetaData = await patchMetaRes.json();

    assert(
      "2.5a Metadata-only update returns 200 and version is null",
      patchMetaRes.status === 200 &&
        patchMetaData.agent.name === "Support Assistant Renamed" &&
        patchMetaData.version === null,
    );

    const [vCountAfterMeta] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(agentVersions)
      .where(eq(agentVersions.agentId, agentId));

    assert(
      "2.5b Database version count remains 1 after metadata update",
      vCountAfterMeta.count === 1,
    );

    // 2.6 Version changes create new immutable version (v2)
    const patchVersionReq = new NextRequest(
      `http://localhost:3000/api/agents/${agentId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          instructions: "Updated instructions v2: be concise.",
          model: "claude-3-5-sonnet",
        }),
      },
    );

    const patchVersionRes = await patchAgentDetail(patchVersionReq, {
      params: Promise.resolve({ id: agentId }),
    });
    const patchVersionData = await patchVersionRes.json();

    assert(
      "2.6a Version change returns 200 and version 2",
      patchVersionRes.status === 200 &&
        patchVersionData.version?.version === 2 &&
        patchVersionData.version?.model === "claude-3-5-sonnet",
    );

    const [vCountAfterVer] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(agentVersions)
      .where(eq(agentVersions.agentId, agentId));

    assert(
      "2.6b Database now contains exactly 2 versions",
      vCountAfterVer.count === 2,
    );

    // 2.7 Archiving works correctly (soft delete)
    const deleteRes = await deleteAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${agentId}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: agentId }) },
    );
    const deleteData = await deleteRes.json();

    assert(
      "2.7a DELETE /api/agents/[id] returns 200 and agent archived",
      deleteRes.status === 200 && deleteData.agent?.status === "archived",
    );

    const [archivedAgentDb] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId));
    assert(
      "2.7b Agent remains in database with status 'archived'",
      archivedAgentDb?.status === "archived",
    );

    // 2.8 Cross-workspace isolation
    setSessionUser(userOutsideId);

    const outsideListRes = await getAgents(
      new NextRequest(`http://localhost:3000/api/agents?workspaceId=${ws1.id}`),
    );
    assert(
      "2.8a Outside user cannot list another workspace's agents (403)",
      outsideListRes.status === 403,
    );

    const outsideCreateRes = await postAgent(
      new NextRequest("http://localhost:3000/api/agents", {
        method: "POST",
        body: JSON.stringify({
          workspaceId: ws1.id,
          name: "Intruder Agent",
          instructions: "Test",
          model: "gpt-4o",
        }),
      }),
    );
    assert(
      "2.8b Outside user cannot create agent in another workspace (403)",
      outsideCreateRes.status === 403,
    );

    const outsideGetRes = await getAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${agentId}`),
      { params: Promise.resolve({ id: agentId }) },
    );
    assert(
      "2.8c Outside user cannot view agent details in another workspace (404)",
      outsideGetRes.status === 404,
    );

    // 2.9 RBAC Permissions: Member vs Admin
    // Member can read but cannot create, modify, or archive
    setSessionUser(userMemberId);

    const memberListRes = await getAgents(
      new NextRequest(`http://localhost:3000/api/agents?workspaceId=${ws1.id}`),
    );
    assert(
      "2.9a Member can read agents list (200 OK)",
      memberListRes.status === 200,
    );

    const memberDetailRes = await getAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${agentId}`),
      { params: Promise.resolve({ id: agentId }) },
    );
    assert(
      "2.9b Member can view agent details (200 OK)",
      memberDetailRes.status === 200,
    );

    const memberCreateRes = await postAgent(
      new NextRequest("http://localhost:3000/api/agents", {
        method: "POST",
        body: JSON.stringify({
          workspaceId: ws1.id,
          name: "Member Created",
          instructions: "Test",
          model: "gpt-4o",
        }),
      }),
    );
    assert(
      "2.9c Member cannot create agent (403 Forbidden)",
      memberCreateRes.status === 403,
    );

    const memberPatchRes = await patchAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${agentId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "Hacked by Member" }),
      }),
      { params: Promise.resolve({ id: agentId }) },
    );
    assert(
      "2.9d Member cannot modify agent (403 Forbidden)",
      memberPatchRes.status === 403,
    );

    const memberDeleteRes = await deleteAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${agentId}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: agentId }) },
    );
    assert(
      "2.9e Member cannot archive agent (403 Forbidden)",
      memberDeleteRes.status === 403,
    );

    // Admin can create, modify, archive
    setSessionUser(userAdminId);

    const adminCreateRes = await postAgent(
      new NextRequest("http://localhost:3000/api/agents", {
        method: "POST",
        body: JSON.stringify({
          workspaceId: ws1.id,
          name: "Admin Agent",
          instructions: "Created by admin",
          model: "gpt-4o-mini",
        }),
      }),
    );
    const adminCreateData = await adminCreateRes.json();
    assert(
      "2.9f Admin can create agent (201 Created)",
      adminCreateRes.status === 201 && !!adminCreateData.agent?.id,
    );

    const adminAgentId = adminCreateData.agent.id;
    testAgentIds.push(adminAgentId);

    const adminPatchRes = await patchAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${adminAgentId}`, {
        method: "PATCH",
        body: JSON.stringify({ instructions: "Admin updated instructions" }),
      }),
      { params: Promise.resolve({ id: adminAgentId }) },
    );
    assert(
      "2.9g Admin can modify agent (200 OK)",
      adminPatchRes.status === 200,
    );

    const adminDeleteRes = await deleteAgentDetail(
      new NextRequest(`http://localhost:3000/api/agents/${adminAgentId}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: adminAgentId }) },
    );
    assert(
      "2.9h Admin can archive agent (200 OK)",
      adminDeleteRes.status === 200,
    );

    // -------------------------------------------------------------
    // TASK 3: DATABASE INTEGRITY VERIFICATIONS
    // -------------------------------------------------------------
    console.log("\n--- TASK 3: Database Integrity Verifications ---");

    // 3.1 Every user has at most one personal workspace
    const duplicateOwners = await db.execute(sql`
      SELECT owner_user_id, count(*)::int as ws_count
      FROM workspaces
      GROUP BY owner_user_id
      HAVING count(*) > 1;
    `);
    assert(
      "3.1 Zero users own more than one personal workspace",
      duplicateOwners.length === 0,
    );

    // 3.2 Consistency between workspace ownership and workspace_members
    const inconsistentOwners = await db.execute(sql`
      SELECT w.id, w.owner_user_id
      FROM workspaces w
      LEFT JOIN workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = w.owner_user_id AND wm.role = 'owner'
      WHERE wm.workspace_id IS NULL;
    `);
    assert(
      "3.2 Every workspace owner has a matching 'owner' workspace_members entry",
      inconsistentOwners.length === 0,
    );

    // 3.3 Foreign key validity for agents
    const orphanedAgents = await db.execute(sql`
      SELECT a.id FROM agents a
      LEFT JOIN workspaces w ON a.workspace_id = w.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE w.id IS NULL OR u.id IS NULL;
    `);
    assert(
      "3.3 All agents have valid workspace and creator foreign keys",
      orphanedAgents.length === 0,
    );

    // 3.4 Foreign key and version validity for agent_versions
    const orphanedVersions = await db.execute(sql`
      SELECT av.id FROM agent_versions av
      LEFT JOIN agents a ON av.agent_id = a.id
      LEFT JOIN users u ON av.created_by = u.id
      WHERE a.id IS NULL OR u.id IS NULL;
    `);
    assert(
      "3.4 All agent_versions have valid agent and creator foreign keys",
      orphanedVersions.length === 0,
    );

    // 3.5 Duplicate version numbers per agent
    const duplicateVersions = await db.execute(sql`
      SELECT agent_id, version, count(*)::int
      FROM agent_versions
      GROUP BY agent_id, version
      HAVING count(*) > 1;
    `);
    assert(
      "3.5 Zero duplicate (agent_id, version) pairs in database",
      duplicateVersions.length === 0,
    );

    // 3.6 Check constraint: version > 0
    const nonPositiveVersions = await db.execute(sql`
      SELECT id FROM agent_versions WHERE version <= 0;
    `);
    assert(
      "3.6 All versions have positive version numbers (version > 0)",
      nonPositiveVersions.length === 0,
    );

  } finally {
    // -------------------------------------------------------------
    // CLEANUP TEST DATA SAFELY
    // -------------------------------------------------------------
    console.log("\n--- CLEANING UP TEST DATA ---");

    // Clean up created agents
    for (const aid of testAgentIds) {
      await db.delete(agentVersions).where(eq(agentVersions.agentId, aid));
      await db.delete(agents).where(eq(agents.id, aid));
    }

    // Clean up created workspaces (cascades to workspace_members)
    for (const wid of testWorkspaceIds) {
      await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, wid));
      await db.delete(workspaces).where(eq(workspaces.id, wid));
    }

    // Clean up created test users
    for (const uid of testUserIds) {
      await db.delete(users).where(eq(users.id, uid));
    }

    // Verify baseline user data is intact
    const [finalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    assert(
      "Final data integrity: Baseline user count restored, real data intact",
      finalUsers.count === initialUsers.count,
      `initial=${initialUsers.count}, final=${finalUsers.count}`,
    );

    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    console.log(`\n=== SUITE COMPLETE: ${passedTests}/${totalTests} PASSED ===`);

    if (passedTests !== totalTests) {
      process.exit(1);
    }
    process.exit(0);
  }
}

runVerification().catch((err) => {
  console.error("UNEXPECTED ERROR IN TEST SUITE:", err);
  process.exit(1);
});
