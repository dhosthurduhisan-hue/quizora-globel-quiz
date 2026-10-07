import React, { useState } from 'react';
import { Quiz, QuizAttempt } from '../../types';
import {
  RotateCcw,
  ArrowRight,
  Share2,
  Home,
  CheckCircle,
  XCircle,
  Trophy,
  Zap,
  Clock,
  Percent,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  Award
} from 'lucide-react';

interface QuizResultsProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetry: () => void;
  onNextQuiz: () => void;
  onReturnHome: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  attempt,
  onRetry,
  onNextQuiz,
  onReturnHome,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Time format
  const minutes = Math.floor(attempt.timeSpentSec / 60);
  const seconds = attempt.timeSpentSec % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;

  // Calculated rank position for gamification
  const simulatedRank = Math.max(14, 380 - Math.round(attempt.accuracy * 3.4));

  const handleShare = () => {
    const shareText = `🎯 I scored ${attempt.accuracy}% on "${quiz.title}" and earned +${attempt.xpEarned} XP on Quizora! Can you beat my rank (#${simulatedRank})? Play at: ${window.location.origin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
      {/* Top Banner & Circular Score Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            <span>Quiz Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {quiz.title}
          </h1>
          <p className="text-xs text-slate-400">
            You completed all questions in {timeFormatted}.
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="48"
              className="text-slate-800"
              strokeWidth="9"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Foreground progress ring */}
            <circle
              cx="60"
              cy="60"
              r="48"
              className={attempt.accuracy >= 70 ? 'text-indigo-500' : 'text-amber-500'}
              strokeWidth="9"
              strokeDasharray={301.6}
              strokeDashoffset={301.6 - (301.6 * attempt.accuracy) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
              {attempt.accuracy}%
            </span>
            <span className="text-xs text-slate-400 mt-0.5">Accuracy</span>
          </div>
        </div>

        {/* Today's Rank Statement */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>
            You ranked <strong className="text-white font-mono">#{simulatedRank}</strong> among
            today's players worldwide!
          </span>
        </div>

        {/* 4 Core Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 border border-slate-800/60 rounded-xl text-left">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>XP Earned</span>
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              +{attempt.xpEarned}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/60 rounded-xl text-left">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Correct</span>
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums mt-1">
              {attempt.correctCount} / {attempt.correctCount + attempt.incorrectCount}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/60 rounded-xl text-left">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Time Taken</span>
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              {timeFormatted}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/60 rounded-xl text-left">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-purple-400" />
              <span>Score</span>
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              {attempt.score} / {attempt.totalPoints}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Result Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Share Result</span>
              </>
            )}
          </button>

          <button
            onClick={onNextQuiz}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <span>Next Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReturnHome}
            className="px-4 py-2.5 text-slate-400 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>
      </div>

      {/* Review Answers Dropdown / Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Review Detailed Answers & Explanations</span>
            <span className="text-xs text-slate-400">
              ({attempt.correctCount} correct, {attempt.incorrectCount} missed)
            </span>
          </div>
          {showReview ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showReview && quiz.questions && (
          <div className="p-5 pt-0 space-y-4 border-t border-slate-800/80">
            {quiz.questions.map((q, idx) => {
              const userAns = attempt.userAnswers[q.id];
              return (
                <div key={q.id} className="p-4 bg-slate-950/70 border border-slate-800/70 rounded-xl space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-indigo-400">
                      Q{idx + 1}. {q.questionText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-850">
                    <strong className="text-slate-200">Insight: </strong>
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
