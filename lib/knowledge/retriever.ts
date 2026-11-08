/**
 * Meow Knowledge Retriever & Document Ingestion Pipeline (RAG)
 *
 * Ingests documents into PostgreSQL pgvector chunks and executes
 * high-speed semantic similarity searches using the cosine distance operator (<=>).
 */

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { documentChunks, files, type DocumentChunk } from "@/db/schema";
import { TextChunker, type ChunkOptions } from "./chunker";
import { EmbeddingService } from "./embeddings";

export interface IngestDocumentOptions {
  workspaceId: string;
  fileId: string;
  content: string;
  metadata?: Record<string, unknown>;
  chunkOptions?: ChunkOptions;
}

export interface SearchKnowledgeOptions {
  workspaceId: string;
  query: string;
  limit?: number;
  threshold?: number;
}

export interface SearchResultChunk {
  id: string;
  fileId: string;
  chunkIndex: number;
  content: string;
  similarity: number;
  metadata: Record<string, unknown>;
}

export class KnowledgeRetriever {
  /**
   * Ingests a text document into the workspace's vector knowledge base.
   * Chunks text and saves embeddings into document_chunks table.
   */
  public static async ingestDocument(
    options: IngestDocumentOptions,
  ): Promise<{ chunksCreated: number }> {
    const { workspaceId, fileId, content, metadata = {} } = options;

    // 1. Chunk text recursively with sliding-window overlap
    const chunks = TextChunker.splitText(content, options.chunkOptions);
    if (chunks.length === 0) {
      return { chunksCreated: 0 };
    }

    // 2. Generate vector embeddings for all chunks
    const chunkTexts = chunks.map((c) => c.content);
    const embeddings = await EmbeddingService.generateBatchEmbeddings(chunkTexts);

    // 3. Insert chunks into document_chunks table inside a transaction
    await db.transaction(async (tx) => {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = embeddings[i];

        await tx.insert(documentChunks).values({
          workspaceId,
          fileId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          embedding,
          metadata: {
            ...metadata,
            charLength: chunk.charLength,
          },
        });
      }
    });

    return { chunksCreated: chunks.length };
  }

  /**
   * Performs semantic similarity search across workspace document chunks.
   * Uses Neon PostgreSQL pgvector cosine distance operator (<=>).
   */
  public static async searchKnowledge(
    options: SearchKnowledgeOptions,
  ): Promise<SearchResultChunk[]> {
    const { workspaceId, query, limit = 5, threshold = 0.0 } = options;

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return [];
    }

    // 1. Generate query vector embedding
    const queryVector = await EmbeddingService.generateEmbedding(trimmedQuery);
    const vectorJson = JSON.stringify(queryVector);

    // 2. Execute Cosine Distance Query in Neon PostgreSQL
    // 1 - (embedding <=> queryVector) calculates Cosine Similarity (1.0 = identical)
    const rawResults = await db.execute(sql`
      SELECT 
        "id",
        "file_id" AS "fileId",
        "chunk_index" AS "chunkIndex",
        "content",
        "metadata",
        (1 - ("embedding" <=> ${vectorJson}::vector)) AS "similarity"
      FROM "document_chunks"
      WHERE "workspace_id" = ${workspaceId}
      ORDER BY "embedding" <=> ${vectorJson}::vector ASC
      LIMIT ${limit};
    `);

    const results: SearchResultChunk[] = [];

    for (const row of rawResults as any[]) {
      const similarity = parseFloat(row.similarity);
      if (isNaN(similarity) || similarity < threshold) {
        continue;
      }

      results.push({
        id: String(row.id),
        fileId: String(row.fileId),
        chunkIndex: Number(row.chunkIndex),
        content: String(row.content),
        similarity: Math.round(similarity * 1000) / 1000,
        metadata: (typeof row.metadata === "object" && row.metadata !== null) ? row.metadata : {},
      });
    }

    return results;
  }
}

