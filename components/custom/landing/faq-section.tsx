"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Do I have to switch to a new AI to use Meow Bot?",
    answer:
      "No. Meow Bot connects to whatever AI you already use — Claude, ChatGPT, Cursor, Gemini, or custom LLMs. You get 1,700+ tools, durable background scheduling, and auth guardrails without changing your workflow.",
  },
  {
    question: "Which AI assistants does Meow Bot work with?",
    answer:
      "Meow Bot works seamlessly with Anthropic Claude Desktop, OpenAI ChatGPT, Google Gemini 2.5, Cursor IDE, Codex CLI, Grok, and any client compatible with the Model Context Protocol (MCP).",
  },
  {
    question: "Which apps can I connect to?",
    answer:
      "Meow Bot supports 1,700+ apps including Gmail, Google Calendar, Slack, Notion, GitHub, Google Drive, HubSpot, Salesforce, Stripe, PostgreSQL, Linear, and Jira.",
  },
  {
    question: "The app I need isn't listed. Can I still use it?",
    answer:
      "Yes. If the service has a REST API, OpenAPI schema, or MCP server, you can connect it to Meow Bot in minutes for free.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Not at all. You can use the Meow Bot visual web app to create agents, connect tools with one-click OAuth, and set up recurring scheduled routines using plain English. If you are a developer, our SDK and CLI provide full programmatic control.",
  },
  {
    question: "How is Meow Bot different from the connectors already built into my AI?",
    answer:
      "Built-in connectors usually give one AI access to a very limited set of apps with no durable scheduling, multi-account handling, or team governance. Meow Bot provides 1,700+ apps, multi-account session multiplexing, Inngest durable cron routines, and human-in-the-loop permission enforcement.",
  },
  {
    question: "What access does Meow Bot get to my accounts?",
    answer:
      "Only what you approve. You sign in on each app's official OAuth consent screen. Meow Bot stores resulting tokens in encrypted hardware vaults. Your LLM never sees raw credentials or secret tokens.",
  },
  {
    question: "How much does Meow Bot cost?",
    answer:
      "Meow Bot has a generous free Hobby plan that includes 100,000 tool calls per month. Most individual users and small teams never need to exceed the free plan.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col border-t border-black/10">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-neutral-600 focus:outline-none"
                >
                  <span className="font-sans text-base sm:text-lg font-medium text-neutral-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/10 text-neutral-600">
                    {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm sm:text-base text-neutral-600 font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}