import React, { useState, useEffect } from 'react';
import { Puzzle } from '../../types';
import { sounds } from '../../services/soundEffects';
import { ArrowLeft, Clock, Lightbulb, CheckCircle, RotateCcw } from 'lucide-react';

interface WordSearchPlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

export const WordSearchPlayer: React.FC<WordSearchPlayerProps> = ({
  puzzle,
  onComplete,
  onExit,
}) => {
  const grid: string[][] = puzzle.config.grid;
  const targetWords: string[] = puzzle.config.words;

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<[number, number][]>([]);
  const [timerSec, setTimerSec] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [activeHintText, setActiveHintText] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => setTimerSec((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handleCellClick = (r: number, c: number) => {
    sounds.playClick();
    const alreadySelectedIdx = selectedCoords.findIndex(([cr, cc]) => cr === r && cc === c);

    let nextCoords: [number, number][];
    if (alreadySelectedIdx !== -1) {
      nextCoords = selectedCoords.slice(0, alreadySelectedIdx);
    } else {
      nextCoords = [...selectedCoords, [r, c]];
    }
    setSelectedCoords(nextCoords);

    // Form current word from selections
    const wordString = nextCoords.map(([qr, qc]) => grid[qr][qc]).join('');
    const reverseString = wordString.split('').reverse().join('');

    const matchedWord = targetWords.find(
      (w) => (w === wordString || w === reverseString) && !foundWords.includes(w)
    );

    if (matchedWord) {
      sounds.playMatch();
      const updatedFound = [...foundWords, matchedWord];
      setFoundWords(updatedFound);
      setSelectedCoords([]);

      if (updatedFound.length === targetWords.length) {
        setIsCompleted(true);
        sounds.playVictory();
        onComplete(puzzle.xpReward);
      }
    }
  };

  const handleHint = () => {
    const unFound = targetWords.filter((w) => !foundWords.includes(w));
    if (unFound.length === 0) return;
    const target = unFound[0];
    sounds.playCorrect();
    setHintsUsed((h) => h + 1);
    setActiveHintText(`Hint: Look for "${target}" (First letter: "${target[0]}")`);
  };

  const minutes = Math.floor(timerSec / 60);
  const seconds = timerSec % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
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

        <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeFormatted}</span>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl flex items-center justify-between text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-bold text-sm text-white">All Cosmic Words Discovered!</div>
              <div className="text-xs text-emerald-300">
                Found {targetWords.length} words in {timeFormatted} · +{puzzle.xpReward} XP Earned
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

      {/* Grid and Words Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Word Search 10x10 Grid */}
        <div className="md:col-span-2 flex justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl inline-block">
            <div className="grid grid-cols-10 gap-1">
              {grid.map((row, r) =>
                row.map((char, c) => {
                  const isSelected = selectedCoords.some(([sr, sc]) => sr === r && sc === c);
                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center font-mono font-bold text-sm sm:text-base rounded-lg transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {char}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Target Words List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Words to Locate ({foundWords.length}/{targetWords.length})
            </span>
            <button
              onClick={handleHint}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs flex items-center gap-1"
              title="Get Word Hint"
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeHintText && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
              {activeHintText}
            </div>
          )}

          <div className="flex flex-wrap md:flex-col gap-2">
            {targetWords.map((word) => {
              const isFound = foundWords.includes(word);
              return (
                <div
                  key={word}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-between transition-colors ${
                    isFound
                      ? 'bg-emerald-950/40 text-emerald-400 line-through border border-emerald-500/20'
                      : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{word}</span>
                  {isFound && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-2 shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Reset selection */}
          {selectedCoords.length > 0 && (
            <button
              onClick={() => setSelectedCoords([])}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg transition-colors"
            >
              Clear Current Selection ({selectedCoords.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
