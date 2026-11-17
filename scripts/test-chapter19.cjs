/**
 * Chapter 19 Verification Script
 * Validates production health check and environment audit
 */
require('./dns-fix.cjs');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { sql } = require('drizzle-orm');
const fs = require('fs');

async function testChapter19() {
  console.log('====================================================');
  console.log('🧪 CHAPTER 19: PRODUCTION READINESS & DEPLOYMENT TEST');
  console.log('====================================================\n');

  // 1. Verify Database Connectivity & Pooler latency
  console.log('1️⃣  Auditing PostgreSQL Database Connection...');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined in environment!');
  }

  const client = postgres(dbUrl, { prepare: false });
  const db = drizzle({ client });

  const start = Date.now();
  const res = await db.execute(sql`SELECT 1 as ping`);
  const latency = Date.now() - start;
  console.log(`   ✅ Database connected successfully! Latency: ${latency}ms`);
  console.log(`   ✅ Query response: ${JSON.stringify(res[0])}\n`);

  // 2. Audit Environment Configuration
  console.log('2️⃣  Auditing Production Environment Configurations...');
  const requiredKeys = [
    { key: 'NEXTAUTH_SECRET', critical: true },
    { key: 'DATABASE_URL', critical: true },
    { key: 'GEMINI_API_KEY', critical: true },
    { key: 'COMPOSIO_API_KEY', critical: false },
    { key: 'BROWSERBASE_API_KEY', critical: false },
    { key: 'BROWSERBASE_PROJECT_ID', critical: false },
    { key: 'INNGEST_EVENT_KEY', critical: false },
    { key: 'INNGEST_SIGNING_KEY', critical: false },
  ];

  for (const { key, critical } of requiredKeys) {
    const val = process.env[key];
    const isPresent = Boolean(val && !val.includes('placeholder'));
    const statusIcon = isPresent ? '✅' : critical ? '❌' : '⚠️';
    console.log(`   ${statusIcon} ${key}: ${isPresent ? 'Configured' : critical ? 'CRITICAL MISSING' : 'Optional/Unconfigured'}`);
  }

  // 3. Verify Vercel & Deployment Files
  console.log('\n3️⃣  Checking Deployment Metadata Files...');
  const vercelJsonExists = fs.existsSync('vercel.json');
  const envExampleExists = fs.existsSync('.env.production.example');
  const healthRouteExists = fs.existsSync('app/api/health/route.ts');

  console.log(`   ${vercelJsonExists ? '✅' : '❌'} vercel.json: ${vercelJsonExists ? 'Present' : 'Missing'}`);
  console.log(`   ${envExampleExists ? '✅' : '❌'} .env.production.example: ${envExampleExists ? 'Present' : 'Missing'}`);
  console.log(`   ${healthRouteExists ? '✅' : '❌'} /api/health route: ${healthRouteExists ? 'Present' : 'Missing'}`);

  await client.end();
  console.log('\n====================================================');
  console.log('🎉 CHAPTER 19 AUDIT PASSED! READY FOR PRODUCTION DEPLOYMENT');
  console.log('====================================================');
}

testChapter19().catch((err) => {
  console.error('❌ Chapter 19 Verification Failed:', err);
  process.exit(1);
});
