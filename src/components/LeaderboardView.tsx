import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { LeaderboardEntry } from '../types';
import { Trophy, Flame, Zap, Award, ShieldCheck, UserPlus, Sparkles, AlertCircle } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<'global' | 'daily' | 'weekly'>('global');

  // Load registered users who signed up to this website
  useEffect(() => {
    // If the current user is signed up, ensure they are registered in storage
    if (user.provider === 'google' && user.email) {
      StorageService.registerOrUpdateUser(user);
    }
    const list = StorageService.getRegisteredLeaderboard(user.id);
    setRegisteredUsers(list);
  }, [user, isAuthenticated]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center border border-amber-400/40">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-full bg-slate-300/20 text-slate-300 font-bold font-mono text-xs flex items-center justify-center border border-slate-300/40">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 font-bold font-mono text-xs flex items-center justify-center border border-amber-700/40">
          3
        </div>
      );
    }
    return (
      <span className="w-7 text-center font-mono text-xs font-semibold text-slate-400">
        #{rank}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
            <span>Verified Members Only</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Official Leaderboard
          </h1>
          <p className="text-sm text-slate-400">
            Exclusive rankings for registered members who signed up to Quizora.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            {registeredUsers.length} Signed-Up {registeredUsers.length === 1 ? 'Member' : 'Members'}
          </span>
        </div>
      </div>

      {/* Guest Notice Banner if Not Signed Up */}
      {!isAuthenticated && (
        <div className="p-5 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Only users who sign up to Quizora appear on the leaderboard
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                You are currently playing as a guest. Sign up with Google to record your XP, preserve your daily streak, and claim your place in the rankings!
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>
      )}

      {/* Signed In Confirmation Pill */}
      {isAuthenticated && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Signed up as <strong className="text-white">{user.name}</strong> ({user.email}). Your official ranking is live!
            </span>
          </div>
          <span className="font-mono font-bold text-white tabular-nums">
            Total XP: {user.xp}
          </span>
        </div>
      )}

      {/* Leaderboard Table or Empty State */}
      {registeredUsers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Signed-Up Members Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The leaderboard only displays individuals who sign up to this web application. Be the first to create an account and seize the #1 rank!
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Sign up with Google</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                  <th className="py-3.5 px-4 w-16">Rank</th>
                  <th className="py-3.5 px-4">Signed-Up Member</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Level Tier</th>
                  <th className="py-3.5 px-4 text-right">Streak</th>
                  <th className="py-3.5 px-4 text-right">Accuracy</th>
                  <th className="py-3.5 px-4 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs sm:text-sm">
                {registeredUsers.map((entry) => {
                  const isCurrent = entry.isCurrentUser || (user.email && entry.email === user.email);

                  return (
                    <tr
                      key={entry.userId}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-indigo-950/50 border-l-2 border-indigo-500 font-semibold'
                          : 'hover:bg-slate-850/50'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4">{getRankBadge(entry.rank)}</td>

                      {/* Member Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatarUrl}
                            alt={entry.userName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div className="truncate max-w-[160px] sm:max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <span className={isCurrent ? 'text-indigo-300 font-bold' : 'text-white'}>
                                {entry.userName}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            {entry.email && (
                              <div className="text-[11px] text-slate-400 font-mono truncate">
                                {entry.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Google Sign-Up</span>
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="text-xs">
                          Lvl {entry.level} · {entry.levelTitle}
                        </span>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        <span className="inline-flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{entry.streak}d</span>
                        </span>
                      </td>

                      {/* Accuracy */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {entry.accuracy}%
                      </td>

                      {/* XP */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                        <span className="text-amber-400">+{entry.scoreOrXp} XP</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
