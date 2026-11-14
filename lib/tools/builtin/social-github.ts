/**
 * GitHub Agent Tools
 */

import { RegisteredTool } from "../types";
import { IntegrationsService } from "@/lib/integrations/service";

export const githubCreateIssueTool: RegisteredTool = {
  id: "github_create_issue",
  name: "Create GitHub Issue",
  description: "Creates a new issue in a GitHub repository.",
  permissionLevel: "dangerous",
  executionType: "integration",
  requiresApproval: true,
  parameters: {
    type: "object",
    properties: {
      owner: {
        type: "string",
        description: "The repository owner or organization (e.g. 'octocat').",
      },
      repo: {
        type: "string",
        description: "The repository name (e.g. 'hello-world').",
      },
      title: {
        type: "string",
        description: "Issue title.",
      },
      body: {
        type: "string",
        description: "Issue markdown description.",
      },
    },
    required: ["owner", "repo", "title", "body"],
  },
  async execute(args, context) {
    const owner = String(args.owner || "").trim();
    const repo = String(args.repo || "").trim();
    const title = String(args.title || "").trim();
    const body = String(args.body || "").trim();

    if (!owner || !repo || !title) {
      return { error: "owner, repo, and title are required." };
    }

    try {
      const client = await IntegrationsService.getClient(context.workspaceId, "github");
      const result = await client.createIssue({ owner, repo, title, body });
      return {
        message: `Issue #${result.issueNumber} created!`,
        ...result,
      };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};

export const githubGetRepoTool: RegisteredTool = {
  id: "github_get_repo",
  name: "Get GitHub Repo Details",
  description: "Inspects metadata, star count, and open issues for a GitHub repository.",
  permissionLevel: "read",
  executionType: "integration",
  requiresApproval: false,
  parameters: {
    type: "object",
    properties: {
      owner: {
        type: "string",
        description: "The repository owner.",
      },
      repo: {
        type: "string",
        description: "The repository name.",
      },
    },
    required: ["owner", "repo"],
  },
  async execute(args, context) {
    const owner = String(args.owner || "").trim();
    const repo = String(args.repo || "").trim();

    try {
      const client = await IntegrationsService.getClient(context.workspaceId, "github");
      return await client.getRepo(owner, repo);
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};
