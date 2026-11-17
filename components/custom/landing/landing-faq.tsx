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
    question: "do i need to download or install any software?",
    answer:
      "no. meow bot is 100% web-first. you can access your workspace, manage your agents, and view your remote browser desktop directly in chrome, safari, or any modern browser without downloading software.",
  },
  {
    question: "does it work when my computer is turned off?",
    answer:
      "yes! because meow bot runs in the cloud with inngest serverless orchestration, your scheduled routines and background tasks execute 24/7 even when your computer is asleep or completely powered off.",
  },
  {
    question: "does it do things without asking?",
    answer:
      "never. if an action involves spending money, deleting files, sending emails to external clients, or modifying production code, meow bot stops and asks for your approval first.",
  },
  {
    question: "can i use it with my existing chatgpt, claude, or gemini subscription?",
    answer:
      "yes! just bring your own api keys. meow bot connects directly to openai, anthropic, or google ai with zero token markup. you can also run 100% free offline models via ollama.",
  },
  {
    question: "can i take over the browser when a bot gets stuck?",
    answer:
      "yes. every bot has a live computer view. if a website has a stubborn captcha or two-factor prompt, just click 'take the mouse' to solve it in seconds, then hand control back to the bot.",
  },
  {
    question: "are my accounts and passwords safe?",
    answer:
      "yes. meow bot uses standard oauth 2.0 with apps like gmail, slack, and github. tokens are encrypted in secure hardware vaults. your ai models never see your raw master passwords.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-white text-[#131316]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 sm:mb-18">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            frequently asked questions.
          </h2>
        </div>

        <div className="flex flex-col border-t border-black/8">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-black/8">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
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
                      transition={{ duration: 0.2 }}
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