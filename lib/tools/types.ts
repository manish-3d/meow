/**
 * Meow Tool System Contracts & Types
 *
 * Defines the execution interfaces, permission tiers, and context
 * shapes for all built-in and third-party tools.
 */

import { PermissionLevel, ToolExecutionType } from "@/db/schema";

export interface ToolContext {
  workspaceId: string;
  userId?: string;
  agentId?: string;
  conversationId?: string;
  credentials?: Record<string, string>;
}

export interface RegisteredTool {
  /** Unique programmatic identifier (e.g. 'web_search', 'read_file') */
  id: string;

  /** Human-readable display name */
  name: string;

  /** Comprehensive functional description for LLM reasoning */
  description: string;

  /** Standard JSON Schema parameter declarations */
  parameters: Record<string, unknown>;

  /** Security clearance level: 'read' | 'write' | 'dangerous' */
  permissionLevel: PermissionLevel;

  /** Execution runtime target: 'native' | 'integration' | 'sandbox' */
  executionType: ToolExecutionType;

  /** Whether execution must halt for explicit human approval */
  requiresApproval: boolean;

  /** The core execution handler */
  execute: (
    args: Record<string, unknown>,
    context: ToolContext,
  ) => Promise<Record<string, unknown> | string>;
}

