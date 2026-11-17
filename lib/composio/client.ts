import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const apiKey = process.env.COMPOSIO_API_KEY || "";

if (!apiKey) {
  console.warn("⚠️ Warning: COMPOSIO_API_KEY is not set in environment");
}

export const composio = new Composio({
  apiKey,
  provider: new VercelProvider(),
});

/**
 * Initiates an OAuth or API Key connection link for a specific toolkit
 */
export async function initiateToolConnection(userId: string, toolkitSlug: string, callbackUrl: string) {
  const normalizedSlug = toolkitSlug.toLowerCase();

  // 1. Find or create an auth config for this toolkit
  const authConfigList = await composio.authConfigs.list({ toolkit: normalizedSlug });
  let authConfigId = authConfigList.items[0]?.id;

  if (!authConfigId) {
    try {
      const createdConfig = await composio.authConfigs.create(normalizedSlug, {
        type: "use_composio_managed_auth",
        name: `${toolkitSlug} OAuth Config`,
      });
      authConfigId = createdConfig.id;
    } catch (createErr: any) {
      if (normalizedSlug === "twitter") {
        throw new Error(
          "Twitter (X) requires custom developer credentials (Client ID & Secret) in your Composio dashboard because Twitter's API does not permit third-party shared OAuth apps. Alternatively, your agent can browse and post on Twitter directly via its Cloud VM Desktop browser in Chapter 17!"
        );
      }
      throw createErr;
    }
  }

  // 2. Generate the redirect link for the user
  const linkResponse = await composio.connectedAccounts.link(userId, authConfigId, {
    callbackUrl,
  });

  return {
    redirectUrl: linkResponse.redirectUrl,
    connectionId: linkResponse.id,
  };
}

/**
 * Retrieves the list of active connected toolkits for a user
 */
export async function getActiveUserConnections(userId: string): Promise<Set<string>> {
  try {
    const list = await composio.connectedAccounts.list({
      userIds: [userId],
    });

    const activeSlugs = new Set<string>();

    for (const item of list.items) {
      if (item.status === "ACTIVE" && item.toolkit?.slug) {
        activeSlugs.add(item.toolkit.slug.toUpperCase());
      }
    }

    return activeSlugs;
  } catch (error) {
    console.error("Error fetching active Composio connections:", error);
    return new Set<string>();
  }
}

/**
 * Disconnects and revokes an active tool connection for a user
 */
export async function disconnectUserConnection(userId: string, toolkitSlug: string): Promise<boolean> {
  try {
    const list = await composio.connectedAccounts.list({
      userIds: [userId],
    });

    const targetSlug = toolkitSlug.toLowerCase();
    let disconnectedAny = false;

    for (const item of list.items) {
      if (item.toolkit?.slug?.toLowerCase() === targetSlug && item.id) {
        try {
          await composio.connectedAccounts.delete(item.id);
          disconnectedAny = true;
        } catch (delErr) {
          console.warn(`Could not delete account ${item.id}:`, delErr);
        }
      }
    }

    return disconnectedAny;
  } catch (error) {
    console.error("Error disconnecting Composio connection:", error);
    throw error;
  }
}
