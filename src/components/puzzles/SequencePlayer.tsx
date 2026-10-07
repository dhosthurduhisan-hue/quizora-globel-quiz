import React, { useState } from 'react';
import { Puzzle } from '../../types';
import { sounds } from '../../services/soundEffects';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, Binary } from 'lucide-react';

interface SequencePlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

export const SequencePlayer: React.FC<SequencePlayerProps> = ({
  puzzle,
  onComplete,
  onExit,
}) => {
  const challenges = puzzle.config.challenges || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeChallenge = challenges[currentIdx];
  if (!activeChallenge) return null;

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    sounds.playClick();
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === activeChallenge.correctAnswer;
    if (isCorrect) {
      sounds.playCorrect();
      setSolvedCount((c) => c + 1);
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIdx === challenges.length - 1) {
      setIsCompleted(true);
      sounds.playVictory();
      onComplete(puzzle.xpReward);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const isCurrentCorrect = selectedOption === activeChallenge.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Puzzle</span>
        </button>

        <h2 className="text-base font-bold text-white font-display">{puzzle.title}</h2>

        <div className="text-xs text-slate-400 font-mono">
          Sequence {currentIdx + 1} of {challenges.length}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl flex items-center justify-between text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-bold text-sm text-white">Mathematical Logic Mastered!</div>
              <div className="text-xs text-emerald-300">
                Solved {solvedCount}/{challenges.length} patterns · +{puzzle.xpReward} XP Earned
              </div>
            </div>
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Back to Hub
          </button>
        </div>
      )}

      {/* Sequence Arena Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Binary className="w-5 h-5" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed font-display">
            {activeChallenge.prompt}
          </h3>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {activeChallenge.options.map((opt: string) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === activeChallenge.correctAnswer;

            let style = 'bg-slate-950 border-slate-800 hover:border-indigo-500 text-white';
            if (isAnswered) {
              if (isCorrect) {
                style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
              } else if (isSelected && !isCorrect) {
                style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              } else {
                style = 'bg-slate-950/50 border-slate-850 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-xl border font-mono font-bold text-lg text-center transition-all cursor-pointer ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation once answered */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1 animate-fadeIn ${
              isCurrentCorrect
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="font-bold">
              {isCurrentCorrect ? 'Correct Deduction!' : 'Incorrect.'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>Rule: </strong>
              {activeChallenge.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {isAnswered && !isCompleted && (
          <div className="pt-2">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{currentIdx === challenges.length - 1 ? 'Finish Challenge' : 'Next Sequence'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
