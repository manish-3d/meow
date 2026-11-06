import vm from "vm";
import { RegisteredTool } from "../types";

export const executeCodeTool: RegisteredTool = {
  id: "execute_code",
  name: "Execute Code",
  description:
    "Executes an isolated JavaScript or data-processing script in a secure sandbox. Dangerous: Requires user approval before execution.",
  permissionLevel: "dangerous",
  executionType: "sandbox",
  requiresApproval: true,
  parameters: {
    type: "object",
    properties: {
      language: {
        type: "string",
        enum: ["javascript"],
        description: "Programming language to execute (currently supporting 'javascript').",
        default: "javascript",
      },
      code: {
        type: "string",
        description: "The JavaScript code to execute.",
      },
      timeoutMs: {
        type: "integer",
        description: "Execution timeout in milliseconds (default 5000ms, max 10000ms).",
        default: 5000,
      },
    },
    required: ["code"],
  },
  async execute(args) {
    const code = String(args.code || "").trim();
    const timeoutMs = Math.min(Number(args.timeoutMs) || 5000, 10000);

    if (!code) {
      return { error: "Code snippet is required" };
    }

    const logs: string[] = [];
    const sandbox = {
      console: {
        log: (...msgs: unknown[]) =>
          logs.push(msgs.map((m) => (typeof m === "object" ? JSON.stringify(m) : String(m))).join(" ")),
        error: (...msgs: unknown[]) =>
          logs.push("[ERROR] " + msgs.map((m) => (typeof m === "object" ? JSON.stringify(m) : String(m))).join(" ")),
        warn: (...msgs: unknown[]) =>
          logs.push("[WARN] " + msgs.map((m) => (typeof m === "object" ? JSON.stringify(m) : String(m))).join(" ")),
      },
      Math,
      Date,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      Array,
      Object,
      String,
      Number,
      Boolean,
    };

    const startTime = Date.now();
    try {
      const context = vm.createContext(sandbox);
      const script = new vm.Script(code);

      const result = script.runInContext(context, {
        timeout: timeoutMs,
      });

      const executionDurationMs = Date.now() - startTime;

      return {
        success: true,
        executionDurationMs,
        result: result !== undefined ? (typeof result === "object" ? result : String(result)) : null,
        logs: logs.length > 0 ? logs : undefined,
      };
    } catch (err: unknown) {
      const executionDurationMs = Date.now() - startTime;
      return {
        success: false,
        executionDurationMs,
        error: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
        logs: logs.length > 0 ? logs : undefined,
      };
    }
  },
};

