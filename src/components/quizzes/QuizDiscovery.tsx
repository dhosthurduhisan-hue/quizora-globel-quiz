import React, { useState, useMemo } from 'react';
import { Quiz, Difficulty } from '../../types';
import { QuizCard } from './QuizCard';
import { CATEGORIES_DATA } from '../../data/categories';
import { Search, Filter, SlidersHorizontal, BookOpen, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizDiscoveryProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: string) => void;
  selectedCategoryId?: string;
  onClearCategory?: () => void;
}

const ITEMS_PER_PAGE = 12;

export const QuizDiscovery: React.FC<QuizDiscoveryProps> = ({
  quizzes,
  onStartQuiz,
  selectedCategoryId,
  onClearCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Sync category prop if updated
  React.useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
      setCurrentPage(1);
    }
  }, [selectedCategoryId]);

  // Filtered and Sorted Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes
      .filter((q) => {
        // Search Filter
        if (searchQuery.trim()) {
          const qText = searchQuery.toLowerCase();
          const matchesTitle = q.title.toLowerCase().includes(qText);
          const matchesDesc = q.description.toLowerCase().includes(qText);
          const matchesSub = q.subcategory?.toLowerCase().includes(qText);
          if (!matchesTitle && !matchesDesc && !matchesSub) return false;
        }

        // Category Filter
        if (selectedCategory !== 'all' && q.categoryId !== selectedCategory) {
          return false;
        }

        // Difficulty Filter
        if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.playCount - a.playCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [quizzes, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE) || 1;
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            <span>Knowledge Repository</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Quiz Library & Exploration
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Over 1,000+ vetted quizzes across science, football, technology, history, and world cultures.
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono tabular-nums text-slate-300 shrink-0">
          <span className="text-indigo-400 font-bold">{filteredQuizzes.length.toLocaleString()}</span> Available Quizzes
        </div>
      </div>

      {/* Quick Category Featured Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          All Quizzes (1,000+)
        </button>

        <button
          onClick={() => {
            setSelectedCategory('foot-ball');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'foot-ball'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          <span>⚽ Foot Ball (120 Quizzes)</span>
        </button>

        {[
          { id: 'science', label: 'Science & Cosmos' },
          { id: 'technology', label: 'Technology & AI' },
          { id: 'history', label: 'History & Civilizations' },
          { id: 'space-astronomy', label: 'Space & Astronomy' },
          { id: 'mathematics', label: 'Mathematics & Logic' },
          { id: 'regional-kerala-india', label: 'Kerala & India' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCategory(c.id);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Top Search & Sort Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by topic, keyword, or concept (e.g. quantum, neural, Roman)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newly Published</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons & Segmented Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {/* Category Dropdown (Only non-empty categories) */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES_DATA.filter((cat) => quizzes.some((q) => q.categoryId === cat.id)).map((cat) => {
              const count = quizzes.filter((q) => q.categoryId === cat.id).length;
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({count})
                </option>
              );
            })}
          </select>

          {/* Difficulty Tabs (Interactive Segmented Control) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            {['all', 'easy', 'medium', 'hard', 'master'].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors font-medium ${
                  selectedDifficulty === diff
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Clear Filters helper */}
          {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
                if (onClearCategory) onClearCategory();
                setCurrentPage(1);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 ml-auto transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Quiz Grid */}
      {paginatedQuizzes.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No quizzes match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, difficulty setting, or selecting a broader category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onStart={onStartQuiz}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 tabular-nums">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuizzes.length)} of{' '}
            {filteredQuizzes.length.toLocaleString()} quizzes
          </div>

          <div className="flex items-center gap-3">
            {/* Quick jump to page input */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const p = parseInt(jumpPageInput);
                    if (!isNaN(p) && p >= 1 && p <= totalPages) {
                      setCurrentPage(p);
                      setJumpPageInput('');
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }
                  }
                }}
                placeholder={String(currentPage)}
                className="w-14 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-center text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <span>of {totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
