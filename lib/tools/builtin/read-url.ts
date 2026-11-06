import { RegisteredTool } from "../types";

export const readUrlTool: RegisteredTool = {
  id: "read_url",
  name: "Read Webpage",
  description:
    "Fetches a public web page and extracts its readable text and content as Markdown.",
  permissionLevel: "read",
  executionType: "native",
  requiresApproval: false,
  parameters: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "The complete HTTP or HTTPS URL to read.",
      },
    },
    required: ["url"],
  },
  async execute(args) {
    const rawUrl = String(args.url || "").trim();

    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Only http and https protocols are supported." };
      }

      const response = await fetch(parsed.toString(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MeowBot/1.0; +https://meow.local)",
        },
      });

      if (!response.ok) {
        return {
          url: rawUrl,
          statusCode: response.status,
          error: `Failed to fetch URL. HTTP status: ${response.status}`,
        };
      }

      const html = await response.text();

      // Extract <title>
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : parsed.hostname;

      // Clean HTML: Remove scripts, styles, svg, and tags
      let cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
        .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
        .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
        .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
        .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
        .replace(/<h1[^>]*>/gi, "\n\n# ")
        .replace(/<h2[^>]*>/gi, "\n\n## ")
        .replace(/<h3[^>]*>/gi, "\n\n### ")
        .replace(/<p[^>]*>/gi, "\n\n")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/<li[^>]*>/gi, "\n• ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      // Truncate to maximum 8,000 characters to prevent prompt context bloating
      const maxChars = 8000;
      const isTruncated = cleanText.length > maxChars;
      if (isTruncated) {
        cleanText = cleanText.slice(0, maxChars) + "\n\n...[Content truncated for token safety]...";
      }

      return {
        url: rawUrl,
        title,
        statusCode: response.status,
        characterCount: cleanText.length,
        isTruncated,
        content: cleanText,
      };
    } catch (err: unknown) {
      return {
        url: rawUrl,
        error: `URL fetching error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  },
};

