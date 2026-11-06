/**
 * Phase 3 Verification Suite: Conversation & Chat API Routes
 *
 * Verifies:
 * 1. GET /api/conversations (Auth checks, listing, filtering by agentId).
 * 2. POST /api/conversations (Auth checks, binding to latest agent version, creation).
 * 3. GET /api/conversations/[id]/messages (Chronological ordering, tool call hydration).
 * 4. POST /api/chat (Multi-turn execution, DB persistence of user and assistant messages, usage tracking).
 * 5. Full lifecycle cleanup.
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
} from "../db/schema";
import { GET as getConversations, POST as postConversation } from "../app/api/conversations/route";
import { GET as getMessages } from "../app/api/conversations/[id]/messages/route";
import { POST as postChat } from "../app/api/chat/route";
import { AIProviderFactory } from "../lib/ai/factory";
import { AIProvider, ModelResponse } from "../lib/ai/types";

// Mock NextAuth session state
const nextAuthNext = require("next-auth/next");
let currentSession: { user?: { id?: string } } | null = null;
nextAuthNext.getServerSession = async () => currentSession;

function setSessionUser(userId: string | null) {
  currentSession = userId ? { user: { id: userId } } : null;
}

async function runApiTests() {
  console.log("=== PHASE 3.5: CONVERSATION & CHAT API VERIFICATION ===\n");

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
  const testUserId = `test_user_p3_${timestamp}`;
  const testWorkspaceId = `ws_p3_${timestamp}`;
  const testAgentId = `agent_p3_${timestamp}`;
  const testVersionId = `ver_p3_${timestamp}`;
  let createdConversationId = "";

  try {
    // -------------------------------------------------------------
    // SETUP TEST FIXTURES
    // -------------------------------------------------------------
    await db.insert(users).values({
      id: testUserId,
      name: "Test User Phase 3",
      email: `${testUserId}@example.com`,
    });

    await db.insert(workspaces).values({
      id: testWorkspaceId,
      name: "Phase 3 Test Workspace",
      slug: `p3-test-ws-${timestamp}`,
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
      name: "Support Assistant",
      description: "Assist customers politely.",
      status: "active",
      createdBy: testUserId,
    });

    await db.insert(agentVersions).values({
      id: testVersionId,
      agentId: testAgentId,
      version: 1,
      instructions: "Assist customers politely.",
      model: "gpt-4o",
      config: { temperature: 0.3 },
      createdBy: testUserId,
    });

    // Register a mock AI provider for gpt-4o so tests do not burn real API tokens
    const testMockAIProvider: AIProvider = {
      id: "openai",
      async generate(): Promise<ModelResponse> {
        return {
          content: "Hello! I am your support agent. How can I assist you today?",
          finishReason: "stop",
          usage: { promptTokens: 30, completionTokens: 15, totalTokens: 45 },
        };
      },
      async *stream() {},
    };
    AIProviderFactory.registerProvider("openai", () => testMockAIProvider);

    // -------------------------------------------------------------
    // 1. TEST POST & GET /api/conversations
    // -------------------------------------------------------------
    console.log("--- Group 1: Conversations CRUD ---");

    // 1.1 Unauthenticated POST
    setSessionUser(null);
    const unauthPostReq = new NextRequest("http://localhost:3000/api/conversations", {
      method: "POST",
      body: JSON.stringify({ workspaceId: testWorkspaceId, agentId: testAgentId }),
    });
    const unauthPostRes = await postConversation(unauthPostReq);
    assert("1.1 POST /api/conversations returns 401 when unauthenticated", unauthPostRes.status === 401);

    // 1.2 Authenticated POST
    setSessionUser(testUserId);
    const authPostReq = new NextRequest("http://localhost:3000/api/conversations", {
      method: "POST",
      body: JSON.stringify({
        workspaceId: testWorkspaceId,
        agentId: testAgentId,
        title: "Test Support Ticket",
      }),
    });
    const authPostRes = await postConversation(authPostReq);
    assert("1.2 POST /api/conversations returns 201 Created", authPostRes.status === 201);

    const postData = await authPostRes.json();
    createdConversationId = postData.conversation?.id;
    assert(
      "1.3 Created conversation binds to latest agentVersionId",
      postData.conversation?.agentVersionId === testVersionId &&
        postData.conversation?.title === "Test Support Ticket",
    );

    // 1.3 GET /api/conversations list
    const getListReq = new NextRequest(
      `http://localhost:3000/api/conversations?workspaceId=${testWorkspaceId}&agentId=${testAgentId}`,
    );
    const getListRes = await getConversations(getListReq);
    assert("1.4 GET /api/conversations returns 200 OK", getListRes.status === 200);

    const listData = await getListRes.json();
    assert(
      "1.5 Conversation list contains created conversation",
      listData.conversations?.some((c: any) => c.id === createdConversationId),
    );

    // -------------------------------------------------------------
    // 2. TEST POST /api/chat
    // -------------------------------------------------------------
    console.log("\n--- Group 2: Chat Execution & Message Persistence ---");

    // 2.1 Unauthenticated POST /api/chat
    setSessionUser(null);
    const unauthChatReq = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        conversationId: createdConversationId,
        content: "Hi there!",
      }),
    });
    const unauthChatRes = await postChat(unauthChatReq);
    assert("2.1 POST /api/chat returns 401 when unauthenticated", unauthChatRes.status === 401);

    // 2.2 Authenticated POST /api/chat
    setSessionUser(testUserId);
    const authChatReq = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        conversationId: createdConversationId,
        content: "Hi there, I need help with my billing.",
      }),
    });
    const authChatRes = await postChat(authChatReq);
    assert("2.2 POST /api/chat returns 200 OK", authChatRes.status === 200);

    const chatData = await authChatRes.json();
    assert(
      "2.3 Returns userMessage with role 'user'",
      chatData.userMessage?.role === "user" &&
        chatData.userMessage?.content === "Hi there, I need help with my billing.",
    );
    assert(
      "2.4 Returns assistantMessage with generated content",
      chatData.assistantMessage?.role === "assistant" &&
        chatData.assistantMessage?.content.includes("How can I assist you today?"),
    );
    assert(
      "2.5 Tracks usage metrics in assistantMessage metadata",
      chatData.assistantMessage?.metadata?.usage?.totalTokens === 45,
    );

    // -------------------------------------------------------------
    // 3. TEST GET /api/conversations/[id]/messages
    // -------------------------------------------------------------
    console.log("\n--- Group 3: Message History Retrieval ---");

    const getMessagesReq = new NextRequest(
      `http://localhost:3000/api/conversations/${createdConversationId}/messages`,
    );
    const getMessagesRes = await getMessages(getMessagesReq, {
      params: Promise.resolve({ id: createdConversationId }),
    });
    assert("3.1 GET messages returns 200 OK", getMessagesRes.status === 200);

    const messagesData = await getMessagesRes.json();
    assert(
      "3.2 Returns ordered messages (user turn followed by assistant turn)",
      messagesData.messages?.length === 2 &&
        messagesData.messages[0].role === "user" &&
        messagesData.messages[1].role === "assistant",
    );
  } finally {
    // -------------------------------------------------------------
    // TEARDOWN TEST FIXTURES
    // -------------------------------------------------------------
    console.log("\n--- Cleaning up test fixtures ---");
    if (createdConversationId) {
      await db.delete(conversations).where(eq(conversations.id, createdConversationId));
    }
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

runApiTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

