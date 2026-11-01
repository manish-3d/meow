import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { workspaces, workspaceMembers, type Workspace } from "@/db/schema";

export type ProvisionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  user: ProvisionUser,
): Promise<string> {
  const rawBase =
    (user.name && user.name.trim()) ||
    (user.email && user.email.split("@")[0].trim()) ||
    "workspace";

  const base = slugify(rawBase) || "workspace";

  // Check if the plain base slug is available
  const [existingBase] = await tx
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.slug, base))
    .limit(1);

  if (!existingBase) {
    return base;
  }

  // If taken, try a stable slug using a prefix of the user's ID
  const stableSuffix = user.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toLowerCase();
  const stableSlug = `${base}-${stableSuffix}`;

  const [existingStable] = await tx
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.slug, stableSlug))
    .limit(1);

  if (!existingStable) {
    return stableSlug;
  }

  // Fallback: append incrementing counter / random hex
  let attempt = 1;
  while (attempt <= 10) {
    const candidate = `${base}-${stableSuffix}-${attempt}`;
    const [found] = await tx
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.slug, candidate))
      .limit(1);

    if (!found) {
      return candidate;
    }
    attempt++;
  }

  // Ultimate fallback using full timestamp
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Ensures that the given user has a personal workspace.
 * If one already exists, it is returned (and missing workspace_members owner row is added if absent).
 * If none exists, one is created alongside its workspace_members owner row inside a transaction.
 * Concurrency is safely handled using a PostgreSQL transaction-level advisory lock per user ID.
 */
export async function ensurePersonalWorkspace(
  user: ProvisionUser,
): Promise<Workspace> {
  if (!user.id) {
    throw new Error("User ID is required to provision personal workspace");
  }

  return await db.transaction(async (tx) => {
    // 1. Transaction-level advisory lock based on user.id to handle concurrent sign-ins
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtext(${`workspace_provision_${user.id}`}))`,
    );

    // 2. Check if the user already owns a workspace
    const [existing] = await tx
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerUserId, user.id))
      .limit(1);

    if (existing) {
      // Ensure workspace_members contains an owner entry
      const [existingMember] = await tx
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, existing.id),
            eq(workspaceMembers.userId, user.id),
          ),
        )
        .limit(1);

      if (!existingMember) {
        await tx.insert(workspaceMembers).values({
          workspaceId: existing.id,
          userId: user.id,
          role: "owner",
        });
      }

      return existing;
    }

    // 3. Generate a unique, stable workspace slug
    const slug = await generateUniqueSlug(tx, user);

    // 4. Generate workspace name
    const rawName = user.name?.trim() || user.email?.split("@")[0]?.trim();
    const workspaceName = rawName ? `${rawName}'s Workspace` : "Personal Workspace";

    // 5. Create workspace
    const [newWorkspace] = await tx
      .insert(workspaces)
      .values({
        name: workspaceName,
        slug,
        ownerUserId: user.id,
      })
      .returning();

    // 6. Create corresponding workspace_members record with role 'owner'
    await tx.insert(workspaceMembers).values({
      workspaceId: newWorkspace.id,
      userId: user.id,
      role: "owner",
    });

    return newWorkspace;
  });
}

