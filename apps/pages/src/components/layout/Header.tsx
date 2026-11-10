import React from 'react';
import { Sun, Moon, ArrowUpRight, Cpu } from 'lucide-react';

interface HeaderProps {
  currentView: 'blog' | 'pipeline' | 'widgets' | 'specs' | 'agent' | 'telemetry';
  setCurrentView: (view: 'blog' | 'pipeline' | 'widgets' | 'specs' | 'agent' | 'telemetry') => void;
  isDark: boolean;
  toggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  isDark,
  toggleDark,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark with glowing gradient badge */}
        <button
          onClick={() => setCurrentView('blog')}
          className="flex items-center gap-2.5 text-left group cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 via-cyan-500 to-indigo-600 p-[1px] shadow-sm shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[7px] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white leading-none">
              LaunchPilot <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent font-extrabold">& SaaS Pass</span>
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-wider uppercase mt-0.5">
              OpenSpec System Engine
            </div>
          </div>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => setCurrentView('blog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'blog'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Engineering Blog
          </button>

          <button
            onClick={() => setCurrentView('pipeline')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'pipeline'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-cyan-500'
                : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Edge Pipeline
          </button>

          <button
            onClick={() => setCurrentView('widgets')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'widgets'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Interactive Widgets
          </button>

          <button
            onClick={() => setCurrentView('specs')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'specs'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-indigo-500'
                : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            OpenSpec Blueprints
          </button>

          <button
            onClick={() => setCurrentView('agent')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'agent'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-cyan-500'
                : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Autonomous Execution
          </button>

          <button
            onClick={() => setCurrentView('telemetry')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'telemetry'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Live Telemetry
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle + status indicator */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Subtle real-time status beacon */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tabular-nums">Sub-50ms Edge OK</span>
          </div>

          <button
            onClick={toggleDark}
            aria-label="Toggle theme"
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setCurrentView('specs')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 dark:from-white dark:to-neutral-100 dark:text-neutral-950 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
          >
            <span>OpenSpec Specs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Nav row */}
      <div className="lg:hidden flex items-center justify-around py-2 px-3 border-t border-neutral-100 dark:border-neutral-900 text-xs overflow-x-auto bg-neutral-50/50 dark:bg-neutral-950">
        <button
          onClick={() => setCurrentView('blog')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'blog' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`}
        >
          Blog
        </button>
        <button
          onClick={() => setCurrentView('pipeline')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'pipeline' ? 'font-bold text-cyan-600 dark:text-cyan-400' : 'text-neutral-500'}`}
        >
          Pipeline
        </button>
        <button
          onClick={() => setCurrentView('widgets')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'widgets' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`}
        >
          Widgets
        </button>
        <button
          onClick={() => setCurrentView('specs')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'specs' ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-neutral-500'}`}
        >
          Specs
        </button>
        <button
          onClick={() => setCurrentView('agent')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'agent' ? 'font-bold text-cyan-600 dark:text-cyan-400' : 'text-neutral-500'}`}
        >
          Agent
        </button>
        <button
          onClick={() => setCurrentView('telemetry')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'telemetry' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`}
        >
          Telemetry
        </button>
      </div>
    </header>
  );
};
