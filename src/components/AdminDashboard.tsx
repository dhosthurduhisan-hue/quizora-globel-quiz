import React, { useState } from 'react';
import { Quiz, Question, Difficulty, QuestionType } from '../types';
import { StorageService } from '../services/storage';
import { CATEGORIES_DATA } from '../data/categories';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  BarChart3,
  Layers,
  HelpCircle,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onRefreshQuizzes: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefreshQuizzes }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(StorageService.getAllQuizzes());
  const [activeTab, setActiveTab] = useState<'analytics' | 'quizzes' | 'create'>('quizzes');

  // Form State for creating a quiz
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('science');
  const [newSubcategory, setNewSubcategory] = useState('Quantum Physics');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('medium');
  const [newDuration, setNewDuration] = useState(6);
  const [newXp, setNewXp] = useState(250);

  // Form question builder
  const [formQuestions, setFormQuestions] = useState<Question[]>([
    {
      id: 'q1',
      quizId: 'custom',
      questionText: 'Which particle was confirmed by CERN Large Hadron Collider in 2012?',
      questionType: 'mcq',
      options: [
        { id: 'opt1', text: 'Higgs Boson' },
        { id: 'opt2', text: 'Top Quark' },
        { id: 'opt3', text: 'Graviton' },
        { id: 'opt4', text: 'Tau Neutrino' }
      ],
      correctAnswer: 'opt1',
      explanation: 'The Higgs Boson provides particles with mass via the Brout-Englert-Higgs mechanism.',
      points: 50,
      timeLimitSec: 30
    }
  ]);

  const [questionInputText, setQuestionInputText] = useState('');
  const [questionInputType, setQuestionInputType] = useState<QuestionType>('mcq');
  const [questionOpt1, setQuestionOpt1] = useState('');
  const [questionOpt2, setQuestionOpt2] = useState('');
  const [questionOpt3, setQuestionOpt3] = useState('');
  const [questionOpt4, setQuestionOpt4] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState('0');
  const [questionExplanation, setQuestionExplanation] = useState('');

  const handleAddQuestionToQuiz = () => {
    if (!questionInputText.trim()) return;

    let options = undefined;
    let correctAnswer: any = 'opt1';

    if (questionInputType === 'mcq') {
      options = [
        { id: 'opt1', text: questionOpt1 || 'Option A' },
        { id: 'opt2', text: questionOpt2 || 'Option B' },
        { id: 'opt3', text: questionOpt3 || 'Option C' },
        { id: 'opt4', text: questionOpt4 || 'Option D' }
      ];
      correctAnswer = `opt${parseInt(correctOptIdx) + 1}`;
    } else if (questionInputType === 'true_false') {
      options = [
        { id: 't', text: 'True' },
        { id: 'f', text: 'False' }
      ];
      correctAnswer = correctOptIdx === '0' ? 't' : 'f';
    }

    const newQ: Question = {
      id: `q_${Date.now()}`,
      quizId: 'custom',
      questionText: questionInputText.trim(),
      questionType: questionInputType,
      options,
      correctAnswer,
      explanation: questionExplanation.trim() || 'Verified answer.',
      points: 50,
      timeLimitSec: 30
    };

    setFormQuestions([...formQuestions, newQ]);
    setQuestionInputText('');
    setQuestionOpt1('');
    setQuestionOpt2('');
    setQuestionOpt3('');
    setQuestionOpt4('');
    setQuestionExplanation('');
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || formQuestions.length === 0) return;

    const newQuiz: Quiz = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDesc.trim() || 'A challenging trivia competition created by admin.',
      categoryId: newCategory,
      subcategory: newSubcategory,
      difficulty: newDifficulty,
      durationMinutes: newDuration,
      questionCount: formQuestions.length,
      thumbnail: '/src/assets/images/hero_quiz_mind_1791200336656.jpg',
      xpReward: newXp,
      rating: 5.0,
      playCount: 1,
      language: 'English',
      status: 'published',
      createdAt: new Date().toISOString(),
      author: 'Admin Portal',
      questions: formQuestions
    };

    StorageService.addCustomQuiz(newQuiz);
    const updated = StorageService.getAllQuizzes();
    setQuizzes(updated);
    onRefreshQuizzes();

    // Reset form
    setNewTitle('');
    setNewDesc('');
    setActiveTab('quizzes');
  };

  const handleDeleteQuiz = (id: string) => {
    StorageService.deleteCustomQuiz(id);
    const updated = StorageService.getAllQuizzes();
    setQuizzes(updated);
    onRefreshQuizzes();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 tracking-wider uppercase">
            <span>Administration Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Quizora System Management
          </h1>
          <p className="text-sm text-slate-400">
            Publish quizzes, configure questions, monitor platform KPIs, and manage categories.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'quizzes' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'create' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            + Create Quiz
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics KPI
          </button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Daily Active Users</span>
              <div className="text-2xl font-bold text-white font-mono">14,820</div>
              <span className="text-[11px] text-emerald-400">+12% vs last week</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Total Quiz Attempts</span>
              <div className="text-2xl font-bold text-white font-mono">182,490</div>
              <span className="text-[11px] text-indigo-400">92% completion rate</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Questions Answered</span>
              <div className="text-2xl font-bold text-white font-mono">1,420,800</div>
              <span className="text-[11px] text-emerald-400">84.2% average accuracy</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Puzzles Solved</span>
              <div className="text-2xl font-bold text-white font-mono">54,120</div>
              <span className="text-[11px] text-purple-400">Sudoku is #1 popular</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white font-display">System Health & Latency</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">Database Throughput</span>
                <div className="text-sm font-semibold text-white font-mono">2,410 queries/sec</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">API Response Time</span>
                <div className="text-sm font-semibold text-emerald-400 font-mono">42 ms (P95)</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">Active Daily Streaks</span>
                <div className="text-sm font-semibold text-amber-400 font-mono">9,840 active streaks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes List Tab */}
      {activeTab === 'quizzes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">
              Published & Custom Quizzes ({quizzes.length})
            </h2>
            <button
              onClick={() => setActiveTab('create')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Quiz</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-indigo-400 capitalize">{q.categoryId}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{q.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.questionCount} Questions</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-mono">+{q.xpReward} XP</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{q.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{q.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 font-mono tabular-nums mr-2">
                    {q.playCount.toLocaleString()} plays
                  </span>
                  {q.id.startsWith('custom_') && (
                    <button
                      onClick={() => handleDeleteQuiz(q.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-colors"
                      title="Delete Custom Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Quiz Tab */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateQuiz} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Author & Publish a New Quiz</h2>
            <p className="text-xs text-slate-400 mt-1">
              Construct high-yield questions with rich educational explanations and custom difficulty ratings.
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Quiz Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Modern Astro-Physics & Exoplanetary Atmospheres"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Detailed context for the questions included in this quiz..."
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              >
                {CATEGORIES_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Subcategory</label>
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="master">Master</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">XP Reward</label>
              <input
                type="number"
                value={newXp}
                onChange={(e) => setNewXp(parseInt(e.target.value) || 200)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Current Question List in this quiz */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Questions in this Quiz ({formQuestions.length})
              </span>
            </div>

            <div className="space-y-2">
              {formQuestions.map((q, i) => (
                <div
                  key={q.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="text-indigo-400 font-bold mr-2">Q{i + 1}.</span>
                    <span className="text-white">{q.questionText}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormQuestions(formQuestions.filter((item) => item.id !== q.id))}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Question Sub-form */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
              + Append Question to Quiz
            </span>

            <div className="space-y-2">
              <input
                type="text"
                value={questionInputText}
                onChange={(e) => setQuestionInputText(e.target.value)}
                placeholder="Question prompt..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={questionOpt1}
                  onChange={(e) => setQuestionOpt1(e.target.value)}
                  placeholder="Option 1 (Default Correct)"
                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  value={questionOpt2}
                  onChange={(e) => setQuestionOpt2(e.target.value)}
                  placeholder="Option 2"
                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  value={questionOpt3}
                  onChange={(e) => setQuestionOpt3(e.target.value)}
                  placeholder="Option 3"
                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  value={questionOpt4}
                  onChange={(e) => setQuestionOpt4(e.target.value)}
                  placeholder="Option 4"
                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <input
                type="text"
                value={questionExplanation}
                onChange={(e) => setQuestionExplanation(e.target.value)}
                placeholder="Educational explanation for correct answer..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />

              <button
                type="button"
                onClick={handleAddQuestionToQuiz}
                disabled={!questionInputText.trim()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Add Question
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newTitle.trim() || formQuestions.length === 0}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Publish Quiz to Quizora
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
