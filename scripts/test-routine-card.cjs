require('./dns-fix.cjs');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { generateText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = google('gemini-3-flash-preview');

const systemPrompt = `You are social media bot, an autonomous AI agent operating inside the Meow Bot SaaS platform.
### Platform Capabilities:
- Available Tools Platform Catalog:
- Slack (slug: "SLACK"): Send messages, post summaries, and read channels.
- Gmail (slug: "GMAIL"): Read unread emails, search threads, send emails.
- User Timezone: UTC

### PROTOCOL FOR ROUTINES & AUTOMATIONS:
When the user asks to schedule, automate, or set up a recurring task, routine, or alert (e.g. "summarize my emails every day at 8am", "send me a slack alert daily", "create a routine for...", "alert me on slack every morning"):
1. If the schedule time or frequency is missing, respond with a JSON block of type "clarification":
\`\`\`json
{
  "type": "clarification",
  "content": "At what time of day and how frequently would you like this routine to run?"
}
\`\`\`

2. If sufficient routine parameters are provided:
Respond with a JSON block of type "routine":
\`\`\`json
{
  "type": "routine",
  "content": "I have prepared the automated routine for you. Review the schedule and tool requirements below, then click Create Routine.",
  "routine": {
    "name": "Brief title (e.g. Daily Email Briefing)",
    "goal": "High-level goal",
    "instruction": "Precise step-by-step autonomous instruction for the Inngest background runner",
    "frequency": "daily",
    "scheduledTime": "08:00 AM UTC",
    "timezone": "UTC",
    "tools": ["GMAIL", "SLACK"]
  }
}
\`\`\``;

async function run() {
  console.log("Testing Prompt: 'Summarize my top unread emails and alert me on Slack every day at 8 AM'");
  const res = await generateText({
    model,
    system: systemPrompt,
    messages: [
      { role: 'user', content: 'Summarize my top unread emails and alert me on Slack every day at 8 AM' }
    ]
  });
  console.log("\n--- Model Output ---");
  console.log(res.text);

  // Test parsing
  const jsonMatch = res.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[1]);
    console.log("\n--- Successfully Parsed Routine JSON! ---");
    console.log("Name:", parsed.routine.name);
    console.log("Goal:", parsed.routine.goal);
    console.log("Frequency:", parsed.routine.frequency);
    console.log("Time:", parsed.routine.scheduledTime);
    console.log("Required Tools:", parsed.routine.tools);
  }
}

run().catch(console.error);
