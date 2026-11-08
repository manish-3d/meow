/**
 * Phase 5 Verification Suite: Memory & Vector Knowledge Retrieval (RAG)
 *
 * Verifies:
 * 1. Tier 2 Memory Manager CRUD & Deduplication.
 * 2. Prompt Compiler Layer 3 Context Injection.
 * 3. /api/agents/[id]/memories REST API Endpoints.
 * 4. Tier 3 Recursive Document Chunker with Overlap.
 * 5. 1536-Dimensional Normalized Vector Embeddings.
 * 6. Document Ingestion & pgvector Cosine Similarity Search (<=>).
 * 7. Autonomous Tool Execution (search_knowledge).
 * 8. Automatic Cleanup.
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
  agentMemories,
  files,
  documentChunks,
} from "../db/schema";
import { MemoryManager } from "../lib/memory/manager";
import { TextChunker } from "../lib/knowledge/chunker";
import { EmbeddingService } from "../lib/knowledge/embeddings";
import { KnowledgeRetriever } from "../lib/knowledge/retriever";
import { searchKnowledgeTool } from "../lib/tools/builtin/search-knowledge";
import { compilePrompt } from "../lib/ai/compiler";
import {
  GET as getMemoriesRoute,
  POST as postMemoryRoute,
  DELETE as deleteMemoryRoute,
} from "../app/api/agents/[id]/memories/route";

// Mock NextAuth session state
const nextAuthNext = require("next-auth/next");
let currentSession: { user?: { id?: string; name?: string; email?: string } } | null = null;
nextAuthNext.getServerSession = async () => currentSession;

function setSessionUser(user: { id: string; name?: string; email?: string } | null) {
  currentSession = user ? { user } : null;
}

async function runPhase5Verification() {
  console.log("=== PHASE 5: MEMORY & VECTOR RAG RETRIEVAL VERIFICATION ===\n");

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
  const testUserId = `user_p5_${timestamp}`;
  const testWorkspaceId = `ws_p5_${timestamp}`;
  const testAgentId = `agent_p5_${timestamp}`;
  const testVersionId = `ver_p5_${timestamp}`;
  const testFileId = `file_p5_${timestamp}`;

  try {
    // -------------------------------------------------------------
    // SETUP FIXTURES
    // -------------------------------------------------------------
    await db.insert(users).values({
      id: testUserId,
      name: "Phase 5 Test User",
      email: `p5_test_${timestamp}@meow.local`,
    });

    await db.insert(workspaces).values({
      id: testWorkspaceId,
      name: "Phase 5 Workspace",
      slug: `p5-workspace-${timestamp}`,
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
      name: "Memory & RAG Specialist",
      description: "Agent for testing Tier 2 memories and Tier 3 RAG",
      createdBy: testUserId,
    });

    await db.insert(agentVersions).values({
      id: testVersionId,
      agentId: testAgentId,
      version: 1,
      instructions: "You are a helpful assistant with persistent memory and knowledge access.",
      model: "gpt-4o",
      createdBy: testUserId,
    });

    setSessionUser({
      id: testUserId,
      name: "Phase 5 Test User",
      email: `p5_test_${timestamp}@meow.local`,
    });

    // -------------------------------------------------------------
    // Test Group 1: Tier 2 Memory Manager CRUD & Deduplication
    // -------------------------------------------------------------
    console.log("--- 1. Testing Tier 2 Memory Manager ---");

    const mem1 = await MemoryManager.addMemory(testAgentId, {
      memoryType: "preference",
      content: "User prefers TypeScript and strict types",
      metadata: { confidence: 0.95 },
    });
    assert("1.1 Store preference memory", !!mem1.id && mem1.memoryType === "preference");

    const mem2 = await MemoryManager.addMemory(testAgentId, {
      memoryType: "fact",
      content: "Deployment target is AWS us-east-1",
      metadata: { source: "chat" },
    });
    assert("1.2 Store factual memory", !!mem2.id && mem2.memoryType === "fact");

    // Deduplication check: storing identical memory should return existing record
    const duplicateMem = await MemoryManager.addMemory(testAgentId, {
      memoryType: "preference",
      content: "User prefers TypeScript and strict types",
    });
    assert("1.3 Deduplication returns existing memory ID", duplicateMem.id === mem1.id);

    const agentMems = await MemoryManager.getMemoriesForAgent(testAgentId);
    assert("1.4 List memories returns exactly 2 entries", agentMems.length === 2);

    // -------------------------------------------------------------
    // Test Group 2: Prompt Compiler Memory Layer Integration
    // -------------------------------------------------------------
    console.log("\n--- 2. Testing Prompt Compiler Memory Injection ---");

    const compiledMems = await MemoryManager.getCompiledMemories(testAgentId);
    assert("2.1 Compiled memories count equals 2", compiledMems.length === 2);

    const compiledPrompt = compilePrompt({
      agentVersion: {
        model: "gpt-4o",
        instructions: "Follow user preferences.",
        config: {},
      },
      workspace: {
        id: testWorkspaceId,
        name: "Phase 5 Workspace",
      },
      memories: compiledMems,
    });

    const systemPromptText = compiledPrompt.messages[0].content;
    assert(
      "2.2 System prompt contains '[PREFERENCE]: User prefers TypeScript'",
      systemPromptText.includes("[PREFERENCE]: User prefers TypeScript and strict types"),
    );
    assert(
      "2.3 System prompt contains '[FACT]: Deployment target is AWS us-east-1'",
      systemPromptText.includes("[FACT]: Deployment target is AWS us-east-1"),
    );

    // -------------------------------------------------------------
    // Test Group 3: Memories REST API Endpoints
    // -------------------------------------------------------------
    console.log("\n--- 3. Testing Memories API Endpoints ---");

    const getRes = await getMemoriesRoute(
      new NextRequest(`http://localhost:3000/api/agents/${testAgentId}/memories`),
      { params: Promise.resolve({ id: testAgentId }) },
    );
    assert("3.1 GET /api/agents/[id]/memories returns HTTP 200", getRes.status === 200);
    const getData = await getRes.json();
    assert("3.2 Response contains memories list", Array.isArray(getData.memories) && getData.memories.length === 2);

    // POST new memory
    const postReq = new NextRequest(`http://localhost:3000/api/agents/${testAgentId}/memories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memoryType: "instruction",
        content: "Never generate Python 2 code",
      }),
    });

    const postRes = await postMemoryRoute(postReq, { params: Promise.resolve({ id: testAgentId }) });
    assert("3.3 POST /api/agents/[id]/memories returns HTTP 201", postRes.status === 201);
    const postData = await postRes.json();
    const createdMemoryId = postData.memory.id;

    // DELETE memory
    const delReq = new NextRequest(
      `http://localhost:3000/api/agents/${testAgentId}/memories?memoryId=${createdMemoryId}`,
      { method: "DELETE" },
    );
    const delRes = await deleteMemoryRoute(delReq, { params: Promise.resolve({ id: testAgentId }) });
    assert("3.4 DELETE /api/agents/[id]/memories returns HTTP 200", delRes.status === 200);

    // -------------------------------------------------------------
    // Test Group 4: Text Chunker with Sliding-Window Overlap
    // -------------------------------------------------------------
    console.log("\n--- 4. Testing Recursive Text Chunker ---");

    const sampleDoc = `
# Acme Corporation Policy Manual

## 1. Remote Work Policy
Employees may work remotely up to 3 days per week with manager approval. Home office equipment stipends are disbursed annually up to $500.

## 2. Customer Refund Policy
Customers are eligible for a 100% money-back refund within 14 days of purchase. Refunds are returned to the original payment method within 3 to 5 business days.

## 3. Data Protection Guidelines
All customer personal records must be encrypted using AES-256 at rest and TLS 1.3 in transit. Never share database connection credentials in Slack channels.
`.trim();

    const chunks = TextChunker.splitText(sampleDoc, { maxChunkSize: 220, chunkOverlap: 40 });
    assert("4.1 Document split into multiple chunks", chunks.length >= 2);
    assert("4.2 Chunks have ascending sequential chunkIndex", chunks[0].chunkIndex === 0 && chunks[1].chunkIndex === 1);
    assert("4.3 Each chunk has valid content and length", chunks.every((c) => c.content.length > 0 && c.charLength > 0));

    // -------------------------------------------------------------
    // Test Group 5: 1,536-Dimensional Vector Embeddings
    // -------------------------------------------------------------
    console.log("\n--- 5. Testing Vector Embedding Generator ---");

    const embedding1 = await EmbeddingService.generateEmbedding("Customer Refund Policy");
    assert("5.1 Generates vector with length 1536", embedding1.length === 1536);

    // Verify unit vector normalization (L2 norm ~ 1.0)
    let sumSq = 0;
    for (let i = 0; i < embedding1.length; i++) {
      sumSq += embedding1[i] * embedding1[i];
    }
    const l2Norm = Math.sqrt(sumSq);
    assert("5.2 Vector is L2 normalized (magnitude ~ 1.0)", Math.abs(l2Norm - 1.0) < 0.05, `norm: ${l2Norm}`);

    // Semantic consistency check: identical or highly overlapping queries have high similarity
    const embedding2 = await EmbeddingService.generateEmbedding("Customer Refund Policy Details");
    let dotProduct = 0;
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
    }
    assert("5.3 Similar phrases produce high cosine similarity (> 0.7)", dotProduct > 0.7, `similarity: ${dotProduct}`);

    // -------------------------------------------------------------
    // Test Group 6: Document Ingestion & Cosine Similarity Search
    // -------------------------------------------------------------
    console.log("\n--- 6. Testing pgvector Document Ingestion & Retrieval ---");

    await db.insert(files).values({
      id: testFileId,
      workspaceId: testWorkspaceId,
      storageKey: `policies_${timestamp}.md`,
      originalFilename: "Acme_Policy_Manual.md",
      mimeType: "text/markdown",
      sizeBytes: sampleDoc.length,
    });

    const ingestResult = await KnowledgeRetriever.ingestDocument({
      workspaceId: testWorkspaceId,
      fileId: testFileId,
      content: sampleDoc,
      chunkOptions: { maxChunkSize: 220, chunkOverlap: 40 },
    });
    assert("6.1 Ingestion creates document_chunks rows", ingestResult.chunksCreated >= 2);

    // Verify retrieval for refund query
    const searchResults = await KnowledgeRetriever.searchKnowledge({
      workspaceId: testWorkspaceId,
      query: "How do customer refunds work?",
      limit: 3,
    });

    assert("6.2 Semantic search returns matching chunks", searchResults.length > 0);
    const topResult = searchResults[0];
    assert(
      "6.3 Top result contains refund policy content",
      topResult.content.toLowerCase().includes("refund"),
      topResult.content,
    );
    assert("6.4 Top result has positive cosine similarity", topResult.similarity > 0);

    // -------------------------------------------------------------
    // Test Group 7: Autonomous Tool Execution (search_knowledge)
    // -------------------------------------------------------------
    console.log("\n--- 7. Testing search_knowledge Tool ---");

    assert("7.1 Tool clearance is 'read' and requiresApproval is false",
      searchKnowledgeTool.permissionLevel === "read" && searchKnowledgeTool.requiresApproval === false,
    );

    const toolResult = (await searchKnowledgeTool.execute(
      { query: "remote work policy" },
      { workspaceId: testWorkspaceId, userId: testUserId, agentId: testAgentId },
    )) as Record<string, unknown>;

    assert("7.2 Tool execution succeeds", toolResult.success === true);
    const toolData = toolResult.data as Record<string, unknown>;
    assert("7.3 Tool returns matching chunks", Array.isArray(toolData.results) && toolData.results.length > 0);

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  } finally {
    // -------------------------------------------------------------
    // CLEANUP FIXTURES
    // -------------------------------------------------------------
    console.log("\n--- Cleanup Test Fixtures ---");
    try {
      await db.delete(documentChunks).where(eq(documentChunks.workspaceId, testWorkspaceId));
      await db.delete(files).where(eq(files.workspaceId, testWorkspaceId));
      await db.delete(agentMemories).where(eq(agentMemories.agentId, testAgentId));
      await db.delete(agentVersions).where(eq(agentVersions.agentId, testAgentId));
      await db.delete(agents).where(eq(agents.id, testAgentId));
      await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, testWorkspaceId));
      await db.delete(workspaces).where(eq(workspaces.id, testWorkspaceId));
      await db.delete(users).where(eq(users.id, testUserId));
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

runPhase5Verification().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});

