/**
 * Built-in Native Tool: search_knowledge
 *
 * Allows autonomous agents to semantically query workspace document chunks
 * and documentation using vector search.
 */

import { RegisteredTool, ToolContext } from "../types";
import { KnowledgeRetriever } from "@/lib/knowledge/retriever";

interface SearchKnowledgeArgs {
  query: string;
  maxResults?: number;
}

export const searchKnowledgeTool: RegisteredTool = {
  id: "search_knowledge",
  name: "Search Knowledge Base",
  description:
    "Semantically searches workspace document chunks, guides, uploaded files, or internal specifications using vector retrieval.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query or question to retrieve knowledge for.",
      },
      maxResults: {
        type: "integer",
        description: "Maximum number of document chunks to retrieve (default: 4).",
        default: 4,
      },
    },
    required: ["query"],
  },
  executionType: "native",
  permissionLevel: "read",
  requiresApproval: false,

  execute: async (
    args: Record<string, unknown>,
    context: ToolContext,
  ): Promise<Record<string, unknown> | string> => {
    const { query, maxResults = 4 } = args as unknown as SearchKnowledgeArgs;

    if (!query || typeof query !== "string" || !query.trim()) {
      return {
        success: false,
        error: "Missing or invalid 'query' argument.",
      };
    }

    try {
      const results = await KnowledgeRetriever.searchKnowledge({
        workspaceId: context.workspaceId,
        query: query.trim(),
        limit: Math.min(Math.max(Number(maxResults) || 4, 1), 10),
      });

      if (results.length === 0) {
        return {
          success: true,
          data: {
            query,
            matchCount: 0,
            message: "No relevant documents found in the workspace knowledge base.",
            results: [],
          },
        };
      }

      return {
        success: true,
        data: {
          query,
          matchCount: results.length,
          results: results.map((r) => ({
            chunkIndex: r.chunkIndex,
            similarity: r.similarity,
            content: r.content,
          })),
        },
      };
    } catch (err: unknown) {
      console.error("search_knowledge execution error:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Knowledge base retrieval failed",
      };
    }
  },
};
