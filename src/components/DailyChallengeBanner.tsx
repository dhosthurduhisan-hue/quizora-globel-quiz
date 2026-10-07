import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, CheckCircle, ArrowRight, Sparkles, BookOpen, Puzzle } from 'lucide-react';

interface DailyChallengeBannerProps {
  onStartDailyQuiz: (quizId: string) => void;
  onStartDailyPuzzle: (puzzleId: string) => void;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  onStartDailyQuiz,
  onStartDailyPuzzle,
}) => {
  const { dailyState, claimDailyBonus } = useAuth();
  const streakBonusXp = dailyState.streakDays * 30 + 150;
  const isComboComplete = dailyState.quizCompleted && dailyState.puzzleCompleted;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
      {/* Subtle accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{dailyState.streakDays}-Day Active Streak</span>
            </div>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[10px] text-indigo-300 font-mono bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              Auto-refreshes daily
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
            Today's Daily Challenge Combo
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Complete today's automated featured quiz and logic puzzle to advance your daily streak and claim the{' '}
            <span className="text-amber-300 font-semibold font-mono">+{streakBonusXp} XP</span> combo bonus.
          </p>
        </div>

        {/* Challenge Action Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
          {/* Daily Quiz Card */}
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  dailyState.quizCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {dailyState.quizCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
              </div>
              <div className="max-w-[150px] sm:max-w-[180px]">
                <div className="text-xs font-semibold text-white truncate">
                  {dailyState.quizTitle || 'Today\'s Quiz'}
                </div>
                <div className="text-[11px] text-slate-400 capitalize truncate">
                  {dailyState.quizCategory || 'Daily Trivia'}
                </div>
              </div>
            </div>

            {dailyState.quizCompleted ? (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                Completed
              </span>
            ) : (
              <button
                onClick={() => onStartDailyQuiz(dailyState.quizId)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Play</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Daily Puzzle Card */}
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  dailyState.puzzleCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {dailyState.puzzleCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Puzzle className="w-5 h-5" />
                )}
              </div>
              <div className="max-w-[150px] sm:max-w-[180px]">
                <div className="text-xs font-semibold text-white truncate">
                  {dailyState.puzzleTitle || 'Today\'s Puzzle'}
                </div>
                <div className="text-[11px] text-slate-400 capitalize truncate">
                  {dailyState.puzzleType ? dailyState.puzzleType.replace('_', ' ') : 'Logic Grid'}
                </div>
              </div>
            </div>

            {dailyState.puzzleCompleted ? (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                Completed
              </span>
            ) : (
              <button
                onClick={() => onStartDailyPuzzle(dailyState.puzzleId)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Solve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bonus Claim Bar */}
      {isComboComplete && (
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Both daily challenges completed! Claim your streak bonus now.</span>
          </div>

          {dailyState.bonusClaimed ? (
            <span className="text-xs text-emerald-400 font-semibold">Bonus Claimed Today ✓</span>
          ) : (
            <button
              onClick={claimDailyBonus}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer animate-pulse"
            >
              Claim +{streakBonusXp} XP Bonus
            </button>
          )}
        </div>
      )}
    </div>
  );
};
