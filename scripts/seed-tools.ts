import "dotenv/config";
import { db } from "../db";
import { tools } from "../db/schema";

const toolRecords = [
  {
    name: "Slack",
    slug: "SLACK",
    description: "Send messages, post summaries, and read channel history",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Gmail",
    slug: "GMAIL",
    description: "Read unread emails, search threads, send emails, and draft replies",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Outlook",
    slug: "OUTLOOK",
    description: "Read and send Outlook emails, manage calendar, and contacts",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Notion",
    slug: "NOTION",
    description: "Create pages, query databases, and append notes",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Google Calendar",
    slug: "GOOGLECALENDAR",
    description: "Check free slots, create events, send calendar invites",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "GitHub",
    slug: "GITHUB",
    description: "List repositories, review PRs, create issues, and comment",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Reddit",
    slug: "REDDIT",
    description: "Browse subreddits, fetch top posts, and read comments",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Google Docs",
    slug: "GOOGLEDOCS",
    description: "Create documents, read and edit content, and share files",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Google Drive",
    slug: "GOOGLEDRIVE",
    description: "Upload, download, search, and organize files in Drive",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Discord",
    slug: "DISCORD",
    description: "Send messages, read channels, and manage server interactions",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Trello",
    slug: "TRELLO",
    description: "Create cards, manage boards, and move tasks across lists",
    authType: "OAUTH2",
    isActive: true,
  },
  {
    name: "Linear",
    slug: "LINEAR",
    description: "Create issues, manage projects, and track engineering sprints",
    authType: "API_KEY",
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Seeding tools table...");

  for (const t of toolRecords) {
    await db.insert(tools).values(t).onConflictDoNothing();
  }

  const allTools = await db.select().from(tools);
  console.log(`✅ Seeded ${allTools.length} tools into Neon PostgreSQL:`);
  allTools.forEach((t) => console.log(`  - ${t.name} (${t.slug}) [${t.authType}]`));
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
