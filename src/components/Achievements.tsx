import React, { useState, useMemo } from 'react';
import { UserProfile, Achievement } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { StorageService } from '../services/storage';
import {
  Trophy,
  Flame,
  Zap,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Brain,
  Puzzle,
  Compass,
  Crown,
  Heart,
  Rocket,
  Layers,
  Grid,
  Filter,
  LucideIcon
} from 'lucide-react';

interface AchievementsProps {
  user: UserProfile;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Flame,
  Trophy,
  Award,
  Sparkles,
  Brain,
  Puzzle,
  Compass,
  Crown,
  Heart,
  Rocket,
  Layers,
  Grid,
};

export const Achievements: React.FC<AchievementsProps> = ({ user }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'streak' | 'quiz' | 'puzzle' | 'xp' | 'unlocked'>('all');
  const attempts = useMemo(() => StorageService.getAttempts(), []);
  const perfectScoresCount = useMemo(() => attempts.filter((a) => a.accuracy === 100).length, [attempts]);

  // Compute progress for each achievement
  const achievementsWithProgress = useMemo(() => {
    return ACHIEVEMENTS_DATA.map((ach) => {
      let currentVal = 0;
      let unit = '';

      switch (ach.progressMetric) {
        case 'xp':
          currentVal = user.xp;
          unit = 'XP';
          break;
        case 'streak':
          currentVal = user.currentStreak;
          unit = 'days';
          break;
        case 'quizzes':
          currentVal = user.quizzesCompleted;
          unit = 'quizzes';
          break;
        case 'puzzles':
          currentVal = user.puzzlesSolved;
          unit = 'puzzles';
          break;
        case 'categories':
          currentVal = user.favoriteCategories ? user.favoriteCategories.length : 0;
          unit = 'categories';
          break;
        case 'perfect_scores':
          currentVal = perfectScoresCount;
          unit = 'perfect runs';
          break;
        default:
          currentVal = 0;
          unit = '';
      }

      const isUnlocked = user.unlockedAchievements.includes(ach.id) || currentVal >= ach.threshold;
      const progressPercent = Math.min(100, Math.round((currentVal / ach.threshold) * 100));

      return {
        ...ach,
        currentVal,
        unit,
        isUnlocked,
        progressPercent,
      };
    });
  }, [user, perfectScoresCount]);

  // Overall milestone statistics
  const unlockedCount = achievementsWithProgress.filter((a) => a.isUnlocked).length;
  const totalCount = achievementsWithProgress.length;
  const totalClaimedXp = achievementsWithProgress
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);
  const overallPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Next up milestone (highest non-completed progress percentage)
  const nextUp = useMemo(() => {
    const locked = achievementsWithProgress.filter((a) => !a.isUnlocked);
    if (locked.length === 0) return null;
    return locked.sort((a, b) => b.progressPercent - a.progressPercent)[0];
  }, [achievementsWithProgress]);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    if (selectedFilter === 'all') return achievementsWithProgress;
    if (selectedFilter === 'unlocked') return achievementsWithProgress.filter((a) => a.isUnlocked);
    return achievementsWithProgress.filter((a) => a.category === selectedFilter);
  }, [achievementsWithProgress, selectedFilter]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-7 shadow-xl">
      {/* Top Header & Analytics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Milestones & Badges</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display mt-1">
            Tracked Achievements
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Reach consecutive streak records, master diverse quiz categories, and claim bonus XP by conquering milestones.
          </p>
        </div>

        {/* Global Progress Metrics */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shrink-0">
          <div>
            <div className="text-[11px] text-slate-400">Milestones Unlocked</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {unlockedCount} / {totalCount}
            </div>
            <div className="text-[10px] text-amber-400 font-semibold font-mono">
              +{totalClaimedXp} XP Earned
            </div>
          </div>

          <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center font-mono">
            <span className="text-sm font-bold text-indigo-400 tabular-nums">{overallPercentage}%</span>
            <span className="text-[9px] text-slate-500 uppercase">Done</span>
          </div>
        </div>
      </div>

      {/* Next Up Spotlight (if any milestone pending) */}
      {nextUp && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/40 via-slate-950/60 to-purple-950/40 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                Next Milestone to Unlock
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{nextUp.title}</span>
                <span className="text-xs text-amber-400 font-mono">+{nextUp.xpReward} XP</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{nextUp.description}</p>
            </div>
          </div>

          <div className="sm:text-right shrink-0 min-w-[140px] space-y-1.5">
            <div className="text-xs font-mono text-slate-300 font-semibold tabular-nums">
              {Math.min(nextUp.currentVal, nextUp.threshold)} / {nextUp.threshold} {nextUp.unit} ({nextUp.progressPercent}%)
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${nextUp.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Milestones' },
          { id: 'streak', label: 'Streaks' },
          { id: 'quiz', label: 'Quizzes' },
          { id: 'puzzle', label: 'Puzzles' },
          { id: 'xp', label: 'XP & Rank' },
          { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const IconComponent = ICON_MAP[ach.iconName] || Award;

          return (
            <div
              key={ach.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-4 ${
                ach.isUnlocked
                  ? 'bg-slate-950/80 border-amber-500/30 hover:border-amber-500/50 shadow-md shadow-amber-950/10'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Unlocked background subtle glow */}
              {ach.isUnlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              )}

              {/* Card Top: Icon + Status Badge */}
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    ach.isUnlocked
                      ? 'bg-gradient-to-br from-amber-500/20 to-indigo-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    +{ach.xpReward} XP
                  </span>

                  {ach.isUnlocked ? (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content: Title + Description */}
              <div className="space-y-1 relative z-10">
                <h3 className={`text-sm font-bold tracking-tight ${ach.isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Card Bottom: Progress Bar */}
              <div className="pt-2 border-t border-slate-850 space-y-1.5 relative z-10">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    {ach.isUnlocked ? 'Milestone achieved' : 'Progress'}
                  </span>
                  <span className={`font-semibold tabular-nums ${ach.isUnlocked ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {ach.isUnlocked ? (
                      'Completed ✓'
                    ) : (
                      `${Math.min(ach.currentVal, ach.threshold)} / ${ach.threshold} ${ach.unit}`
                    )}
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      ach.isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${ach.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
