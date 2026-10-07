import React, { useState, useEffect, useRef } from 'react';
import { Puzzle, PuzzleBadge } from '../../types';
import { sounds } from '../../services/soundEffects';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import {
  Clock,
  Zap,
  RotateCcw,
  Check,
  X as XIcon,
  HelpCircle,
  Award,
  Sparkles,
  Trophy,
  ArrowRight,
  Heart,
  Volume2,
  VolumeX,
  Eye,
  ShieldCheck
} from 'lucide-react';

interface NonogramPlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

type CellState = 0 | 1 | 2; // 0 = empty, 1 = filled, 2 = crossed (X)

export const NonogramPlayer: React.FC<NonogramPlayerProps> = ({ puzzle, onComplete, onExit }) => {
  const { user } = useAuth();
  const config = puzzle.config;
  const gridSize: number = config.gridSize || 5;
  const solution: number[][] = config.solution;
  const rowClues: number[][] = config.rowClues;
  const colClues: number[][] = config.colClues;
  const badgeReward: PuzzleBadge | undefined = puzzle.badgeReward;

  // Grid State: 0 (empty), 1 (filled), 2 (crossed)
  const [grid, setGrid] = useState<CellState[][]>(() =>
    Array(gridSize).fill(0).map(() => Array(gridSize).fill(0))
  );

  // Active Tool Mode: 'fill' or 'cross'
  const [activeTool, setActiveTool] = useState<'fill' | 'cross'>('fill');

  // Option for Badge: user can toggle whether they want to claim and pin the badge
  const [claimBadgeOption, setClaimBadgeOption] = useState<boolean>(true);
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);

  // Game state
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsRemaining, setHintsRemaining] = useState<number>(2);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [dragAction, setDragAction] = useState<CellState | null>(null);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Check Solution after every grid change
  const checkCompletion = (currentGrid: CellState[][]) => {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const isSolutionFilled = solution[r][c] === 1;
        const isUserFilled = currentGrid[r][c] === 1;
        if (isSolutionFilled !== isUserFilled) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (r: number, c: number, overrideTool?: 'fill' | 'cross') => {
    if (isCompleted) return;

    const toolToUse = overrideTool || activeTool;
    const current = grid[r][c];
    let next: CellState = 0;

    if (toolToUse === 'fill') {
      next = current === 1 ? 0 : 1;
    } else {
      next = current === 2 ? 0 : 2;
    }

    // Play subtle audio
    if (next === 1) sounds.playClick();
    else if (next === 2) sounds.playClick();

    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? next : cell))
    );
    setGrid(newGrid);

    // Verify victory
    if (checkCompletion(newGrid)) {
      handleVictory();
    }
  };

  const handleVictory = () => {
    setIsCompleted(true);
    sounds.playVictory();

    // Handle Badge Unlock
    if (badgeReward && claimBadgeOption) {
      setBadgeUnlocked(true);
      const currentUser = StorageService.getUser();
      const existingAchievements = currentUser.unlockedAchievements || [];
      if (!existingAchievements.includes(badgeReward.id)) {
        currentUser.unlockedAchievements = [...existingAchievements, badgeReward.id];
        StorageService.saveUser(currentUser);
      }
    }

    onComplete(puzzle.xpReward);
  };

  const handleReset = () => {
    setGrid(Array(gridSize).fill(0).map(() => Array(gridSize).fill(0)));
    setIsCompleted(false);
    setBadgeUnlocked(false);
  };

  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isCompleted) return;

    // Find a cell that differs from solution
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const target = solution[r][c] === 1 ? 1 : 2;
        if (grid[r][c] !== target) {
          const newGrid = grid.map((row, ri) =>
            row.map((cell, ci) => (ri === r && ci === c ? target : cell))
          );
          setGrid(newGrid);
          setHintsRemaining((prev) => prev - 1);
          sounds.playCorrect();

          if (checkCompletion(newGrid)) {
            handleVictory();
          }
          return;
        }
      }
    }
  };

  // Check if a row currently matches the solution exactly
  const isRowSatisfied = (r: number) => {
    for (let c = 0; c < gridSize; c++) {
      if ((solution[r][c] === 1) !== (grid[r][c] === 1)) return false;
    }
    return true;
  };

  // Check if a col currently matches the solution exactly
  const isColSatisfied = (c: number) => {
    for (let r = 0; r < gridSize; r++) {
      if ((solution[r][c] === 1) !== (grid[r][c] === 1)) return false;
    }
    return true;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Header Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Exit Nonogram"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md font-display">
                {puzzle.title}
              </h2>
              {badgeReward && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Badge Reward</span>
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{gridSize}×{gridSize} Picture Logic Grid</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize text-indigo-300 font-medium">{puzzle.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Right HUD: Timer + XP + Sound */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono font-semibold text-slate-300 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTime(timeSpent)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300 tabular-nums">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>+{puzzle.xpReward} XP</span>
          </div>

          <button
            onClick={() => setIsMuted(sounds.toggleMute())}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Interactive Matrix Area */}
      <main className="max-w-2xl w-full mx-auto my-auto py-6 space-y-6">
        {/* Controls Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl">
          {/* Tool Selector: Fill or Cross */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTool('fill')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTool === 'fill'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="w-3.5 h-3.5 bg-white rounded-sm" />
              <span>Fill Square (■)</span>
            </button>

            <button
              onClick={() => setActiveTool('cross')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTool === 'cross'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <XIcon className="w-3.5 h-3.5 text-white" />
              <span>Cross (✕)</span>
            </button>
          </div>

          {/* Action Utilities: Hint & Reset & Badge Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || isCompleted}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reveal 1 square"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Hint ({hintsRemaining})</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Reset Grid"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badge Option Checkbox Toggle */}
        {badgeReward && (
          <div className="p-3 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Badge Reward: {badgeReward.title}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {badgeReward.description}
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={claimBadgeOption}
                onChange={(e) => setClaimBadgeOption(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <span className="hidden sm:inline">Claim & Pin Badge</span>
            </label>
          </div>
        )}

        {/* The Nonogram Grid Matrix */}
        <div className="p-5 sm:p-7 bg-slate-900 border border-slate-800/90 rounded-3xl shadow-2xl flex flex-col items-center justify-center overflow-x-auto">
          <div className="inline-block">
            {/* Top Row: Empty Corner + Column Clues */}
            <div className="flex">
              {/* Corner spacer for row clues width */}
              <div
                className="shrink-0 flex items-end justify-end p-2 text-right border-r-2 border-b-2 border-slate-700 font-mono text-[11px] text-slate-500 font-bold"
                style={{ width: gridSize === 5 ? '80px' : '100px' }}
              >
                ROW \ COL
              </div>

              {/* Column Clues Header */}
              <div className="flex border-b-2 border-slate-700">
                {colClues.map((clues, colIdx) => {
                  const satisfied = isColSatisfied(colIdx);
                  return (
                    <div
                      key={`col-${colIdx}`}
                      className={`flex flex-col items-center justify-end pb-2 font-mono text-xs font-bold transition-colors ${
                        satisfied ? 'text-indigo-400/60 bg-indigo-950/10' : 'text-slate-300'
                      }`}
                      style={{
                        width: gridSize === 5 ? '56px' : '42px',
                        borderRight: (colIdx + 1) % 5 === 0 && colIdx !== gridSize - 1 ? '2px solid #475569' : '1px solid #1e293b'
                      }}
                    >
                      {clues.map((num, i) => (
                        <span key={i} className="leading-tight py-0.5">
                          {num}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid Rows: Row Clue + Cells */}
            {grid.map((row, rowIdx) => {
              const rowSatisfied = isRowSatisfied(rowIdx);

              return (
                <div
                  key={`row-${rowIdx}`}
                  className="flex"
                  style={{
                    borderBottom: (rowIdx + 1) % 5 === 0 && rowIdx !== gridSize - 1 ? '2px solid #475569' : '1px solid #1e293b'
                  }}
                >
                  {/* Row Clue on Left */}
                  <div
                    className={`shrink-0 flex items-center justify-end pr-3 gap-1.5 font-mono text-xs font-bold border-r-2 border-slate-700 transition-colors ${
                      rowSatisfied ? 'text-indigo-400/60 bg-indigo-950/10' : 'text-slate-300'
                    }`}
                    style={{ width: gridSize === 5 ? '80px' : '100px' }}
                  >
                    {rowClues[rowIdx].map((num, i) => (
                      <span key={i}>{num}</span>
                    ))}
                  </div>

                  {/* Row Cells */}
                  <div className="flex">
                    {row.map((cell, colIdx) => (
                      <button
                        key={`cell-${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleCellClick(rowIdx, colIdx, activeTool === 'fill' ? 'cross' : 'fill');
                        }}
                        className={`flex items-center justify-center transition-all select-none cursor-pointer ${
                          cell === 1
                            ? 'bg-indigo-600 hover:bg-indigo-500 shadow-inner'
                            : cell === 2
                            ? 'bg-slate-950 hover:bg-slate-900 text-rose-400 font-bold'
                            : 'bg-slate-950 hover:bg-slate-850'
                        }`}
                        style={{
                          width: gridSize === 5 ? '56px' : '42px',
                          height: gridSize === 5 ? '56px' : '42px',
                          borderRight: (colIdx + 1) % 5 === 0 && colIdx !== gridSize - 1 ? '2px solid #475569' : '1px solid #1e293b'
                        }}
                      >
                        {cell === 1 && (
                          <div className="w-full h-full bg-indigo-500/90 rounded-sm m-0.5 border border-indigo-400/50" />
                        )}
                        {cell === 2 && (
                          <XIcon className="w-4 h-4 text-rose-400/90 stroke-[2.5]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip footer */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Tip: Left click applies current tool. Right click applies the opposite tool.</p>
          <p>Each number represents a consecutive block of filled cells in that row or column.</p>
        </div>
      </main>

      {/* Victory Celebration Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl p-7 text-center space-y-6 shadow-2xl">
            {/* Trophy Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Pixel Blueprint Solved
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                {config.revealName || puzzle.title}!
              </h2>
              <p className="text-xs text-slate-400">
                You flawlessly deciphered all row & column number constraints in{' '}
                <strong className="text-white font-mono">{formatTime(timeSpent)}</strong>.
              </p>
            </div>

            {/* Revealed Pixel Art Thumbnail Display */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div
                className="grid gap-1 bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-inner"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
                }}
              >
                {solution.map((row, ri) =>
                  row.map((val, ci) => (
                    <div
                      key={`preview-${ri}-${ci}`}
                      className={`w-4 h-4 rounded-xs ${
                        val === 1
                          ? 'bg-indigo-400 shadow-sm shadow-indigo-400/50'
                          : 'bg-slate-950'
                      }`}
                    />
                  ))
                )}
              </div>
              <span className="text-xs font-mono text-indigo-300 font-semibold">
                "{config.revealName || 'Picture Logic Blueprint'}"
              </span>
            </div>

            {/* Badge Unlocked Notification Card */}
            {badgeReward && claimBadgeOption && (
              <div className="p-3.5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/50 border border-amber-500/40 rounded-2xl flex items-center gap-3 text-left">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Exclusive Badge Unlocked!</span>
                  </div>
                  <div className="text-sm font-bold text-white">{badgeReward.title}</div>
                  <div className="text-[11px] text-slate-400">{badgeReward.description}</div>
                </div>
              </div>
            )}

            {/* XP Earned Indicator */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs font-mono font-bold text-indigo-300">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>+{puzzle.xpReward} XP Added to Profile</span>
            </div>

            {/* Exit CTA */}
            <div className="space-y-2 pt-2">
              <button
                onClick={onExit}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Puzzle Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
