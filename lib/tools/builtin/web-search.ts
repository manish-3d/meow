import { RegisteredTool } from "../types";

export const webSearchTool: RegisteredTool = {
  id: "web_search",
  name: "Web Search",
  description:
    "Searches the internet for real-time information, news, documentation, or facts.",
  permissionLevel: "read",
  executionType: "native",
  requiresApproval: false,
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query terms or question.",
      },
      maxResults: {
        type: "integer",
        description: "Maximum number of search results to return (default: 5).",
        default: 5,
      },
    },
    required: ["query"],
  },
  async execute(args) {
    const query = String(args.query || "").trim();
    const maxResults = typeof args.maxResults === "number" ? Math.min(args.maxResults, 10) : 5;

    if (!query) {
      return { error: "Search query cannot be empty" };
    }

    try {
      // Use DuckDuckGo Instant Answer API for live public queries
      const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const response = await fetch(endpoint, {
        headers: { "User-Agent": "MeowAgent/1.0" },
      });

      if (!response.ok) {
        return {
          query,
          results: [],
          notice: `Search engine returned status ${response.status}`,
        };
      }

      const data = await response.json();
      const results: Array<{ title: string; url: string; snippet: string }> = [];

      if (data.AbstractText) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL || "",
          snippet: data.AbstractText,
        });
      }

      if (Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics) {
          if (results.length >= maxResults) break;
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(" - ")[0] || "Related Result",
              url: topic.FirstURL,
              snippet: topic.Text,
            });
          }
        }
      }

      // If no instant answers were found, provide fallback structured acknowledgment
      if (results.length === 0) {
        results.push({
          title: `Web search for: ${query}`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          snippet: `Live search executed for query: "${query}". No direct instant answer found.`,
        });
      }

      return {
        query,
        count: results.length,
        results,
      };
    } catch (err: unknown) {
      return {
        query,
        error: `Search execution failed: ${err instanceof Error ? err.message : String(err)}`,
        results: [],
      };
    }
  },
};

