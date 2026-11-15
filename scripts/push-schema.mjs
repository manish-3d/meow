import postgres from 'postgres';
import dns from 'node:dns';
import * as dotenv from 'dotenv';
dotenv.config();

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);
const origLookup = dns.lookup.bind(dns);

dns.lookup = (hostname, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (hostname && hostname.includes("neon.tech")) {
    resolver.resolve4(hostname, (err, addrs) => {
      if (!err && addrs && addrs.length > 0) {
        if (options && options.all) {
          return callback(null, addrs.map((a) => ({ address: a, family: 4 })));
        }
        return callback(null, addrs[0], 4);
      }
      origLookup(hostname, options, callback);
    });
  } else {
    origLookup(hostname, options, callback);
  }
};

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("No DATABASE_URL found");
  process.exit(1);
}

const sql = postgres(url, { ssl: 'require' });

async function main() {
  console.log("Connecting to database and setting up clean tables...");

  // 1. Users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      credits INTEGER NOT NULL DEFAULT 5,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log("✓ users table ready");

  // 2. Agent Config table
  await sql`
    CREATE TABLE IF NOT EXISTS agent_config (
      id SERIAL PRIMARY KEY,
      agent_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      agent_image TEXT,
      user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log("✓ agent_config table ready");

  // 3. Tools table
  await sql`
    CREATE TABLE IF NOT EXISTS tools (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true
    );
  `;
  console.log("✓ tools table ready");

  // 4. Routines / Schedule table
  await sql`
    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      agent_id TEXT NOT NULL REFERENCES agent_config(agent_id) ON DELETE CASCADE,
      user_email TEXT NOT NULL,
      title TEXT NOT NULL,
      instruction TEXT NOT NULL,
      frequency TEXT NOT NULL DEFAULT 'daily',
      time TEXT NOT NULL DEFAULT '08:00 AM',
      timezone TEXT NOT NULL DEFAULT 'UTC',
      status TEXT NOT NULL DEFAULT 'active',
      last_run_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log("✓ routines table ready");

  // 5. Messages table
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      agent_id TEXT NOT NULL REFERENCES agent_config(agent_id) ON DELETE CASCADE,
      user_email TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log("✓ messages table ready");

  // Seed default tools if empty
  const existingTools = await sql`SELECT count(*) FROM tools`;
  if (parseInt(existingTools[0].count, 10) === 0) {
    await sql`
      INSERT INTO tools (name, slug, description, is_active) VALUES
      ('Gmail', 'gmail', 'Read, draft, and summarize unread emails.', true),
      ('Slack', 'slack', 'Send notifications, messages, and alerts to Slack channels.', true),
      ('Google News & Web', 'web_search', 'Search live news, articles, and websites.', true),
      ('Browserbase VM Desktop', 'browserbase_vm', 'Autonomous cloud browser for interactive navigation.', true),
      ('GitHub', 'github', 'Inspect PRs, read repositories, and create issues.', true),
      ('Notion', 'notion', 'Read and create Notion pages and documentation.', true)
      ON CONFLICT (slug) DO NOTHING;
    `;
    console.log("✓ Default tools seeded");
  }

  console.log("Database schema synced successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
