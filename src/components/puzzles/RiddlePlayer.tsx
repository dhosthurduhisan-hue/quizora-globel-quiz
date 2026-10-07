import React, { useState } from 'react';
import { Puzzle } from '../../types';
import { sounds } from '../../services/soundEffects';
import { ArrowLeft, Lightbulb, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface RiddlePlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

export const RiddlePlayer: React.FC<RiddlePlayerProps> = ({ puzzle, onComplete, onExit }) => {
  const riddles = puzzle.config.riddles || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [solvedRiddles, setSolvedRiddles] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeRiddle = riddles[currentIdx];

  if (!activeRiddle) return null;

  const handleVerify = () => {
    if (!userInput.trim()) return;
    const cleanInput = userInput.trim().toLowerCase();
    const isCorrect = activeRiddle.acceptedAnswers.some((ans: string) =>
      cleanInput.includes(ans) || ans.includes(cleanInput)
    );

    if (isCorrect) {
      sounds.playCorrect();
      const updatedSolved = [...new Set([...solvedRiddles, activeRiddle.id])];
      setSolvedRiddles(updatedSolved);
      setFeedback({
        isCorrect: true,
        text: `Correct! ${activeRiddle.explanation}`,
      });

      if (updatedSolved.length === riddles.length) {
        setIsCompleted(true);
        sounds.playVictory();
        onComplete(puzzle.xpReward);
      }
    } else {
      sounds.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: 'Not quite! Think laterally or use the hint above.',
      });
    }
  };

  const handleNext = () => {
    setUserInput('');
    setShowHint(false);
    setFeedback(null);
    setCurrentIdx((i) => Math.min(riddles.length - 1, i + 1));
  };

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

        <div className="text-xs text-slate-400">
          Enigma {currentIdx + 1} of {riddles.length}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl flex items-center justify-between text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-bold text-sm text-white">All Brain Teasers Solved!</div>
              <div className="text-xs text-emerald-300">
                You demonstrated supreme lateral wit · +{puzzle.xpReward} XP Earned
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

      {/* Riddle Arena */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed font-display">
            "{activeRiddle.question}"
          </h3>
        </div>

        {/* Clue button & reveal */}
        <div>
          {showHint ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 leading-relaxed">
              <strong>Clue: </strong>
              {activeRiddle.hint}
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                setShowHint(true);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Reveal Lateral Clue</span>
            </button>
          )}
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="What is your deductive answer?"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleVerify}
              disabled={!userInput.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Solve
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Next Enigma button if solved */}
        {feedback?.isCorrect && currentIdx < riddles.length - 1 && (
          <div className="pt-2">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Enigma</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
