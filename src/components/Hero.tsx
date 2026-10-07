import React from 'react';
import { ArrowRight, Sparkles, Brain, Compass, Trophy } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HeroProps {
  onNavigate: (tab: ActiveTab) => void;
  onStartQuiz: (quizId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onStartQuiz }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-slate-800/80">
      {/* Background Graphic Asset with High Contrast Scrim */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/hero_quiz_mind_1791200336656.jpg"
          alt="Quizora Knowledge Core"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      </div>

      {/* Floating subtle geometric elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl space-y-6">
          {/* Subtle text kicker (no pill badge) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            <span>Play · Think · Learn · Compete</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display [text-wrap:balance]">
            Test Your Mind. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Challenge Your Limits.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Explore thousands of curated quizzes and logic puzzles, earn XP, climb the global
            leaderboard, and discover how much you really know.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onStartQuiz('quiz-quantum-frontiers')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 group cursor-pointer whitespace-nowrap"
            >
              <span>Start Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('puzzles')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>Explore Puzzles</span>
            </button>

            <button
              onClick={() => onNavigate('categories')}
              className="px-5 py-3 text-slate-400 hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Browse 10+ Categories</span>
            </button>
          </div>

          {/* Platform Live Proof Counters (Single Line, clean text) */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">1,000+</div>
              <div className="text-xs text-slate-400 mt-0.5">Quizzes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">12 Puzzles</div>
              <div className="text-xs text-slate-400 mt-0.5">Logic & Math Hubs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">98.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Knowledge Retention</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
