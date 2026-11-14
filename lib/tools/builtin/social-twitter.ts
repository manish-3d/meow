/**
 * Twitter / X Agent Tools
 */

import { RegisteredTool } from "../types";
import { IntegrationsService } from "@/lib/integrations/service";

export const twitterPostTweetTool: RegisteredTool = {
  id: "twitter_post_tweet",
  name: "Post to Twitter / X",
  description: "Publishes a new public tweet/post to the connected Twitter/X account.",
  permissionLevel: "dangerous",
  executionType: "integration",
  requiresApproval: true,
  parameters: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The exact content of the tweet to post (up to 280 characters).",
      },
    },
    required: ["text"],
  },
  async execute(args, context) {
    const text = String(args.text || "").trim();
    if (!text) return { error: "Tweet text is required." };

    try {
      const client = await IntegrationsService.getClient(context.workspaceId, "twitter");
      const result = await client.postTweet({ text });
      return {
        success: true,
        message: "Tweet posted successfully!",
        ...result,
      };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};

export const twitterSearchRecentTool: RegisteredTool = {
  id: "twitter_search_recent",
  name: "Search Twitter / X",
  description: "Searches recent public tweets for a specific topic, keyword, or hashtag.",
  permissionLevel: "read",
  executionType: "integration",
  requiresApproval: false,
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query, topic, or hashtag (e.g. '#AI', 'crypto', 'technology').",
      },
      maxResults: {
        type: "number",
        description: "Number of tweets to retrieve (default: 10, max: 20).",
      },
    },
    required: ["query"],
  },
  async execute(args, context) {
    const query = String(args.query || "").trim();
    if (!query) return { error: "Search query is required." };

    try {
      const client = await IntegrationsService.getClient(context.workspaceId, "twitter");
      const result = await client.searchRecent({
        query,
        maxResults: Number(args.maxResults) || 10,
      });
      return result;
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};
