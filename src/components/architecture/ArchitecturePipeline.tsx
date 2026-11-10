import React, { useState } from 'react';
import { Cpu, Terminal, Database, ShieldCheck, DollarSign, PackageCheck, Zap, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface PipelineNode {
  id: string;
  step: string;
  title: string;
  module: string;
  role: string;
  latencyTarget: string;
  description: string;
  specsSummary: string[];
  codeSnippet: string;
  badgeColor: string;
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'step-1',
    step: '01',
    title: 'Pain Signal Mining Engine',
    module: 'Module A',
    role: 'Automated Intelligence Scraper',
    latencyTarget: '<35ms Ingestion',
    description: 'Scrapes developer friction and unvalidated pain points across Reddit, GitHub Issues, and Hacker News, scoring willingness-to-pay between 0 and 100.',
    specsSummary: [
      'Regex extraction rules for pricing mentions ($XX/mo)',
      'Sub-50ms ingestion into Cloudflare D1 SQL store',
      'WTP scoring formula: (Pain·3.5 + Friction·2.5 + log₁₀(Budget)·12) / 0.75',
    ],
    codeSnippet: `// Edge Worker: Signal Mining Ingestion
export async function ingestSignal(request: Request, env: Env): Promise<Response> {
  const payload = await request.json<PainSignalPayload>();
  const wtp = calculateWtpScore(payload);
  
  if (wtp.score >= 70) {
    await env.DB.prepare(
      "INSERT INTO pain_signals (domain, pain_level, wtp_score, created_at) VALUES (?, ?, ?, ?)"
    ).bind(payload.domain, payload.pain, wtp.score, Date.now()).run();
  }
  return Response.json({ success: true, wtp });
}`,
    badgeColor: 'border-cyan-500/30 text-cyan-500 bg-cyan-500/10',
  },
  {
    id: 'step-2',
    step: '02',
    title: 'OpenSpec Architectural Blueprints',
    module: 'System Engine',
    role: 'Google AI Studio Spec Engine',
    latencyTarget: 'Zero Drift SLA',
    description: 'Establishes mathematical boundaries, strict type constraints, and vertical slice schemas before any code execution begins.',
    specsSummary: [
      'Strict V8 edge isolation: zero Node.js imports permitted',
      'Parameterized D1 prepared statements mandatory for all SQL',
      'Zod-backed contract schemas for all inter-module boundaries',
    ],
    codeSnippet: `# openspec/config.yaml
runtime_environment:
  platform: "cloudflare-workers"
  constraints:
    isolated_environment: true
    banned_node_builtins: ["fs", "path", "child_process", "net"]
    allowed_web_apis: ["fetch", "Request", "Response", "crypto.subtle"]`,
    badgeColor: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/10',
  },
  {
    id: 'step-3',
    step: '03',
    title: 'Autonomous Code Execution',
    module: 'OpenHands',
    role: 'Autonomous Execution Agent',
    latencyTarget: '<120s Clean Build',
    description: 'Consumes OpenSpec contracts, provisions Cloudflare Worker bindings (wrangler.jsonc), and implements DDD vertical slices without human intervention.',
    specsSummary: [
      'Executes wrangler d1 migrations against Cloudflare D1',
      'Runs automated EDGE-001 and PERF-001 linter verification',
      'Builds MDX static blogs on Cloudflare Pages with zero hydration errors',
    ],
    codeSnippet: `// OpenHands Autonomous Worker Handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startTime = performance.now();
    const router = new EdgeRouter(env);
    const response = await router.handle(request);
    
    // Strict PERF-001 <50ms Verification
    const latency = performance.now() - startTime;
    response.headers.set("X-Edge-Latency-Ms", latency.toFixed(2));
    return response;
  }
};`,
    badgeColor: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
  },
  {
    id: 'step-4',
    step: '04',
    title: 'SaaS Pass Subscription Gateway',
    module: 'Module E',
    role: 'Commercial Marketplace Entitlements',
    latencyTarget: '<12ms KV Cache',
    description: 'Replaces individual tool paywalls with a unified developer subscription pass, redistributing 70% of subscription revenue to contributing creators.',
    specsSummary: [
      'Starter ($19/mo), Pro ($49/mo), Unlimited ($99/mo) entitlements',
      'KV cache for single-digit millisecond token lookups',
      'Cryptographically verified usage weight allocation',
    ],
    codeSnippet: `// SaaS Pass Entitlement Verification Middleware
export async function verifySaasPass(token: string, env: Env): Promise<EntitlementResult> {
  const cached = await env.CACHE_KV.get(\`pass:\${token}\`, "json");
  if (cached && cached.valid) return { allowed: true, quota: cached.remaining };
  
  const user = await env.DB.prepare(
    "SELECT tier, remaining_tokens FROM saas_pass_subscribers WHERE api_key = ?"
  ).bind(token).first();
  return { allowed: Boolean(user && user.remaining_tokens > 0), user };
}`,
    badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
  },
  {
    id: 'step-5',
    step: '05',
    title: 'Automated Acquire.com Exporter',
    module: 'Module E',
    role: 'Commercial Exit Packager',
    latencyTarget: '<120s Full Export',
    description: 'Automatically packages the sanitized codebase, D1 migrations, audited Stripe MRR ledger, and marketing brief into a turnkey acquisition bundle.',
    specsSummary: [
      'Automated repository sanitization and license audit',
      'Cryptographically verified MRR and churn rate certificate',
      'Turnkey Cloudflare Worker 1-click deployment runbook',
    ],
    codeSnippet: `// Module E: Automated Acquire.com Exporter
export async function generateAcquisitionPackage(env: Env): Promise<PackageManifest> {
  const mrrAudit = await calculateVerifiedStripeMrr(env);
  const repoArchive = await buildSanitizedRepoZip();
  const listingBrief = renderAcquireListingBrief(mrrAudit);
  
  return {
    packageId: "lp-proof-01",
    verifiedARR: mrrAudit.arr,
    suggestedValuation: mrrAudit.arr * 4.0,
    downloadUrl: \`/api/export/package-\${Date.now()}.zip\`
  };
}`,
    badgeColor: 'border-rose-500/30 text-rose-500 bg-rose-500/10',
  },
];

export const ArchitecturePipeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string>('step-1');
  const currentNode = PIPELINE_NODES.find((n) => n.id === activeStep) || PIPELINE_NODES[0];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-10">
      {/* Header with Visual Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-white/10 bg-neutral-900 shadow-2xl">
        {/* Background Visual Asset Generated for LaunchPilot */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen overflow-hidden">
          <img
            src="/src/assets/images/hero_edge_architecture_1794285169852.jpg"
            alt="LaunchPilot Edge Architecture visualization"
            className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        {/* Content over Hero Image */}
        <div className="relative z-10 p-8 sm:p-12 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Serverless Edge Mesh
            </span>
            <span className="text-xs font-mono text-cyan-300/80">Cloudflare Workers · D1 SQL · KV Cache</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            The Autonomous Code-to-Exit Architecture
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
            From unvalidated market pain signals to automated $100k+ acquisition packaging. Follow our 5-stage OpenSpec vertical slice execution pipeline.
          </p>

          {/* Quick Metrics Bar inside Hero */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Target Latency</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">&lt;50ms p95</div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Execution Agent</div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-0.5">OpenHands</div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Dev Pool Split</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-0.5 tabular-nums">70% MRR</div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Exit Multiple</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-300 mt-0.5 tabular-nums">4.0x ARR</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pipeline Step Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Interactive Execution Pipeline (Select a Stage)
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">5 Architectural Stages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PIPELINE_NODES.map((node) => {
            const isSelected = activeStep === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveStep(node.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-neutral-900 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500 dark:bg-neutral-900'
                    : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                {/* Glowing subtle top indicator */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    STAGE {node.step}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${node.badgeColor}`}>
                    {node.latencyTarget}
                  </span>
                </div>

                <div className="font-bold text-sm leading-snug line-clamp-2">
                  {node.title}
                </div>

                <div className={`text-xs mt-1 truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {node.module} · {node.role}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Deep Dive Inspector */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <span>Stage {currentNode.step} Specification</span>
                <span>·</span>
                <span>{currentNode.module}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                {currentNode.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {currentNode.description}
              </p>
            </div>

            {/* Architecture Constraints */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                OpenSpec Architectural Deliverables
              </h4>
              <ul className="space-y-2">
                {currentNode.specsSummary.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* If Stage 4 (SaaS Pass), show the luxury pass card preview */}
            {currentNode.id === 'step-4' && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 border border-amber-500/30 text-white flex items-center gap-4">
                <img
                  src="/src/assets/images/saas_pass_card_1794285170321.jpg"
                  alt="SaaS Pass Holographic Card"
                  className="w-24 h-16 rounded-lg object-cover shadow-lg border border-amber-400/40 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>SaaS Pass Developer Card</span>
                  </div>
                  <div className="text-neutral-300 text-[11px] mt-0.5">
                    Unified subscription for solo builders. 70% direct creator pool distribution.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Code Sandbox */}
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-neutral-100 flex flex-col shadow-inner">
            <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentNode.module} Edge Implementation</span>
              </span>
              <span className="text-neutral-500 text-[11px]">Strict V8 Isolate</span>
            </div>
            <pre className="flex-1 p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300/90 selection:bg-emerald-500 selection:text-neutral-950">
              <code>{currentNode.codeSnippet}</code>
            </pre>
            <div className="px-4 py-2 bg-neutral-900/60 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
              <span>Cloudflare D1 Binding: Parameterized</span>
              <span>Latency: {currentNode.latencyTarget}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
