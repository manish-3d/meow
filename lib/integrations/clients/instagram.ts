/**
 * Instagram Graph API Client
 */

export interface InstagramPublishParams {
  caption: string;
  imageUrl: string;
}

export class InstagramClient {
  private accessToken: string;
  private instagramAccountId: string;

  constructor(creds: Record<string, unknown>) {
    this.accessToken = String(creds.accessToken || "");
    this.instagramAccountId = String(creds.instagramAccountId || "");
  }

  /**
   * Publishes a photo post with caption to Instagram Business Account via Graph API.
   * Step 1: Create media container.
   * Step 2: Publish media container.
   */
  public async publishPhoto(params: InstagramPublishParams) {
    if (!this.accessToken || !this.instagramAccountId) {
      throw new Error("Instagram Access Token and Business Account ID are required.");
    }

    // 1. Create Media Container
    const createUrl = new URL(`https://graph.facebook.com/v19.0/${this.instagramAccountId}/media`);
    createUrl.searchParams.set("image_url", params.imageUrl);
    createUrl.searchParams.set("caption", params.caption);
    createUrl.searchParams.set("access_token", this.accessToken);

    const createRes = await fetch(createUrl.toString(), { method: "POST" });
    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Failed to create Instagram media container (HTTP ${createRes.status}): ${err}`);
    }

    const { id: creationId } = await createRes.json();

    // 2. Publish Media Container
    const publishUrl = new URL(`https://graph.facebook.com/v19.0/${this.instagramAccountId}/media_publish`);
    publishUrl.searchParams.set("creation_id", creationId);
    publishUrl.searchParams.set("access_token", this.accessToken);

    const pubRes = await fetch(publishUrl.toString(), { method: "POST" });
    if (!pubRes.ok) {
      const err = await pubRes.text();
      throw new Error(`Failed to publish Instagram media (HTTP ${pubRes.status}): ${err}`);
    }

    const json = await pubRes.json();
    return {
      success: true,
      mediaId: json.id,
      caption: params.caption,
    };
  }
}

