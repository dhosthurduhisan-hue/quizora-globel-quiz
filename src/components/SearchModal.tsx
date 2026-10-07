import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Puzzle, Layers, ArrowRight } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/categories';
import { INITIAL_PUZZLES } from '../data/puzzles';
import { StorageService } from '../services/storage';
import { Quiz } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuiz: (quizId: string) => void;
  onSelectPuzzle: (puzzleId: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectQuiz,
  onSelectPuzzle,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Listen to Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allQuizzes: Quiz[] = StorageService.getAllQuizzes();
  const lowerQuery = query.toLowerCase().trim();

  const matchingQuizzes = lowerQuery
    ? allQuizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(lowerQuery) ||
          q.description.toLowerCase().includes(lowerQuery) ||
          q.subcategory?.toLowerCase().includes(lowerQuery)
      )
    : [];

  const matchingPuzzles = lowerQuery
    ? INITIAL_PUZZLES.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.type.toLowerCase().includes(lowerQuery)
      )
    : [];

  const matchingCategories = lowerQuery
    ? CATEGORIES_DATA.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.subcategories.some((s) => s.toLowerCase().includes(lowerQuery))
      )
    : [];

  const totalResults = matchingQuizzes.length + matchingPuzzles.length + matchingCategories.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quizzes, puzzles, categories, topics (e.g. Quantum, Kerala, Sudoku)..."
            className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-slate-400">Popular topics to explore:</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['Quantum Physics', 'Deep Space', 'Sudoku', 'Civilizations', 'Artificial Intelligence', 'Kerala Culture'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching quizzes or puzzles found for "{query}".
            </div>
          ) : (
            <>
              {/* Quizzes */}
              {matchingQuizzes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                    Quizzes ({matchingQuizzes.length})
                  </div>
                  {matchingQuizzes.slice(0, 8).map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() => {
                        onSelectQuiz(quiz.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/90 rounded-xl text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                            {quiz.title}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{quiz.difficulty.toUpperCase()}</span>
                            <span aria-hidden="true">·</span>
                            <span>{quiz.questionCount} Questions</span>
                            <span aria-hidden="true">·</span>
                            <span>+{quiz.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {/* Puzzles */}
              {matchingPuzzles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                    Puzzles ({matchingPuzzles.length})
                  </div>
                  {matchingPuzzles.map((puzzle) => (
                    <button
                      key={puzzle.id}
                      onClick={() => {
                        onSelectPuzzle(puzzle.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/90 rounded-xl text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Puzzle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                            {puzzle.title}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{puzzle.type}</span>
                            <span aria-hidden="true">·</span>
                            <span>{puzzle.estimatedTimeMin} min</span>
                            <span aria-hidden="true">·</span>
                            <span>+{puzzle.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {/* Categories */}
              {matchingCategories.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                    Categories ({matchingCategories.length})
                  </div>
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/90 rounded-xl text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
                            {cat.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-sm">
                            {cat.subcategories.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
