/**
 * Twitter / X API v2 Client
 */

export interface TwitterPostTweetParams {
  text: string;
}

export interface TwitterSearchParams {
  query: string;
  maxResults?: number;
}

export class TwitterClient {
  private bearerToken: string;
  private apiKey?: string;
  private apiSecret?: string;
  private accessToken?: string;
  private accessSecret?: string;

  constructor(creds: Record<string, unknown>) {
    this.bearerToken = String(creds.bearerToken || creds.accessToken || "");
    this.apiKey = creds.apiKey ? String(creds.apiKey) : undefined;
    this.apiSecret = creds.apiSecret ? String(creds.apiSecret) : undefined;
    this.accessToken = creds.accessToken ? String(creds.accessToken) : undefined;
    this.accessSecret = creds.accessSecret ? String(creds.accessSecret) : undefined;
  }

  /**
   * Search recent tweets for a topic, keyword, or hashtag.
   */
  public async searchRecent(params: TwitterSearchParams) {
    if (!this.bearerToken) {
      throw new Error("Twitter Bearer Token is required for search queries.");
    }

    const url = new URL("https://api.twitter.com/2/tweets/search/recent");
    url.searchParams.set("query", params.query);
    url.searchParams.set("max_results", String(Math.min(50, Math.max(10, params.maxResults || 10))));
    url.searchParams.set("tweet.fields", "created_at,public_metrics,author_id");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Twitter search failed (HTTP ${res.status}): ${errText}`);
    }

    return await res.json();
  }

  /**
   * Publishes a new tweet to the connected Twitter / X account.
   */
  public async postTweet(params: TwitterPostTweetParams) {
    if (!this.bearerToken && !this.accessToken) {
      throw new Error("Twitter Access Token or Bearer Token required to post.");
    }

    const token = this.accessToken || this.bearerToken;

    const res = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: params.text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Twitter tweet failed (HTTP ${res.status}): ${errText}`);
    }

    const json = await res.json();
    return {
      id: json.data?.id,
      text: json.data?.text || params.text,
      url: json.data?.id ? `https://x.com/i/status/${json.data.id}` : undefined,
    };
  }
}
