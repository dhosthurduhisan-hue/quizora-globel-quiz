import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, QuizAttempt, DailyChallengeState } from '../types';
import { StorageService, calculateLevel } from '../services/storage';
import { sounds } from '../services/soundEffects';

interface ToastNotification {
  id: string;
  type: 'xp' | 'level_up' | 'achievement' | 'streak';
  title: string;
  message: string;
}

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  dailyState: DailyChallengeState;
  toasts: ToastNotification[];
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  logout: () => void;
  updateAvatar: (newAvatarUrl: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addXP: (amount: number, reason?: string) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  recordPuzzleSolved: (puzzleId: string, xpEarned: number) => void;
  completeDailyQuiz: () => void;
  completeDailyPuzzle: () => void;
  claimDailyBonus: () => void;
  dismissToast: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(StorageService.getUser());
  const [dailyState, setDailyState] = useState<DailyChallengeState>(StorageService.getDailyState());
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const isAuthenticated = user.provider === 'google';

  const triggerToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ensure registered user is stored in leaderboard if signed up
  useEffect(() => {
    if (user.provider === 'google' && user.email) {
      StorageService.registerOrUpdateUser(user);
    }
  }, [user]);

  const loginWithGoogle = (
    email = 'dhosthurduhisan@gmail.com',
    name = 'Dhosthur Duhisan',
    avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  ) => {
    const updated: UserProfile = {
      ...user,
      id: `google_${Date.now()}`,
      name,
      email,
      avatarUrl: avatar,
      provider: 'google',
    };
    setUser(updated);
    StorageService.saveUser(updated);
    StorageService.registerOrUpdateUser(updated);
    sounds.playVictory();
    triggerToast({
      type: 'achievement',
      title: 'Welcome to Quizora!',
      message: `Signed in successfully as ${email}`,
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    const guestUser: UserProfile = {
      ...user,
      name: 'Explorer Guest',
      email: '',
      provider: 'guest',
    };
    setUser(guestUser);
    StorageService.saveUser(guestUser);
  };

  const updateAvatar = (newAvatarUrl: string) => {
    const updatedUser: UserProfile = {
      ...user,
      avatarUrl: newAvatarUrl,
    };
    setUser(updatedUser);
    StorageService.saveUser(updatedUser);
    if (updatedUser.provider === 'google') {
      StorageService.registerOrUpdateUser(updatedUser);
    }
    sounds.playVictory();
    triggerToast({
      type: 'achievement',
      title: 'Profile Picture Updated',
      message: 'Your new avatar is now active across Quizora and the leaderboard.',
    });
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    const updatedUser: UserProfile = {
      ...user,
      ...data,
    };
    setUser(updatedUser);
    StorageService.saveUser(updatedUser);
    if (updatedUser.provider === 'google' || user.email) {
      StorageService.registerOrUpdateUser(updatedUser);
    }
    sounds.playVictory();
    triggerToast({
      type: 'achievement',
      title: 'Profile Saved',
      message: 'Your profile changes have been saved successfully.',
    });
  };

  const addXP = (amount: number, reason?: string) => {
    if (amount <= 0) return;
    const oldLevelInfo = calculateLevel(user.xp);
    const newTotalXp = user.xp + amount;
    const newLevelInfo = calculateLevel(newTotalXp);

    const updatedUser: UserProfile = {
      ...user,
      xp: newTotalXp,
      level: newLevelInfo.level,
      levelTitle: newLevelInfo.title,
    };

    // Check achievements
    const { updatedUser: finalUser, newlyUnlocked } = StorageService.checkAchievements(updatedUser);
    setUser(finalUser);
    StorageService.saveUser(finalUser);
    if (finalUser.provider === 'google') {
      StorageService.registerOrUpdateUser(finalUser);
    }

    // Audio and toast cues
    triggerToast({
      type: 'xp',
      title: `+${amount} XP Earned`,
      message: reason || 'Keep expanding your knowledge base!',
    });

    if (newLevelInfo.level > oldLevelInfo.level) {
      sounds.playVictory();
      triggerToast({
        type: 'level_up',
        title: `Level Up! Level ${newLevelInfo.level} — ${newLevelInfo.title}`,
        message: 'Congratulations! You have reached a prestigious knowledge tier.',
      });
    }

    if (newlyUnlocked.length > 0) {
      sounds.playVictory();
      triggerToast({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `You unlocked ${newlyUnlocked.length} new badge${newlyUnlocked.length > 1 ? 's' : ''}!`,
      });
    }
  };

  const recordQuizAttempt = (attempt: QuizAttempt) => {
    StorageService.saveAttempt(attempt);

    const oldLevelInfo = calculateLevel(user.xp);
    const newTotalXp = user.xp + attempt.xpEarned;
    const newLevelInfo = calculateLevel(newTotalXp);

    const updatedUser: UserProfile = {
      ...user,
      xp: newTotalXp,
      level: newLevelInfo.level,
      levelTitle: newLevelInfo.title,
      quizzesCompleted: user.quizzesCompleted + 1,
      questionsAnswered: user.questionsAnswered + attempt.correctCount + attempt.incorrectCount,
      correctAnswers: user.correctAnswers + attempt.correctCount,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    const { updatedUser: finalUser, newlyUnlocked } = StorageService.checkAchievements(updatedUser);
    setUser(finalUser);
    StorageService.saveUser(finalUser);
    if (finalUser.provider === 'google') {
      StorageService.registerOrUpdateUser(finalUser);
    }

    if (newlyUnlocked.length > 0) {
      triggerToast({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `You earned ${newlyUnlocked.length} new badge${newlyUnlocked.length > 1 ? 's' : ''}!`,
      });
    }
  };

  const recordPuzzleSolved = (puzzleId: string, xpEarned: number) => {
    const updatedUser: UserProfile = {
      ...user,
      puzzlesSolved: user.puzzlesSolved + 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setUser(updatedUser);
    StorageService.saveUser(updatedUser);
    addXP(xpEarned, `Solved logic puzzle: ${puzzleId}`);
  };

  const completeDailyQuiz = () => {
    const nextDaily: DailyChallengeState = {
      ...dailyState,
      quizCompleted: true,
    };
    setDailyState(nextDaily);
    StorageService.saveDailyState(nextDaily);
    addXP(100, 'Completed Daily Quiz challenge');
  };

  const completeDailyPuzzle = () => {
    const nextDaily: DailyChallengeState = {
      ...dailyState,
      puzzleCompleted: true,
    };
    setDailyState(nextDaily);
    StorageService.saveDailyState(nextDaily);
    addXP(100, 'Completed Daily Logic Puzzle');
  };

  const claimDailyBonus = () => {
    if (dailyState.quizCompleted && dailyState.puzzleCompleted && !dailyState.bonusClaimed) {
      const streakBonusXp = dailyState.streakDays * 30 + 150;
      const nextDaily: DailyChallengeState = {
        ...dailyState,
        bonusClaimed: true,
        streakDays: dailyState.streakDays + 1,
      };
      setDailyState(nextDaily);
      StorageService.saveDailyState(nextDaily);

      const updatedUser: UserProfile = {
        ...user,
        currentStreak: user.currentStreak + 1,
        longestStreak: Math.max(user.longestStreak, user.currentStreak + 1),
      };
      setUser(updatedUser);
      StorageService.saveUser(updatedUser);

      sounds.playVictory();
      addXP(streakBonusXp, `Daily Combo Bonus (${dailyState.streakDays} Day Streak Multiplier)`);
      triggerToast({
        type: 'streak',
        title: `🔥 Streak Increased to ${nextDaily.streakDays} Days!`,
        message: `Claimed +${streakBonusXp} XP daily combo bonus.`,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        dailyState,
        toasts,
        loginWithGoogle,
        logout,
        updateAvatar,
        updateProfile,
        addXP,
        recordQuizAttempt,
        recordPuzzleSolved,
        completeDailyQuiz,
        completeDailyPuzzle,
        claimDailyBonus,
        dismissToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
