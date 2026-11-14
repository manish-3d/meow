/**
 * Reddit Agent Tools
 */

import { RegisteredTool } from "../types";
import { IntegrationsService } from "@/lib/integrations/service";

export const redditSubmitPostTool: RegisteredTool = {
  id: "reddit_submit_post",
  name: "Submit Post to Reddit",
  description: "Submits a new text discussion post to a specified subreddit.",
  permissionLevel: "dangerous",
  executionType: "integration",
  requiresApproval: true,
  parameters: {
    type: "object",
    properties: {
      subreddit: {
        type: "string",
        description: "The subreddit name to post in (e.g. 'technology', 'artificial', 'startups').",
      },
      title: {
        type: "string",
        description: "The title of the Reddit post.",
      },
      text: {
        type: "string",
        description: "The body content/markdown of the post.",
      },
    },
    required: ["subreddit", "title", "text"],
  },
  async execute(args, context) {
    const subreddit = String(args.subreddit || "").trim();
    const title = String(args.title || "").trim();
    const text = String(args.text || "").trim();

    if (!subreddit || !title) {
      return { error: "Both subreddit and title are required." };
    }

    try {
      const client = await IntegrationsService.getClient(context.workspaceId, "reddit");
      const result = await client.submitPost({ subreddit, title, text });
      return {
        message: `Post submitted to r/${subreddit}!`,
        ...result,
      };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};

export const redditSearchPostsTool: RegisteredTool = {
  id: "reddit_search_posts",
  name: "Search Reddit Posts",
  description: "Searches Reddit posts within a specific subreddit or across Reddit for topics and discussions.",
  permissionLevel: "read",
  executionType: "integration",
  requiresApproval: false,
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query (e.g. 'best AI tools', 'Next.js 15 tips').",
      },
      subreddit: {
        type: "string",
        description: "Optional subreddit to restrict search (e.g. 'technology'). Defaults to 'all'.",
      },
      limit: {
        type: "number",
        description: "Maximum number of posts to return (default: 10).",
      },
    },
    required: ["query"],
  },
  async execute(args, context) {
    const query = String(args.query || "").trim();
    if (!query) return { error: "Search query is required." };

    try {
      const client = await IntegrationsService.getClient(context.workspaceId, "reddit");
      const posts = await client.searchPosts({
        query,
        subreddit: args.subreddit ? String(args.subreddit) : undefined,
        limit: Number(args.limit) || 10,
      });
      return {
        query,
        count: posts.length,
        posts,
      };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};
