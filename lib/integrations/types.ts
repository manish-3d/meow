/**
 * Meow Workspace Integrations - Social Media & Platform Types
 */

import { IntegrationProvider } from "@/db/schema";

export interface IntegrationManifest {
  provider: IntegrationProvider;
  name: string;
  category: "social" | "developer" | "productivity";
  description: string;
  icon: string;
  fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "password";
    required: boolean;
    helperText?: string;
  }>;
  capabilities: string[];
}

export const SUPPORTED_INTEGRATIONS: Record<IntegrationProvider, IntegrationManifest> = {
  twitter: {
    provider: "twitter",
    name: "Twitter / X",
    category: "social",
    description: "Post tweets, reply to threads, and search trending topics and hashtags autonomously.",
    icon: "Twitter",
    fields: [
      {
        key: "bearerToken",
        label: "API Bearer Token",
        placeholder: "AAAAAAAAAAAAAAAAAAAAA...",
        type: "password",
        required: true,
        helperText: "X Developer Portal App Bearer Token for v2 API access",
      },
      {
        key: "apiKey",
        label: "Consumer API Key",
        placeholder: "Consumer Key",
        type: "text",
        required: false,
      },
      {
        key: "apiSecret",
        label: "Consumer API Secret",
        placeholder: "Consumer Secret",
        type: "password",
        required: false,
      },
      {
        key: "accessToken",
        label: "User Access Token",
        placeholder: "User Access Token",
        type: "password",
        required: false,
      },
      {
        key: "accessSecret",
        label: "User Access Secret",
        placeholder: "User Access Secret",
        type: "password",
        required: false,
      },
    ],
    capabilities: [
      "twitter_post_tweet (Write - Requires Approval)",
      "twitter_search_recent (Read - Search keywords & hashtags)",
      "twitter_get_trends (Read - Live topics)",
    ],
  },
  instagram: {
    provider: "instagram",
    name: "Instagram (Meta)",
    category: "social",
    description: "Publish photo captions, schedule carousel posts, and read account engagement insights.",
    icon: "Instagram",
    fields: [
      {
        key: "accessToken",
        label: "Meta Graph Access Token",
        placeholder: "EAAG...",
        type: "password",
        required: true,
        helperText: "Long-lived Instagram Graph API Page access token",
      },
      {
        key: "instagramAccountId",
        label: "Instagram Business Account ID",
        placeholder: "17841400000000000",
        type: "text",
        required: true,
        helperText: "Instagram Business / Creator Account ID linked to your Facebook Page",
      },
    ],
    capabilities: [
      "instagram_publish_post (Write - Requires Approval)",
      "instagram_get_insights (Read - Engagement metrics)",
    ],
  },
  reddit: {
    provider: "reddit",
    name: "Reddit",
    category: "social",
    description: "Submit discussions to subreddits, query hot community posts, and monitor comment threads.",
    icon: "MessageSquare",
    fields: [
      {
        key: "clientId",
        label: "Reddit App Client ID",
        placeholder: "Script App ID",
        type: "text",
        required: true,
      },
      {
        key: "clientSecret",
        label: "Reddit App Client Secret",
        placeholder: "Secret key",
        type: "password",
        required: true,
      },
      {
        key: "username",
        label: "Reddit Username",
        placeholder: "u/your_bot_name",
        type: "text",
        required: true,
      },
      {
        key: "password",
        label: "Reddit Password",
        placeholder: "Account password",
        type: "password",
        required: true,
      },
    ],
    capabilities: [
      "reddit_submit_post (Write - Requires Approval)",
      "reddit_search_posts (Read - Subreddit search)",
      "reddit_get_hot (Read - Top community trends)",
    ],
  },
  github: {
    provider: "github",
    name: "GitHub",
    category: "developer",
    description: "Manage repositories, create issues, review pull request diffs, and inspect commits.",
    icon: "Github",
    fields: [
      {
        key: "personalAccessToken",
        label: "Personal Access Token (PAT)",
        placeholder: "ghp_...",
        type: "password",
        required: true,
        helperText: "GitHub Fine-Grained or Classic Token with repo & issue permissions",
      },
    ],
    capabilities: [
      "github_create_issue (Write - Requires Approval)",
      "github_list_prs (Read - Pull requests)",
      "github_get_repo (Read - Repository stats)",
    ],
  },
  linkedin: {
    provider: "linkedin",
    name: "LinkedIn",
    category: "social",
    description: "Share corporate articles, professional updates, and company page posts.",
    icon: "Linkedin",
    fields: [
      {
        key: "accessToken",
        label: "LinkedIn OAuth Access Token",
        placeholder: "AQV...",
        type: "password",
        required: true,
        helperText: "OAuth 2.0 token with w_member_social and r_basicprofile scopes",
      },
      {
        key: "personUrn",
        label: "Author Person URN",
        placeholder: "urn:li:person:abcdef",
        type: "text",
        required: false,
      },
    ],
    capabilities: [
      "linkedin_share_update (Write - Requires Approval)",
      "linkedin_get_profile (Read - Profile data)",
    ],
  },
};

