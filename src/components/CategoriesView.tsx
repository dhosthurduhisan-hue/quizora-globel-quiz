import React, { useState } from 'react';
import { CATEGORIES_DATA } from '../data/categories';
import { StorageService } from '../services/storage';
import {
  Atom,
  Cpu,
  Landmark,
  Globe,
  Binary,
  Telescope,
  Trophy,
  Palette,
  BookOpen,
  Film,
  Leaf,
  HelpCircle,
  TrendingUp,
  HeartPulse,
  Compass,
  Utensils,
  Sparkles,
  ArrowRight,
  Search,
  LucideIcon
} from 'lucide-react';

interface CategoriesViewProps {
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Atom,
  Cpu,
  Landmark,
  Globe,
  Binary,
  Telescope,
  Trophy,
  Palette,
  BookOpen,
  Film,
  Leaf,
  HelpCircle,
  TrendingUp,
  HeartPulse,
  Compass,
  Utensils,
  Sparkles,
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const allQuizzes = StorageService.getAllQuizzes();

  // Compute live count and filter out empty categories (strictly remove any with 0 quizzes)
  const populatedCategories = CATEGORIES_DATA.map((cat) => {
    const count = allQuizzes.filter((q) => q.categoryId === cat.id).length;
    return { ...cat, actualCount: count };
  }).filter((cat) => cat.actualCount > 0);

  const filteredCategories = populatedCategories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.subcategories.some((sub) => sub.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            <span>Knowledge Taxonomy</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Explore Active Categories
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            From world football tournaments to quantum mechanics, modern AI, and global geography. All categories feature verified, playable quizzes.
          </p>
        </div>

        {/* Category search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter categories & topics..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const IconComp = ICON_MAP[category.iconName] || BookOpen;

          return (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 cursor-pointer"
            >
              <div className="space-y-4">
                {/* Top Row: Icon + Quizzes count */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${category.color}15`,
                      border: `1px solid ${category.color}30`,
                      color: category.color,
                    }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <span className="text-xs text-slate-300 font-mono tabular-nums font-semibold">
                    {category.actualCount} quizzes
                  </span>
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>

                {/* Subcategories (Unboxed Text with typographic bullet separators) */}
                <div className="pt-2 border-t border-slate-800/70">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Specialized Domains:
                  </span>
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {category.subcategories.map((sub, i) => (
                      <span key={sub}>
                        <span className="hover:text-slate-200">{sub}</span>
                        {i < category.subcategories.length - 1 && (
                          <span className="mx-1.5 text-slate-600">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Browse Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Explore {category.actualCount} Quizzes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
