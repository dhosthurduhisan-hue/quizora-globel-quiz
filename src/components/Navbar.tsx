import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Flame, User, LogOut, Shield, Award, Camera } from 'lucide-react';
import { calculateLevel } from '../services/storage';
import { Logo } from './Logo';

export type ActiveTab =
  | 'home'
  | 'quizzes'
  | 'puzzles'
  | 'daily'
  | 'leaderboard'
  | 'categories'
  | 'profile'
  | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenAvatarModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSearch, onOpenAvatarModal }) => {
  const { user, isAuthenticated, logout, setIsAuthModalOpen } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const levelInfo = calculateLevel(user.xp);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark with Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors shrink-0 text-left font-display group cursor-pointer"
        >
          <Logo size="sm" />
          <span className="font-display font-black tracking-tight">Quizora</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'home' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'quizzes' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('puzzles')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'puzzles' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Puzzles
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'daily' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Challenge
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'leaderboard' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'categories' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'admin' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline-block text-[10px] text-slate-500 font-mono">⌘K</kbd>
          </button>

          {/* Daily Streak Indicator */}
          <div
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-semibold text-amber-400 cursor-pointer hover:bg-amber-500/20 transition-colors"
            title={`Current streak: ${user.currentStreak} days`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="tabular-nums">{user.currentStreak}d</span>
          </div>

          {/* User Auth / Profile */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-medium text-white truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-indigo-400 tabular-nums">
                    Lvl {levelInfo.level} · {user.xp} XP
                  </div>
                </div>
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-500/40"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-300">
                      <span>{levelInfo.title}</span>
                      <span className="tabular-nums">{user.xp} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile & Stats</span>
                  </button>
                  {onOpenAvatarModal && (
                    <button
                      onClick={() => {
                        onOpenAvatarModal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-indigo-400" />
                      <span>Change Profile Photo</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Admin Dashboard</span>
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-950 font-medium text-xs rounded-lg hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
