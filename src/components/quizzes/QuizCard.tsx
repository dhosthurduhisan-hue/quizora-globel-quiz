import React, { useState } from 'react';
import { Quiz } from '../../types';
import { Star, Clock, HelpCircle, ArrowRight, Zap } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
  const [imageError, setImageError] = useState(false);

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
    <article className="group bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20">
      {/* Thumbnail Aspect Container (4:3) with Resilient Fallback */}
      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
        {!imageError && quiz.thumbnail ? (
          <img
            src={quiz.thumbnail}
            alt={quiz.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/40 p-4 text-center">
            <HelpCircle className="w-8 h-8 text-indigo-400/60 mb-2" />
            <span className="text-xs text-slate-400 font-medium line-clamp-1">{quiz.title}</span>
          </div>
        )}

        {/* Floating XP Reward in corner */}
        <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 rounded-lg px-2.5 py-1 flex items-center gap-1 text-xs font-semibold text-indigo-300 tabular-nums shadow-md">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>+{quiz.xpReward} XP</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Zero-Pill Unboxed Clean Metadata Kicker */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="capitalize">{quiz.categoryId.replace('-', ' ')}</span>
            {quiz.subcategory && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{quiz.subcategory}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className={`font-semibold capitalize ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
            {quiz.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {quiz.description}
          </p>
        </div>

        {/* Bottom Metrics & Action */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          {/* Clean Unboxed Stats Row with separators */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{quiz.durationMinutes} min</span>
              <span aria-hidden="true">·</span>
              <span>{quiz.questionCount} Qs</span>
            </div>

            <div className="flex items-center gap-1 tabular-nums text-slate-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">{quiz.rating.toFixed(1)}</span>
              <span className="text-slate-400">({(quiz.playCount / 1000).toFixed(1)}k)</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div>
            <button
              onClick={() => onStart(quiz.id)}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 group/btn cursor-pointer whitespace-nowrap shadow-sm"
            >
              <span>Play Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
