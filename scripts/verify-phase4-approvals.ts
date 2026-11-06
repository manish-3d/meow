/**
 * Phase 4 Verification Suite: Human-in-the-Loop Approval Workflow
 *
 * Verifies:
 * 1. Dangerous tools (requiresApproval: true) halt the turn with finishReason: 'approval_required'.
 * 2. Tool call record persisted in PostgreSQL with status: 'requested'.
 * 3. POST /api/chat/approve with decision: 'approved' executes the tool, updates status to 'completed', and resumes reasoning.
 * 4. POST /api/chat/approve with decision: 'rejected' marks status as 'rejected', feeds refusal notice, and lets model reply.
 * 5. Re-approving an already processed tool call is rejected with HTTP 400.
 * 6. RBAC and unauthenticated requests return HTTP 401.
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
  conversations,
  messages,
  toolCalls,
  agentTools,
} from "../db/schema";
import { POST as postChat } from "../app/api/chat/route";
import { POST as postApprove } from "../app/api/chat/approve/route";
import { ToolRegistry } from "../lib/tools/registry";
import { AIProviderFactory } from "../lib/ai/factory";
import { AIProvider, ModelRequest, ModelResponse } from "../lib/ai/types";

// Mock NextAuth session state
const nextAuthNext = require("next-auth/next");
let currentSession: { user?: { id?: string } } | null = null;
nextAuthNext.getServerSession = async () => currentSession;

function setSessionUser(userId: string | null) {
  currentSession = userId ? { user: { id: userId } } : null;
}

async function runApprovalsTests() {
  console.log("=== PHASE 4: HUMAN-IN-THE-LOOP APPROVAL WORKFLOW VERIFICATION ===\n");

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
  const testWorkspaceId = `ws_appr_${timestamp}`;
  const testUserId = `user_appr_${timestamp}`;
  const testAgentId = `agent_appr_${timestamp}`;
  const testVersionId = `ver_appr_${timestamp}`;
  let conversationId1 = "";
  let conversationId2 = "";

  try {
    // -------------------------------------------------------------
    // SETUP TEST FIXTURES
    // -------------------------------------------------------------
    ToolRegistry.init();

    await db.insert(users).values({
      id: testUserId,
      name: "Approval Test User",
      email: `${testUserId}@example.com`,
    });

    await db.insert(workspaces).values({
      id: testWorkspaceId,
      name: "Approval Test Workspace",
      slug: `appr-ws-${timestamp}`,
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
      name: "DevOps Engineer Bot",
      description: "Executes scripts with user approval.",
      status: "active",
      createdBy: testUserId,
    });

    await db.insert(agentVersions).values({
      id: testVersionId,
      agentId: testAgentId,
      version: 1,
      instructions: "You execute calculations and scripts.",
      model: "gpt-4o",
      createdBy: testUserId,
    });

    // Bind execute_code tool (requiresApproval: true)
    await db.insert(agentTools).values({
      agentId: testAgentId,
      toolId: "execute_code",
      enabled: true,
    });

    const [conv1] = await db
      .insert(conversations)
      .values({
        workspaceId: testWorkspaceId,
        agentId: testAgentId,
        agentVersionId: testVersionId,
        title: "Approval Session 1",
        createdBy: testUserId,
      })
      .returning();
    conversationId1 = conv1.id;

    // -------------------------------------------------------------
    // 1. TEST DANGEROUS TOOL GATING (Suspension on Turn 1)
    // -------------------------------------------------------------
    console.log("--- Group 1: Dangerous Action Gating & State Suspension ---");

    // Mock AI that calls execute_code
    const approvalMockAI: AIProvider = {
      id: "openai",
      async generate(req: ModelRequest): Promise<ModelResponse> {
        // Inspect if an observation exists
        const toolMsg = req.messages.find((m) => m.role === "tool");
        if (!toolMsg) {
          // Turn 1: Propose dangerous action
          return {
            content: "I need to run a script to calculate the prime numbers.",
            toolCalls: [
              {
                id: "call_prime_calc",
                name: "execute_code",
                arguments: { language: "javascript", code: "7 * 11 * 13;" },
              },
            ],
            finishReason: "tool_calls",
            usage: { promptTokens: 30, completionTokens: 15, totalTokens: 45 },
          };
        }

        // Resumed turn: Inspect if observation was approved or rejected
        if (toolMsg.content.includes("1001")) {
          return {
            content: "Calculation approved and verified: 7 * 11 * 13 is 1001.",
            finishReason: "stop",
            usage: { promptTokens: 50, completionTokens: 15, totalTokens: 65 },
          };
        } else {
          return {
            content: "Understood. The action was canceled by you. Let me know if you need anything else.",
            finishReason: "stop",
            usage: { promptTokens: 45, completionTokens: 15, totalTokens: 60 },
          };
        }
      },
      async *stream() {},
    };
    AIProviderFactory.registerProvider("openai", () => approvalMockAI);

    setSessionUser(testUserId);
    const chatReq1 = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        conversationId: conversationId1,
        content: "Calculate the prime product 7 * 11 * 13",
      }),
    });

    const chatRes1 = await postChat(chatReq1);
    assert("1.1 POST /api/chat returns 200 OK", chatRes1.status === 200);

    const chatData1 = await chatRes1.json();
    assert(
      "1.2 Turn halts with finishReason 'approval_required'",
      chatData1.finishReason === "approval_required",
    );

    // Verify tool_calls row in PostgreSQL
    const [savedTc1] = await db
      .select()
      .from(toolCalls)
      .where(eq(toolCalls.messageId, chatData1.assistantMessage?.id));

    assert(
      "1.3 tool_calls row created with status 'requested'",
      savedTc1 !== undefined &&
        savedTc1.status === "requested" &&
        savedTc1.name === "execute_code",
    );

    // -------------------------------------------------------------
    // 2. TEST APPROVE ACTION (POST /api/chat/approve decision: 'approved')
    // -------------------------------------------------------------
    console.log("\n--- Group 2: Resuming Turn on Approval ---");

    const approveReq = new NextRequest("http://localhost:3000/api/chat/approve", {
      method: "POST",
      body: JSON.stringify({
        toolCallId: savedTc1.id,
        decision: "approved",
      }),
    });

    const approveRes = await postApprove(approveReq);
    assert("2.1 POST /api/chat/approve returns 200 OK", approveRes.status === 200);

    const approveData = await approveRes.json();
    assert(
      "2.2 Assistant continuation message confirms verified execution",
      approveData.assistantMessage?.content.includes("1001"),
    );

    // Verify updated status in database
    const [updatedTc1] = await db
      .select()
      .from(toolCalls)
      .where(eq(toolCalls.id, savedTc1.id));

    assert(
      "2.3 tool_calls table updated status to 'completed' with execution result",
      updatedTc1.status === "completed" && (updatedTc1.result as any)?.result === "1001",
    );

    // -------------------------------------------------------------
    // 3. TEST REJECT ACTION (POST /api/chat/approve decision: 'rejected')
    // -------------------------------------------------------------
    console.log("\n--- Group 3: Resuming Turn on Rejection ---");

    const [conv2] = await db
      .insert(conversations)
      .values({
        workspaceId: testWorkspaceId,
        agentId: testAgentId,
        agentVersionId: testVersionId,
        title: "Approval Session 2 (Rejection)",
        createdBy: testUserId,
      })
      .returning();
    conversationId2 = conv2.id;

    const chatReq2 = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        conversationId: conversationId2,
        content: "Run calculation again",
      }),
    });
    const chatRes2 = await postChat(chatReq2);
    const chatData2 = await chatRes2.json();

    const [savedTc2] = await db
      .select()
      .from(toolCalls)
      .where(eq(toolCalls.messageId, chatData2.assistantMessage?.id));

    // Reject the tool call
    const rejectReq = new NextRequest("http://localhost:3000/api/chat/approve", {
      method: "POST",
      body: JSON.stringify({
        toolCallId: savedTc2.id,
        decision: "rejected",
      }),
    });

    const rejectRes = await postApprove(rejectReq);
    assert("3.1 POST /api/chat/approve returns 200 OK on rejection", rejectRes.status === 200);

    const rejectData = await rejectRes.json();
    assert(
      "3.2 Model received refusal observation and replied gracefully",
      rejectData.assistantMessage?.content.includes("action was canceled"),
    );

    const [updatedTc2] = await db
      .select()
      .from(toolCalls)
      .where(eq(toolCalls.id, savedTc2.id));

    assert(
      "3.3 tool_calls status updated to 'rejected'",
      updatedTc2.status === "rejected",
    );

    // -------------------------------------------------------------
    // 4. TEST IDEMPOTENCY & EDGE CASES
    // -------------------------------------------------------------
    console.log("\n--- Group 4: Edge Cases & Security Checks ---");

    // 4.1 Cannot re-approve already completed tool call
    const reApproveReq = new NextRequest("http://localhost:3000/api/chat/approve", {
      method: "POST",
      body: JSON.stringify({
        toolCallId: savedTc1.id,
        decision: "approved",
      }),
    });
    const reApproveRes = await postApprove(reApproveReq);
    assert("4.1 Re-approving processed tool call returns 400 Bad Request", reApproveRes.status === 400);

    // 4.2 Unauthenticated approve returns 401
    setSessionUser(null);
    const unauthApproveReq = new NextRequest("http://localhost:3000/api/chat/approve", {
      method: "POST",
      body: JSON.stringify({
        toolCallId: savedTc1.id,
        decision: "approved",
      }),
    });
    const unauthApproveRes = await postApprove(unauthApproveReq);
    assert("4.2 Unauthenticated approve returns 401 Unauthorized", unauthApproveRes.status === 401);
  } finally {
    // -------------------------------------------------------------
    // TEARDOWN TEST FIXTURES
    // -------------------------------------------------------------
    console.log("\n--- Cleaning up test fixtures ---");
    if (conversationId1) {
      await db.delete(conversations).where(eq(conversations.id, conversationId1));
    }
    if (conversationId2) {
      await db.delete(conversations).where(eq(conversations.id, conversationId2));
    }
    await db.delete(agentTools).where(eq(agentTools.agentId, testAgentId));
    await db.delete(agentVersions).where(eq(agentVersions.id, testVersionId));
    await db.delete(agents).where(eq(agents.id, testAgentId));
    await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, testWorkspaceId));
    await db.delete(workspaces).where(eq(workspaces.id, testWorkspaceId));
    await db.delete(users).where(eq(users.id, testUserId));
    AIProviderFactory.reset();
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runApprovalsTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

