"use client";

import React, { useState } from "react";
import {
  Mail,
  GitBranch,
  MessageSquare,
  FileText,
  Calendar,
  Layers,
  Globe,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
} from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  category: string;
  description: string;
  actions: string[];
  color: string;
}

const TOOLS: ToolItem[] = [
  {
    id: "gmail",
    name: "Gmail",
    category: "Communication",
    description: "Read unread messages, draft executive summaries, and send contextual replies.",
    actions: ["Send Email", "Read Inbox", "Filter Labels", "Draft Review"],
    color: "text-red-500",
  },
  {
    id: "github",
    name: "GitHub",
    category: "Engineering",
    description: "Review open pull requests, merge approved diffs, and triage repository issues.",
    actions: ["Review PRs", "File Issues", "Merge Diffs", "Create Branch"],
    color: "text-foreground",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Post automated alerts to channels, broadcast daily standup digests, and listen to events.",
    actions: ["Post Message", "Read Channels", "Direct Mention", "Pin Summary"],
    color: "text-amber-500",
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    description: "Query knowledge bases, append structured notes, and sync agent memory.",
    actions: ["Query Database", "Append Block", "Create Page", "Read Notes"],
    color: "text-foreground",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    category: "Productivity",
    description: "Check availability, schedule meetings, resolve scheduling conflicts, and generate agendas.",
    actions: ["Check Availability", "Book Event", "Reschedule", "Send Invites"],
    color: "text-sky-500",
  },
  {
    id: "linear",
    name: "Linear",
    category: "Engineering",
    description: "Automate sprint backlog grooming, update issue statuses, and link PRs to tickets.",
    actions: ["Create Ticket", "Update Status", "Assign Cycle", "Search Issues"],
    color: "text-indigo-400",
  },
  {
    id: "browserbase",
    name: "Browserbase CDP",
    category: "Cloud VM",
    description: "Spin up a real cloud browser to navigate visual websites, fill forms, and solve JS challenges.",
    actions: ["Click & Fill", "Inspect DOM", "Full Screenshot", "Extract Data"],
    color: "text-emerald-500",
  },
  {
    id: "daytona",
    name: "Daytona VM",
    category: "Cloud VM",
    description: "Execute arbitrary bash scripts, Python workflows, and unit tests in an isolated sandbox.",
    actions: ["Run Bash", "Execute Python", "Inspect Files", "Install Deps"],
    color: "text-cyan-500",
  },
  {
    id: "jira",
    name: "Jira Software",
    category: "Project Management",
    description: "Synchronize enterprise epics, file bug reports, and trigger automated triage routines.",
    actions: ["Log Work", "Transition Status", "Add Comment", "Query JQL"],
    color: "text-blue-500",
  },
];

export function IntegrationsGrid() {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Communication", "Engineering", "Productivity", "Cloud VM"];

  const filteredTools =
    filter === "All" ? TOOLS : TOOLS.filter((t) => t.category === filter);

  return (
    <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-surface-0">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-surface-2 border border-border-subtle text-muted-foreground shadow-2xs">
            <Sparkles className="size-3 text-primary" />
            <span>1,700+ Native Composio Integrations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
            Connect your agent to every tool your team uses
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            No API wrappers or authentication maintenance required. With Composio Native tooling, your Meow Bot agents execute real actions with granular permissions.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground border border-border-subtle"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group rounded-xl border border-border-subtle bg-surface-1 p-4 space-y-3.5 shadow-xs hover:border-foreground/20 hover:bg-surface-2/40 transition-all duration-150"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                    <span className={tool.color}>
                      {tool.id === "gmail" ? "✉" : tool.id === "github" ? "⌥" : tool.id === "slack" ? "#" : "✦"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground tracking-tight">
                      {tool.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="size-2.5" />
                  Ready
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              {/* Action Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border-subtle">
                {tool.actions.map((act, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 border border-border-subtle text-muted-foreground group-hover:text-foreground group-hover:border-border transition-colors"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="p-4 rounded-xl border border-dashed border-border-subtle bg-surface-1 text-center space-y-1">
          <p className="text-xs text-foreground font-medium">
            Need custom tools or private internal APIs?
          </p>
          <p className="text-[11px] text-muted-foreground">
            Meow Bot supports custom MCP servers, OpenAPI specs, and direct webhooks.
          </p>
        </div>
      </div>
    </section>
  );
}
