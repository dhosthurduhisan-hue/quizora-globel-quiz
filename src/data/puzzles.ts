import { Puzzle } from '../types';

export const INITIAL_PUZZLES: Puzzle[] = [
  {
    id: 'sudoku-classic-9x9',
    title: 'Daily Logic Sudoku (9x9)',
    type: 'sudoku',
    difficulty: 'medium',
    description: 'Place digits 1 to 9 so that every row, column, and 3x3 box contains all digits without repetition.',
    estimatedTimeMin: 7,
    xpReward: 180,
    playsCount: 24500,
    isDaily: true,
    thumbnail: '/src/assets/images/puzzle_logic_grid_1791200387847.jpg',
    config: {
      initialGrid: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      solutionGrid: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ]
    }
  },
  {
    id: 'word-search-science',
    title: 'Cosmic Word Search Hunt',
    type: 'word_search',
    difficulty: 'easy',
    description: 'Find all hidden astronomical and physics terms hidden across the grid horizontally, vertically, or diagonally.',
    estimatedTimeMin: 5,
    xpReward: 140,
    playsCount: 17200,
    isDaily: false,
    thumbnail: '/src/assets/images/quiz_space_cosmos_1791200353350.jpg',
    config: {
      grid: [
        ['P', 'H', 'O', 'T', 'O', 'N', 'K', 'Q', 'X', 'B'],
        ['U', 'Q', 'U', 'A', 'S', 'A', 'R', 'U', 'G', 'L'],
        ['L', 'R', 'P', 'R', 'O', 'T', 'O', 'A', 'A', 'A'],
        ['S', 'E', 'A', 'R', 'T', 'H', 'T', 'R', 'L', 'C'],
        ['A', 'C', 'N', 'E', 'B', 'U', 'L', 'K', 'A', 'K'],
        ['R', 'L', 'G', 'A', 'L', 'A', 'X', 'Y', 'X', 'H'],
        ['Z', 'P', 'L', 'A', 'S', 'M', 'A', 'F', 'Y', 'O'],
        ['M', 'A', 'R', 'S', 'T', 'A', 'R', 'S', 'Z', 'L'],
        ['O', 'R', 'B', 'I', 'T', 'C', 'O', 'M', 'E', 'T'],
        ['N', 'E', 'U', 'T', 'R', 'O', 'N', 'D', 'W', 'E']
      ],
      words: ['PHOTON', 'QUASAR', 'NEBULA', 'GALAXY', 'PULSAR', 'PLASMA', 'ORBIT', 'COMET', 'STARS', 'NEUTRON']
    }
  },
  {
    id: 'memory-neuro-matrix',
    title: 'Neuro Symbol Memory Match',
    type: 'memory_match',
    difficulty: 'medium',
    description: 'Flip pairs of neural cards and match all symbols in minimal turns and time.',
    estimatedTimeMin: 4,
    xpReward: 160,
    playsCount: 31000,
    isDaily: false,
    thumbnail: '/src/assets/images/hero_quiz_mind_1791200336656.jpg',
    config: {
      cards: [
        { id: '1', symbol: 'Atom', label: 'Quantum' },
        { id: '2', symbol: 'Atom', label: 'Quantum' },
        { id: '3', symbol: 'Compass', label: 'Orientation' },
        { id: '4', symbol: 'Compass', label: 'Orientation' },
        { id: '5', symbol: 'Telescope', label: 'Cosmos' },
        { id: '6', symbol: 'Telescope', label: 'Cosmos' },
        { id: '7', symbol: 'Flame', label: 'Energy' },
        { id: '8', symbol: 'Flame', label: 'Energy' },
        { id: '9', symbol: 'Zap', label: 'Synapse' },
        { id: '10', symbol: 'Zap', label: 'Synapse' },
        { id: '11', symbol: 'Cpu', label: 'Neural Core' },
        { id: '12', symbol: 'Cpu', label: 'Neural Core' },
        { id: '13', symbol: 'Globe', label: 'Biosphere' },
        { id: '14', symbol: 'Globe', label: 'Biosphere' },
        { id: '15', symbol: 'Binary', label: 'Logic Code' },
        { id: '16', symbol: 'Binary', label: 'Logic Code' }
      ]
    }
  },
  {
    id: 'riddle-lateral-thinker',
    title: 'Enigmas & Lateral Brain Teasers',
    type: 'riddle',
    difficulty: 'hard',
    description: 'Sharpen your deductive wit with deceptive lateral thinking riddles and clues.',
    estimatedTimeMin: 6,
    xpReward: 200,
    playsCount: 19800,
    isDaily: false,
    thumbnail: '/src/assets/images/quiz_history_relics_1791200372663.jpg',
    config: {
      riddles: [
        {
          id: 'rid-1',
          question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
          hint: 'Think of sound bouncing off canyon walls.',
          acceptedAnswers: ['echo', 'an echo'],
          explanation: 'An echo is a sound reflection that travels through air vibrations.'
        },
        {
          id: 'rid-2',
          question: 'The more of this you take, the more you leave behind. What are they?',
          hint: 'You make them with every walking stride.',
          acceptedAnswers: ['footsteps', 'footprints', 'steps', 'foot step', 'foot print'],
          explanation: 'As you take steps forward, you leave footprints behind.'
        },
        {
          id: 'rid-3',
          question: 'What belongs to you, but other people use it much more often than you do?',
          hint: 'It is spoken whenever someone addresses you.',
          acceptedAnswers: ['your name', 'name', 'my name'],
          explanation: 'Your name belongs to you, but acquaintances and colleagues use it to call upon you.'
        },
        {
          id: 'rid-4',
          question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
          hint: 'Cartographers draft me on parchment.',
          acceptedAnswers: ['map', 'a map', 'atlas'],
          explanation: 'A geographical map represents terrain, cities, and oceans without living objects.'
        }
      ]
    }
  },
  {
    id: 'sequence-pattern-math',
    title: 'Mathematical Sequence & Pattern Logic',
    type: 'sequence_pattern',
    difficulty: 'master',
    description: 'Discover the underlying algorithmic rule governing complex numerical and geometric progressions.',
    estimatedTimeMin: 8,
    xpReward: 250,
    playsCount: 15400,
    isDaily: false,
    thumbnail: '/src/assets/images/puzzle_logic_grid_1791200387847.jpg',
    config: {
      challenges: [
        {
          id: 'seq-1',
          prompt: 'Identify the next integer in the sequence: 2, 6, 12, 20, 30, ?',
          rule: 'n * (n + 1) or differences increasing by 2 (+4, +6, +8, +10, +12)',
          correctAnswer: '42',
          options: ['38', '40', '42', '44'],
          explanation: 'Differences are +4, +6, +8, +10, +12. 30 + 12 = 42 (also 6 × 7 = 42).'
        },
        {
          id: 'seq-2',
          prompt: 'Determine the missing number: 1, 8, 27, 64, 125, ?',
          rule: 'Cube of successive integers: n^3 (1^3, 2^3, 3^3, 4^3, 5^3, 6^3)',
          correctAnswer: '216',
          options: ['196', '216', '240', '256'],
          explanation: '6 cubed = 6 × 6 × 6 = 216.'
        },
        {
          id: 'seq-3',
          prompt: 'Look at the Fibonacci-variant sequence: 3, 5, 8, 13, 21, ?',
          rule: 'Each term is the sum of previous two terms: 13 + 21',
          correctAnswer: '34',
          options: ['29', '32', '34', '36'],
          explanation: '13 + 21 = 34.'
        },
        {
          id: 'seq-4',
          prompt: 'Prime gap progression: 11, 13, 17, 19, 23, 29, ?',
          rule: 'Consecutive prime numbers',
          correctAnswer: '31',
          options: ['31', '33', '35', '37'],
          explanation: 'The prime number immediately following 29 is 31.'
        }
      ]
    }
  },
  {
    id: 'mini-crossword-tech',
    title: 'Daily Tech & Science Mini Crossword (5x5)',
    type: 'crossword',
    difficulty: 'medium',
    description: 'Solve compact 5x5 intersecting across and down clues.',
    estimatedTimeMin: 5,
    xpReward: 170,
    playsCount: 21900,
    isDaily: false,
    thumbnail: '/src/assets/images/puzzle_logic_grid_1791200387847.jpg',
    config: {
      gridSize: 5,
      across: [
        { num: 1, clue: 'Brain of a computer', answer: 'CPU', row: 0, col: 0 },
        { num: 3, clue: 'Unit of digital information (8 bits)', answer: 'BYTE', row: 1, col: 1 },
        { num: 5, clue: 'Liquid crystal display acronym', answer: 'LCD', row: 2, col: 0 },
        { num: 6, clue: 'Data structure with FIFO order', answer: 'QUEUE', row: 3, col: 0 },
        { num: 7, clue: 'To repeat instructions in code', answer: 'LOOP', row: 4, col: 1 }
      ],
      down: [
        { num: 1, clue: 'Computer code instructions', answer: 'CLUE', row: 0, col: 0 },
        { num: 2, clue: 'Python loop variable keyword', answer: 'PY', row: 0, col: 1 },
        { num: 4, clue: 'High speed storage memory', answer: 'CACHE', row: 0, col: 2 }
      ]
    }
  },
  {
    id: 'nonogram-pixel-heart',
    title: 'Pixel Heart Nonogram (5x5)',
    type: 'nonogram',
    difficulty: 'easy',
    description: 'Use the row and column number clues to fill the correct grid cells and uncover the hidden pixel heart.',
    estimatedTimeMin: 4,
    xpReward: 160,
    playsCount: 28400,
    isDaily: true,
    thumbnail: '/src/assets/images/puzzle_logic_grid_1791200387847.jpg',
    badgeReward: {
      id: 'badge_pixel_heart',
      title: 'Heart of Logic',
      icon: 'Heart',
      description: 'Solved the Pixel Heart picture logic puzzle and earned the artisan badge!'
    },
    config: {
      gridSize: 5,
      revealName: 'Pixel Heart',
      solution: [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
      ],
      rowClues: [[1, 1], [5], [5], [3], [1]],
      colClues: [[2], [4], [4], [4], [2]],
    }
  },
  {
    id: 'nonogram-cosmic-rocket',
    title: 'Cosmic Rocket Nonogram (8x8)',
    type: 'nonogram',
    difficulty: 'medium',
    description: 'Deduce which cells are thrusters, hull, and cockpit to launch the retro spaceship into deep space.',
    estimatedTimeMin: 6,
    xpReward: 220,
    playsCount: 19300,
    isDaily: false,
    thumbnail: '/src/assets/images/quiz_space_cosmos_1791200353350.jpg',
    badgeReward: {
      id: 'badge_cosmic_rocket',
      title: 'Cosmic Navigator',
      icon: 'Rocket',
      description: 'Engineered the 8x8 interstellar spacecraft through pure grid deduction!'
    },
    config: {
      gridSize: 8,
      revealName: 'Cosmic Rocket',
      solution: [
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 0, 1],
        [0, 0, 1, 0, 0, 1, 0, 0],
      ],
      rowClues: [[2], [4], [1, 1], [4], [6], [8], [1, 4, 1], [1, 1]],
      colClues: [[2], [2], [7], [5], [5], [7], [2], [2]],
    }
  },
  {
    id: 'nonogram-champions-trophy',
    title: 'Champion Trophy Nonogram (8x8)',
    type: 'nonogram',
    difficulty: 'hard',
    description: 'Assemble the golden laurels and pedestal by calculating the overlapping number clues on each axis.',
    estimatedTimeMin: 8,
    xpReward: 260,
    playsCount: 16700,
    isDaily: false,
    thumbnail: '/src/assets/images/hero_quiz_mind_1791200336656.jpg',
    badgeReward: {
      id: 'badge_champions_trophy',
      title: 'Grandmaster Artisan',
      icon: 'Trophy',
      description: 'Conquered the Champion Trophy picture logic matrix and claimed the golden badge!'
    },
    config: {
      gridSize: 8,
      revealName: 'Champion Trophy',
      solution: [
        [0, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 0, 1],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
      ],
      rowClues: [[6], [8], [1, 4, 1], [4], [2], [2], [4], [6]],
      colClues: [[2], [3], [4, 2], [8], [8], [4, 2], [3], [2]],
    }
  },
  {
    id: 'sos-classic-duel',
    title: 'SOS Grid Duel (By Hisan & Friends)',
    type: 'sos',
    difficulty: 'medium',
    description: 'Classic paper-and-pencil SOS grid duel! Place S or O on the grid and connect S-O-S to score points and outmaneuver your opponent.',
    estimatedTimeMin: 5,
    xpReward: 200,
    playsCount: 31200,
    isDaily: true,
    thumbnail: '/src/assets/images/puzzle_logic_grid_1791200387847.jpg',
    badgeReward: {
      id: 'badge_sos_tactician',
      title: 'SOS Tactician',
      icon: 'Swords',
      description: 'Formed winning S-O-S sequences in Hisan & Friends strategic grid duel!'
    },
    config: {
      gridSize: 6,
    }
  },
  {
    id: 'sliding-puzzle-15',
    title: 'Classic 15-Puzzle Slider (By Hisan & Friends)',
    type: 'sliding_tile',
    difficulty: 'hard',
    description: 'Slide numbered tiles into the empty space to arrange numbers 1 to 15 in sequential order.',
    estimatedTimeMin: 7,
    xpReward: 240,
    playsCount: 22400,
    isDaily: false,
    thumbnail: '/src/assets/images/puzzle_logic_grid_1791200387847.jpg',
    badgeReward: {
      id: 'badge_slider_virtuoso',
      title: 'Slide Virtuoso',
      icon: 'Layers',
      description: 'Arranged all 15 sliding tiles in sequential harmony!'
    },
    config: {
      gridSize: 4,
    }
  },
  {
    id: 'lights-out-matrix',
    title: 'Neural Lights Out (By Hisan & Friends)',
    type: 'lights_out',
    difficulty: 'medium',
    description: 'Toggling a bulb flips itself and its orthogonal neighbors. Switch off every light on the grid in minimum moves.',
    estimatedTimeMin: 6,
    xpReward: 210,
    playsCount: 18900,
    isDaily: false,
    thumbnail: '/src/assets/images/hero_quiz_mind_1791200336656.jpg',
    badgeReward: {
      id: 'badge_lights_out_master',
      title: 'Matrix Darkener',
      icon: 'Zap',
      description: 'Turned off all lights on the neural toggle matrix!'
    },
    config: {
      gridSize: 5,
    }
  }
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return INITIAL_PUZZLES.find((p) => p.id === id);
}
