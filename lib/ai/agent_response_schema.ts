import { z } from "zod";

/**
 * Routine Schedule Schema — defining frequency, execution time, and tool dependencies
 */
export const routineSchema = z.object({
  name: z.string().describe("Concise, human-readable title for the routine (e.g. Daily Email Summary & Slack Alert)"),
  goal: z.string().describe("Clear, high-level business objective of this routine"),
  instruction: z.string().describe("Detailed, step-by-step autonomous instruction for the background execution runner"),
  frequency: z.enum(["once", "daily", "weekly", "monthly"]).default("daily").describe("Execution frequency"),
  scheduledTime: z.string().default("08:00 AM UTC").describe("Scheduled time of day (e.g. 08:00 AM UTC)"),
  timezone: z.string().default("UTC").describe("Target timezone for execution"),
  tools: z.array(z.string()).describe("List of tool slugs required to execute this routine (e.g. ['gmail', 'slack'])"),
});

/**
 * Top-level Agent Response Schema
 * - message: general conversational response or direct answer
 * - clarification: follow-up question when user automation intent lacks specific parameters
 * - routine: fully structured routine proposal ready for user confirmation and creation
 */
export const agentResponseSchema = z.object({
  type: z.enum(["message", "clarification", "routine"]).describe("The category of the response"),
  content: z.string().describe("Text explanation, conversational answer, or clarification question"),
  routine: routineSchema.optional().describe("Structured routine details when type is 'routine'"),
  suggestedTools: z.array(z.string()).optional().describe("Tools suggested for connection if needed"),
});

export type RoutineSchemaType = z.infer<typeof routineSchema>;
export type AgentResponseSchemaType = z.infer<typeof agentResponseSchema>;
