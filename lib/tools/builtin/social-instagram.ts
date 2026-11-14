/**
 * Instagram Agent Tools
 */

import { RegisteredTool } from "../types";
import { IntegrationsService } from "@/lib/integrations/service";

export const instagramPublishPostTool: RegisteredTool = {
  id: "instagram_publish_post",
  name: "Publish to Instagram",
  description: "Publishes a photo with a caption to the connected Instagram Business account.",
  permissionLevel: "dangerous",
  executionType: "integration",
  requiresApproval: true,
  parameters: {
    type: "object",
    properties: {
      caption: {
        type: "string",
        description: "The caption text for the Instagram post, including hashtags.",
      },
      imageUrl: {
        type: "string",
        description: "Publicly accessible HTTPS image URL to publish.",
      },
    },
    required: ["caption", "imageUrl"],
  },
  async execute(args, context) {
    const caption = String(args.caption || "").trim();
    const imageUrl = String(args.imageUrl || "").trim();

    if (!caption || !imageUrl) {
      return { error: "Both caption and imageUrl are required." };
    }

    try {
      const client = await IntegrationsService.getClient(context.workspaceId, "instagram");
      const result = await client.publishPhoto({ caption, imageUrl });
      return {
        message: "Instagram post published successfully!",
        ...result,
      };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};
