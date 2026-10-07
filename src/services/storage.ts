import { UserProfile, QuizAttempt, Quiz, DailyChallengeState, LeaderboardEntry } from '../types';
import { INITIAL_QUIZZES } from '../data/quizzes';
import { ALL_QUIZZES_1000 } from '../data/quizDatabase';
import { INITIAL_PUZZLES } from '../data/puzzles';
import { ACHIEVEMENTS_DATA } from '../data/achievements';

const STORAGE_KEYS = {
  USER: 'quizora_user_profile',
  ATTEMPTS: 'quizora_quiz_attempts',
  CUSTOM_QUIZZES: 'quizora_custom_quizzes',
  DAILY_STATE: 'quizora_daily_state',
  SOUND_MUTED: 'quizora_sound_muted',
  REGISTERED_USERS: 'quizora_registered_users',
};

export const LEVEL_TIERS = [
  { level: 1, title: 'Beginner', minXp: 0, maxXp: 500 },
  { level: 2, title: 'Explorer', minXp: 500, maxXp: 1200 },
  { level: 3, title: 'Thinker', minXp: 1200, maxXp: 2500 },
  { level: 4, title: 'Scholar', minXp: 2500, maxXp: 4500 },
  { level: 5, title: 'Master', minXp: 4500, maxXp: 7500 },
  { level: 6, title: 'Genius', minXp: 7500, maxXp: 999999 },
];

export function calculateLevel(xp: number): { level: number; title: string; minXp: number; maxXp: number; progressPercent: number } {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    const tier = LEVEL_TIERS[i];
    if (xp >= tier.minXp) {
      const tierRange = tier.maxXp - tier.minXp;
      const progressInTier = Math.min(xp - tier.minXp, tierRange);
      const progressPercent = tier.level === 6 ? 100 : Math.round((progressInTier / tierRange) * 100);
      return {
        level: tier.level,
        title: tier.title,
        minXp: tier.minXp,
        maxXp: tier.maxXp,
        progressPercent,
      };
    }
  }
  return { level: 1, title: 'Beginner', minXp: 0, maxXp: 500, progressPercent: 0 };
}

export const DEFAULT_USER: UserProfile = {
  id: 'u_local_user',
  name: 'Quiz Master',
  email: '',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  provider: 'guest',
  level: 1,
  levelTitle: 'Beginner',
  xp: 120,
  currentStreak: 2,
  longestStreak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  quizzesCompleted: 1,
  questionsAnswered: 5,
  correctAnswers: 4,
  puzzlesSolved: 0,
  unlockedAchievements: ['first_step'],
  favoriteCategories: ['science', 'technology', 'history'],
  createdAt: new Date().toISOString(),
};

export const StorageService = {
  getUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER;
  },

  saveUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  getAttempts(): QuizAttempt[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveAttempt(attempt: QuizAttempt) {
    try {
      const attempts = this.getAttempts();
      attempts.unshift(attempt);
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }
  },

  getAllQuizzes(): Quiz[] {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUIZZES);
      const customQuizzes: Quiz[] = custom ? JSON.parse(custom) : [];
      return [...customQuizzes, ...ALL_QUIZZES_1000];
    } catch {
      return ALL_QUIZZES_1000;
    }
  },

  addCustomQuiz(quiz: Quiz) {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUIZZES);
      const list: Quiz[] = custom ? JSON.parse(custom) : [];
      list.unshift(quiz);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  },

  deleteCustomQuiz(quizId: string) {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUIZZES);
      if (custom) {
        const list: Quiz[] = JSON.parse(custom);
        const filtered = list.filter((q) => q.id !== quizId);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error(e);
    }
  },

  getDailyPicksForDate(dateStr: string) {
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
      seed = (seed * 31 + dateStr.charCodeAt(i)) & 0xffffff;
    }
    const quizzes = this.getAllQuizzes();
    const quiz = quizzes[Math.abs(seed) % quizzes.length];
    const puzzle = INITIAL_PUZZLES[Math.abs(seed * 7 + 3) % INITIAL_PUZZLES.length];
    return { quiz, puzzle };
  },

  getDailyState(): DailyChallengeState {
    const today = new Date().toISOString().split('T')[0];
    const { quiz: dailyQuiz, puzzle: dailyPuzzle } = this.getDailyPicksForDate(today);

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_STATE);
      if (stored) {
        const parsed: DailyChallengeState = JSON.parse(stored);
        if (parsed.date === today) {
          return {
            ...parsed,
            quizId: parsed.quizId || dailyQuiz.id,
            puzzleId: parsed.puzzleId || dailyPuzzle.id,
            quizTitle: parsed.quizTitle || dailyQuiz.title,
            quizCategory: parsed.quizCategory || dailyQuiz.categoryId,
            puzzleTitle: parsed.puzzleTitle || dailyPuzzle.title,
            puzzleType: parsed.puzzleType || dailyPuzzle.type,
          };
        } else {
          // New day has arrived! Calculate streak continuation
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          let updatedStreak = parsed.streakDays || 1;
          if (parsed.date === yesterday) {
            if (parsed.quizCompleted && parsed.puzzleCompleted) {
              updatedStreak += 1;
            }
          } else {
            updatedStreak = 1;
          }

          const freshState: DailyChallengeState = {
            date: today,
            quizId: dailyQuiz.id,
            puzzleId: dailyPuzzle.id,
            quizTitle: dailyQuiz.title,
            quizCategory: dailyQuiz.categoryId,
            puzzleTitle: dailyPuzzle.title,
            puzzleType: dailyPuzzle.type,
            quizCompleted: false,
            puzzleCompleted: false,
            bonusClaimed: false,
            streakDays: updatedStreak,
          };
          this.saveDailyState(freshState);
          return freshState;
        }
      }
    } catch {}

    const fresh: DailyChallengeState = {
      date: today,
      quizId: dailyQuiz.id,
      puzzleId: dailyPuzzle.id,
      quizTitle: dailyQuiz.title,
      quizCategory: dailyQuiz.categoryId,
      puzzleTitle: dailyPuzzle.title,
      puzzleType: dailyPuzzle.type,
      quizCompleted: false,
      puzzleCompleted: false,
      bonusClaimed: false,
      streakDays: 1,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_STATE, JSON.stringify(fresh));
    } catch {}
    return fresh;
  },

  saveDailyState(state: DailyChallengeState) {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_STATE, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  },

  // Check and unlock any new achievements based on current user stats
  checkAchievements(user: UserProfile): { updatedUser: UserProfile; newlyUnlocked: string[] } {
    const newlyUnlocked: string[] = [];
    const currentUnlocked = new Set(user.unlockedAchievements);

    for (const ach of ACHIEVEMENTS_DATA) {
      if (currentUnlocked.has(ach.id)) continue;

      let qualified = false;
      if (ach.progressMetric === 'quizzes' && user.quizzesCompleted >= ach.threshold) {
        qualified = true;
      } else if (ach.progressMetric === 'puzzles' && user.puzzlesSolved >= ach.threshold) {
        qualified = true;
      } else if (ach.progressMetric === 'streak' && user.currentStreak >= ach.threshold) {
        qualified = true;
      } else if (ach.progressMetric === 'xp' && user.xp >= ach.threshold) {
        qualified = true;
      } else if (ach.progressMetric === 'categories' && user.favoriteCategories.length >= ach.threshold) {
        qualified = true;
      } else if (ach.progressMetric === 'perfect_scores') {
        const attempts = this.getAttempts();
        if (attempts.some((a) => a.accuracy === 100)) {
          qualified = true;
        }
      }

      if (qualified) {
        newlyUnlocked.push(ach.id);
        currentUnlocked.add(ach.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      const updatedUser: UserProfile = {
        ...user,
        unlockedAchievements: Array.from(currentUnlocked),
      };
      this.saveUser(updatedUser);
      return { updatedUser, newlyUnlocked };
    }

    return { updatedUser: user, newlyUnlocked: [] };
  },

  // Retrieve only users who signed up to this website
  getRegisteredUsers(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  // Save or update a registered user in the leaderboard database
  registerOrUpdateUser(user: UserProfile): LeaderboardEntry[] {
    // Only register users who have signed up (e.g. Google auth or email provider)
    if (user.provider !== 'google' && !user.email) {
      return this.getRegisteredUsers();
    }

    const registered = this.getRegisteredUsers();
    const existingIndex = registered.findIndex(
      (u) => u.userId === user.id || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
    );

    const accuracy =
      user.questionsAnswered > 0
        ? Math.round((user.correctAnswers / user.questionsAnswered) * 100)
        : 90;

    const userEntry: LeaderboardEntry = {
      rank: 1,
      userId: user.id,
      userName: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      level: user.level,
      levelTitle: user.levelTitle,
      scoreOrXp: user.xp,
      accuracy,
      streak: user.currentStreak,
      signedUpAt: user.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      registered[existingIndex] = {
        ...registered[existingIndex],
        ...userEntry,
        signedUpAt: registered[existingIndex].signedUpAt || userEntry.signedUpAt,
      };
    } else {
      registered.push(userEntry);
    }

    // Sort strictly by XP descending
    registered.sort((a, b) => b.scoreOrXp - a.scoreOrXp);

    // Re-assign ranks 1, 2, 3...
    registered.forEach((item, index) => {
      item.rank = index + 1;
    });

    try {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));
    } catch (e) {
      console.error(e);
    }

    return registered;
  },

  // Get filtered/ordered leaderboard for signed-up users only
  getRegisteredLeaderboard(currentUserId?: string): LeaderboardEntry[] {
    const list = this.getRegisteredUsers();
    const currentUser = StorageService.getUser();
    return list.map((item) => ({
      ...item,
      isCurrentUser: currentUserId
        ? item.userId === currentUserId || Boolean(item.email && currentUser.email && item.email === currentUser.email)
        : false,
    }));
  },
};
