import React, { useState, useId } from 'react';
import { Calculator, CheckCircle2, Copy, RefreshCw, Sparkles } from 'lucide-react';

export interface WtpCalculatorProps {
  defaultPersona?: 'solo_hacker' | 'serial_founder' | 'dev_agency';
  initialPainScore?: number;
  defaultMonthlyPrice?: number;
  interactive?: boolean;
  headline?: string;
}

interface PersonaPreset {
  id: 'solo_hacker' | 'serial_founder' | 'dev_agency';
  label: string;
  defaultPain: number;
  defaultFriction: number;
  defaultBudget: number;
  defaultPrice: number;
  marketSize: number;
  accent: string;
  description: string;
}

const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: 'solo_hacker',
    label: 'Solo Developer',
    defaultPain: 8,
    defaultFriction: 7,
    defaultBudget: 150,
    defaultPrice: 29,
    marketSize: 850,
    accent: 'from-emerald-500 to-teal-500',
    description: 'Independent hacker building micro-SaaS with zero full-time ops support.',
  },
  {
    id: 'serial_founder',
    label: 'Serial Founder',
    defaultPain: 9,
    defaultFriction: 8,
    defaultBudget: 450,
    defaultPrice: 49,
    marketSize: 320,
    accent: 'from-cyan-500 to-blue-500',
    description: 'Operates 3+ live web properties; optimizes for time-to-first-dollar.',
  },
  {
    id: 'dev_agency',
    label: 'Boutique Dev Agency',
    defaultPain: 7,
    defaultFriction: 9,
    defaultBudget: 1200,
    defaultPrice: 99,
    marketSize: 140,
    accent: 'from-indigo-500 to-purple-500',
    description: 'Ships bespoke client apps; requires high-throughput edge compute.',
  },
];

export const WtpCalculator: React.FC<WtpCalculatorProps> = ({
  defaultPersona = 'solo_hacker',
  initialPainScore = 8,
  defaultMonthlyPrice = 29,
  interactive = true,
  headline = 'Willingness-to-Pay (WTP) Scorecard Widget',
}) => {
  const painInputId = useId();
  const frictionInputId = useId();
  const budgetInputId = useId();
  const priceInputId = useId();

  const [persona, setPersona] = useState<'solo_hacker' | 'serial_founder' | 'dev_agency'>(defaultPersona);
  const [painScore, setPainScore] = useState<number>(initialPainScore);
  const [frictionScore, setFrictionScore] = useState<number>(7);
  const [targetBudget, setTargetBudget] = useState<number>(150);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(defaultMonthlyPrice);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPersona = (p: 'solo_hacker' | 'serial_founder' | 'dev_agency') => {
    setPersona(p);
    const preset = PERSONA_PRESETS.find((x) => x.id === p);
    if (preset) {
      setPainScore(preset.defaultPain);
      setFrictionScore(preset.defaultFriction);
      setTargetBudget(preset.defaultBudget);
      setMonthlyPrice(preset.defaultPrice);
    }
  };

  // WTP Mathematical Formula defined in OpenSpec Module A/F
  const logBudget = Math.log10(Math.max(10, targetBudget));
  const rawWtp = Math.round((painScore * 3.5 + frictionScore * 2.5 + logBudget * 12.0) / 0.75);
  const wtpScore = Math.min(100, Math.max(10, rawWtp));

  const preset = PERSONA_PRESETS.find((x) => x.id === persona)!;
  const estimatedConversionRate = Math.min(18, Math.max(1.5, (wtpScore / 100) * 12.5));
  const estimatedSubscribers = Math.round((preset.marketSize * estimatedConversionRate) / 100);
  const projectedMRR = estimatedSubscribers * monthlyPrice;
  const projectedARR = projectedMRR * 12;

  let tierClassification = 'High Viability — Greenlit for Build';
  let tierAdvice = 'Strong customer pull detected. Recommended to scaffold Module B immediately.';
  let gaugeGradient = 'from-emerald-500 via-teal-400 to-cyan-500';
  let badgeTone = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';

  if (wtpScore < 50) {
    tierClassification = 'Weak Signal — Refine Problem Statement';
    tierAdvice = 'Friction and pain indicators too low. Solo developers will default to DIY code generation.';
    gaugeGradient = 'from-rose-500 to-amber-500';
    badgeTone = 'border-rose-500/30 bg-rose-500/10 text-rose-400';
  } else if (wtpScore < 72) {
    tierClassification = 'Moderate Viability — Price Sensitivity Risk';
    tierAdvice = 'Viable if priced under $29/mo or bundled inside SaaS Pass Starter Tier.';
    gaugeGradient = 'from-amber-500 to-yellow-400';
    badgeTone = 'border-amber-500/30 bg-amber-500/10 text-amber-400';
  }

  const handleCopyReport = () => {
    const report = {
      calculator: 'LaunchPilot OpenSpec WTP Scorecard v1.0',
      persona,
      painScore,
      frictionScore,
      targetBudgetUSD: targetBudget,
      monthlyPriceUSD: monthlyPrice,
      wtpScore,
      tierClassification,
      projectedMRR,
      projectedARR,
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 shadow-xl overflow-hidden text-neutral-900 dark:text-neutral-100 transition-all">
      {/* Widget Header with colorful gradient accent */}
      <div className="px-6 py-4 border-b border-neutral-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-neutral-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>{headline}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                LIVE COMPUTE
              </span>
            </h4>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>OpenSpec Module A & F Contract</span>
              <span aria-hidden="true">·</span>
              <span>Mathematical Intent Classifier</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectPersona(defaultPersona)}
            className="px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1.5"
            title="Reset to default preset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-emerald-500 dark:to-cyan-600 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied JSON' : 'Export Assessment'}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Audience Segment Selector */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase mb-2">
              Select Developer Segment Profile
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PERSONA_PRESETS.map((p) => {
                const isSelected = persona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPersona(p.id)}
                    className={`px-3.5 py-3 text-xs font-medium rounded-xl text-left transition-all border relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                        : 'border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-950/40 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{p.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                    <div className="text-[11px] opacity-75 mt-0.5 truncate font-mono">${p.defaultPrice}/mo tier</div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {preset.description} ({preset.marketSize} verified developer sample size).
            </p>
          </div>

          {/* Slider: Pain Severity */}
          <div className="space-y-2 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-white/5">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor={painInputId} className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <span>Pain Severity Index</span>
              </label>
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20 tabular-nums">
                {painScore} / 10
              </span>
            </div>
            <input
              id={painInputId}
              type="range"
              min="1"
              max="10"
              step="1"
              value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              disabled={!interactive}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
              <span>Minor Nuisance</span>
              <span>Existential Engineering Blocker</span>
            </div>
          </div>

          {/* Slider: Replacement Friction */}
          <div className="space-y-2 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-white/5">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor={frictionInputId} className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <span>DIY / Replacement Friction</span>
              </label>
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-md border border-cyan-500/20 tabular-nums">
                {frictionScore} / 10
              </span>
            </div>
            <input
              id={frictionInputId}
              type="range"
              min="1"
              max="10"
              step="1"
              value={frictionScore}
              onChange={(e) => setFrictionScore(Number(e.target.value))}
              disabled={!interactive}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
              <span>Trivial to Prompt an LLM</span>
              <span>Requires Custom Edge Infra & Ops</span>
            </div>
          </div>

          {/* Grid: Budget & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-white/5">
              <label htmlFor={budgetInputId} className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Target Monthly Tooling Budget
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-400 font-mono">$</span>
                <input
                  id={budgetInputId}
                  type="number"
                  min="10"
                  max="5000"
                  step="10"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Math.max(10, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono tabular-nums rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-white/5">
              <label htmlFor={priceInputId} className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Proposed Subscription Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-400 font-mono">$</span>
                <input
                  id={priceInputId}
                  type="number"
                  min="5"
                  max="999"
                  step="1"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(Math.max(5, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono tabular-nums rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Score Output & Economic Projection */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white border border-white/10 shadow-xl relative overflow-hidden">
          {/* Ambient luminous glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold tracking-wider uppercase text-neutral-400">
                WTP Score (0-100)
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${badgeTone}`}>
                {wtpScore >= 70 ? 'STRONG SIGNAL' : wtpScore >= 50 ? 'MODERATE' : 'WEAK SIGNAL'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black font-mono tracking-tight tabular-nums bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {wtpScore}
              </span>
              <span className="text-sm font-mono text-neutral-400">/ 100</span>
            </div>

            {/* Glowing progress bar */}
            <div className="w-full h-2.5 rounded-full bg-neutral-800/80 overflow-hidden mb-4 p-[1px]">
              <div
                className={`h-full bg-gradient-to-r ${gaugeGradient} rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50`}
                style={{ width: `${wtpScore}%` }}
              />
            </div>

            {/* Diagnosis */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tierClassification}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {tierAdvice}
              </p>
            </div>

            {/* Economic Metrics Matrix */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Est. Conversion Likelihood</span>
                <span className="font-mono font-bold tabular-nums text-emerald-400">
                  {estimatedConversionRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Projected Cohort Size</span>
                <span className="font-mono font-bold tabular-nums text-neutral-200">
                  {estimatedSubscribers} founders
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Monthly Run Rate (MRR)</span>
                <span className="font-mono font-bold tabular-nums text-cyan-300">
                  ${projectedMRR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
                <span className="font-semibold text-neutral-200">Projected Annual ARR</span>
                <span className="font-mono font-extrabold text-base text-amber-300 tabular-nums">
                  ${projectedARR.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Formula: OpenSpec Module A</span>
            <span className="text-emerald-400">Sub-50ms Edge Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
