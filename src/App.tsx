import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StorageService } from './services/storage';
import { Quiz, QuizAttempt, Puzzle } from './types';
import { INITIAL_PUZZLES } from './data/puzzles';
import { CATEGORIES_DATA } from './data/categories';

// Components
import { Navbar, ActiveTab } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Hero } from './components/Hero';
import { DailyChallengeBanner } from './components/DailyChallengeBanner';
import { QuizDiscovery } from './components/quizzes/QuizDiscovery';
import { QuizCard } from './components/quizzes/QuizCard';
import { QuizPlayer } from './components/quizzes/QuizPlayer';
import { QuizResults } from './components/quizzes/QuizResults';
import { PuzzleHub } from './components/puzzles/PuzzleHub';
import { SudokuPlayer } from './components/puzzles/SudokuPlayer';
import { WordSearchPlayer } from './components/puzzles/WordSearchPlayer';
import { MemoryMatchPlayer } from './components/puzzles/MemoryMatchPlayer';
import { RiddlePlayer } from './components/puzzles/RiddlePlayer';
import { SequencePlayer } from './components/puzzles/SequencePlayer';
import { NonogramPlayer } from './components/puzzles/NonogramPlayer';
import { SOSPlayer } from './components/puzzles/SOSPlayer';
import { SlidingTilePlayer } from './components/puzzles/SlidingTilePlayer';
import { LightsOutPlayer } from './components/puzzles/LightsOutPlayer';
import { CategoriesView } from './components/CategoriesView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { SearchModal } from './components/SearchModal';
import { AvatarUploadModal } from './components/AvatarUploadModal';
import { ToastContainer } from './components/ToastContainer';
import { Logo } from './components/Logo';

import {
  Trophy,
  Flame,
  ArrowRight,
  Brain,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  Award
} from 'lucide-react';

function QuizoraApp() {
  const {
    user,
    recordQuizAttempt,
    recordPuzzleSolved,
    completeDailyQuiz,
    completeDailyPuzzle,
    dailyState,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>(StorageService.getAllQuizzes());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  // Active Gameplay States
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeQuizAttempt, setActiveQuizAttempt] = useState<QuizAttempt | null>(null);
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);

  // Global search modal & avatar upload modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshQuizzes = () => {
    setQuizzes(StorageService.getAllQuizzes());
  };

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizAttempt(null);
    setActivePuzzleId(null);
    setActiveQuizId(quizId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteQuiz = (attempt: QuizAttempt) => {
    recordQuizAttempt(attempt);
    setActiveQuizAttempt(attempt);

    if (activeQuizId === dailyState.quizId) {
      completeDailyQuiz();
    }
  };

  const handleStartPuzzle = (puzzleId: string) => {
    setActiveQuizId(null);
    setActiveQuizAttempt(null);
    setActivePuzzleId(puzzleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompletePuzzle = (xpEarned: number) => {
    if (activePuzzleId) {
      recordPuzzleSolved(activePuzzleId, xpEarned);
      if (activePuzzleId === dailyState.puzzleId) {
        completeDailyPuzzle();
      }
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setActiveTab('quizzes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a quiz is actively being played
  if (activeQuizId) {
    const currentQuiz = quizzes.find((q) => q.id === activeQuizId);
    if (!currentQuiz) {
      setActiveQuizId(null);
      return null;
    }

    if (activeQuizAttempt) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <QuizResults
            quiz={currentQuiz}
            attempt={activeQuizAttempt}
            onRetry={() => {
              setActiveQuizAttempt(null);
              setActiveQuizId(currentQuiz.id);
            }}
            onNextQuiz={() => {
              const otherQuizzes = quizzes.filter((q) => q.id !== currentQuiz.id);
              const nextQ = otherQuizzes[Math.floor(Math.random() * otherQuizzes.length)];
              handleStartQuiz(nextQ ? nextQ.id : currentQuiz.id);
            }}
            onReturnHome={() => {
              setActiveQuizId(null);
              setActiveQuizAttempt(null);
              setActiveTab('home');
            }}
          />
          <ToastContainer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <QuizPlayer
          quiz={currentQuiz}
          onComplete={handleCompleteQuiz}
          onExit={() => {
            setActiveQuizId(null);
            setActiveQuizAttempt(null);
          }}
        />
        <ToastContainer />
      </div>
    );
  }

  // If a puzzle is actively being played
  if (activePuzzleId) {
    const currentPuzzle = INITIAL_PUZZLES.find((p) => p.id === activePuzzleId);
    if (!currentPuzzle) {
      setActivePuzzleId(null);
      return null;
    }

    if (currentPuzzle.type === 'nonogram') {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <NonogramPlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
          <ToastContainer />
        </div>
      );
    }

    if (currentPuzzle.type === 'sos') {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <SOSPlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
          <ToastContainer />
        </div>
      );
    }

    if (currentPuzzle.type === 'sliding_tile') {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <SlidingTilePlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
          <ToastContainer />
        </div>
      );
    }

    if (currentPuzzle.type === 'lights_out') {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <LightsOutPlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
          <ToastContainer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/90 py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setActivePuzzleId(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Quizora Hub
            </button>
            <span className="text-xs font-semibold text-emerald-400">
              +{currentPuzzle.xpReward} XP Reward
            </span>
          </div>
        </header>

        {currentPuzzle.type === 'sudoku' && (
          <SudokuPlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
        )}
        {currentPuzzle.type === 'word_search' && (
          <WordSearchPlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
        )}
        {currentPuzzle.type === 'memory_match' && (
          <MemoryMatchPlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
        )}
        {currentPuzzle.type === 'riddle' && (
          <RiddlePlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
        )}
        {currentPuzzle.type === 'sequence_pattern' && (
          <SequencePlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
        )}
        {currentPuzzle.type === 'crossword' && (
          <SequencePlayer
            puzzle={currentPuzzle}
            onComplete={handleCompletePuzzle}
            onExit={() => setActivePuzzleId(null)}
          />
        )}

        <ToastContainer />
      </div>
    );
  }

  // Normal Page View Layout
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16 md:pb-0">
      {/* Strict Top Bar Contract Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <Hero
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartQuiz={handleStartQuiz}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
              {/* Daily Challenge Banner */}
              <DailyChallengeBanner
                onStartDailyQuiz={handleStartQuiz}
                onStartDailyPuzzle={handleStartPuzzle}
              />

              {/* Today's Featured Logic Puzzle Spotlight */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                      Today's Featured Puzzle
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hand-crafted daily logic challenge to exercise deduction and working memory.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('puzzles')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View All 12 Puzzles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {(() => {
                  const featuredPuzzle = INITIAL_PUZZLES.find((p) => p.id === dailyState.puzzleId) || INITIAL_PUZZLES[0];
                  return (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                      <div className="space-y-3 max-w-xl">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="capitalize">{featuredPuzzle.type.replace('_', ' ')} Logic</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-semibold capitalize">{featuredPuzzle.difficulty}</span>
                          <span aria-hidden="true">·</span>
                          <span>~{featuredPuzzle.estimatedTimeMin} min duration</span>
                        </div>

                        <h3 className="text-xl font-bold text-white">{featuredPuzzle.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {featuredPuzzle.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                          <span className="flex items-center gap-1 text-emerald-300">
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>+{featuredPuzzle.xpReward} XP Reward</span>
                          </span>
                          <span>·</span>
                          <span>{(featuredPuzzle.playsCount / 1000).toFixed(1)}k plays</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartPuzzle(featuredPuzzle.id)}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/30 flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <Brain className="w-4 h-4" />
                        <span>Play Today's Puzzle</span>
                      </button>
                    </div>
                  );
                })()}
              </section>

              {/* Popular Quizzes Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                      Popular & Trending Quizzes
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Top-rated knowledge tests challenged by thousands of thinkers this week.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Browse All Quizzes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizzes.slice(0, 3).map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
                  ))}
                </div>
              </section>

              {/* Categories Preview Showcase */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                      Explore by Domain
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Structured curriculum spanning 100+ categories and specialized sub-branches.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View All 100+ Categories</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {CATEGORIES_DATA.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition-all duration-200 group cursor-pointer"
                    >
                      <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        {(cat.totalQuizzes / 1000).toFixed(1)}k quizzes
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Quick Leaderboard & Global Community Section (Signed Up Users Only) */}
              <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                      <span>Verified Members</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                      Official Signed-Up Leaderboard
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Only thinkers who sign up to Quizora appear in the rankings.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Official Rankings</span>
                  </button>
                </div>

                {/* Registered users preview or sign-up CTA */}
                {StorageService.getRegisteredLeaderboard(user.id).length === 0 ? (
                  <div className="p-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white">No Signed-Up Members on the Board Yet</div>
                      <p className="text-xs text-slate-400">
                        Sign up with Google to claim the #1 spot and lead the Quizora leaderboard!
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-md shrink-0 cursor-pointer"
                    >
                      Sign up with Google
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {StorageService.getRegisteredLeaderboard(user.id).slice(0, 3).map((podium) => (
                      <div
                        key={podium.userId}
                        className={`p-4 rounded-2xl flex items-center justify-between gap-3 border ${
                          podium.isCurrentUser
                            ? 'bg-indigo-950/40 border-indigo-500/60'
                            : 'bg-slate-950/70 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                              podium.rank === 1
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : podium.rank === 2
                                ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                                : 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                            }`}
                          >
                            #{podium.rank}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                              <span>{podium.userName}</span>
                              {podium.isCurrentUser && (
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1 py-0.2 rounded font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Lvl {podium.level} · {podium.streak}d streak
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-bold text-amber-400 tabular-nums shrink-0">
                          +{podium.scoreOrXp} XP
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* Quizzes Discovery Tab */}
        {activeTab === 'quizzes' && (
          <QuizDiscovery
            quizzes={quizzes}
            onStartQuiz={handleStartQuiz}
            selectedCategoryId={selectedCategoryId}
            onClearCategory={() => setSelectedCategoryId(undefined)}
          />
        )}

        {/* Puzzles Hub Tab */}
        {activeTab === 'puzzles' && <PuzzleHub onSelectPuzzle={handleStartPuzzle} />}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoriesView onSelectCategory={handleSelectCategory} />
        )}

        {/* Daily Challenge Tab */}
        {activeTab === 'daily' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
                Daily Mind Challenge & Streak
              </h1>
              <p className="text-sm text-slate-400">
                Solve every single day to expand knowledge recall, maintain your burning streak, and
                claim compound XP rewards.
              </p>
            </div>
            <DailyChallengeBanner
              onStartDailyQuiz={handleStartQuiz}
              onStartDailyPuzzle={handleStartPuzzle}
            />
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && <LeaderboardView />}

        {/* Profile Tab */}
        {activeTab === 'profile' && <ProfileView />}

        {/* Admin Tab */}
        {activeTab === 'admin' && <AdminDashboard onRefreshQuizzes={refreshQuizzes} />}
      </main>

      {/* Modern Clean Footer (anti-slop: no fake telemetry tickers or pseudo-code) */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-bold text-slate-200 font-display text-sm">Quizora</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Play. Think. Learn. Compete.</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setActiveTab('quizzes')}
              className="hover:text-slate-300 transition-colors"
            >
              All Quizzes
            </button>
            <button
              onClick={() => setActiveTab('puzzles')}
              className="hover:text-slate-300 transition-colors"
            >
              Puzzle Hub
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="hover:text-slate-300 transition-colors"
            >
              Leaderboards
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-slate-300 transition-colors"
            >
              Admin
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs">
            <span className="text-slate-300 font-medium">
              Made by Hisan & Friends
            </span>
            <span className="hidden sm:inline text-slate-700" aria-hidden="true">·</span>
            <div className="text-slate-500 font-mono">
              © {new Date().getFullYear()} Quizora Global
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (≤ 15% mobile viewport height) */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Interactive Modals */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectQuiz={handleStartQuiz}
        onSelectPuzzle={handleStartPuzzle}
        onSelectCategory={handleSelectCategory}
      />

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* Floating Gamification Toasts (XP, Level Up, Streaks) */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QuizoraApp />
    </AuthProvider>
  );
}
