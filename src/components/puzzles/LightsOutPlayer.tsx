import React, { useState, useEffect } from 'react';
import { Puzzle, PuzzleBadge } from '../../types';
import { sounds } from '../../services/soundEffects';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import {
  Clock,
  Zap,
  RotateCcw,
  X as XIcon,
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Lightbulb
} from 'lucide-react';

interface LightsOutPlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

export const LightsOutPlayer: React.FC<LightsOutPlayerProps> = ({ puzzle, onComplete, onExit }) => {
  const { user } = useAuth();
  const badgeReward: PuzzleBadge | undefined = puzzle.badgeReward;

  const SIZE = 5; // 5x5 Grid

  // Generate initial solvable puzzle by starting with all lights off and applying 6 random toggles
  const generateSolvableBoard = (): boolean[][] => {
    const board = Array(SIZE).fill(false).map(() => Array(SIZE).fill(false));
    // Apply 6 random presses to ensure solvability
    for (let i = 0; i < 6; i++) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      toggleCell(board, r, c);
    }
    // If by chance all off, press center
    if (board.every((row) => row.every((val) => !val))) {
      toggleCell(board, 2, 2);
    }
    return board;
  };

  const toggleCell = (b: boolean[][], r: number, c: number) => {
    b[r][c] = !b[r][c];
    if (r > 0) b[r - 1][c] = !b[r - 1][c];
    if (r < SIZE - 1) b[r + 1][c] = !b[r + 1][c];
    if (c > 0) b[r][c - 1] = !b[r][c - 1];
    if (c < SIZE - 1) b[r][c + 1] = !b[r][c + 1];
  };

  const [grid, setGrid] = useState<boolean[][]>(() => generateSolvableBoard());
  const [moves, setMoves] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [claimBadgeOption, setClaimBadgeOption] = useState<boolean>(true);
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => setTimeSpent((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handlePress = (r: number, c: number) => {
    if (isCompleted) return;
    sounds.playClick();

    const newGrid = grid.map((row) => [...row]);
    toggleCell(newGrid, r, c);
    setGrid(newGrid);
    setMoves((m) => m + 1);

    // Check if all lights are off
    const allOff = newGrid.every((row) => row.every((val) => !val));
    if (allOff) {
      setIsCompleted(true);
      sounds.playVictory();

      if (badgeReward && claimBadgeOption) {
        setBadgeUnlocked(true);
        const currentUser = StorageService.getUser();
        const existing = currentUser.unlockedAchievements || [];
        if (!existing.includes(badgeReward.id)) {
          currentUser.unlockedAchievements = [...existing, badgeReward.id];
          StorageService.saveUser(currentUser);
        }
      }

      onComplete(puzzle.xpReward);
    }
  };

  const handleReset = () => {
    setGrid(generateSolvableBoard());
    setMoves(0);
    setIsCompleted(false);
  };

  const activeLightsCount = grid.reduce(
    (acc, row) => acc + row.filter(Boolean).length,
    0
  );

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 animate-fadeIn">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Exit Lights Out"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md font-display flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>{puzzle.title}</span>
              </h2>
              {badgeReward && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Badge Reward</span>
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>5×5 Matrix Flip Logic · By Hisan & Friends</span>
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

      {/* Main Board Arena */}
      <main className="max-w-md w-full mx-auto my-auto py-6 space-y-5">
        {/* Actions bar */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 font-mono">
            <div>
              <span className="text-slate-400">Moves: </span>
              <span className="font-bold text-white text-sm">{moves}</span>
            </div>
            <span>·</span>
            <div>
              <span className="text-slate-400">Active Lights: </span>
              <span className="font-bold text-amber-400 text-sm">{activeLightsCount} / 25</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Badge Reward Toggle */}
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
                <div className="text-[11px] text-slate-400">{badgeReward.description}</div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={claimBadgeOption}
                onChange={(e) => setClaimBadgeOption(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <span className="hidden sm:inline">Claim Badge</span>
            </label>
          </div>
        )}

        {/* The 5x5 Lights Grid */}
        <div className="p-5 bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl flex justify-center">
          <div className="grid grid-cols-5 gap-3">
            {grid.map((row, r) =>
              row.map((isOn, c) => (
                <button
                  key={`bulb-${r}-${c}`}
                  onClick={() => handlePress(r, c)}
                  disabled={isCompleted}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    isOn
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/40 border-2 border-amber-300'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-700 border border-slate-800'
                  }`}
                >
                  <Lightbulb
                    className={`w-7 h-7 transition-colors ${
                      isOn ? 'text-slate-950 fill-slate-950' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          Clicking a bulb toggles itself and its adjacent neighbors. Extinguish all lights to win!
        </div>
      </main>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl p-7 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Lights Out Mastered
              </span>
              <h2 className="text-2xl font-black text-white font-display">Total Darkness!</h2>
              <p className="text-xs text-slate-400">
                You extinguished every light on the grid in{' '}
                <strong className="text-white font-mono">{moves} flips</strong> and{' '}
                <strong className="text-white font-mono">{formatTime(timeSpent)}</strong>.
              </p>
            </div>

            {/* Badge Unlocked Card */}
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

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs font-mono font-bold text-indigo-300">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>+{puzzle.xpReward} XP Earned</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Play Again
              </button>

              <button
                onClick={onExit}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Puzzle Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
