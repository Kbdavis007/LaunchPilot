import React, { useState } from 'react';
import { GitCommit, CheckCircle2, Clock, ChevronDown, ChevronUp, Layers, Terminal, Sparkles } from 'lucide-react';

export interface RoadmapTimelineProps {
  activePhase?: string;
  expandable?: boolean;
  filterPhase?: string;
  variant?: 'compact' | 'detailed';
}

interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  targetWindow: string;
  status: 'completed' | 'active' | 'upcoming';
  specFile: string;
  architectTask: string;
  openHandsTask: string;
  rinseCriteria: string;
  outcomes: string[];
  gradient: string;
}

const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: 'phase-0',
    phase: 'Phase 0',
    title: 'OpenSpec System Setup & Repository Blueprint',
    targetWindow: 'Day 0',
    status: 'completed',
    specFile: 'openspec/config.yaml',
    architectTask: 'Draft core JSON schema validation rules, edge runtime constraints & openhands-instructions.md',
    openHandsTask: 'Initialize repository, configure Cloudflare Wrangler bindings (wrangler.jsonc), install core dependencies, and setup baseline testing harnesses.',
    rinseCriteria: 'Validate OpenSpec contract linter execution; verify local multi-service execution via wrangler dev.',
    outcomes: ['Zero Node.js runtime enforcement', 'Cloudflare D1 & KV bindings initialized', 'Contract linter configured'],
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'phase-1',
    phase: 'Phase 1',
    title: 'MDX Engineering Blog & Day 1 Public Vision',
    targetWindow: 'Day 1',
    status: 'active',
    specFile: 'openspec/module-f-mdx-blog.md',
    architectTask: 'Draft MDX post templates, prompts for converting commit history into public build logs, and component contracts.',
    openHandsTask: 'Implement MDX compiler middleware, build interactive React UI components (<WtpCalculator />, <RoadmapTimeline />), and deploy static asset generation on Cloudflare Pages.',
    rinseCriteria: 'Verify static site build on Cloudflare Pages, test interactive widgets in preview, validate RSS/Atom feed generation.',
    outcomes: ['Public transparency from Day 1', 'Interactive <WtpCalculator /> and <RoadmapTimeline /> widgets', 'First 3 foundational MDX posts published'],
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'phase-2',
    phase: 'Phase 2',
    title: 'Module A: Pain Signal Mining Engine',
    targetWindow: 'Weeks 1–2',
    status: 'upcoming',
    specFile: 'openspec/module-a-signal-engine.md',
    architectTask: 'Construct high-accuracy regex extraction rules, RSS parser blueprints, WTP mathematical scoring formulas, and OpenAPI interface definitions.',
    openHandsTask: 'Implement Reddit API / RSS ingestion services, GitHub Issue event listeners, and D1 storage schemas for signal indexing.',
    rinseCriteria: 'Unit test WTP scoring routines against benchmark signal sets; confirm D1 persistence and sub-50ms edge processing response times.',
    outcomes: ['Automated pain point scraper', '0-100 WTP scoring algorithm', 'D1 signal indexing engine'],
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'phase-3',
    phase: 'Phase 3',
    title: 'Module B: Lean Tech Stack Generator & CLI',
    targetWindow: 'Weeks 3–4',
    status: 'upcoming',
    specFile: 'openspec/module-b-scaffold-generator.md',
    architectTask: 'Design clean-code boilerplate structures, vertical slice folder organization rules, and context-injection prompts for code gen tools.',
    openHandsTask: 'Write CLI generation commands, string interpolation utilities, and repository bootstrapping handlers.',
    rinseCriteria: 'Execute mock scaffolding routines; verify generated projects compile with zero TypeScript errors and comply with edge runtime limits.',
    outcomes: ['Zero-boilerplate CLI scaffold', 'DDD vertical slice template generator', 'D1 migration automation'],
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'phase-4',
    phase: 'Phase 4',
    title: 'Module C: Automated PLG Engine & Outreach Tools',
    targetWindow: 'Weeks 4–5',
    status: 'upcoming',
    specFile: 'openspec/module-c-plg-funnel.md',
    architectTask: 'Draft cold outreach message matrices, conversion-optimized PLG paywall conditions, and social update template generators.',
    openHandsTask: 'Integrate Stripe Customer Portal webhooks, client-side usage metering hooks, and automated email generation queues.',
    rinseCriteria: 'Run end-to-end integration tests: User Sign-Up → Usage Counter Incrementation → Paywall Trigger Event.',
    outcomes: ['Frictionless onboarding paths', 'Client-side usage metering hooks', 'Stripe customer portal integration'],
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'phase-5',
    phase: 'Phase 5',
    title: 'Module D: Autonomous Support & Self-Healing Ops',
    targetWindow: 'Weeks 5–6',
    status: 'upcoming',
    specFile: 'openspec/module-d-autonomous-ops.md',
    architectTask: 'Fine-tune routing prompts, design triage logic flowcharts, and author automated failure recovery handling protocols.',
    openHandsTask: 'Build Worker log stream listeners, vector retrieval tools for documentation indexing, and automated ticket resolution APIs.',
    rinseCriteria: 'Run 50 simulated support tickets and crash scenarios; confirm >80% autonomous resolution rate without manual escalation.',
    outcomes: ['Worker log stream listener', 'Vectorize doc index retriever', '>80% autonomous ticket resolution rate'],
    gradient: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'phase-6',
    phase: 'Phase 6',
    title: 'Module E: SaaS Pass Marketplace & Exit Exporter',
    targetWindow: 'Weeks 6–7',
    status: 'upcoming',
    specFile: 'openspec/module-e-saas-pass-marketplace.md',
    architectTask: 'Formulate usage weight allocation equations, marketplace metadata schemas, and revenue valuation algorithms.',
    openHandsTask: 'Build SaaS Pass entitlement middleware, usage aggregation crons, revenue payout math routines, and automated Acquire.com ZIP packager.',
    rinseCriteria: 'Simulate multi-tenant app traffic under SaaS Pass constraints; verify payout math accuracy across 1,000 simulated user sessions.',
    outcomes: ['SaaS Pass 3-tier gateway', '70% developer pool revenue split', 'Automated Acquire.com exit packager'],
    gradient: 'from-amber-400 to-emerald-500',
  },
  {
    id: 'phase-7',
    phase: 'Phase 7',
    title: 'Self-Referential Live Validation Proof',
    targetWindow: 'Week 7+',
    status: 'upcoming',
    specFile: 'openspec/phase-7-validation.md',
    architectTask: 'Draft validation audit scripts, performance telemetry schemas, and acquisition evaluation criteria.',
    openHandsTask: 'Execute full self-referential build cycle: run audit tool release, onboard initial 50 solo devs onto SaaS Pass, and export Acquire.com listing.',
    rinseCriteria: 'Public release of verified telemetry logs and Acquire.com Proof #1 asset bundle.',
    outcomes: ['50 active solo developers on SaaS Pass', 'Sub-50ms verified edge latency', 'Published Acquire.com exit package'],
    gradient: 'from-emerald-400 via-cyan-400 to-indigo-500',
  },
];

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  activePhase = 'Phase 1',
  expandable = true,
}) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(activePhase);
  const [filter, setFilter] = useState<'all' | 'active_completed' | 'upcoming'>('all');

  const filteredItems = ROADMAP_DATA.filter((item) => {
    if (filter === 'active_completed') return item.status === 'completed' || item.status === 'active';
    if (filter === 'upcoming') return item.status === 'upcoming';
    return true;
  });

  const toggleExpand = (phase: string) => {
    if (!expandable) return;
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };

  return (
    <div className="my-8 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 shadow-xl overflow-hidden text-neutral-900 dark:text-neutral-100 transition-all">
      {/* Widget Header */}
      <div className="px-6 py-4 border-b border-neutral-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-neutral-50 via-white to-cyan-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-cyan-950/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-tight">Master Execution Roadmap (Phases 0–7)</h4>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>Cloudflare Workers + D1 Edge Architecture</span>
              <span aria-hidden="true">·</span>
              <span>OpenHands Execution Cadence</span>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            All (8)
          </button>
          <button
            onClick={() => setFilter('active_completed')}
            className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'active_completed'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Current (0 & 1)
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'upcoming'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Upcoming (6)
          </button>
        </div>
      </div>

      {/* Timeline items */}
      <div className="p-6 space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedPhase === item.phase;
          const isCurrentActive = item.phase === activePhase;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isCurrentActive
                  ? 'border-cyan-500/80 bg-cyan-50/20 dark:bg-cyan-950/20 shadow-md shadow-cyan-500/5'
                  : item.status === 'completed'
                  ? 'border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/10'
                  : 'border-neutral-200/80 dark:border-white/5 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-white/20'
              }`}
            >
              <div
                onClick={() => toggleExpand(item.phase)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      item.status === 'completed'
                        ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30'
                        : item.status === 'active'
                        ? 'bg-cyan-500 text-white shadow-xs shadow-cyan-500/30 animate-pulse'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : item.status === 'active' ? (
                      <GitCommit className="w-4 h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{item.phase}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="font-mono text-neutral-500 dark:text-neutral-400">{item.targetWindow}</span>
                      <span className="text-neutral-400">·</span>
                      <span
                        className={`font-semibold text-[11px] uppercase tracking-wider ${
                          item.status === 'completed'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : item.status === 'active'
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-neutral-400'
                        }`}
                      >
                        {item.status === 'completed' ? 'Completed & Locked' : item.status === 'active' ? 'Active Focus' : 'Scheduled'}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 truncate">
                      {item.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-neutral-400 hidden md:inline">
                    {item.specFile}
                  </span>
                  <div className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-white/5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-white/5">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Google AI Studio Architect Spec</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {item.architectTask}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-white/5">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                        <span>OpenHands Autonomous Agent</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {item.openHandsTask}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-[11px] flex items-center justify-between">
                    <span>Testing & Rinse Invariant: {item.rinseCriteria}</span>
                    <span className="text-emerald-400 hidden sm:inline">&lt;50ms Edge Safe</span>
                  </div>

                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                      Target Deliverables:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.outcomes.map((outcome, oIdx) => (
                        <span
                          key={oIdx}
                          className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium"
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
