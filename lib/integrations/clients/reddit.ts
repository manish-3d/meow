/**
 * Reddit API Client (OAuth Script App)
 */

export interface RedditSubmitPostParams {
  subreddit: string;
  title: string;
  text: string;
}

export interface RedditSearchParams {
  subreddit?: string;
  query: string;
  limit?: number;
}

export class RedditClient {
  private clientId: string;
  private clientSecret: string;
  private username?: string;
  private password?: string;
  private cachedToken?: string;
  private tokenExpiry: number = 0;

  constructor(creds: Record<string, unknown>) {
    this.clientId = String(creds.clientId || "");
    this.clientSecret = String(creds.clientSecret || "");
    this.username = creds.username ? String(creds.username) : undefined;
    this.password = creds.password ? String(creds.password) : undefined;
  }

  /**
   * Acquires or reuses an OAuth access token from Reddit.
   */
  private async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiry) {
      return this.cachedToken;
    }

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const body = new URLSearchParams();

    if (this.username && this.password) {
      body.set("grant_type", "password");
      body.set("username", this.username);
      body.set("password", this.password);
    } else {
      body.set("grant_type", "client_credentials");
    }

    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "MeowBot/1.0.0 (by /u/meow_agent)",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Reddit auth failed (HTTP ${res.status}): ${err}`);
    }

    const json = await res.json();
    this.cachedToken = json.access_token;
    this.tokenExpiry = Date.now() + (json.expires_in - 60) * 1000;
    return this.cachedToken!;
  }

  /**
   * Search Reddit posts in a subreddit or globally.
   */
  public async searchPosts(params: RedditSearchParams) {
    const token = await this.getAccessToken();
    const sub = params.subreddit?.replace(/^r\//, "") || "all";
    const url = new URL(`https://oauth.reddit.com/r/${sub}/search`);
    url.searchParams.set("q", params.query);
    url.searchParams.set("limit", String(params.limit || 10));
    url.searchParams.set("sort", "relevance");
    url.searchParams.set("restrict_sr", sub === "all" ? "false" : "true");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "MeowBot/1.0.0 (by /u/meow_agent)",
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Reddit search error (HTTP ${res.status}): ${err}`);
    }

    const json = await res.json();
    const children = json.data?.children || [];
    return children.map((item: any) => ({
      id: item.data.id,
      title: item.data.title,
      author: item.data.author,
      subreddit: item.data.subreddit,
      score: item.data.score,
      numComments: item.data.num_comments,
      url: `https://reddit.com${item.data.permalink}`,
      selftext: item.data.selftext?.slice(0, 300) || "",
    }));
  }

  /**
   * Submits a self-text post to a specified subreddit.
   */
  public async submitPost(params: RedditSubmitPostParams) {
    const token = await this.getAccessToken();
    const sub = params.subreddit.replace(/^r\//, "");

    const body = new URLSearchParams({
      api_type: "json",
      kind: "self",
      sr: sub,
      title: params.title,
      text: params.text,
    });

    const res = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "MeowBot/1.0.0 (by /u/meow_agent)",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Reddit post submission failed (HTTP ${res.status}): ${err}`);
    }

    const json = await res.json();
    const postData = json.json?.data;
    return {
      success: true,
      url: postData?.url || `https://reddit.com/r/${sub}`,
      id: postData?.id,
    };
  }
}

