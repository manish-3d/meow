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
    question: "What is Meow Bot?",
    answer:
      "Meow Bot is an autonomous AI agent platform that allows you to create specialized agents equipped with remote Chromium cloud VM desktops, durable Inngest background schedulers, and 1,700+ native tool integrations. It connects multi-model AI reasoning to real-world browser and API execution.",
  },
  {
    question: "How does Meow Bot schedule background routines?",
    answer:
      "When you instruct your agent to perform recurring work (e.g., 'send email at 9 PM IST daily' or 'fetch weekly revenue on Monday'), Meow Bot prepares an automated routine draft. Once confirmed, it registers with our Inngest serverless workflow engine, guaranteeing zero dropped runs, exponential backoff retries, and accurate continent-aware timezone offsets.",
  },
  {
    question: "What is the Cloud VM Desktop feature?",
    answer:
      "Meow Bot provides a dedicated remote Chromium browser sandbox powered by Browserbase. Agents can autonomously navigate sites, click elements, extract data, and fill forms. You can watch the live video stream in your browser or click 'Take Over Control' to manually interact with the session at any time.",
  },
  {
    question: "Which AI models power Meow Bot?",
    answer:
      "Meow Bot comes out-of-the-box with Google Gemini 2.5 Flash, Anthropic Claude 3.7 Sonnet, OpenAI GPT-4o, and supports custom models via the universal Model Context Protocol (MCP) gateway.",
  },
  {
    question: "How do tool connections work?",
    answer:
      "Meow Bot provides one-click OAuth connectors for 1,700+ services including Gmail, Google Calendar, Slack, GitHub, Linear, Stripe, and PostgreSQL. Credentials are stored in encrypted hardware vaults with zero token exposure to the LLM prompt context.",
  },
  {
    question: "Can I take over the browser when an agent gets stuck?",
    answer:
      "Yes! In the VM Desktop tab, you have full human-in-the-loop control. Click 'Take Over Control' to pause the agent and manually complete 2FA challenges, solve captchas, or inspect web elements before letting the agent resume.",
  },
  {
    question: "How does continent-based timezone scheduling work?",
    answer:
      "To eliminate confusing UTC offset calculations, Meow Bot provides a continent-grouped selector (Asia, America, Europe, Australia, Africa). Choose your continent and city (e.g., Asia/Calcutta), and Meow Bot automatically handles Daylight Savings Time conversions.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply click 'Launch Workspace'. You can immediately start chatting with pre-configured agents, connect your preferred tools, and create automated background routines in minutes.",
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
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 mb-2 font-semibold">
            COMMON QUESTIONS
          </span>
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