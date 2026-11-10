import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

interface VerificationCheck {
  id: string;
  name: string;
  command: string;
  status: 'passed' | 'running' | 'pending';
  latency: string;
  details: string;
}

export const OpenHandsSimulator: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'OpenHands Agent Initialized v2026.3.1',
    'Loaded OpenSpec Blueprint: openspec/config.yaml',
    'Consuming Agent Directives: openhands-instructions.md',
    'Ready to execute autonomous verification suite for Phase 0 & Phase 1.',
  ]);

  const [checks, setChecks] = useState<VerificationCheck[]>([
    {
      id: 'edge-001',
      name: 'EDGE-001: Zero Node.js Core Imports in Worker Handlers',
      command: 'grep -rnE "^(node:)?(fs|path|child_process|net)" src/modules',
      status: 'passed',
      latency: '1.2ms',
      details: '0 violations found. Strict Web Standard APIs (Fetch, Streams, Crypto) enforced.',
    },
    {
      id: 'edge-002',
      name: 'EDGE-002: Cloudflare D1 Parameterized Query Verification',
      command: 'npx eslint --rule "d1-parameterized-queries: error"',
      status: 'passed',
      latency: '2.4ms',
      details: 'All prepared statements use env.DB.prepare().bind(?). Zero string interpolation.',
    },
    {
      id: 'spec-001',
      name: 'SPEC-001: OpenSpec Contract Boundary Alignment',
      command: 'openspec-lint --contracts=openspec/*.md',
      status: 'passed',
      latency: '3.1ms',
      details: 'Module F MDX Blog and WtpCalculator / RoadmapTimeline props contracts match.',
    },
    {
      id: 'perf-001',
      name: 'PERF-001: Edge Handler Execution Budget (<50ms SLA)',
      command: 'wrangler dev --test-benchmark --p95-threshold=50',
      status: 'passed',
      latency: '18.4ms',
      details: 'Simulated edge request completed in 18.4ms (Budget: 50ms). Pass.',
    },
    {
      id: 'mdx-001',
      name: 'MDX-001: File-Backed MDX Schema & RSS 2.0 Feed Compiler',
      command: 'node ./scripts/compile-mdx-feed.mjs',
      status: 'passed',
      latency: '4.8ms',
      details: 'Parsed 3 posts in content/posts/*.mdx. Generated /feed.xml and /atom.xml.',
    },
  ]);

  const runVerificationSuite = () => {
    setIsExecuting(true);
    setTerminalLogs((prev) => [
      ...prev,
      '',
      `[${new Date().toLocaleTimeString()}] > Starting OpenHands automated verification cycle...`,
      'Checking Cloudflare Worker V8 isolate boundaries...',
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        '  ✔ Verified: Zero Node.js dependencies found in src/modules/*',
        '  ✔ Parameterized D1 prepared statements: 100% compliant',
      ]);
    }, 600);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        '  ✔ Validating MDX frontmatter against openspec/module-f-mdx-blog.md Zod schema...',
        '  ✔ Injected React widgets: <WtpCalculator />, <RoadmapTimeline />, <TelemetryChart /> validated.',
        '  ✔ Compiling Cloudflare Pages static artifacts & RSS/Atom feed envelopes...',
      ]);
    }, 1200);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✔ Verification cycle completed in 1,842ms. Zero errors detected.`,
      ]);
      setIsExecuting(false);
    }, 1900);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            OpenHands Autonomous Execution Inspector
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Simulate and monitor OpenHands as it consumes OpenSpec schemas, executes builds, and tests edge runtime invariants.
          </p>
        </div>

        <button
          onClick={runVerificationSuite}
          disabled={isExecuting}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white/90 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
        >
          {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          {isExecuting ? 'Executing Suite...' : 'Run OpenHands Test Harness'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Checklist */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            OpenSpec Linter Rules & Invariants
          </div>
          {checks.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{c.name}</h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{c.details}</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0 tabular-nums">
                  {c.latency}
                </span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 font-mono text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                $ {c.command}
              </div>
            </div>
          ))}
        </div>

        {/* Live Terminal Output */}
        <div className="lg:col-span-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-neutral-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-mono font-medium text-neutral-300">OpenHands Agent Terminal</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Isolated Worker Runtime</span>
            </div>
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 text-neutral-300">
            {terminalLogs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes('✔')
                    ? 'text-emerald-400'
                    : log.includes('>')
                    ? 'text-neutral-100 font-semibold'
                    : 'text-neutral-400'
                }
              >
                {log}
              </div>
            ))}
          </div>

          <div className="p-3 bg-neutral-900/60 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Runtime: Cloudflare Workers Edge</span>
            <span>p95 Target: &lt;50ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
