import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { StorageService, calculateLevel } from '../services/storage';
import { AvatarUploadModal } from './AvatarUploadModal';
import { EditProfileModal } from './EditProfileModal';
import { Achievements } from './Achievements';
import {
  Trophy,
  Flame,
  Zap,
  Award,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  Brain,
  Camera,
  Edit3,
  UserCheck,
  LucideIcon
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, setIsAuthModalOpen } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const levelInfo = calculateLevel(user.xp);
  const attempts = StorageService.getAttempts();

  const accuracy =
    user.questionsAnswered > 0
      ? Math.round((user.correctAnswers / user.questionsAnswered) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Clickable Profile Avatar with Camera Icon Overlay */}
            <div
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative group cursor-pointer shrink-0"
              title="Click to change profile picture"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500/50 group-hover:border-indigo-400 transition-colors shadow-md"
              />
              <div className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-semibold gap-1 backdrop-blur-xs">
                <Camera className="w-5 h-5 text-indigo-300" />
                <span>Change</span>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-indigo-600 rounded-md text-[10px] font-bold text-white font-mono uppercase tracking-wider shadow">
                Lvl {levelInfo.level}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {user.name}
                </h1>
                {user.provider === 'google' ? (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                    Google Verified
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    Guest Explorer
                  </span>
                )}
              </div>

              {user.email && (
                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
              )}

              <p className="text-xs text-indigo-300 font-medium pt-0.5">
                {levelInfo.title} Ranking · Member since 2026
              </p>

              {user.bio && (
                <p className="text-xs text-slate-300 italic pt-0.5 max-w-md">
                  "{user.bio}"
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700/80"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* If guest, show Google Sign-In promo */}
          {user.provider !== 'google' && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2.5 bg-white text-slate-950 font-medium text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2 self-start sm:self-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Connect Google Account</span>
            </button>
          )}
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Level {levelInfo.level} Progress</span>
            <span className="text-white font-mono tabular-nums">
              {user.xp} / {levelInfo.maxXp} XP ({levelInfo.progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Core Statistics Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Quizzes Solved</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {user.quizzesCompleted}
          </div>
          <div className="text-[11px] text-slate-400">
            {user.questionsAnswered} total answers logged
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Overall Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {accuracy}%
          </div>
          <div className="text-[11px] text-slate-400">
            {user.correctAnswers} correct solutions
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Daily Streak</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {user.currentStreak} Days
          </div>
          <div className="text-[11px] text-slate-400">
            Longest record: {user.longestStreak} days
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Puzzles Solved</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {user.puzzlesSolved}
          </div>
          <div className="text-[11px] text-slate-400">Logic & math challenges</div>
        </div>
      </div>

      {/* Achievements & Milestones Showcase */}
      <Achievements user={user} />

      {/* Recent Attempts History */}
      {attempts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white font-display">Recent Quiz History</h2>
          <div className="divide-y divide-slate-800/80">
            {attempts.slice(0, 5).map((att) => (
              <div key={att.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white">{att.quizTitle}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{att.accuracy}% Accuracy</span>
                    <span aria-hidden="true">·</span>
                    <span>{att.correctCount} correct</span>
                    <span aria-hidden="true">·</span>
                    <span>{Math.round(att.timeSpentSec)}s</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-indigo-400 font-mono tabular-nums">
                  +{att.xpEarned} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Picture Upload & Selector Dialog */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* Edit Profile Details Dialog */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onOpenAvatarUpload={() => setIsAvatarModalOpen(true)}
      />
    </div>
  );
};
