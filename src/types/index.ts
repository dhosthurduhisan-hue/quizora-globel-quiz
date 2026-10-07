export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'image'
  | 'multi_select'
  | 'ordering'
  | 'matching'
  | 'fill_blank';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: QuestionType;
  options?: AnswerOption[];
  correctAnswer?: string | string[]; // string for mcq/true_false/fill_blank, string[] for multi_select or ordered sequence
  matchingPairs?: MatchingPair[];
  imageUrl?: string;
  explanation: string;
  points: number;
  timeLimitSec?: number;
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  subcategory?: string;
  difficulty: Difficulty;
  durationMinutes: number;
  questionCount: number;
  thumbnail: string;
  xpReward: number;
  rating: number;
  playCount: number;
  language: string;
  isDailyChallenge?: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  author?: string;
  questions?: Question[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  subcategories: string[];
  totalQuizzes: number;
  color: string;
}

export type PuzzleType =
  | 'sudoku'
  | 'word_search'
  | 'memory_match'
  | 'riddle'
  | 'sequence_pattern'
  | 'crossword'
  | 'nonogram'
  | 'sos'
  | 'sliding_tile'
  | 'lights_out';

export interface PuzzleBadge {
  id: string;
  title: string;
  icon: string; // lucide icon name or emoji
  description: string;
  unlockedAt?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  type: PuzzleType;
  difficulty: Difficulty;
  description: string;
  estimatedTimeMin: number;
  xpReward: number;
  playsCount: number;
  thumbnail?: string;
  isDaily?: boolean;
  badgeReward?: PuzzleBadge;
  config: Record<string, any>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  provider: 'google' | 'guest';
  level: number;
  levelTitle: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  quizzesCompleted: number;
  questionsAnswered: number;
  correctAnswers: number;
  puzzlesSolved: number;
  unlockedAchievements: string[];
  favoriteCategories: string[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentSec: number;
  xpEarned: number;
  completedAt: string;
  userAnswers: Record<string, any>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'quiz' | 'puzzle' | 'streak' | 'xp' | 'social';
  xpReward: number;
  threshold: number;
  progressMetric: 'quizzes' | 'puzzles' | 'streak' | 'xp' | 'perfect_scores' | 'categories';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  email?: string;
  avatarUrl: string;
  level: number;
  levelTitle: string;
  scoreOrXp: number;
  accuracy: number;
  streak: number;
  signedUpAt?: string;
  isCurrentUser?: boolean;
}

export interface DailyChallengeState {
  date: string;
  quizId: string;
  puzzleId: string;
  quizTitle?: string;
  quizCategory?: string;
  puzzleTitle?: string;
  puzzleType?: string;
  quizCompleted: boolean;
  puzzleCompleted: boolean;
  bonusClaimed: boolean;
  streakDays: number;
}
