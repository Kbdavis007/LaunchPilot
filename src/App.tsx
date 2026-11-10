/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from './data/blogData';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MdxPostViewer } from './components/blog/MdxPostViewer';
import { WtpCalculator } from './components/widgets/WtpCalculator';
import { RoadmapTimeline } from './components/widgets/RoadmapTimeline';
import { TelemetryChart } from './components/widgets/TelemetryChart';
import { ArchitecturePipeline } from './components/architecture/ArchitecturePipeline';
import { OpenSpecExplorer } from './components/specs/OpenSpecExplorer';
import { OpenHandsSimulator } from './components/agent/OpenHandsSimulator';
import { ArrowRight, Sparkles, Terminal, Activity, Layers, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'blog' | 'pipeline' | 'widgets' | 'specs' | 'agent' | 'telemetry'>('blog');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isDark, setIsDark] = useState<boolean>(true); // Default to dark for dramatic, cutting-edge aesthetics

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  const selectedPost = BLOG_POSTS.find((p) => p.slug === selectedPostSlug);
  const allTags = ['All', ...Array.from(new Set(BLOG_POSTS.flatMap((p) => p.frontmatter.tags)))];

  const filteredPosts = BLOG_POSTS.filter((p) => {
    if (selectedTag === 'All') return true;
    return p.frontmatter.tags.includes(selectedTag);
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#08090d] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950 transition-colors relative overflow-hidden">
      {/* Background ambient mesh glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSelectedPostSlug(null);
        }}
        isDark={isDark}
        toggleDark={toggleDark}
      />

      <main className="flex-1">
        {/* VIEW 1: BLOG & DISPATCHES */}
        {currentView === 'blog' && (
          <div>
            {selectedPost ? (
              <MdxPostViewer post={selectedPost} onBack={() => setSelectedPostSlug(null)} />
            ) : (
              <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-12">
                {/* Hero Showcase Section */}
                <div className="relative rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-white/10 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 shadow-2xl p-8 sm:p-14 text-white">
                  {/* Subtle Background Edge Mesh Illustration */}
                  <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-35 mix-blend-screen pointer-events-none overflow-hidden">
                    <img
                      src="/src/assets/images/hero_edge_architecture_1794285169852.jpg"
                      alt="Edge Architecture Glow"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
                  </div>

                  <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        PHASE 1 ACTIVE ROLLOUT
                      </span>
                      <span className="text-xs font-mono text-cyan-300">OpenSpec Architecture Engine</span>
                    </div>

                    <h1
                      className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent"
                      style={{ textWrap: 'balance' }}
                    >
                      Why Code Execution Speed Is No Longer the Bottleneck
                    </h1>

                    <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
                      Introducing LaunchPilot & SaaS Pass: the first autonomous, self-referential software factory built on serverless edge isolates, parameterized D1 SQL, and contract-driven OpenSpecs.
                    </p>

                    {/* Interactive CTAs */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => setSelectedPostSlug('01-paradigm-shift-and-vision')}
                        className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-neutral-950 hover:opacity-95 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <span>Read Day 1 Dispatch</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCurrentView('pipeline')}
                        className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>Inspect Edge Pipeline</span>
                      </button>
                    </div>

                    {/* Quick Live Spec Metric Bar */}
                    <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <div className="text-neutral-400 text-[11px]">Runtime SLA</div>
                        <div className="text-emerald-400 font-bold text-sm mt-0.5">&lt;50ms Global p95</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 text-[11px]">Isolation</div>
                        <div className="text-cyan-400 font-bold text-sm mt-0.5">Zero Node.js Builtins</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 text-[11px]">Live Validation</div>
                        <div className="text-amber-400 font-bold text-sm mt-0.5">Self-Referential</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tag Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                      Day 1 Engineering Dispatches
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Canonical MDX logs documenting architecture, roadmaps, and target metrics.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                          selectedTag === tag
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredPosts.map((post, idx) => {
                    const accents = [
                      { border: 'hover:border-emerald-500/60', badge: 'text-emerald-500', bar: 'from-emerald-500 to-teal-500' },
                      { border: 'hover:border-cyan-500/60', badge: 'text-cyan-500', bar: 'from-cyan-500 to-blue-500' },
                      { border: 'hover:border-indigo-500/60', badge: 'text-indigo-500', bar: 'from-indigo-500 to-purple-500' },
                    ];
                    const accent = accents[idx % accents.length];

                    return (
                      <div
                        key={post.slug}
                        onClick={() => setSelectedPostSlug(post.slug)}
                        className={`group cursor-pointer rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 ${accent.border} relative overflow-hidden`}
                      >
                        {/* Glowing top line on hover */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent.bar} opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div>
                          {/* Unboxed metadata row */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3 font-mono">
                            <span className={`font-bold ${accent.badge}`}>{post.frontmatter.phase}</span>
                            <span>·</span>
                            <span>{post.frontmatter.date}</span>
                            <span>·</span>
                            <span>{post.frontmatter.reading_time_minutes}m read</span>
                          </div>

                          <h3
                            className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors leading-snug"
                            style={{ textWrap: 'balance' }}
                          >
                            {post.frontmatter.title}
                          </h3>

                          <p className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                            {post.frontmatter.summary}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                          <div className="text-[11px] font-mono text-neutral-400">
                            {post.frontmatter.author.handle}
                          </div>
                          <div className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform">
                            <span>Read</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: EDGE PIPELINE */}
        {currentView === 'pipeline' && <ArchitecturePipeline />}

        {/* VIEW 3: INTERACTIVE WIDGETS */}
        {currentView === 'widgets' && (
          <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Safe MDX Component Registry (Module F)</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                Interactive MDX React Widgets
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Embedded directly inside MDX prose at compile time for real-time mathematical simulation, phased roadmaps, and live telemetry.
              </p>
            </div>

            <section>
              <WtpCalculator defaultPersona="solo_hacker" initialPainScore={8} defaultMonthlyPrice={29} interactive={true} />
            </section>

            <section>
              <RoadmapTimeline activePhase="Phase 1" expandable={true} variant="detailed" />
            </section>

            <section>
              <TelemetryChart primaryMetric="all" refreshIntervalSeconds={4} telemetrySource="edge_benchmark" />
            </section>
          </div>
        )}

        {/* VIEW 4: OPENSPEC EXPLORER */}
        {currentView === 'specs' && <OpenSpecExplorer />}

        {/* VIEW 5: OPENHANDS SIMULATOR */}
        {currentView === 'agent' && <OpenHandsSimulator />}

        {/* VIEW 6: TELEMETRY */}
        {currentView === 'telemetry' && (
          <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                Live Edge Telemetry & Business Outcomes
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Monitoring our sub-50ms p95 global SLA, SaaS Pass 50-developer onboarding cohort, and automated Acquire.com asset exporter.
              </p>
            </div>
            <TelemetryChart primaryMetric="all" refreshIntervalSeconds={4} telemetrySource="edge_benchmark" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
