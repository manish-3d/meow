/**
 * Meow Tier 2 Memory Manager
 *
 * Manages cross-conversation long-term facts, preferences, instructions,
 * and user guidelines for autonomous agents.
 */

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { agentMemories, type AgentMemory, type MemoryType } from "@/db/schema";
import { type AgentMemoryItem } from "@/lib/ai/compiler";

export interface CreateMemoryInput {
  memoryType: MemoryType;
  content: string;
  metadata?: Record<string, unknown>;
}

export class MemoryManager {
  /**
   * Retrieves all stored long-term memories for an agent.
   */
  public static async getMemoriesForAgent(
    agentId: string,
    limit: number = 50,
  ): Promise<AgentMemory[]> {
    return await db
      .select()
      .from(agentMemories)
      .where(eq(agentMemories.agentId, agentId))
      .orderBy(desc(agentMemories.createdAt))
      .limit(limit);
  }

  /**
   * Stores a new memory fact or user preference for an agent.
   * Performs deduplication to prevent storing identical memories.
   */
  public static async addMemory(
    agentId: string,
    input: CreateMemoryInput,
  ): Promise<AgentMemory> {
    const trimmedContent = input.content.trim();
    if (!trimmedContent) {
      throw new Error("Memory content cannot be empty");
    }

    // Check for duplicate memory with exact same content & type
    const [existing] = await db
      .select()
      .from(agentMemories)
      .where(
        and(
          eq(agentMemories.agentId, agentId),
          eq(agentMemories.memoryType, input.memoryType),
          eq(agentMemories.content, trimmedContent),
        ),
      )
      .limit(1);

    if (existing) {
      return existing;
    }

    const [created] = await db
      .insert(agentMemories)
      .values({
        agentId,
        memoryType: input.memoryType,
        content: trimmedContent,
        metadata: input.metadata || {},
      })
      .returning();

    return created;
  }

  /**
   * Deletes a specific memory entry by ID.
   */
  public static async deleteMemory(memoryId: string): Promise<boolean> {
    const deleted = await db
      .delete(agentMemories)
      .where(eq(agentMemories.id, memoryId))
      .returning();

    return deleted.length > 0;
  }

  /**
   * Purges all memories for an agent.
   */
  public static async clearMemoriesForAgent(agentId: string): Promise<number> {
    const deleted = await db
      .delete(agentMemories)
      .where(eq(agentMemories.agentId, agentId))
      .returning();

    return deleted.length;
  }

  /**
   * Compiles stored agent memories into AgentMemoryItem[] format ready
   * to inject directly into Layer 3 of the Prompt Compiler.
   */
  public static async getCompiledMemories(
    agentId: string,
    limit: number = 20,
  ): Promise<AgentMemoryItem[]> {
    const records = await this.getMemoriesForAgent(agentId, limit);

    return records.map((m) => ({
      id: m.id,
      memoryType: m.memoryType,
      content: m.content,
    }));
  }
}

