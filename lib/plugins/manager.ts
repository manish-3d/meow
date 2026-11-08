import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  pluginManifests,
  workspacePlugins,
  type PluginManifest,
  type WorkspacePlugin,
} from "@/db/schema";
import { logAction } from "@/lib/audit";

export interface MarketplacePlugin {
  pluginId: string;
  name: string;
  description: string;
  version: string;
  category: "productivity" | "developer" | "integrations" | "analytics";
  author: string;
  requiredPermissions: string[];
}

export const BUILTIN_MARKETPLACE: MarketplacePlugin[] = [
  {
    pluginId: "google-workspace",
    name: "Google Workspace",
    description: "Read, draft, and inspect Google Docs, Sheets, and Calendar events directly in chat.",
    version: "1.2.0",
    category: "productivity",
    author: "Google",
    requiredPermissions: ["manage_plugins"],
  },
  {
    pluginId: "github-integration",
    name: "GitHub Automation",
    description: "Create issues, review pull request diffs, and inspect commit histories autonomously.",
    version: "2.0.1",
    category: "developer",
    author: "Meow Partners",
    requiredPermissions: ["manage_plugins"],
  },
  {
    pluginId: "slack-notifier",
    name: "Slack Alert Dispatcher",
    description: "Send operational summaries, agent task notifications, and approval pings to Slack channels.",
    version: "1.0.4",
    category: "integrations",
    author: "Meow Community",
    requiredPermissions: ["manage_plugins"],
  },
  {
    pluginId: "python-sandbox",
    name: "Python 3.12 Isolated Sandbox",
    description: "Execute scientific Python, Pandas dataframe transformations, and visualization scripts safely.",
    version: "1.1.0",
    category: "developer",
    author: "Meow Labs",
    requiredPermissions: ["manage_plugins", "execute_code"],
  },
];

export class PluginManager {
  /**
   * Initializes default plugin manifests in the database if not already seeded.
   */
  public static async syncMarketplaceCatalog(): Promise<void> {
    for (const item of BUILTIN_MARKETPLACE) {
      await db
        .insert(pluginManifests)
        .values({
          pluginId: item.pluginId,
          name: item.name,
          description: item.description,
          version: item.version,
          category: item.category,
          manifest: {
            author: item.author,
            requiredPermissions: item.requiredPermissions,
          },
        })
        .onConflictDoUpdate({
          target: pluginManifests.pluginId,
          set: {
            name: item.name,
            description: item.description,
            version: item.version,
            category: item.category,
            manifest: {
              author: item.author,
              requiredPermissions: item.requiredPermissions,
            },
          },
        });
    }
  }

  /**
   * Returns the available marketplace catalog.
   */
  public static async getMarketplace(): Promise<PluginManifest[]> {
    await this.syncMarketplaceCatalog();
    return await db.select().from(pluginManifests);
  }

  /**
   * Returns all plugins installed in the given workspace.
   */
  public static async getInstalledPlugins(workspaceId: string): Promise<
    Array<{
      plugin: WorkspacePlugin;
      manifest: PluginManifest | null;
    }>
  > {
    await this.syncMarketplaceCatalog();

    const installed = await db
      .select()
      .from(workspacePlugins)
      .where(eq(workspacePlugins.workspaceId, workspaceId));

    const manifests = await db.select().from(pluginManifests);
    const manifestMap = new Map(manifests.map((m) => [m.pluginId, m]));

    return installed.map((plugin) => ({
      plugin,
      manifest: manifestMap.get(plugin.pluginId) ?? null,
    }));
  }

  /**
   * Installs a marketplace plugin into a workspace.
   */
  public static async installPlugin(
    workspaceId: string,
    userId: string,
    pluginId: string,
    config: Record<string, unknown> = {},
  ): Promise<WorkspacePlugin> {
    await this.syncMarketplaceCatalog();

    // Check if plugin exists in catalog
    const [manifest] = await db
      .select()
      .from(pluginManifests)
      .where(eq(pluginManifests.pluginId, pluginId))
      .limit(1);

    if (!manifest) {
      throw new Error(`Plugin '${pluginId}' not found in marketplace catalog`);
    }

    const [installed] = await db
      .insert(workspacePlugins)
      .values({
        workspaceId,
        pluginId,
        enabled: true,
        config,
      })
      .onConflictDoUpdate({
        target: [workspacePlugins.workspaceId, workspacePlugins.pluginId],
        set: {
          enabled: true,
          config,
          updatedAt: new Date(),
        },
      })
      .returning();

    await logAction({
      workspaceId,
      userId,
      action: "plugin_installed",
      targetType: "plugin",
      targetId: pluginId,
      details: { pluginId, name: manifest.name },
    });

    return installed;
  }

  /**
   * Toggles the enabled state of an installed plugin.
   */
  public static async setPluginEnabled(
    workspaceId: string,
    userId: string,
    pluginId: string,
    enabled: boolean,
  ): Promise<WorkspacePlugin> {
    const [updated] = await db
      .update(workspacePlugins)
      .set({
        enabled,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(workspacePlugins.workspaceId, workspaceId),
          eq(workspacePlugins.pluginId, pluginId),
        ),
      )
      .returning();

    if (!updated) {
      throw new Error(`Plugin '${pluginId}' is not installed in workspace`);
    }

    await logAction({
      workspaceId,
      userId,
      action: enabled ? "plugin_enabled" : "plugin_disabled",
      targetType: "plugin",
      targetId: pluginId,
      details: { pluginId, enabled },
    });

    return updated;
  }

  /**
   * Uninstalls a plugin from a workspace.
   */
  public static async uninstallPlugin(
    workspaceId: string,
    userId: string,
    pluginId: string,
  ): Promise<boolean> {
    const deleted = await db
      .delete(workspacePlugins)
      .where(
        and(
          eq(workspacePlugins.workspaceId, workspaceId),
          eq(workspacePlugins.pluginId, pluginId),
        ),
      )
      .returning();

    if (deleted.length > 0) {
      await logAction({
        workspaceId,
        userId,
        action: "plugin_uninstalled",
        targetType: "plugin",
        targetId: pluginId,
        details: { pluginId },
      });
      return true;
    }

    return false;
  }
}

