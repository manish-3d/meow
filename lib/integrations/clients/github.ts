/**
 * GitHub REST API Client
 */

export interface GitHubCreateIssueParams {
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels?: string[];
}

export class GitHubClient {
  private token: string;

  constructor(creds: Record<string, unknown>) {
    this.token = String(creds.personalAccessToken || creds.accessToken || "");
  }

  public async createIssue(params: GitHubCreateIssueParams) {
    if (!this.token) {
      throw new Error("GitHub Personal Access Token is required.");
    }

    const res = await fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Meow-Agent-OS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: params.title,
        body: params.body,
        labels: params.labels,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GitHub issue creation failed (HTTP ${res.status}): ${err}`);
    }

    const json = await res.json();
    return {
      success: true,
      issueNumber: json.number,
      htmlUrl: json.html_url,
      title: json.title,
    };
  }

  public async getRepo(owner: string, repo: string) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : "",
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Meow-Agent-OS",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch repo ${owner}/${repo}: HTTP ${res.status}`);
    }

    const json = await res.json();
    return {
      fullName: json.full_name,
      description: json.description,
      stars: json.stargazers_count,
      openIssues: json.open_issues_count,
      defaultBranch: json.default_branch,
    };
  }
}

