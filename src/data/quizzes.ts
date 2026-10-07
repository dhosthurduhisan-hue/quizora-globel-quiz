import { Quiz } from '../types';

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-quantum-frontiers',
    title: 'Quantum Mechanics & Modern Physics',
    slug: 'quantum-mechanics-modern-physics',
    description: 'Test your understanding of wave-particle duality, quantum entanglement, and the Copenhagen interpretation.',
    categoryId: 'science',
    subcategory: 'Quantum Mechanics',
    difficulty: 'hard',
    durationMinutes: 8,
    questionCount: 6,
    thumbnail: '/src/assets/images/hero_quiz_mind_1791200336656.jpg',
    xpReward: 350,
    rating: 4.9,
    playCount: 18450,
    language: 'English',
    isDailyChallenge: true,
    status: 'published',
    createdAt: '2026-09-20T10:00:00Z',
    author: 'Dr. Elena Rostova',
    questions: [
      {
        id: 'qm-q1',
        quizId: 'quiz-quantum-frontiers',
        questionText: 'Which principle states that you cannot simultaneously measure both the exact position and momentum of a subatomic particle?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Pauli Exclusion Principle' },
          { id: 'opt2', text: 'Schrödinger Wave Equation' },
          { id: 'opt3', text: 'Heisenberg Uncertainty Principle' },
          { id: 'opt4', text: 'De Broglie Hypothesis' }
        ],
        correctAnswer: 'opt3',
        explanation: 'Formulated by Werner Heisenberg in 1927, Δx·Δp ≥ ℏ/2 establishes that increasing precision in position measurement inherently limits knowledge of momentum.',
        points: 50,
        timeLimitSec: 30
      },
      {
        id: 'qm-q2',
        quizId: 'quiz-quantum-frontiers',
        questionText: 'Light exhibits both wave and particle characteristics depending on the experimental measurement.',
        questionType: 'true_false',
        options: [
          { id: 't', text: 'True' },
          { id: 'f', text: 'False' }
        ],
        correctAnswer: 't',
        explanation: 'Wave-particle duality was demonstrated through Young’s double-slit experiment (wave) and Einstein’s photoelectric effect (particle photons).',
        points: 40,
        timeLimitSec: 20
      },
      {
        id: 'qm-q3',
        quizId: 'quiz-quantum-frontiers',
        questionText: 'Select ALL phenomena directly predicted or explained by Quantum Mechanics:',
        questionType: 'multi_select',
        options: [
          { id: 'a', text: 'Quantum Tunneling' },
          { id: 'b', text: 'Spontaneous Emission in Lasers' },
          { id: 'c', text: 'Newtonian Gravity Acceleration' },
          { id: 'd', text: 'Superconductivity in metals' }
        ],
        correctAnswer: ['a', 'b', 'd'],
        explanation: 'Tunneling, laser emission, and Cooper pairing in superconductivity are quantum phenomena. Classical Newtonian gravity is a macroscopic classical approximation.',
        points: 70,
        timeLimitSec: 45
      },
      {
        id: 'qm-q4',
        quizId: 'quiz-quantum-frontiers',
        questionText: 'Arrange these fundamental particles and entities in order of discovery year (earliest to latest):',
        questionType: 'ordering',
        correctAnswer: ['Electron (1897)', 'Proton (1917)', 'Neutron (1932)', 'Higgs Boson (2012)'],
        options: [
          { id: '1', text: 'Neutron (1932)' },
          { id: '2', text: 'Electron (1897)' },
          { id: '3', text: 'Higgs Boson (2012)' },
          { id: '4', text: 'Proton (1917)' }
        ],
        explanation: 'J.J. Thomson discovered the electron in 1897, Rutherford identified the proton in 1917, Chadwick discovered the neutron in 1932, and CERN confirmed the Higgs boson in 2012.',
        points: 80,
        timeLimitSec: 45
      },
      {
        id: 'qm-q5',
        quizId: 'quiz-quantum-frontiers',
        questionText: 'Match each visionary physicist with their seminal quantum contribution:',
        questionType: 'matching',
        matchingPairs: [
          { left: 'Max Planck', right: 'Quanta of energy (E = hf)' },
          { left: 'Erwin Schrödinger', right: 'Wavefunction probability' },
          { left: 'Louis de Broglie', right: 'Matter waves' },
          { left: 'Paul Dirac', right: 'Antimatter prediction' }
        ],
        explanation: 'Planck birthed quantum theory in 1900; Schrödinger established wave mechanics; de Broglie postulated matter waves; Dirac united quantum mechanics with special relativity, predicting positrons.',
        points: 60,
        timeLimitSec: 50
      },
      {
        id: 'qm-q6',
        quizId: 'quiz-quantum-frontiers',
        questionText: 'What is the standard unit symbol for Planck constant divided by 2π, often called "h-bar"? Type its common mathematical name:',
        questionType: 'fill_blank',
        correctAnswer: 'reduced planck constant',
        options: [
          { id: 'hint1', text: 'Also known as Dirac constant or reduced Planck constant' }
        ],
        explanation: 'ℏ (h-bar) is the reduced Planck constant (or Dirac constant), with an exact value of 1.054571817... × 10^-34 J·s.',
        points: 50,
        timeLimitSec: 30
      }
    ]
  },
  {
    id: 'quiz-deep-space-cosmos',
    title: 'Deep Space & Stellar Astrophysics',
    slug: 'deep-space-stellar-astrophysics',
    description: 'Journey across stellar nucleosynthesis, black hole event horizons, neutron stars, and cosmic microwave background.',
    categoryId: 'space-astronomy',
    subcategory: 'Astrophysics',
    difficulty: 'medium',
    durationMinutes: 7,
    questionCount: 5,
    thumbnail: '/src/assets/images/quiz_space_cosmos_1791200353350.jpg',
    xpReward: 280,
    rating: 4.85,
    playCount: 14200,
    language: 'English',
    isDailyChallenge: false,
    status: 'published',
    createdAt: '2026-09-25T14:30:00Z',
    author: 'Cassini Astronomical Society',
    questions: [
      {
        id: 'sp-q1',
        quizId: 'quiz-deep-space-cosmos',
        questionText: 'Identify this cosmic phenomenon shown in the high-resolution telescope survey:',
        questionType: 'image',
        imageUrl: '/src/assets/images/quiz_space_cosmos_1791200353350.jpg',
        options: [
          { id: 'opt1', text: 'Supermassive Black Hole Accretion Disk' },
          { id: 'opt2', text: 'Planetary Nebula & Stellar Nursery' },
          { id: 'opt3', text: 'Oort Cloud debris' },
          { id: 'opt4', text: 'Asteroid Belt resonance' }
        ],
        correctAnswer: 'opt2',
        explanation: 'This celestial photograph captures glowing interstellar gas and ionized plasma in a stellar nursery where young protostars ignite hydrogen fusion.',
        points: 50,
        timeLimitSec: 30
      },
      {
        id: 'sp-q2',
        quizId: 'quiz-deep-space-cosmos',
        questionText: 'What is the boundary around a black hole beyond which nothing, not even light, can escape?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Photon Sphere' },
          { id: 'opt2', text: 'Ergosphere' },
          { id: 'opt3', text: 'Roche Limit' },
          { id: 'opt4', text: 'Event Horizon' }
        ],
        correctAnswer: 'opt4',
        explanation: 'The event horizon defines the boundary of spacetime in general relativity where the escape velocity strictly equals or exceeds the speed of light c.',
        points: 40,
        timeLimitSec: 25
      },
      {
        id: 'sp-q3',
        quizId: 'quiz-deep-space-cosmos',
        questionText: 'A light-year is a unit of time measuring how long light takes to orbit a star.',
        questionType: 'true_false',
        options: [
          { id: 't', text: 'True' },
          { id: 'f', text: 'False' }
        ],
        correctAnswer: 'f',
        explanation: 'A light-year is a unit of astronomical distance, equivalent to approximately 9.46 trillion kilometers (5.88 trillion miles).',
        points: 30,
        timeLimitSec: 20
      },
      {
        id: 'sp-q4',
        quizId: 'quiz-deep-space-cosmos',
        questionText: 'Order these celestial bodies from closest to farthest from Earth on average:',
        questionType: 'ordering',
        correctAnswer: ['The Moon', 'Mars', 'Jupiter', 'Proxima Centauri'],
        options: [
          { id: '1', text: 'Jupiter' },
          { id: '2', text: 'The Moon' },
          { id: '3', text: 'Proxima Centauri' },
          { id: '4', text: 'Mars' }
        ],
        explanation: 'Moon is ~384,400 km; Mars is ~225 million km average; Jupiter is ~778 million km; Proxima Centauri is ~4.24 light years (40 trillion km).',
        points: 70,
        timeLimitSec: 40
      },
      {
        id: 'sp-q5',
        quizId: 'quiz-deep-space-cosmos',
        questionText: 'What is the term for an extremely dense collapsed core of a massive supergiant star that spins rapidly and emits beams of electromagnetic radiation?',
        questionType: 'fill_blank',
        correctAnswer: 'pulsar',
        explanation: 'A pulsar is a highly magnetized rotating neutron star that emits directional beams of radiation, first discovered by Jocelyn Bell Burnell in 1967.',
        points: 50,
        timeLimitSec: 30
      }
    ]
  },
  {
    id: 'quiz-world-civilizations',
    title: 'Ancient Empires & Forgotten Chronicles',
    slug: 'ancient-empires-forgotten-chronicles',
    description: 'Explore the architectural monuments, governance, and epic transformations of Mesopotamian, Roman, and Malabar civilizations.',
    categoryId: 'history',
    subcategory: 'Ancient Rome & Greece',
    difficulty: 'medium',
    durationMinutes: 6,
    questionCount: 5,
    thumbnail: '/src/assets/images/quiz_history_relics_1791200372663.jpg',
    xpReward: 250,
    rating: 4.92,
    playCount: 16800,
    language: 'English',
    isDailyChallenge: false,
    status: 'published',
    createdAt: '2026-09-15T09:00:00Z',
    author: 'Archival Heritage Institute',
    questions: [
      {
        id: 'wh-q1',
        quizId: 'quiz-world-civilizations',
        questionText: 'Which ancient legal code engraved on a diorite stele is celebrated for the principle "an eye for an eye"?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Justinian Code' },
          { id: 'opt2', text: 'Code of Hammurabi' },
          { id: 'opt3', text: 'Twelve Tables of Rome' },
          { id: 'opt4', text: 'Edicts of Ashoka' }
        ],
        correctAnswer: 'opt2',
        explanation: 'The Code of Hammurabi was promulgated by King Hammurabi of Babylon around 1750 BCE and contains 282 edicts regulating commerce, contracts, and penal law.',
        points: 50,
        timeLimitSec: 25
      },
      {
        id: 'wh-q2',
        quizId: 'quiz-world-civilizations',
        questionText: 'Select ALL ancient wonders that actually existed simultaneously in antiquity:',
        questionType: 'multi_select',
        options: [
          { id: 'a', text: 'Great Pyramid of Giza' },
          { id: 'b', text: 'Colossus of Rhodes' },
          { id: 'c', text: 'Lighthouse of Alexandria' },
          { id: 'd', text: 'Taj Mahal' }
        ],
        correctAnswer: ['a', 'b', 'c'],
        explanation: 'The Great Pyramid, Colossus of Rhodes, and Lighthouse of Alexandria coexisted in the 3rd century BCE. The Taj Mahal was completed in 1653 CE in Agra.',
        points: 60,
        timeLimitSec: 35
      },
      {
        id: 'wh-q3',
        quizId: 'quiz-world-civilizations',
        questionText: 'In Kerala history, the ancient port city of Muziris was renowned across the Greco-Roman world for its brisk trade in black pepper and spices.',
        questionType: 'true_false',
        options: [
          { id: 't', text: 'True' },
          { id: 'f', text: 'False' }
        ],
        correctAnswer: 't',
        explanation: 'Muziris (near Kodungallur / Pattanam in Kerala) was described in the Periplus of the Erythraean Sea and Pliny the Elder as the foremost emporium of India.',
        points: 40,
        timeLimitSec: 20
      },
      {
        id: 'wh-q4',
        quizId: 'quiz-world-civilizations',
        questionText: 'Match each ancient civilization with its characteristic writing system:',
        questionType: 'matching',
        matchingPairs: [
          { left: 'Mesopotamia', right: 'Cuneiform script' },
          { left: 'Ancient Egypt', right: 'Hieroglyphics' },
          { left: 'Indus Valley', right: 'Undeciphered Indus Script' },
          { left: 'Mesoamerica (Maya)', right: 'Glyphic syllabary' }
        ],
        explanation: 'Sumerian cuneiform on clay tablets and Egyptian hieroglyphics on papyrus and stone represent the earliest documented scripts.',
        points: 60,
        timeLimitSec: 45
      },
      {
        id: 'wh-q5',
        quizId: 'quiz-world-civilizations',
        questionText: 'What term describes the golden period of Roman imperial peace initiated under Augustus Caesar?',
        questionType: 'fill_blank',
        correctAnswer: 'pax romana',
        explanation: 'Pax Romana was an era of relative tranquility lasting approximately 200 years from 27 BCE to 180 CE.',
        points: 50,
        timeLimitSec: 25
      }
    ]
  },
  {
    id: 'quiz-ai-foundations',
    title: 'Artificial Intelligence & Neural Architectures',
    slug: 'artificial-intelligence-neural-architectures',
    description: 'Transformers, self-attention mechanisms, gradient descent optimization, and ethics of large models.',
    categoryId: 'technology',
    subcategory: 'Artificial Intelligence',
    difficulty: 'hard',
    durationMinutes: 8,
    questionCount: 5,
    thumbnail: '/src/assets/images/puzzle_logic_grid_1791200387847.jpg',
    xpReward: 320,
    rating: 4.95,
    playCount: 22100,
    language: 'English',
    isDailyChallenge: false,
    status: 'published',
    createdAt: '2026-09-28T16:00:00Z',
    author: 'Applied AI Institute',
    questions: [
      {
        id: 'ai-q1',
        quizId: 'quiz-ai-foundations',
        questionText: 'What landmark 2017 research paper introduced the Transformer architecture based entirely on self-attention?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Deep Residual Learning for Image Recognition' },
          { id: 'opt2', text: 'Generative Adversarial Nets' },
          { id: 'opt3', text: 'Attention Is All You Need' },
          { id: 'opt4', text: 'Mastering the Game of Go' }
        ],
        correctAnswer: 'opt3',
        explanation: 'Vaswani et al. published "Attention Is All You Need" from Google Research, replacing recurrent units with multi-head self-attention.',
        points: 50,
        timeLimitSec: 25
      },
      {
        id: 'ai-q2',
        quizId: 'quiz-ai-foundations',
        questionText: 'In neural network training, Backpropagation computes the gradient of the loss function with respect to each parameter using the mathematical chain rule.',
        questionType: 'true_false',
        options: [
          { id: 't', text: 'True' },
          { id: 'f', text: 'False' }
        ],
        correctAnswer: 't',
        explanation: 'Backpropagation propagates errors backwards through network layers using the calculus chain rule to update weights via gradient descent.',
        points: 40,
        timeLimitSec: 20
      },
      {
        id: 'ai-q3',
        quizId: 'quiz-ai-foundations',
        questionText: 'Select ALL components that constitute a standard Transformer decoder block:',
        questionType: 'multi_select',
        options: [
          { id: 'a', text: 'Masked Multi-Head Self-Attention' },
          { id: 'b', text: 'Cross-Attention (Encoder-Decoder Attention)' },
          { id: 'c', text: 'Feed-Forward Neural Network' },
          { id: 'd', text: 'Convolutional Pooling Layer' }
        ],
        correctAnswer: ['a', 'b', 'c'],
        explanation: 'Standard autoregressive Transformer decoders use masked attention, cross-attention (in sequence-to-sequence setups), and feed-forward networks with layer normalization. They do not employ convolutional pooling.',
        points: 70,
        timeLimitSec: 40
      },
      {
        id: 'ai-q4',
        quizId: 'quiz-ai-foundations',
        questionText: 'Order the typical phases in training an aligned Frontier Large Language Model:',
        questionType: 'ordering',
        correctAnswer: [
          'Pre-training on raw web corpus',
          'Supervised Fine-Tuning (SFT)',
          'Preference Alignment (RLHF / DPO)',
          'Safety Evaluation & Red Teaming'
        ],
        options: [
          { id: '1', text: 'Supervised Fine-Tuning (SFT)' },
          { id: '2', text: 'Pre-training on raw web corpus' },
          { id: '3', text: 'Safety Evaluation & Red Teaming' },
          { id: '4', text: 'Preference Alignment (RLHF / DPO)' }
        ],
        explanation: 'Models first learn world knowledge via self-supervised pre-training, then instruction tuning (SFT), followed by alignment (RLHF/DPO) and thorough safety evaluation.',
        points: 70,
        timeLimitSec: 45
      },
      {
        id: 'ai-q5',
        quizId: 'quiz-ai-foundations',
        questionText: 'What term describes when an AI model generates factually ungrounded or fabricated statements with high confidence?',
        questionType: 'fill_blank',
        correctAnswer: 'hallucination',
        explanation: 'Hallucination occurs when an autoregressive language model produces plausible-sounding but erroneous or unverified information.',
        points: 50,
        timeLimitSec: 25
      }
    ]
  },
  {
    id: 'quiz-world-geography-champions',
    title: 'Global Geography & Topography Masterclass',
    slug: 'global-geography-topography-masterclass',
    description: 'Challenging geography trivia spanning highest peaks, landlocked nations, oceanic trenches, and geopolitical borders.',
    categoryId: 'geography',
    subcategory: 'Physical Cartography',
    difficulty: 'easy',
    durationMinutes: 5,
    questionCount: 5,
    thumbnail: '/src/assets/images/quiz_history_relics_1791200372663.jpg',
    xpReward: 200,
    rating: 4.8,
    playCount: 19500,
    language: 'English',
    isDailyChallenge: false,
    status: 'published',
    createdAt: '2026-09-18T11:00:00Z',
    author: 'Royal Cartographic Guild',
    questions: [
      {
        id: 'geo-q1',
        quizId: 'quiz-world-geography-champions',
        questionText: 'Which is the deepest known oceanic trench on planet Earth?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Puerto Rico Trench' },
          { id: 'opt2', text: 'Mariana Trench (Challenger Deep)' },
          { id: 'opt3', text: 'Java Trench' },
          { id: 'opt4', text: 'Tonga Trench' }
        ],
        correctAnswer: 'opt2',
        explanation: 'The Challenger Deep in the Mariana Trench plunges to approximately 10,994 meters (36,070 feet) below sea level in the western Pacific Ocean.',
        points: 40,
        timeLimitSec: 20
      },
      {
        id: 'geo-q2',
        quizId: 'quiz-world-geography-champions',
        questionText: 'Which nation has the longest coastline in the world?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Norway' },
          { id: 'opt2', text: 'Russia' },
          { id: 'opt3', text: 'Canada' },
          { id: 'opt4', text: 'Australia' }
        ],
        correctAnswer: 'opt3',
        explanation: 'Canada holds the world record with over 202,080 kilometers of ocean coastline bordering the Atlantic, Pacific, and Arctic oceans.',
        points: 40,
        timeLimitSec: 25
      },
      {
        id: 'geo-q3',
        quizId: 'quiz-world-geography-champions',
        questionText: 'There are only two doubly landlocked countries in the world (surrounded exclusively by other landlocked countries). One is Uzbekistan. Which is the other?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Liechtenstein' },
          { id: 'opt2', text: 'Bolivia' },
          { id: 'opt3', text: 'Switzerland' },
          { id: 'opt4', text: 'Paraguay' }
        ],
        correctAnswer: 'opt1',
        explanation: 'Liechtenstein and Uzbekistan are the only two doubly landlocked nations on Earth.',
        points: 50,
        timeLimitSec: 25
      },
      {
        id: 'geo-q4',
        quizId: 'quiz-world-geography-champions',
        questionText: 'Mount Everest is located entirely within the borders of India.',
        questionType: 'true_false',
        options: [
          { id: 't', text: 'True' },
          { id: 'f', text: 'False' }
        ],
        correctAnswer: 'f',
        explanation: 'Mount Everest straddles the international border between Nepal and the Tibet Autonomous Region of China.',
        points: 30,
        timeLimitSec: 20
      },
      {
        id: 'geo-q5',
        quizId: 'quiz-world-geography-champions',
        questionText: 'What is the capital city of Australia?',
        questionType: 'fill_blank',
        correctAnswer: 'canberra',
        explanation: 'Canberra was chosen in 1908 as a compromise between Sydney and Melbourne as the planned capital of Australia.',
        points: 40,
        timeLimitSec: 25
      }
    ]
  },
  {
    id: 'quiz-kerala-heritage',
    title: 'Kerala Heritage, Culture & Geography',
    slug: 'kerala-heritage-culture-geography',
    description: 'Explore the backwaters, Kathakali traditions, Ayurvedic roots, and literary renaissance of God’s Own Country.',
    categoryId: 'regional-kerala-india',
    subcategory: 'Kerala History & Malabar',
    difficulty: 'medium',
    durationMinutes: 6,
    questionCount: 5,
    thumbnail: '/src/assets/images/quiz_history_relics_1791200372663.jpg',
    xpReward: 260,
    rating: 4.96,
    playCount: 11400,
    language: 'English',
    isDailyChallenge: false,
    status: 'published',
    createdAt: '2026-09-22T08:00:00Z',
    author: 'Keralam Cultural Forum',
    questions: [
      {
        id: 'ker-q1',
        quizId: 'quiz-kerala-heritage',
        questionText: 'Which classical dance-drama of Kerala is celebrated for its elaborate facial makeup (Chutti), towering headgear (Kireedam), and mudra gestures?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Mohiniyattam' },
          { id: 'opt2', text: 'Koodiyattam' },
          { id: 'opt3', text: 'Kathakali' },
          { id: 'opt4', text: 'Theyyam' }
        ],
        correctAnswer: 'opt3',
        explanation: 'Kathakali originated in Kerala during the 17th century and dramatizes stories from the Mahabharata and Ramayana with stylized facial makeup and hand mudras.',
        points: 50,
        timeLimitSec: 25
      },
      {
        id: 'ker-q2',
        quizId: 'quiz-kerala-heritage',
        questionText: 'Select ALL rivers that flow through Kerala among the following:',
        questionType: 'multi_select',
        options: [
          { id: 'a', text: 'Periyar' },
          { id: 'b', text: 'Bharathapuzha' },
          { id: 'c', text: 'Pamba' },
          { id: 'd', text: 'Yamuna' }
        ],
        correctAnswer: ['a', 'b', 'c'],
        explanation: 'Periyar (the longest), Bharathapuzha (Nila), and Pamba are major lifelines of Kerala. The Yamuna flows through northern India.',
        points: 60,
        timeLimitSec: 30
      },
      {
        id: 'ker-q3',
        quizId: 'quiz-kerala-heritage',
        questionText: 'Anamudi, the highest peak in the Western Ghats and South India, is located in the Idukki district of Kerala.',
        questionType: 'true_false',
        options: [
          { id: 't', text: 'True' },
          { id: 'f', text: 'False' }
        ],
        correctAnswer: 't',
        explanation: 'Anamudi stands at 2,695 meters (8,842 ft) in Eravikulam National Park and is the highest elevation in peninsular India.',
        points: 40,
        timeLimitSec: 20
      },
      {
        id: 'ker-q4',
        quizId: 'quiz-kerala-heritage',
        questionText: 'Match each Kerala festival or art form with its traditional venue or association:',
        questionType: 'matching',
        matchingPairs: [
          { left: 'Thrissur Pooram', right: 'Vadakkunnathan Temple grounds' },
          { left: 'Nehru Trophy Boat Race', right: 'Punnamada Lake, Alappuzha' },
          { left: 'Onam', right: 'King Mahabali homecoming' },
          { left: 'Theyyam', right: 'North Malabar shrines' }
        ],
        explanation: 'Thrissur Pooram features the Kudamattom spectacle; the Nehru Trophy is held on Punnamada Lake; Onam honors Mahabali.',
        points: 60,
        timeLimitSec: 40
      },
      {
        id: 'ker-q5',
        quizId: 'quiz-kerala-heritage',
        questionText: 'What is the traditional boat used in the famous Kerala snake boat races known as in Malayalam?',
        questionType: 'fill_blank',
        correctAnswer: 'chundan vallam',
        explanation: 'Chundan Vallam ("beaked boat"), or snake boat, measures over 100 feet in length and accommodates over 100 rowers and singers.',
        points: 50,
        timeLimitSec: 25
      }
    ]
  },
  {
    id: 'quiz-football-legends',
    title: 'Football World Cup & Champions League Lore',
    slug: 'football-world-cup-champions-league-lore',
    description: 'Iconic goals, Ballon d’Or records, legendary managers, and historic World Cup finals.',
    categoryId: 'foot-ball',
    subcategory: 'FIFA World Cup',
    difficulty: 'easy',
    durationMinutes: 5,
    questionCount: 4,
    thumbnail: '/src/assets/images/hero_quiz_mind_1791200336656.jpg',
    xpReward: 200,
    rating: 4.88,
    playCount: 28900,
    language: 'English',
    isDailyChallenge: false,
    status: 'published',
    createdAt: '2026-09-24T12:00:00Z',
    author: 'Global Football Archive',
    questions: [
      {
        id: 'fb-q1',
        quizId: 'quiz-football-legends',
        questionText: 'Which nation has won the FIFA World Cup trophy the most times (5 titles)?',
        questionType: 'mcq',
        options: [
          { id: 'opt1', text: 'Germany' },
          { id: 'opt2', text: 'Brazil' },
          { id: 'opt3', text: 'Italy' },
          { id: 'opt4', text: 'Argentina' }
        ],
        correctAnswer: 'opt2',
        explanation: 'Brazil won in 1958, 1962, 1970, 1994, and 2002, holding a record 5 World Cup victories.',
        points: 50,
        timeLimitSec: 20
      },
      {
        id: 'fb-q2',
        quizId: 'quiz-football-legends',
        questionText: 'Lionel Messi captained Argentina to victory in the 2022 FIFA World Cup in Qatar.',
        questionType: 'true_false',
        options: [
          { id: 't', text: 'True' },
          { id: 'f', text: 'False' }
        ],
        correctAnswer: 't',
        explanation: 'Argentina defeated France in an iconic final on penalties, sealing Messi’s first World Cup championship.',
        points: 40,
        timeLimitSec: 15
      },
      {
        id: 'fb-q3',
        quizId: 'quiz-football-legends',
        questionText: 'Order these legendary players by total career Ballon d’Or awards won (highest count to lowest):',
        questionType: 'ordering',
        correctAnswer: ['Lionel Messi', 'Cristiano Ronaldo', 'Michel Platini', 'Zinedine Zidane'],
        options: [
          { id: '1', text: 'Cristiano Ronaldo' },
          { id: '2', text: 'Zinedine Zidane' },
          { id: '3', text: 'Lionel Messi' },
          { id: '4', text: 'Michel Platini' }
        ],
        explanation: 'Lionel Messi (8), Cristiano Ronaldo (5), Michel Platini (3), Zinedine Zidane (1).',
        points: 60,
        timeLimitSec: 35
      },
      {
        id: 'fb-q4',
        quizId: 'quiz-football-legends',
        questionText: 'Which football club has won the most UEFA Champions League / European Cup titles in history?',
        questionType: 'fill_blank',
        correctAnswer: 'real madrid',
        explanation: 'Real Madrid has won an unmatched 15 European Cup / Champions League titles.',
        points: 50,
        timeLimitSec: 25
      }
    ]
  }
];

export function getQuizById(id: string): Quiz | undefined {
  return INITIAL_QUIZZES.find((q) => q.id === id);
}
