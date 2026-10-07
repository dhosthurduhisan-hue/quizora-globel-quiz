import React, { useState, useEffect } from 'react';
import { Puzzle } from '../../types';
import { sounds } from '../../services/soundEffects';
import {
  ArrowLeft,
  Clock,
  RotateCcw,
  CheckCircle,
  Atom,
  Compass,
  Telescope,
  Flame,
  Zap,
  Cpu,
  Globe,
  Binary,
  LucideIcon
} from 'lucide-react';

interface MemoryMatchPlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Atom,
  Compass,
  Telescope,
  Flame,
  Zap,
  Cpu,
  Globe,
  Binary,
};

export const MemoryMatchPlayer: React.FC<MemoryMatchPlayerProps> = ({
  puzzle,
  onComplete,
  onExit,
}) => {
  const cardsData = puzzle.config.cards || [];

  const [cards, setCards] = useState(() =>
    [...cardsData].sort(() => Math.random() - 0.5)
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [timerSec, setTimerSec] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => setTimerSec((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handleCardClick = (index: number) => {
    // Prevent clicking already matched or already flipped card
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      matchedPairs.includes(cards[index].symbol) ||
      isCompleted
    ) {
      return;
    }

    sounds.playClick();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        // Matched!
        sounds.playMatch();
        const nextMatched = [...matchedPairs, firstCard.symbol];
        setMatchedPairs(nextMatched);
        setFlippedIndices([]);

        if (nextMatched.length * 2 === cards.length) {
          setIsCompleted(true);
          sounds.playVictory();
          onComplete(puzzle.xpReward);
        }
      } else {
        // Not matched, flip back after brief interval
        sounds.playIncorrect();
        setTimeout(() => {
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const handleRestart = () => {
    setCards([...cardsData].sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimerSec(0);
    setIsCompleted(false);
  };

  const minutes = Math.floor(timerSec / 60);
  const seconds = timerSec % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Puzzle</span>
        </button>

        <h2 className="text-base font-bold text-white font-display">{puzzle.title}</h2>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeFormatted}</span>
          </div>
          <div>Moves: {moves}</div>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl flex items-center justify-between text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-bold text-sm text-white">Neural Matrix Synced!</div>
              <div className="text-xs text-emerald-300">
                Completed in {moves} moves ({timeFormatted}) · +{puzzle.xpReward} XP Earned
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

      {/* 4x4 Memory Cards Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx);
          const isMatched = matchedPairs.includes(card.symbol);
          const IconComp = ICON_MAP[card.symbol] || Atom;

          return (
            <button
              key={`${card.id}-${idx}`}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-3 transition-all duration-300 cursor-pointer ${
                isMatched
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : isFlipped
                  ? 'bg-indigo-900/60 border-indigo-400 text-white scale-105 shadow-lg'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-600'
              }`}
            >
              {isFlipped || isMatched ? (
                <>
                  <IconComp className="w-7 h-7 sm:w-9 sm:h-9" />
                  <span className="text-[10px] font-semibold tracking-wide mt-1.5 line-clamp-1">
                    {card.label}
                  </span>
                </>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-700/60 flex items-center justify-center text-xs font-bold text-slate-600">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Reset Tool */}
      <div className="text-center pt-2">
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Game</span>
        </button>
      </div>
    </div>
  );
};
