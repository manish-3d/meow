import fs from "fs/promises";
import path from "path";
import { RegisteredTool } from "../types";

/**
 * Validates and resolves a workspace-scoped sandboxed filepath.
 * Strictly prevents Path Traversal attacks (e.g. '../../etc/passwd').
 */
function resolveWorkspacePath(relativePath: string, workspaceId: string): string {
  const safeWorkspaceId = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const baseDir = path.resolve(process.cwd(), "storage", "workspaces", safeWorkspaceId);
  const targetPath = path.resolve(baseDir, relativePath);

  // Guard against path traversal
  if (!targetPath.startsWith(baseDir)) {
    throw new Error(
      `Access Denied: Path traversal detected. Target path '${relativePath}' resolves outside the authorized workspace sandbox.`,
    );
  }

  return targetPath;
}

export const readFileTool: RegisteredTool = {
  id: "read_file",
  name: "Read File",
  description:
    "Reads content from a file inside the authorized workspace sandboxed storage directory.",
  permissionLevel: "read",
  executionType: "sandbox",
  requiresApproval: false,
  parameters: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Relative file path within the workspace sandbox (e.g. 'docs/notes.txt').",
      },
    },
    required: ["filePath"],
  },
  async execute(args, context) {
    const rawPath = String(args.filePath || "").trim();
    if (!rawPath) return { error: "filePath is required" };

    try {
      const targetPath = resolveWorkspacePath(rawPath, context.workspaceId);
      const content = await fs.readFile(targetPath, "utf-8");
      const stats = await fs.stat(targetPath);

      return {
        path: rawPath,
        sizeBytes: stats.size,
        content,
      };
    } catch (err: unknown) {
      return {
        path: rawPath,
        error: `Failed to read file: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  },
};

export const writeFileTool: RegisteredTool = {
  id: "write_file",
  name: "Write File",
  description:
    "Creates or updates a file inside the authorized workspace sandboxed storage directory.",
  permissionLevel: "write",
  executionType: "sandbox",
  requiresApproval: false,
  parameters: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Relative file path within the workspace sandbox (e.g. 'reports/summary.md').",
      },
      content: {
        type: "string",
        description: "The text content to write to the file.",
      },
    },
    required: ["filePath", "content"],
  },
  async execute(args, context) {
    const rawPath = String(args.filePath || "").trim();
    const content = String(args.content ?? "");

    if (!rawPath) return { error: "filePath is required" };

    try {
      const targetPath = resolveWorkspacePath(rawPath, context.workspaceId);

      // Ensure parent directory exists
      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      await fs.writeFile(targetPath, content, "utf-8");
      const stats = await fs.stat(targetPath);

      return {
        success: true,
        path: rawPath,
        bytesWritten: stats.size,
      };
    } catch (err: unknown) {
      return {
        path: rawPath,
        error: `Failed to write file: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  },
};

