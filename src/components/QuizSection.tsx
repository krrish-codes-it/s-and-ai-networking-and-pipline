import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import confetti from 'canvas-confetti';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, Award, Sparkles, ArrowRight } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted[currentIdx]) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleVerifyAnswer = () => {
    if (selectedAnswers[currentIdx] === undefined) return;
    const isCorrect = selectedAnswers[currentIdx] === question.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setIsSubmitted(prev => ({ ...prev, [currentIdx]: true }));

    // If last question
    if (currentIdx === QUIZ_QUESTIONS.length - 1) {
      setQuizFinished(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsSubmitted({});
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-950/70 border border-teal-800 text-teal-400 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
          <span>Test Your LLM Architecture Intuition</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          LLM Tokenization & Embedding Knowledge Challenge
        </h2>
        <p className="text-sm text-slate-400">
          Reinforce your understanding of token IDs, BPE subwords, embedding memory, and semantic vectors.
        </p>
      </div>

      {/* Quiz Card */}
      {!quizFinished ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6 shadow-xl">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
            <span className="px-2.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono">
              Topic: {question.conceptTag}
            </span>
            <span className="font-mono text-cyan-400 font-bold">Score: {score}</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-lg font-bold text-white leading-snug">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              const hasSubmitted = isSubmitted[currentIdx];
              const isCorrect = optIdx === question.correctIndex;

              let btnStyle = 'bg-slate-950/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200';
              if (hasSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-200 ring-1 ring-rose-500';
                }
              } else if (isSelected) {
                btnStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start space-x-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {hasSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                  {hasSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted[currentIdx] && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
              <strong className="text-cyan-400 block font-mono uppercase">
                {selectedAnswers[currentIdx] === question.correctIndex ? '✅ Correct!' : '❌ Incorrect'}
              </strong>
              <p className="leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Control Actions */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">Select an answer and verify</span>

            {!isSubmitted[currentIdx] ? (
              <button
                onClick={handleVerifyAnswer}
                disabled={selectedAnswers[currentIdx] === undefined}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30"
              >
                Verify Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-teal-500/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-teal-950 border border-teal-800 text-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Challenge Completed!</h3>
            <p className="text-sm text-slate-400">
              You scored <strong className="text-teal-300 font-mono text-lg">{score}</strong> out of{' '}
              <strong className="text-white font-mono text-lg">{QUIZ_QUESTIONS.length}</strong> ({((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%).
            </p>
          </div>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {score === 6
              ? '🎉 Outstanding! You have complete mastery of tokens, BPE subwords, GPU IDs, embedding matrices, and semantic vectors.'
              : 'Great effort! Re-visit the 8 Concept Modules and Tokenizer Playground to solidify your understanding of edge cases.'}
          </p>

          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-teal-600/30"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Challenge</span>
          </button>
        </div>
      )}
    </div>
  );
};
