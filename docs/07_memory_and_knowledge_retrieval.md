# 07 — Memory Architecture & Knowledge Retrieval (RAG)

Meow agents require memory to be truly personal and context-aware. This document details the three-tier memory architecture, background fact extraction, and document retrieval using PostgreSQL `pgvector`.

---

## 1. The Three Tiers of Agent Memory

```mermaid
flowchart TD
    subgraph Tier1["Tier 1: Conversation Memory (Short-Term)"]
        C1["Messages in Active Thread"]
        C2["Windowed Rolling Context"]
        C3["Thread Context Summary"]
    end

    subgraph Tier2["Tier 2: Agent Memory (Long-Term Cross-Thread)"]
        M1["User Preferences ('Prefers concise code')"]
        M2["Learned Facts ('Acme Corp uses Next.js 16')"]
        M3["Behavioral Corrections ('Never use any in TS')"]
    end

    subgraph Tier3["Tier 3: Knowledge Memory (Enterprise RAG)"]
        K1["Uploaded PDFs, CSVs, Text Files"]
        K2["Embedded Document Chunks (pgvector)"]
        K3["Connected Knowledge Integrations (Notion/GitHub)"]
    end

    Tier1 -->|"Scoped to 1 Conversation"| PROMPT["Prompt Context Compiler"]
    Tier2 -->|"Scoped to Agent + Workspace"| PROMPT
    Tier3 -->|"Semantic Similarity Search"| PROMPT
```

---

## 2. Memory Extraction & Reflection Pipeline

Agents should not blindly save every message to long-term memory. A background reflection worker analyzes completed conversations to extract durable facts:

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Agent as Agent Chat
    participant Inngest as Inngest Background Worker
    participant DB as Neon Database (agent_memories)

    User->>Agent: "My favorite model is Claude 3.5 Sonnet, always use that."
    Agent-->>User: "Got it, I'll remember that preference."
    
    Note over Inngest: Conversation ends or user navigates away
    Inngest->>Inngest: Analyze conversation for durable user facts
    Note over Inngest: Evaluates against criteria (Is it durable? Is it a preference?)
    Inngest->>DB: INSERT INTO agent_memories (type: 'preference', content: 'Prefers Claude 3.5 Sonnet')
    
    Note over User,Agent: Weeks later, in a brand new conversation:
    User->>Agent: "Write an email generator agent config."
    Agent->>DB: Query agent_memories for agent
    DB-->>Agent: Returns: "Prefers Claude 3.5 Sonnet"
    Agent-->>User: "Here is your config, defaulted to Claude 3.5 Sonnet."
```

### Memory Extraction System Prompt:
```
You are a Memory Extraction Assistant. Analyze the dialogue and extract ONLY persistent user facts, preferences, or project guidelines.
Do NOT extract ephemeral tasks or conversational pleasantries.
Format as JSON:
[
  { "memoryType": "preference", "content": "User prefers TypeScript over JavaScript" },
  { "memoryType": "fact", "content": "Target production deployment is AWS us-east-1" }
]
```

---

## 3. Knowledge Memory: Document Ingestion & RAG Pipeline

When users upload PDFs, API documentation, or spreadsheets, Meow indexes them using **Neon PostgreSQL with pgvector**.

```mermaid
flowchart LR
    FILE["Uploaded Document (PDF / Markdown / Code)"]
    PARSER["Text Extractor & Normalizer"]
    CHUNKER["Recursive Character Chunker (512 tokens, 64 overlap)"]
    EMBEDDER["Embedding Model (text-embedding-3-small)"]
    PGVECTOR["Neon PostgreSQL (document_chunks with HNSW Index)"]

    FILE --> PARSER
    PARSER --> CHUNKER
    CHUNKER --> EMBEDDER
    EMBEDDER --> PGVECTOR
```

### Relational Schema for Document Chunks with Vector Embeddings:
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "document_chunks" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
    "file_id" text NOT NULL REFERENCES "files"("id") ON DELETE CASCADE,
    "chunk_index" integer NOT NULL,
    "content" text NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Fast Approximate Nearest Neighbor (ANN) index using HNSW
CREATE INDEX "document_chunks_embedding_hnsw_idx" 
ON "document_chunks" 
USING hnsw ("embedding" vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

---

## 4. Semantic Similarity Search Query

When a user asks a question, Meow computes the query embedding and retrieves the top-K relevant chunks within the user's workspace using cosine distance (`<=>`):

```typescript
export async function searchKnowledgeBase(
  workspaceId: string,
  queryText: string,
  topK: number = 5,
): Promise<Array<{ content: string; similarity: number }>> {
  // 1. Generate embedding vector for query
  const queryEmbedding = await generateEmbedding(queryText);

  // 2. Perform Cosine Similarity Search in Neon PostgreSQL
  const results = await db.execute(sql`
    SELECT 
      content,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) AS similarity
    FROM document_chunks
    WHERE workspace_id = ${workspaceId}
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${topK};
  `);

  return results as unknown as Array<{ content: string; similarity: number }>;
}
```

---

## 5. User Privacy & Right to Erasure (GDPR)

Users have complete visibility and control over what the AI platform remembers:
1. **Inspection UI:** Users can view the **Memory & Knowledge** tab in Workspace Settings.
2. **Individual Deletion:** Users can edit or delete any stored memory fact or uploaded document.
3. **Workspace Cascade:** Deleting a workspace triggers `ON DELETE CASCADE` across all `agent_memories`, `files`, and `document_chunks`, immediately purging vectors from disk.

