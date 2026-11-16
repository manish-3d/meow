require('./dns-fix.cjs');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL);

async function testChatHistory() {
  console.log("1. Checking table 'agent_chat_history' in Neon PostgreSQL...");
  
  const testAgentId = "c23d1bfe-1e90-4847-b756-27da8b8bfeb8";
  const testEmail = "manishsinghjio135@gmail.com";

  // Test insert
  console.log("2. Inserting test user and agent messages...");
  const inserted = await sql`
    INSERT INTO agent_chat_history (agent_id, user_email, role, content)
    VALUES 
      (${testAgentId}, ${testEmail}, 'user', 'Hello social media bot, test message verification!'),
      (${testAgentId}, ${testEmail}, 'agent', 'Hello Manish! Your chat history persistence is now live in Neon PostgreSQL.')
    RETURNING id, agent_id, role, content, created_at;
  `;
  console.log("Inserted rows:", inserted);

  // Test query
  console.log("\n3. Querying conversation thread for agent...");
  const thread = await sql`
    SELECT id, role, content, created_at
    FROM agent_chat_history
    WHERE agent_id = ${testAgentId} AND user_email = ${testEmail}
    ORDER BY created_at ASC;
  `;
  console.log("Found thread messages count:", thread.length);
  thread.forEach(msg => {
    console.log(`[${msg.role.toUpperCase()}] ${msg.content} (at ${msg.created_at})`);
  });

  // Verify
  if (thread.length >= 2) {
    console.log("\n✅ SUCCESS: agent_chat_history table verified and working!");
  } else {
    throw new Error("Failed to retrieve inserted messages");
  }

  // Cleanup test messages
  await sql`
    DELETE FROM agent_chat_history
    WHERE content LIKE '%test message verification%' OR content LIKE '%persistence is now live%';
  `;
  console.log("4. Cleaned up temporary test messages.");

  await sql.end();
}

testChatHistory().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
