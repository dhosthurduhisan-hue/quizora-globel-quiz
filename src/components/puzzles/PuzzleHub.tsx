import React, { useState } from 'react';
import { Puzzle, PuzzleType } from '../../types';
import { INITIAL_PUZZLES } from '../../data/puzzles';
import { Clock, Zap, ArrowRight, Brain, Sparkles, Filter, Award } from 'lucide-react';

interface PuzzleHubProps {
  onSelectPuzzle: (puzzleId: string) => void;
}

export const PuzzleHub: React.FC<PuzzleHubProps> = ({ onSelectPuzzle }) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredPuzzles = INITIAL_PUZZLES.filter((p) => {
    if (selectedType !== 'all' && p.type !== selectedType) return false;
    return true;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'text-emerald-400';
      case 'medium':
        return 'text-amber-400';
      case 'hard':
        return 'text-rose-400';
      case 'master':
        return 'text-purple-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase">
          <span>Cognitive Gymnasium</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
          Logic & Puzzle Hub
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Sharpen your mental agility with daily interactive logic grids, Nonograms with badge rewards,
          word searches, neural memory matrixes, and lateral enigmas.
        </p>
      </div>

      {/* Filter Tabs (Interactive Segmented Control) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        {[
          { id: 'all', label: 'All 12 Puzzles' },
          { id: 'sos', label: 'SOS Game (Hisan & Friends)' },
          { id: 'nonogram', label: 'Nonogram' },
          { id: 'sliding_tile', label: '15-Puzzle Slider' },
          { id: 'lights_out', label: 'Lights Out' },
          { id: 'sudoku', label: 'Sudoku' },
          { id: 'word_search', label: 'Word Search' },
          { id: 'memory_match', label: 'Memory Matrix' },
          { id: 'riddle', label: 'Riddles & Enigmas' },
          { id: 'sequence_pattern', label: 'Sequence & Math' },
          { id: 'crossword', label: 'Mini Crossword' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedType === tab.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Puzzle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPuzzles.map((puzzle) => (
          <article
            key={puzzle.id}
            className="group bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
              {puzzle.thumbnail ? (
                <img
                  src={puzzle.thumbnail}
                  alt={puzzle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950">
                  <Brain className="w-10 h-10 text-emerald-400/40" />
                </div>
              )}

              {/* Floating XP Reward in corner */}
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 rounded-lg px-2.5 py-1 flex items-center gap-1 text-xs font-semibold text-emerald-300 tabular-nums shadow-md">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>+{puzzle.xpReward} XP</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                {/* Zero-Pill Unboxed Clean Metadata Kicker */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="capitalize">{puzzle.type.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className={`font-semibold capitalize ${getDifficultyColor(puzzle.difficulty)}`}>
                    {puzzle.difficulty}
                  </span>
                  {puzzle.isDaily && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400 font-medium">Daily Spotlight</span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {puzzle.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {puzzle.description}
                </p>

                {/* Badge Reward Indicator */}
                {puzzle.badgeReward && (
                  <div className="pt-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] font-semibold text-amber-300">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unlock Badge: {puzzle.badgeReward.title}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Metrics and Play CTA */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{puzzle.estimatedTimeMin} min</span>
                  </div>
                  <div className="tabular-nums">
                    {(puzzle.playsCount / 1000).toFixed(1)}k plays
                  </div>
                </div>

                <button
                  onClick={() => onSelectPuzzle(puzzle.id)}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 group/btn cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <span>{puzzle.badgeReward ? 'Play for Badge' : 'Solve Logic Puzzle'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
