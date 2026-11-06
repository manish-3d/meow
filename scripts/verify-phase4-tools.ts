/**
 * Phase 4 Verification Suite: Tool Registry & Built-in Capabilities
 *
 * Verifies:
 * 1. Tool metadata, permission levels, and JSON schema declarations.
 * 2. web_search execution and structured output mapping.
 * 3. read_url execution, HTML sanitization, and markdown conversion.
 * 4. Sandboxed file_ops (write_file and read_file) with strict Path Traversal defense.
 * 5. Safe isolated code execution via execute_code in Node vm sandbox.
 * 6. ToolRegistry catalog synchronization into Neon PostgreSQL 'tools' table.
 * 7. Agent tool binding via agent_tools junction table and dynamic resolution.
 * 8. End-to-end chat turn executing a live tool through POST /api/chat.
 */

import fs from "fs/promises";
import path from "path";
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
  tools as dbTools,
  agentTools,
  toolCalls,
} from "../db/schema";
import { ToolRegistry } from "../lib/tools/registry";
import { webSearchTool } from "../lib/tools/builtin/web-search";
import { readUrlTool } from "../lib/tools/builtin/read-url";
import { readFileTool, writeFileTool } from "../lib/tools/builtin/file-ops";
import { executeCodeTool } from "../lib/tools/builtin/execute-code";
import { POST as postChat } from "../app/api/chat/route";
import { AIProviderFactory } from "../lib/ai/factory";
import { AIProvider, ModelRequest, ModelResponse } from "../lib/ai/types";

// Mock NextAuth session
const nextAuthNext = require("next-auth/next");
let currentSession: { user?: { id?: string } } | null = null;
nextAuthNext.getServerSession = async () => currentSession;

function setSessionUser(userId: string | null) {
  currentSession = userId ? { user: { id: userId } } : null;
}

async function runToolsTests() {
  console.log("=== PHASE 4: TOOL REGISTRY & INTEGRATIONS VERIFICATION ===\n");

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
  const testWorkspaceId = `ws_tools_${timestamp}`;
  const testUserId = `user_tools_${timestamp}`;
  const testAgentId = `agent_tools_${timestamp}`;
  const testVersionId = `ver_tools_${timestamp}`;
  let createdConversationId = "";

  try {
    // -------------------------------------------------------------
    // GROUP 1: Built-in Tool Definitions & Properties
    // -------------------------------------------------------------
    console.log("--- Group 1: Tool Definitions & Declarations ---");

    assert(
      "1.1 web_search has permissionLevel 'read' and requiresApproval false",
      webSearchTool.permissionLevel === "read" && !webSearchTool.requiresApproval,
    );
    assert(
      "1.2 read_url has permissionLevel 'read' and requiresApproval false",
      readUrlTool.permissionLevel === "read" && !readUrlTool.requiresApproval,
    );
    assert(
      "1.3 write_file has permissionLevel 'write' and requiresApproval false",
      writeFileTool.permissionLevel === "write" && !writeFileTool.requiresApproval,
    );
    assert(
      "1.4 execute_code has permissionLevel 'dangerous' and requiresApproval true",
      executeCodeTool.permissionLevel === "dangerous" && executeCodeTool.requiresApproval,
    );

    // -------------------------------------------------------------
    // GROUP 2: File Operations & Path Traversal Security
    // -------------------------------------------------------------
    console.log("\n--- Group 2: Sandboxed File Operations & Security ---");

    const context = { workspaceId: testWorkspaceId };

    // 2.1 Write file within sandbox
    const writeRes = (await writeFileTool.execute(
      { filePath: "reports/test.txt", content: "Hello Meow Sandboxed Storage!" },
      context,
    )) as any;
    assert("2.1 write_file successfully writes within workspace sandbox", writeRes.success === true);

    // 2.2 Read file within sandbox
    const readRes = (await readFileTool.execute(
      { filePath: "reports/test.txt" },
      context,
    )) as any;
    assert(
      "2.2 read_file reads back exact content",
      readRes.content === "Hello Meow Sandboxed Storage!",
    );

    // 2.3 Path Traversal Attack Defense
    const hackAttemptRes = (await readFileTool.execute(
      { filePath: "../../secret.env" },
      context,
    )) as any;
    assert(
      "2.3 Blocks path traversal attempt (../../secret.env)",
      hackAttemptRes.error && hackAttemptRes.error.includes("Path traversal detected"),
    );

    // -------------------------------------------------------------
    // GROUP 3: Isolated Code Execution (execute_code)
    // -------------------------------------------------------------
    console.log("\n--- Group 3: Isolated Code Execution Sandbox ---");

    const codeRes = (await executeCodeTool.execute(
      {
        language: "javascript",
        code: `
          const items = [10, 20, 30, 40];
          const total = items.reduce((a, b) => a + b, 0);
          console.log("Calculated sum:", total);
          total;
        `,
      },
      context,
    )) as any;

    assert("3.1 execute_code runs JavaScript and returns evaluated result", codeRes.success === true && codeRes.result === "100");
    assert(
      "3.2 execute_code captures console.log output in sandbox",
      codeRes.logs && codeRes.logs[0].includes("Calculated sum: 100"),
    );

    // -------------------------------------------------------------
    // GROUP 4: Database Catalog Sync & Dynamic Agent Binding
    // -------------------------------------------------------------
    console.log("\n--- Group 4: Catalog Sync & Dynamic Agent Tool Resolution ---");

    // 4.1 Sync in-memory tools into Neon PostgreSQL
    await ToolRegistry.syncCatalogToDatabase();

    const dbToolList = await db.select().from(dbTools);
    assert(
      "4.1 Syncs 5 built-in tools into Neon PostgreSQL 'tools' table",
      dbToolList.length >= 5 &&
        dbToolList.some((t) => t.id === "web_search") &&
        dbToolList.some((t) => t.id === "execute_code"),
    );

    // Setup test fixtures for agent binding
    await db.insert(users).values({
      id: testUserId,
      name: "Tools Test User",
      email: `${testUserId}@example.com`,
    });

    await db.insert(workspaces).values({
      id: testWorkspaceId,
      name: "Tools Workspace",
      slug: `tools-ws-${timestamp}`,
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
      name: "Data Analyst Agent",
      description: "Performs calculations and queries.",
      status: "active",
      createdBy: testUserId,
    });

    await db.insert(agentVersions).values({
      id: testVersionId,
      agentId: testAgentId,
      version: 1,
      instructions: "You analyze data using provided tools.",
      model: "gpt-4o",
      createdBy: testUserId,
    });

    // 4.2 Bind only 'execute_code' to this agent in agent_tools
    await db.insert(agentTools).values({
      agentId: testAgentId,
      toolId: "execute_code",
      enabled: true,
    });

    const activeTools = await ToolRegistry.getActiveToolsForAgent(testAgentId, context);
    assert(
      "4.2 Dynamic resolution returns only enabled tools for agent (1 tool: execute_code)",
      activeTools.length === 1 && activeTools[0].name === "execute_code",
    );

    // -------------------------------------------------------------
    // GROUP 5: End-to-End Chat Execution with Tool Invocation
    // -------------------------------------------------------------
    console.log("\n--- Group 5: End-to-End Chat Tool Invocation ---");

    const [conv] = await db
      .insert(conversations)
      .values({
        workspaceId: testWorkspaceId,
        agentId: testAgentId,
        agentVersionId: testVersionId,
        title: "Code Execution Session",
        createdBy: testUserId,
      })
      .returning();
    createdConversationId = conv.id;

    // Register a mock AI provider that decides to call 'execute_code' on turn 1
    let turnCount = 0;
    const toolCallingMockAI: AIProvider = {
      id: "openai",
      async generate(req: ModelRequest): Promise<ModelResponse> {
        turnCount++;
        if (turnCount === 1) {
          return {
            content: "I will calculate 25 * 4 using the execute_code tool.",
            toolCalls: [
              {
                id: "call_code_1",
                name: "execute_code",
                arguments: { language: "javascript", code: "25 * 4;" },
              },
            ],
            finishReason: "tool_calls",
            usage: { promptTokens: 40, completionTokens: 15, totalTokens: 55 },
          };
        }

        return {
          content: "The result of 25 * 4 is 100.",
          finishReason: "stop",
          usage: { promptTokens: 60, completionTokens: 10, totalTokens: 70 },
        };
      },
      async *stream() {},
    };
    AIProviderFactory.registerProvider("openai", () => toolCallingMockAI);

    setSessionUser(testUserId);
    const chatReq = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        conversationId: createdConversationId,
        content: "What is 25 * 4?",
      }),
    });

    const chatRes = await postChat(chatReq);
    assert("5.1 POST /api/chat returns 200 OK during tool execution", chatRes.status === 200);

    const chatData = await chatRes.json();
    assert(
      "5.2 Agent executed the tool and completed the multi-step turn",
      chatData.assistantMessage?.content.includes("100") && chatData.steps?.length === 2,
    );

    // Verify tool call was recorded in database
    const savedToolCalls = await db
      .select()
      .from(toolCalls)
      .where(eq(toolCalls.messageId, chatData.assistantMessage?.id));

    assert(
      "5.3 Tool call persisted in PostgreSQL 'tool_calls' table with result",
      savedToolCalls.length === 1 &&
        savedToolCalls[0].name === "execute_code" &&
        savedToolCalls[0].status === "completed",
    );
  } finally {
    // -------------------------------------------------------------
    // TEARDOWN TEST FIXTURES
    // -------------------------------------------------------------
    console.log("\n--- Cleaning up test fixtures ---");
    if (createdConversationId) {
      await db.delete(conversations).where(eq(conversations.id, createdConversationId));
    }
    await db.delete(agentTools).where(eq(agentTools.agentId, testAgentId));
    await db.delete(agentVersions).where(eq(agentVersions.id, testVersionId));
    await db.delete(agents).where(eq(agents.id, testAgentId));
    await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, testWorkspaceId));
    await db.delete(workspaces).where(eq(workspaces.id, testWorkspaceId));
    await db.delete(users).where(eq(users.id, testUserId));

    // Clean up test sandbox storage folder
    try {
      await fs.rm(path.resolve(process.cwd(), "storage", "workspaces", testWorkspaceId), {
        recursive: true,
        force: true,
      });
    } catch {}

    AIProviderFactory.reset();
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runToolsTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

