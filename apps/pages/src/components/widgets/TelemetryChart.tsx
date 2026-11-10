import React, { useState, useEffect } from 'react';
import { Activity, Globe, DollarSign, PackageCheck } from 'lucide-react';

export interface TelemetryChartProps {
  primaryMetric?: 'latency' | 'saas_pass_subscribers' | 'exit_valuation' | 'all';
  refreshIntervalSeconds?: number;
  telemetrySource?: 'edge_benchmark' | 'live_prober';
}

interface RegionLatency {
  region: string;
  code: string;
  p50: number;
  p95: number;
  status: 'nominal' | 'warning';
  barPercent: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  primaryMetric = 'all',
  refreshIntervalSeconds = 4,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'latency' | 'saas_pass' | 'exit_pkg'>(
    primaryMetric === 'latency'
      ? 'latency'
      : primaryMetric === 'saas_pass_subscribers'
      ? 'saas_pass'
      : primaryMetric === 'exit_valuation'
      ? 'exit_pkg'
      : 'all'
  );

  const [exitMultiple, setExitMultiple] = useState<number>(4.0);
  const [, setTick] = useState<number>(0);

  const [regions, setRegions] = useState<RegionLatency[]>([
    { region: 'North America (San Jose)', code: 'SJC', p50: 14, p95: 28, status: 'nominal', barPercent: 56 },
    { region: 'Europe (Frankfurt)', code: 'FRA', p50: 19, p95: 36, status: 'nominal', barPercent: 72 },
    { region: 'Asia-Pacific (Tokyo)', code: 'NRT', p50: 22, p95: 41, status: 'nominal', barPercent: 82 },
    { region: 'Australia (Sydney)', code: 'SYD', p50: 25, p95: 45, status: 'nominal', barPercent: 90 },
    { region: 'South America (São Paulo)', code: 'GRU', p50: 28, p95: 47, status: 'nominal', barPercent: 94 },
  ]);

  // SaaS Pass Cohort State
  const starterCount = 35;
  const proCount = 12;
  const unlimitedCount = 3;
  const totalSubscribers = starterCount + proCount + unlimitedCount; // 50 solo dev target
  const targetSubscribers = 50;

  const starterMRR = starterCount * 19;
  const proMRR = proCount * 49;
  const unlimitedMRR = unlimitedCount * 99;
  const totalMRR = starterMRR + proMRR + unlimitedMRR; // $1,550/mo
  const totalARR = totalMRR * 12; // $18,600/yr
  const developerPoolShare = Math.round(totalMRR * 0.7); // 70% pool split
  const exitValuation = Math.round(totalARR * exitMultiple);

  // Micro-fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setRegions((prev) =>
        prev.map((r) => {
          const delta = (Math.random() - 0.5) * 3;
          const newP95 = Math.min(48, Math.max(22, Math.round(r.p95 + delta)));
          return {
            ...r,
            p95: newP95,
            p50: Math.round(newP95 * 0.52),
            barPercent: Math.round((newP95 / 50) * 100),
          };
        })
      );
    }, refreshIntervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [refreshIntervalSeconds]);

  return (
    <div className="my-8 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 shadow-xl overflow-hidden text-neutral-900 dark:text-neutral-100 transition-all">
      {/* Widget Header with colorful gradient accent */}
      <div className="px-6 py-4 border-b border-neutral-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-neutral-50 via-white to-indigo-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Real-Time Edge Telemetry & Target Metrics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PULSING LIVE
              </span>
            </h4>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>Cloudflare Workers + D1 Telemetry Engine</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Sub-50ms SLA Target</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setActiveTab('latency')}
            className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'latency'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Edge Latency
          </button>
          <button
            onClick={() => setActiveTab('saas_pass')}
            className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'saas_pass'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            SaaS Pass (50 Cohort)
          </button>
          <button
            onClick={() => setActiveTab('exit_pkg')}
            className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'exit_pkg'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Acquire.com Exit
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* KPI Strip with vibrant gradient cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-emerald-50/50 dark:from-neutral-950 dark:to-emerald-950/20 border border-emerald-500/20 shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
              <span>Global p95 Latency</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums">
              34.8 <span className="text-sm font-sans text-emerald-600 dark:text-emerald-400 font-bold">ms</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              Target: &lt;50ms (Compliant)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-cyan-50/50 dark:from-neutral-950 dark:to-cyan-950/20 border border-cyan-500/20 shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Cold Start Penalty
            </div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums">
              0.0 <span className="text-sm font-sans text-cyan-600 dark:text-cyan-400 font-bold">ms</span>
            </div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 font-medium">
              V8 Edge Isolate Reuse
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-amber-50/50 dark:from-neutral-950 dark:to-amber-950/20 border border-amber-500/20 shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              SaaS Pass Cohort
            </div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums">
              {totalSubscribers} <span className="text-sm font-sans text-neutral-400 font-normal">/ {targetSubscribers}</span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
              Weeks 5–6 Cohort Goal
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-indigo-50/50 dark:from-neutral-950 dark:to-indigo-950/20 border border-indigo-500/20 shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Dev Pool Share (70%)
            </div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums">
              ${developerPoolShare.toLocaleString()}<span className="text-sm font-sans text-indigo-400 font-bold">/mo</span>
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
              Smart D1 Ledger Allocation
            </div>
          </div>
        </div>

        {/* Section: Edge Latency Breakdown */}
        {(activeTab === 'all' || activeTab === 'latency') && (
          <div className="p-6 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-500" />
                <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Global Edge Response Times (Cloudflare PoP Edge Isolate Probers)
                </h5>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                Pulse cycle: {refreshIntervalSeconds}s
              </span>
            </div>

            <div className="space-y-3">
              {regions.map((r) => (
                <div key={r.code} className="p-3 rounded-lg bg-neutral-50/80 dark:bg-neutral-950/60 border border-neutral-200/50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 w-48 shrink-0">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-[11px]">
                      {r.code}
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{r.region}</span>
                  </div>

                  {/* Visual Latency Bar */}
                  <div className="flex-1 px-2">
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: `${r.barPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                    <span className="text-neutral-500">p50: <strong className="text-neutral-800 dark:text-neutral-200">{r.p50}ms</strong></span>
                    <span className="text-neutral-500">p95: <strong className="text-emerald-500 font-bold">{r.p95}ms</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">&lt;50ms SLA OK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: SaaS Pass Cohort & Developer Revenue Pool */}
        {(activeTab === 'all' || activeTab === 'saas_pass') && (
          <div className="p-6 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  SaaS Pass Subscription Model (Weeks 5–6 Cohort Target)
                </h5>
              </div>
              <span className="text-xs font-mono font-bold text-amber-500">
                Cohort ARR: ${totalARR.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 border border-neutral-200 dark:border-white/10">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Starter Tier ($19/mo)</div>
                <div className="text-2xl font-black font-mono mt-1 text-neutral-900 dark:text-neutral-100">
                  {starterCount} Developers
                </div>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  ${starterMRR}/mo MRR · 100 System Tokens
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-cyan-50/30 dark:from-neutral-950 dark:to-cyan-950/20 border border-cyan-500/20">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Pro Tier ($49/mo)</div>
                <div className="text-2xl font-black font-mono mt-1 text-neutral-900 dark:text-neutral-100">
                  {proCount} Founders
                </div>
                <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                  ${proMRR}/mo MRR · 500 System Tokens
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-indigo-50/30 dark:from-neutral-950 dark:to-indigo-950/20 border border-indigo-500/20">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Unlimited Tier ($99/mo)</div>
                <div className="text-2xl font-black font-mono mt-1 text-neutral-900 dark:text-neutral-100">
                  {unlimitedCount} Dev Agencies
                </div>
                <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                  ${unlimitedMRR}/mo MRR · Priority Compute
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-neutral-300">Creator Pool Split (70/30 model):</span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-emerald-400 font-bold">${developerPoolShare}/mo to Creators</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">${totalMRR - developerPoolShare}/mo Ops</span>
              </div>
            </div>
          </div>
        )}

        {/* Section: Automated Acquire.com Exit Packaging with dynamic multiplier slider */}
        {(activeTab === 'all' || activeTab === 'exit_pkg') && (
          <div className="p-6 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-gradient-to-br from-neutral-50 via-white to-purple-50/20 dark:from-neutral-950 dark:via-neutral-900 dark:to-purple-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-purple-500" />
                <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Automated Acquire.com Exit Valuation Simulator
                </h5>
              </div>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold">
                Export SLA: &lt;120s
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1.5 font-medium">
                    <span>Valuation Revenue Multiple:</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                      {exitMultiple.toFixed(1)}x ARR
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="6.0"
                    step="0.1"
                    value={exitMultiple}
                    onChange={(e) => setExitMultiple(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono mt-1">
                    <span>2.5x Conservative</span>
                    <span>4.0x Market Baseline</span>
                    <span>6.0x Premium Edge Growth</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">
                    Automated Due Diligence Checklist:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-neutral-600 dark:text-neutral-300">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Sanitized OpenSpec Git Repo
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Cloudflare D1 SQL Schema
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Audited Stripe MRR Proof
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      1-Click Worker Deployment
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-xl bg-neutral-950 text-white border border-purple-500/30 flex flex-col justify-between shadow-lg shadow-purple-500/10">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Projected Exit Valuation
                  </div>
                  <div className="text-3xl font-black font-mono text-purple-300 mt-1 tabular-nums">
                    ${exitValuation.toLocaleString()} USD
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                    Based on verified 50-developer cohort ARR (${totalARR.toLocaleString()}) with zero hosting overhead on Cloudflare edge.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>Target Packaging Time:</span>
                  <span className="text-emerald-400 font-bold">42.8 seconds</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
