import { Achievement } from '../types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'first_100_xp',
    title: 'First 100 XP',
    description: 'Earn your first 100 XP across quizzes and logic puzzles.',
    iconName: 'Zap',
    category: 'xp',
    xpReward: 100,
    threshold: 100,
    progressMetric: 'xp'
  },
  {
    id: 'streak_10_days',
    title: '10-Day Streak',
    description: 'Maintain an unbroken 10-day streak solving daily challenges.',
    iconName: 'Flame',
    category: 'streak',
    xpReward: 500,
    threshold: 10,
    progressMetric: 'streak'
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Conquer and complete 10 quizzes on Quizora.',
    iconName: 'Trophy',
    category: 'quiz',
    xpReward: 350,
    threshold: 10,
    progressMetric: 'quizzes'
  },
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first quiz on Quizora.',
    iconName: 'Footprints',
    category: 'quiz',
    xpReward: 100,
    threshold: 1,
    progressMetric: 'quizzes'
  },
  {
    id: 'perfect_mind',
    title: 'Perfect Mind',
    description: 'Achieve a 100% flawless score on any quiz.',
    iconName: 'Sparkles',
    category: 'quiz',
    xpReward: 250,
    threshold: 1,
    progressMetric: 'perfect_scores'
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Finish any quiz in less than half the allotted duration with over 80% accuracy.',
    iconName: 'Zap',
    category: 'quiz',
    xpReward: 200,
    threshold: 1,
    progressMetric: 'quizzes'
  },
  {
    id: 'puzzle_apprentice',
    title: 'Puzzle Apprentice',
    description: 'Solve your first logic puzzle in the Puzzle Hub.',
    iconName: 'Puzzle',
    category: 'puzzle',
    xpReward: 120,
    threshold: 1,
    progressMetric: 'puzzles'
  },
  {
    id: 'puzzle_master',
    title: 'Puzzle Master',
    description: 'Solve 10 logic puzzles across Sudoku, Word Search, and riddles.',
    iconName: 'Brain',
    category: 'puzzle',
    xpReward: 500,
    threshold: 10,
    progressMetric: 'puzzles'
  },
  {
    id: 'streak_initiator',
    title: 'Ignite the Flame',
    description: 'Maintain a 3-day consecutive play streak.',
    iconName: 'Flame',
    category: 'streak',
    xpReward: 150,
    threshold: 3,
    progressMetric: 'streak'
  },
  {
    id: 'streak_legend',
    title: 'Streak Legend',
    description: 'Maintain an unbroken 14-day daily challenge streak.',
    iconName: 'FlameKindling',
    category: 'streak',
    xpReward: 1000,
    threshold: 14,
    progressMetric: 'streak'
  },
  {
    id: 'category_explorer',
    title: 'Renaissance Explorer',
    description: 'Complete quizzes across 5 distinct knowledge categories.',
    iconName: 'Compass',
    category: 'quiz',
    xpReward: 350,
    threshold: 5,
    progressMetric: 'categories'
  },
  {
    id: 'knowledge_hunter',
    title: 'Knowledge Hunter',
    description: 'Successfully complete 25 quizzes on the platform.',
    iconName: 'BookOpenCheck',
    category: 'quiz',
    xpReward: 750,
    threshold: 25,
    progressMetric: 'quizzes'
  },
  {
    id: 'xp_titan',
    title: 'XP Titan',
    description: 'Accumulate 2,500 total XP to attain Scholar ranking.',
    iconName: 'Award',
    category: 'xp',
    xpReward: 500,
    threshold: 2500,
    progressMetric: 'xp'
  },
  {
    id: 'polymath',
    title: 'Grand Polymath',
    description: 'Complete 50 quizzes with an aggregate accuracy rate above 85%.',
    iconName: 'Crown',
    category: 'quiz',
    xpReward: 1200,
    threshold: 50,
    progressMetric: 'quizzes'
  },
  {
    id: 'sudoku_adept',
    title: 'Sudoku Adept',
    description: 'Complete a full 9x9 Sudoku grid without a single error.',
    iconName: 'Grid',
    category: 'puzzle',
    xpReward: 300,
    threshold: 1,
    progressMetric: 'puzzles'
  },
  {
    id: 'badge_pixel_heart',
    title: 'Heart of Logic',
    description: 'Solve the Pixel Heart Nonogram to unlock this exclusive picture logic badge.',
    iconName: 'Heart',
    category: 'puzzle',
    xpReward: 200,
    threshold: 1,
    progressMetric: 'puzzles'
  },
  {
    id: 'badge_cosmic_rocket',
    title: 'Cosmic Navigator',
    description: 'Decipher the 8x8 Cosmic Rocket Nonogram blueprint.',
    iconName: 'Rocket',
    category: 'puzzle',
    xpReward: 250,
    threshold: 1,
    progressMetric: 'puzzles'
  },
  {
    id: 'badge_champions_trophy',
    title: 'Grandmaster Artisan',
    description: 'Master the 8x8 Champion Trophy picture logic grid with flawless deduction.',
    iconName: 'Trophy',
    category: 'puzzle',
    xpReward: 300,
    threshold: 1,
    progressMetric: 'puzzles'
  },
  {
    id: 'badge_sos_tactician',
    title: 'SOS Tactician',
    description: 'Formed winning S-O-S sequences in Hisan & Friends strategic grid duel!',
    iconName: 'Swords',
    category: 'puzzle',
    xpReward: 250,
    threshold: 1,
    progressMetric: 'puzzles'
  },
  {
    id: 'badge_slider_virtuoso',
    title: 'Slide Virtuoso',
    description: 'Arranged all 15 sliding tiles in sequential harmony!',
    iconName: 'Layers',
    category: 'puzzle',
    xpReward: 260,
    threshold: 1,
    progressMetric: 'puzzles'
  },
  {
    id: 'badge_lights_out_master',
    title: 'Matrix Darkener',
    description: 'Turned off all lights on the neural toggle matrix!',
    iconName: 'Zap',
    category: 'puzzle',
    xpReward: 240,
    threshold: 1,
    progressMetric: 'puzzles'
  }
];
