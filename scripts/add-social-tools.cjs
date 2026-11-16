require('./dns-fix.cjs');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function insertSocialTools() {
  const toolsToAdd = [
    {
      name: 'Twitter (X)',
      slug: 'TWITTER',
      description: 'Post tweets, monitor mentions, search trends, and schedule threads.',
      auth_type: 'OAUTH2',
      is_active: true,
    },
    {
      name: 'LinkedIn',
      slug: 'LINKEDIN',
      description: 'Publish professional updates, share articles, and analyze engagement.',
      auth_type: 'OAUTH2',
      is_active: true,
    },
    {
      name: 'Instagram',
      slug: 'INSTAGRAM',
      description: 'Publish media posts, draft captions, and monitor social community metrics.',
      auth_type: 'OAUTH2',
      is_active: true,
    },
  ];

  for (const t of toolsToAdd) {
    const existing = await sql`SELECT id FROM tools WHERE slug = ${t.slug}`;
    if (!existing.length) {
      await sql`
        INSERT INTO tools (name, slug, description, auth_type, is_active)
        VALUES (${t.name}, ${t.slug}, ${t.description}, ${t.auth_type}, ${t.is_active})
      `;
      console.log('Inserted:', t.name);
    } else {
      console.log('Already exists:', t.name);
    }
  }
  await sql.end();
}

insertSocialTools().catch(err => {
  console.error("Insert error:", err);
  process.exit(1);
});
