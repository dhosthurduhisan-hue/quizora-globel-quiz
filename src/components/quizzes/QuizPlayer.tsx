import React, { useState, useEffect, useRef } from 'react';
import { Quiz, Question, QuizAttempt } from '../../types';
import { sounds } from '../../services/soundEffects';
import {
  Clock,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  XCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onExit }) => {
  const questions: Question[] = quiz.questions && quiz.questions.length > 0 ? quiz.questions : [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<string, boolean>>({});
  const [showImmediateFeedback, setShowImmediateFeedback] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  // Current question
  const currentQ = questions[currentIdx];

  // Specific state for complex question types
  const [multiSelectState, setMultiSelectState] = useState<string[]>([]);
  const [orderingState, setOrderingState] = useState<string[]>([]);
  const [matchingSelections, setMatchingSelections] = useState<{ [left: string]: string }>({});
  const [selectedLeftItem, setSelectedLeftItem] = useState<string | null>(null);
  const [fillBlankInput, setFillBlankInput] = useState('');

  // Setup current question state whenever index changes
  useEffect(() => {
    if (!currentQ) return;
    setTimeLeft(currentQ.timeLimitSec || 30);

    if (currentQ.questionType === 'ordering' && currentQ.options) {
      // Shuffle initially if not answered
      if (!userAnswers[currentQ.id]) {
        setOrderingState(currentQ.options.map((o) => o.text));
      } else {
        setOrderingState(userAnswers[currentQ.id]);
      }
    } else if (currentQ.questionType === 'multi_select') {
      setMultiSelectState(userAnswers[currentQ.id] || []);
    } else if (currentQ.questionType === 'matching') {
      setMatchingSelections(userAnswers[currentQ.id] || {});
      setSelectedLeftItem(null);
    } else if (currentQ.questionType === 'fill_blank') {
      setFillBlankInput(userAnswers[currentQ.id] || '');
    }
  }, [currentIdx, currentQ]);

  // Overall timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTimeSpent((t) => t + 1);
      setTimeLeft((tl) => {
        if (tl <= 1) {
          // Time expired for this question
          return 0;
        }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentQ) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-white">
        <p>No questions found in this quiz.</p>
        <button
          onClick={onExit}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-sm text-white"
        >
          Return to Quizzes
        </button>
      </div>
    );
  }

  const isSubmitted = isAnswerSubmitted[currentQ.id] || false;
  const currentAnswer = userAnswers[currentQ.id];

  // Evaluate correctness of question
  const checkIsCorrect = (q: Question, answer: any): boolean => {
    if (!answer) return false;
    if (q.questionType === 'mcq' || q.questionType === 'true_false' || q.questionType === 'image') {
      return answer === q.correctAnswer;
    }
    if (q.questionType === 'multi_select' && Array.isArray(q.correctAnswer) && Array.isArray(answer)) {
      if (q.correctAnswer.length !== answer.length) return false;
      return q.correctAnswer.every((val) => answer.includes(val));
    }
    if (q.questionType === 'ordering' && Array.isArray(q.correctAnswer) && Array.isArray(answer)) {
      return q.correctAnswer.every((val, i) => answer[i] === val);
    }
    if (q.questionType === 'matching' && q.matchingPairs) {
      return q.matchingPairs.every((pair) => answer[pair.left] === pair.right);
    }
    if (q.questionType === 'fill_blank' && typeof q.correctAnswer === 'string') {
      return (
        String(answer).trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      );
    }
    return false;
  };

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    sounds.playClick();
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
    setIsAnswerSubmitted((prev) => ({ ...prev, [currentQ.id]: true }));

    const isCorrect = optId === currentQ.correctAnswer;
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleSubmitMultiSelect = () => {
    if (isSubmitted || multiSelectState.length === 0) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: multiSelectState }));
    setIsAnswerSubmitted((prev) => ({ ...prev, [currentQ.id]: true }));
    const isCorrect = checkIsCorrect(currentQ, multiSelectState);
    if (isCorrect) sounds.playCorrect();
    else sounds.playIncorrect();
  };

  const handleSubmitOrdering = () => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: orderingState }));
    setIsAnswerSubmitted((prev) => ({ ...prev, [currentQ.id]: true }));
    const isCorrect = checkIsCorrect(currentQ, orderingState);
    if (isCorrect) sounds.playCorrect();
    else sounds.playIncorrect();
  };

  const handleSubmitMatching = () => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: matchingSelections }));
    setIsAnswerSubmitted((prev) => ({ ...prev, [currentQ.id]: true }));
    const isCorrect = checkIsCorrect(currentQ, matchingSelections);
    if (isCorrect) sounds.playCorrect();
    else sounds.playIncorrect();
  };

  const handleSubmitFillBlank = () => {
    if (isSubmitted || !fillBlankInput.trim()) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: fillBlankInput.trim() }));
    setIsAnswerSubmitted((prev) => ({ ...prev, [currentQ.id]: true }));
    const isCorrect = checkIsCorrect(currentQ, fillBlankInput.trim());
    if (isCorrect) sounds.playCorrect();
    else sounds.playIncorrect();
  };

  // Reordering controls
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted) return;
    sounds.playClick();
    const newItems = [...orderingState];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setOrderingState(newItems);
  };

  // Final Quiz Completion
  const handleFinishQuiz = () => {
    sounds.playVictory();
    let correctCount = 0;
    let earnedPoints = 0;
    let totalPoints = 0;

    questions.forEach((q) => {
      totalPoints += q.points;
      const ans = userAnswers[q.id];
      if (checkIsCorrect(q, ans)) {
        correctCount++;
        earnedPoints += q.points;
      }
    });

    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const xpMultiplier = accuracy === 100 ? 1.5 : accuracy >= 80 ? 1.2 : 1.0;
    const xpEarned = Math.round(quiz.xpReward * (accuracy / 100) * xpMultiplier);

    const attempt: QuizAttempt = {
      id: `att_${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: earnedPoints,
      totalPoints,
      accuracy,
      correctCount,
      incorrectCount: questions.length - correctCount,
      timeSpentSec: totalTimeSpent,
      xpEarned,
      completedAt: new Date().toISOString(),
      userAnswers,
    };

    onComplete(attempt);
  };

  const isCurrentCorrect = checkIsCorrect(currentQ, currentAnswer);
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Header Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
            title="Exit Quiz"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">
              {quiz.title}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{currentQ.questionType.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Right HUD: Timer + XP + Sound */}
        <div className="flex items-center gap-3">
          {/* Timer with color threshold */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold tabular-nums ${
              timeLeft <= 10
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          {/* XP potential */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300 tabular-nums">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>+{currentQ.points} pts</span>
          </div>

          {/* Mute button */}
          <button
            onClick={() => setIsMuted(sounds.toggleMute())}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl w-full mx-auto my-3">
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Arena */}
      <main className="max-w-4xl w-full mx-auto my-auto py-4 space-y-6">
        {/* Question Text & Media */}
        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-relaxed font-display">
            {currentQ.questionText}
          </h1>

          {/* Optional Image */}
          {currentQ.imageUrl && (
            <div className="max-w-lg aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src={currentQ.imageUrl}
                alt="Question Reference"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Dynamic Question Type Input Fields */}
        <div className="space-y-3">
          {/* MCQ / True-False / Image-based */}
          {(currentQ.questionType === 'mcq' ||
            currentQ.questionType === 'true_false' ||
            currentQ.questionType === 'image') &&
            currentQ.options?.map((opt) => {
              const isSelected = currentAnswer === opt.id;
              const isCorrectOpt = opt.id === currentQ.correctAnswer;

              let btnStyle = 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 text-slate-200';
              if (isSubmitted) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 font-semibold';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-100';
                } else {
                  btnStyle = 'bg-slate-900/40 border-slate-850 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-950/60 border-indigo-500 text-white font-semibold';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${btnStyle}`}
                >
                  <span className="text-sm sm:text-base leading-snug">{opt.text}</span>
                  {isSubmitted && isCorrectOpt && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-3" />
                  )}
                  {isSubmitted && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-3" />
                  )}
                </button>
              );
            })}

          {/* Multiple Select (Checkboxes) */}
          {currentQ.questionType === 'multi_select' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">Select all valid options, then submit:</p>
              {currentQ.options?.map((opt) => {
                const isChecked = multiSelectState.includes(opt.id);
                const isTargetCorrect = Array.isArray(currentQ.correctAnswer) && currentQ.correctAnswer.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (isSubmitted) return;
                      sounds.playClick();
                      setMultiSelectState((prev) =>
                        prev.includes(opt.id) ? prev.filter((id) => id !== opt.id) : [...prev, opt.id]
                      );
                    }}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isSubmitted
                        ? isTargetCorrect
                          ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-200'
                          : isChecked
                          ? 'bg-rose-950/50 border-rose-500/80 text-rose-200'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                        : isChecked
                        ? 'bg-indigo-950/60 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-sm sm:text-base">{opt.text}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer pointer-events-none"
                    />
                  </div>
                );
              })}
              {!isSubmitted && (
                <button
                  onClick={handleSubmitMultiSelect}
                  disabled={multiSelectState.length === 0}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Confirm Selections ({multiSelectState.length})
                </button>
              )}
            </div>
          )}

          {/* Ordering Sequence */}
          {currentQ.questionType === 'ordering' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                Arrange items into the correct chronological or rank sequence using up/down controls:
              </p>
              {orderingState.map((itemText, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between bg-slate-900 ${
                    isSubmitted ? 'border-indigo-500/50' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-indigo-400 font-mono text-xs font-semibold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-white">{itemText}</span>
                  </div>
                  {!isSubmitted && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 bg-slate-800 rounded-lg"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, 'down')}
                        disabled={idx === orderingState.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 bg-slate-800 rounded-lg"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {!isSubmitted && (
                <button
                  onClick={handleSubmitOrdering}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Submit Order
                </button>
              )}
            </div>
          )}

          {/* Matching Pairs */}
          {currentQ.questionType === 'matching' && currentQ.matchingPairs && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-medium">
                Tap a left item first, then tap its matching counterpart on the right:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left items */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Subject</div>
                  {currentQ.matchingPairs.map((pair) => {
                    const isSelected = selectedLeftItem === pair.left;
                    const matchedWith = matchingSelections[pair.left];

                    return (
                      <button
                        key={pair.left}
                        disabled={isSubmitted}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedLeftItem(pair.left);
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : matchedWith
                            ? 'bg-slate-900 border-indigo-500/50 text-indigo-300'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="font-medium">{pair.left}</div>
                        {matchedWith && (
                          <div className="text-[11px] text-slate-400 truncate mt-1">
                            → {matchedWith}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right items */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Match</div>
                  {currentQ.matchingPairs.map((pair) => {
                    return (
                      <button
                        key={pair.right}
                        disabled={isSubmitted || !selectedLeftItem}
                        onClick={() => {
                          if (!selectedLeftItem) return;
                          sounds.playMatch();
                          setMatchingSelections((prev) => ({
                            ...prev,
                            [selectedLeftItem]: pair.right,
                          }));
                          setSelectedLeftItem(null);
                        }}
                        className="w-full p-3 rounded-xl border text-left text-xs sm:text-sm bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-300 transition-colors disabled:opacity-50"
                      >
                        {pair.right}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleSubmitMatching}
                  disabled={Object.keys(matchingSelections).length < currentQ.matchingPairs.length}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Verify Matches ({Object.keys(matchingSelections).length}/
                  {currentQ.matchingPairs.length})
                </button>
              )}
            </div>
          )}

          {/* Fill-in-the-Blank */}
          {currentQ.questionType === 'fill_blank' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fillBlankInput}
                  onChange={(e) => setFillBlankInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitFillBlank()}
                  disabled={isSubmitted}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {!isSubmitted && (
                  <button
                    onClick={handleSubmitFillBlank}
                    disabled={!fillBlankInput.trim()}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors shrink-0"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Immediate Educational Explanation */}
        {isSubmitted && showImmediateFeedback && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 animate-fadeIn ${
              isCurrentCorrect
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {isCurrentCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Incorrect.</span>
                </>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation Controls */}
      <footer className="max-w-4xl w-full mx-auto flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleFinishQuiz}
              disabled={!isSubmitted}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Complete Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              disabled={!isSubmitted}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
