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
  Users,
  Bot,
  Swords,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  HelpCircle
} from 'lucide-react';

interface SOSPlayerProps {
  puzzle: Puzzle;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

type CellValue = 'S' | 'O' | null;

interface SOSLine {
  id: string;
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  r3: number;
  c3: number;
  player: 1 | 2;
}

export const SOSPlayer: React.FC<SOSPlayerProps> = ({ puzzle, onComplete, onExit }) => {
  const { user } = useAuth();
  const badgeReward: PuzzleBadge | undefined = puzzle.badgeReward;

  const GRID_SIZE = 6; // 6x6 grid (36 cells)
  const [grid, setGrid] = useState<CellValue[][]>(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );

  const [selectedLetter, setSelectedLetter] = useState<'S' | 'O'>('S');
  const [gameMode, setGameMode] = useState<'ai' | 'pvp'>('ai'); // 'ai' = vs Hisan's Bot, 'pvp' = Pass & Play with Friends
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1); // 1 = You / P1, 2 = AI / P2
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [completedLines, setCompletedLines] = useState<SOSLine[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Badge claim option
  const [claimBadgeOption, setClaimBadgeOption] = useState<boolean>(true);
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);

  // Sound & Timer
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [timeSpent, setTimeSpent] = useState<number>(0);

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Check for any newly completed SOS formed by placing letter at (r, c)
  const findFormedSOS = (board: CellValue[][], r: number, c: number, letter: 'S' | 'O'): { r1: number; c1: number; r2: number; c2: number; r3: number; c3: number }[] => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ];

    const formed: { r1: number; c1: number; r2: number; c2: number; r3: number; c3: number }[] = [];

    if (letter === 'S') {
      // S can be either end: S-O-S (looking forward 2 steps) or S-O-S (looking backward 2 steps)
      for (const [dr, dc] of directions) {
        // Forward: (r, c) is first 'S'
        const r2 = r + dr;
        const c2 = c + dc;
        const r3 = r + dr * 2;
        const c3 = c + dc * 2;
        if (r3 >= 0 && r3 < GRID_SIZE && c3 >= 0 && c3 < GRID_SIZE) {
          if (board[r2][c2] === 'O' && board[r3][c3] === 'S') {
            formed.push({ r1: r, c1: c, r2, c2, r3, c3 });
          }
        }

        // Backward: (r, c) is the second 'S'
        const br2 = r - dr;
        const bc2 = c - dc;
        const br3 = r - dr * 2;
        const bc3 = c - dc * 2;
        if (br3 >= 0 && br3 < GRID_SIZE && bc3 >= 0 && bc3 < GRID_SIZE) {
          if (board[br2][bc2] === 'O' && board[br3][bc3] === 'S') {
            formed.push({ r1: br3, c1: bc3, r2: br2, c2: bc2, r3: r, c3: c });
          }
        }
      }
    } else if (letter === 'O') {
      // O must be in the middle: S-(r, c)-S
      for (const [dr, dc] of directions) {
        const s1r = r - dr;
        const s1c = c - dc;
        const s2r = r + dr;
        const s2c = c + dc;
        if (s1r >= 0 && s1r < GRID_SIZE && s1c >= 0 && s1c < GRID_SIZE &&
            s2r >= 0 && s2r < GRID_SIZE && s2c >= 0 && s2c < GRID_SIZE) {
          if (board[s1r][s1c] === 'S' && board[s2r][s2c] === 'S') {
            formed.push({ r1: s1r, c1: s1c, r2: r, c2: c, r3: s2r, c3: s2c });
          }
        }
      }
    }

    return formed;
  };

  // Place a move for current player
  const makeMove = (r: number, c: number, letter: 'S' | 'O') => {
    if (grid[r][c] !== null || isGameOver) return;

    sounds.playClick();

    // 1. Update Grid
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? letter : cell))
    );
    setGrid(newGrid);

    // 2. Check for SOS
    const formed = findFormedSOS(newGrid, r, c, letter);

    if (formed.length > 0) {
      sounds.playCorrect();
      const newLines: SOSLine[] = formed.map((f, idx) => ({
        id: `line_${Date.now()}_${idx}`,
        ...f,
        player: currentPlayer,
      }));
      setCompletedLines((prev) => [...prev, ...newLines]);

      // Award points
      if (currentPlayer === 1) {
        setP1Score((s) => s + formed.length);
      } else {
        setP2Score((s) => s + formed.length);
      }
      // Note: By official SOS rules, scoring grants an EXTRA turn! Keep currentPlayer the same.
    } else {
      // No SOS formed, switch turn
      setCurrentPlayer((p) => (p === 1 ? 2 : 1));
    }

    // Check board completion
    const isFull = newGrid.every((row) => row.every((cell) => cell !== null));
    if (isFull) {
      handleGameOver(
        currentPlayer === 1 ? p1Score + formed.length : p1Score,
        currentPlayer === 2 ? p2Score + formed.length : p2Score
      );
    }
  };

  // AI Turn Handling
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 2 && !isGameOver) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        executeAiMove();
        setIsAiThinking(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, isGameOver, grid]);

  const executeAiMove = () => {
    // 1. Try to find a winning move (creates an SOS with S or O)
    const availableCells: { r: number; c: number }[] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === null) {
          availableCells.push({ r, c });

          // Test if placing 'S' scores
          const testS = findFormedSOS(grid, r, c, 'S');
          if (testS.length > 0) {
            makeMove(r, c, 'S');
            return;
          }

          // Test if placing 'O' scores
          const testO = findFormedSOS(grid, r, c, 'O');
          if (testO.length > 0) {
            makeMove(r, c, 'O');
            return;
          }
        }
      }
    }

    if (availableCells.length === 0) return;

    // 2. Play randomly or strategically in center
    const chosen = availableCells[Math.floor(Math.random() * availableCells.length)];
    const chosenLetter: 'S' | 'O' = Math.random() > 0.45 ? 'S' : 'O';
    makeMove(chosen.r, chosen.c, chosenLetter);
  };

  const handleGameOver = (finalP1: number, finalP2: number) => {
    setIsGameOver(true);
    sounds.playVictory();

    // If P1 won or tied and badge option is on, award badge
    if (finalP1 >= finalP2 && badgeReward && claimBadgeOption) {
      setBadgeUnlocked(true);
      const currentUser = StorageService.getUser();
      const existing = currentUser.unlockedAchievements || [];
      if (!existing.includes(badgeReward.id)) {
        currentUser.unlockedAchievements = [...existing, badgeReward.id];
        StorageService.saveUser(currentUser);
      }
    }

    onComplete(puzzle.xpReward);
  };

  const handleReset = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
    setP1Score(0);
    setP2Score(0);
    setCompletedLines([]);
    setCurrentPlayer(1);
    setIsGameOver(false);
    setBadgeUnlocked(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 animate-fadeIn">
      {/* Top Header Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Exit SOS"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md font-display flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-amber-400" />
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
              <span>{GRID_SIZE}×{GRID_SIZE} Grid Duel · Made by Hisan & Friends</span>
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

      {/* Main Game Arena */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 space-y-6">
        {/* Mode Selector & Scoreboard */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          {/* Opponent Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setGameMode('ai');
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  gameMode === 'ai'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Vs Hisan's Bot</span>
              </button>

              <button
                onClick={() => {
                  setGameMode('pvp');
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  gameMode === 'pvp'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Pass & Play Friends</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Reset Match"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Head-to-Head Scoreboard */}
          <div className="grid grid-cols-2 gap-3">
            {/* Player 1 */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                currentPlayer === 1 && !isGameOver
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/40'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{user.name || 'You (P1)'}</span>
                  {currentPlayer === 1 && !isGameOver && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </span>
                <span className="text-xl font-black font-mono text-indigo-400 tabular-nums">
                  {p1Score}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {currentPlayer === 1 && !isGameOver ? 'Your Turn' : 'Ready'}
              </div>
            </div>

            {/* Player 2 / AI */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                currentPlayer === 2 && !isGameOver
                  ? 'bg-amber-950/60 border-amber-500 shadow-md shadow-amber-950/40'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{gameMode === 'ai' ? "Hisan's Bot" : 'Friend (P2)'}</span>
                  {currentPlayer === 2 && !isGameOver && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </span>
                <span className="text-xl font-black font-mono text-amber-400 tabular-nums">
                  {p2Score}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isAiThinking
                  ? 'Bot is calculating move...'
                  : currentPlayer === 2 && !isGameOver
                  ? 'Taking Turn'
                  : 'Waiting'}
              </div>
            </div>
          </div>

          {/* Letter Placer Selector: 'S' or 'O' */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-300">Choose Letter to Place:</span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedLetter('S')}
                className={`w-11 h-11 rounded-xl font-black text-base transition-all flex items-center justify-center cursor-pointer ${
                  selectedLetter === 'S'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border-2 border-indigo-400'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                S
              </button>

              <button
                onClick={() => setSelectedLetter('O')}
                className={`w-11 h-11 rounded-xl font-black text-base transition-all flex items-center justify-center cursor-pointer ${
                  selectedLetter === 'O'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border-2 border-indigo-400'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                O
              </button>
            </div>
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
              <span className="hidden sm:inline">Claim & Pin Badge</span>
            </label>
          </div>
        )}

        {/* The 6x6 SOS Grid */}
        <div className="p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center">
          <div className="grid grid-cols-6 gap-2">
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`sos-${r}-${c}`}
                  onClick={() => makeMove(r, c, selectedLetter)}
                  disabled={cell !== null || (gameMode === 'ai' && currentPlayer === 2) || isGameOver}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-xl flex items-center justify-center transition-all select-none cursor-pointer ${
                    cell === null
                      ? 'bg-slate-950 hover:bg-slate-800 text-transparent hover:text-slate-500 border border-slate-800/90 hover:border-indigo-500/50'
                      : cell === 'S'
                      ? 'bg-indigo-950/80 border-2 border-indigo-500 text-indigo-300 shadow-md'
                      : 'bg-amber-950/80 border-2 border-amber-500 text-amber-300 shadow-md'
                  }`}
                >
                  {cell !== null ? cell : selectedLetter}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Rule Reminder */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Rule: Form "S-O-S" horizontally, vertically, or diagonally to score a point!</p>
          <p>Every time you complete an SOS, you earn a bonus extra turn.</p>
        </div>
      </main>

      {/* Game Over Victory Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl p-7 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                SOS Duel Concluded
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                {p1Score > p2Score
                  ? 'Victory!'
                  : p1Score === p2Score
                  ? "It's a Draw!"
                  : 'Match Finished!'}
              </h2>
              <p className="text-xs text-slate-400">
                Final Score: <strong className="text-indigo-400">{p1Score}</strong> vs{' '}
                <strong className="text-amber-400">{p2Score}</strong>.
              </p>
            </div>

            {/* Badge Unlocked Notification Card */}
            {badgeReward && claimBadgeOption && p1Score >= p2Score && (
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

            {/* XP Award */}
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
