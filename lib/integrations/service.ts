/**
 * Meow Workspace Integrations Service
 */

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  workspaceIntegrations,
  type IntegrationProvider,
  type WorkspaceIntegration,
} from "@/db/schema";
import { logAction } from "@/lib/audit";
import { SUPPORTED_INTEGRATIONS } from "./types";
import { TwitterClient } from "./clients/twitter";
import { RedditClient } from "./clients/reddit";
import { InstagramClient } from "./clients/instagram";
import { GitHubClient } from "./clients/github";

export class IntegrationsService {
  /**
   * Retrieves all integrations configured for a workspace, masking sensitive keys.
   */
  public static async listWorkspaceIntegrations(workspaceId: string) {
    const rows = await db
      .select()
      .from(workspaceIntegrations)
      .where(eq(workspaceIntegrations.workspaceId, workspaceId));

    const connectedMap = new Map(rows.map((r) => [r.provider, r]));

    // Return status for all supported integrations
    return (Object.keys(SUPPORTED_INTEGRATIONS) as IntegrationProvider[]).map((prov) => {
      const manifest = SUPPORTED_INTEGRATIONS[prov];
      const record = connectedMap.get(prov);

      return {
        provider: prov,
        name: manifest.name,
        category: manifest.category,
        description: manifest.description,
        icon: manifest.icon,
        capabilities: manifest.capabilities,
        fields: manifest.fields,
        isConnected: Boolean(record && record.status === "connected"),
        status: record?.status ?? "disconnected",
        accountHandle: record?.accountHandle ?? null,
        accountName: record?.accountName ?? null,
        updatedAt: record?.updatedAt ?? null,
      };
    });
  }

  /**
   * Retrieves raw credentials for a specific provider in a workspace.
   */
  public static async getIntegration(
    workspaceId: string,
    provider: IntegrationProvider,
  ): Promise<WorkspaceIntegration | null> {
    const [record] = await db
      .select()
      .from(workspaceIntegrations)
      .where(
        and(
          eq(workspaceIntegrations.workspaceId, workspaceId),
          eq(workspaceIntegrations.provider, provider),
        ),
      )
      .limit(1);

    return record || null;
  }

  /**
   * Connects or updates a workspace integration.
   */
  public static async connectIntegration(params: {
    workspaceId: string;
    userId: string;
    provider: IntegrationProvider;
    credentials: Record<string, unknown>;
    accountHandle?: string;
    accountName?: string;
    metadata?: Record<string, unknown>;
  }): Promise<WorkspaceIntegration> {
    const now = new Date();

    const [saved] = await db
      .insert(workspaceIntegrations)
      .values({
        workspaceId: params.workspaceId,
        provider: params.provider,
        status: "connected",
        credentials: params.credentials,
        accountHandle: params.accountHandle || null,
        accountName: params.accountName || null,
        metadata: params.metadata || {},
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [workspaceIntegrations.workspaceId, workspaceIntegrations.provider],
        set: {
          status: "connected",
          credentials: params.credentials,
          accountHandle: params.accountHandle || null,
          accountName: params.accountName || null,
          metadata: params.metadata || {},
          updatedAt: now,
        },
      })
      .returning();

    await logAction({
      workspaceId: params.workspaceId,
      userId: params.userId,
      action: "integration_connected",
      targetType: "integration",
      targetId: params.provider,
      details: {
        provider: params.provider,
        accountHandle: params.accountHandle,
      },
    });

    return saved;
  }

  /**
   * Disconnects and removes integration credentials for a provider.
   */
  public static async disconnectIntegration(
    workspaceId: string,
    userId: string,
    provider: IntegrationProvider,
  ): Promise<boolean> {
    const deleted = await db
      .delete(workspaceIntegrations)
      .where(
        and(
          eq(workspaceIntegrations.workspaceId, workspaceId),
          eq(workspaceIntegrations.provider, provider),
        ),
      )
      .returning();

    if (deleted.length > 0) {
      await logAction({
        workspaceId,
        userId,
        action: "integration_disconnected",
        targetType: "integration",
        targetId: provider,
        details: { provider },
      });
      return true;
    }

    return false;
  }

  /**
   * Creates an authenticated client instance for a provider.
   */
  public static async getClient(workspaceId: string, provider: "twitter"): Promise<TwitterClient>;
  public static async getClient(workspaceId: string, provider: "reddit"): Promise<RedditClient>;
  public static async getClient(workspaceId: string, provider: "instagram"): Promise<InstagramClient>;
  public static async getClient(workspaceId: string, provider: "github"): Promise<GitHubClient>;
  public static async getClient(workspaceId: string, provider: IntegrationProvider): Promise<any> {
    const integration = await this.getIntegration(workspaceId, provider);
    if (!integration || integration.status !== "connected") {
      throw new Error(`Integration for '${provider}' is not connected in this workspace.`);
    }

    switch (provider) {
      case "twitter":
        return new TwitterClient(integration.credentials);
      case "reddit":
        return new RedditClient(integration.credentials);
      case "instagram":
        return new InstagramClient(integration.credentials);
      case "github":
        return new GitHubClient(integration.credentials);
      default:
        throw new Error(`Unsupported provider client: ${provider}`);
    }
  }
}
