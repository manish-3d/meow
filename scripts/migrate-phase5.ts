/**
 * Migration 0005: Phase 5 Schema (pgvector, agent_memories, files, document_chunks)
 *
 * Applies:
 * 1. CREATE EXTENSION IF NOT EXISTS vector
 * 2. agent_memories table (Tier 2 Long-Term Cross-Thread Memory)
 * 3. files table (Domain G - Workspace File Storage)
 * 4. document_chunks table (Domain G - Vector Embeddings & HNSW Index)
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyPhase5Migration() {
  console.log("=== APPLYING MIGRATION 0005: PHASE 5 SCHEMA ===\n");

  try {
    // 1. Enable pgvector extension
    console.log("1. Enabling pgvector extension...");
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log("✓ pgvector extension active.");

    // 2. Create agent_memories table
    console.log("\n2. Creating agent_memories table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "agent_memories" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "agent_id" text NOT NULL REFERENCES "agents"("id") ON DELETE CASCADE,
        "memory_type" text NOT NULL,
        "content" text NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "agent_memories_memory_type_check" CHECK ("memory_type" IN ('fact', 'preference', 'instruction', 'summary'))
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "agent_memories_agent_id_idx" ON "agent_memories" ("agent_id");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "agent_memories_memory_type_idx" ON "agent_memories" ("memory_type");
    `);
    console.log("✓ agent_memories table and indexes verified.");

    // 3. Create files table
    console.log("\n3. Creating files table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "files" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "storage_key" text NOT NULL UNIQUE,
        "original_filename" text NOT NULL,
        "mime_type" text NOT NULL,
        "size_bytes" integer NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "files_workspace_id_idx" ON "files" ("workspace_id");
    `);
    console.log("✓ files table and indexes verified.");

    // 4. Create document_chunks table with vector(1536) & HNSW index
    console.log("\n4. Creating document_chunks table with pgvector...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "document_chunks" (
        "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "file_id" text NOT NULL REFERENCES "files"("id") ON DELETE CASCADE,
        "chunk_index" integer NOT NULL,
        "content" text NOT NULL,
        "embedding" vector(1536) NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "document_chunks_workspace_id_idx" ON "document_chunks" ("workspace_id");
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "document_chunks_file_id_idx" ON "document_chunks" ("file_id");
    `);

    // HNSW index for high-speed Approximate Nearest Neighbor (ANN) search using cosine ops
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "document_chunks_embedding_hnsw_idx" 
      ON "document_chunks" 
      USING hnsw ("embedding" vector_cosine_ops);
    `);
    console.log("✓ document_chunks table and HNSW index verified.");

    // 5. Verify presence of all tables
    console.log("\n5. Verifying database catalog...");
    const tablesCheck = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('agent_memories', 'files', 'document_chunks');
    `);

    console.log("Found tables in public schema:", tablesCheck);
    console.log("\n==================================================");
    console.log("MIGRATION 0005 APPLIED SUCCESSFULLY!");
    console.log("==================================================\n");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

applyPhase5Migration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

