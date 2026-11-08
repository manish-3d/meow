/**
 * Meow Central Tool Registry
 *
 * Manages tool declarations, synchronizes catalog metadata to PostgreSQL,
 * and resolves active executable tools per agent for the ReAct runner.
 */

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { agentTools, tools as dbTools } from "@/db/schema";
import { ExecutableTool } from "@/lib/ai/runner";
import { RegisteredTool, ToolContext } from "./types";
import { webSearchTool } from "./builtin/web-search";
import { readUrlTool } from "./builtin/read-url";
import { readFileTool, writeFileTool } from "./builtin/file-ops";
import { executeCodeTool } from "./builtin/execute-code";
import { searchKnowledgeTool } from "./builtin/search-knowledge";

export class ToolRegistry {
  private static registeredTools = new Map<string, RegisteredTool>();
  private static initialized = false;

  /**
   * Initializes built-in tools into registry.
   */
  public static init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.register(webSearchTool);
    this.register(readUrlTool);
    this.register(readFileTool);
    this.register(writeFileTool);
    this.register(executeCodeTool);
    this.register(searchKnowledgeTool);
  }

  /**
   * Register a new tool definition.
   */
  public static register(tool: RegisteredTool): void {
    this.registeredTools.set(tool.id, tool);
  }

  /**
   * Retrieve a tool by its unique ID.
   */
  public static get(toolId: string): RegisteredTool | undefined {
    this.init();
    return this.registeredTools.get(toolId);
  }

  /**
   * Retrieve all registered tools.
   */
  public static getAll(): RegisteredTool[] {
    this.init();
    return Array.from(this.registeredTools.values());
  }

  /**
   * Synchronizes all registered in-memory tools into PostgreSQL 'tools' catalog table.
   * Ensures the database catalog matches our codebase.
   */
  public static async syncCatalogToDatabase(): Promise<void> {
    this.init();

    for (const tool of this.registeredTools.values()) {
      await db
        .insert(dbTools)
        .values({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          inputSchema: tool.parameters,
          executionType: tool.executionType,
          permissionLevel: tool.permissionLevel,
          requiresApproval: tool.requiresApproval,
        })
        .onConflictDoUpdate({
          target: dbTools.id,
          set: {
            name: tool.name,
            description: tool.description,
            inputSchema: tool.parameters,
            executionType: tool.executionType,
            permissionLevel: tool.permissionLevel,
            requiresApproval: tool.requiresApproval,
          },
        });
    }
  }

  /**
   * Fetches active enabled tools for an agent from PostgreSQL and converts them
   * into ExecutableTools ready for AgentRunner.
   */
  public static async getActiveToolsForAgent(
    agentId: string,
    context: ToolContext,
  ): Promise<ExecutableTool[]> {
    this.init();

    // Query active bindings from agent_tools junction table
    const bindings = await db
      .select({
        toolId: agentTools.toolId,
        configOverride: agentTools.configOverride,
      })
      .from(agentTools)
      .where(and(eq(agentTools.agentId, agentId), eq(agentTools.enabled, true)));

    const executableTools: ExecutableTool[] = [];

    for (const binding of bindings) {
      const tool = this.registeredTools.get(binding.toolId);
      if (!tool) continue;

      executableTools.push({
        name: tool.id, // AgentRunner matches tool calls via tool.name
        description: tool.description,
        parameters: tool.parameters,
        requiresApproval: tool.requiresApproval,
        execute: async (args: Record<string, unknown>) => {
          return tool.execute(args, context);
        },
      });
    }

    return executableTools;
  }
}

