import React, { useState, useEffect } from 'react';
import { Puzzle } from '../../types';
import { sounds } from '../../services/soundEffects';
import { Clock, RotateCcw, Lightbulb, Trophy, ArrowLeft, CheckCircle } from 'lucide-react';

interface SudokuPlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

export const SudokuPlayer: React.FC<SudokuPlayerProps> = ({ puzzle, onComplete, onExit }) => {
  const initialGrid: number[][] = puzzle.config.initialGrid;
  const solutionGrid: number[][] = puzzle.config.solutionGrid;

  const [grid, setGrid] = useState<number[][]>(() =>
    initialGrid.map((row) => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 2]);
  const [timerSec, setTimerSec] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => setTimerSec((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handleCellClick = (r: number, c: number) => {
    sounds.playClick();
    setSelectedCell([r, c]);
  };

  const handleInputDigit = (digit: number) => {
    if (!selectedCell || isCompleted) return;
    const [r, c] = selectedCell;

    // Cannot modify initial given numbers
    if (initialGrid[r][c] !== 0) return;

    sounds.playClick();
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = digit;
    setGrid(newGrid);

    // Validate digit against solution
    if (digit !== 0 && digit !== solutionGrid[r][c]) {
      sounds.playIncorrect();
      setMistakes((m) => m + 1);
    } else if (digit !== 0) {
      sounds.playMatch();
    }

    // Check if entire board is filled correctly
    let filledAndCorrect = true;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newGrid[row][col] !== solutionGrid[row][col]) {
          filledAndCorrect = false;
          break;
        }
      }
      if (!filledAndCorrect) break;
    }

    if (filledAndCorrect) {
      setIsCompleted(true);
      sounds.playVictory();
      onComplete(puzzle.xpReward);
    }
  };

  const handleHint = () => {
    if (!selectedCell || hintsLeft <= 0 || isCompleted) return;
    const [r, c] = selectedCell;
    if (grid[r][c] === solutionGrid[r][c]) return;

    const correctVal = solutionGrid[r][c];
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = correctVal;
    setGrid(newGrid);
    setHintsLeft((h) => h - 1);
    sounds.playCorrect();
  };

  const handleReset = () => {
    setGrid(initialGrid.map((row) => [...row]));
    setMistakes(0);
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

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeFormatted}</span>
          </div>
          <div className="text-rose-400">
            Mistakes: {mistakes}/5
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl flex items-center justify-between text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-bold text-sm text-white">Sudoku Solved Flawlessly!</div>
              <div className="text-xs text-emerald-300">
                Completed in {timeFormatted} · Earned +{puzzle.xpReward} XP
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

      {/* Sudoku 9x9 Grid Board */}
      <div className="flex justify-center">
        <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-xl p-2 shadow-2xl inline-block">
          <div className="grid grid-cols-9 gap-0.5">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isGiven = initialGrid[r][c] !== 0;
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                const isWrong = !isGiven && val !== 0 && val !== solutionGrid[r][c];

                // 3x3 block borders
                const borderR = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-slate-700' : '';
                const borderB = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-slate-700' : '';

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-sm sm:text-base font-bold font-mono transition-colors ${borderR} ${borderB} ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : isWrong
                        ? 'bg-rose-950/60 text-rose-300'
                        : isGiven
                        ? 'bg-slate-950 text-slate-200'
                        : 'bg-slate-900/90 text-indigo-300 hover:bg-slate-800'
                    }`}
                  >
                    {val !== 0 ? val : ''}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Keypad Digits 1-9 & Tools */}
      <div className="space-y-4">
        {/* Digits row */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handleInputDigit(digit)}
              className="w-9 h-11 sm:w-12 sm:h-12 bg-slate-900 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-400 rounded-xl text-base sm:text-lg font-bold font-mono text-white transition-all cursor-pointer shadow-sm"
            >
              {digit}
            </button>
          ))}
        </div>

        {/* Action Tools: Erase, Hint, Reset */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleInputDigit(0)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors"
          >
            Erase Cell
          </button>

          <button
            onClick={handleHint}
            disabled={hintsLeft <= 0}
            className="px-4 py-2 bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-500/40 rounded-xl text-xs font-medium text-indigo-300 flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint ({hintsLeft} left)</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-400 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
