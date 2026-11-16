//Renders the interactive question screen with a progress bar, pure Arabic script card (when a verse or Dua is featured), 4 multiple-choice options with instant visual & haptic feedback, and a multi-language scholarly explanation (English, Roman Urdu, Urdu, Hindi) after each answer.

import React, { useState } from 'react';

const LANG_TABS = [
  { id: 'en', label: 'EN' },
  { id: 'romanUrdu', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function QuizPlay({
  category,
  onFinishQuiz,
  onExitQuiz,
}) {
  const questions = category?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [answersRecord, setAnswersRecord] = useState([]);
  const [explainLang, setExplainLang] = useState(
    localStorage.getItem('aamaal_language') === 'ur-roman'
      ? 'romanUrdu'
      : localStorage.getItem('aamaal_language') || 'en'
  );

  if (!category || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isAnswered = selectedOptionIndex !== null;
  const isCorrect = selectedOptionIndex === currentQ.correctIndex;
  const totalQuestions = questions.length;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOptionIndex(idx);

    const correct = idx === currentQ.correctIndex;
    try {
      if (navigator.vibrate) {
        navigator.vibrate(correct ? 15 : [25, 40, 25]);
      }
    } catch (_) {}

    setAnswersRecord((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        questionText: currentQ.question,
        chosenIndex: idx,
        correctIndex: currentQ.correctIndex,
        isCorrect: correct,
        options: currentQ.options,
        reference: currentQ.reference,
        arabic: currentQ.arabic,
        explanation: currentQ.explanation,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else if (onFinishQuiz) {
      const scoreCount = answersRecord.filter((a) => a.isCorrect).length;
      onFinishQuiz({
        categoryId: category.id,
        categoryTitle: category.title,
        score: scoreCount,
        total: totalQuestions,
        answers: answersRecord,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const getExplanationText = () => {
    if (!currentQ.explanation) return '';
    if (typeof currentQ.explanation === 'string') return currentQ.explanation;
    return (
      currentQ.explanation[explainLang] ||
      currentQ.explanation.en ||
      ''
    );
  };

  return (
    <div className="space-y-3.5 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExitQuiz}
          className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
        >
          ✕ Exit Quiz
        </button>

        <span className="px-3 py-1 rounded-full bg-[#EAE8D7] text-primary text-[11.5px] font-bold border border-[#D5D2BE]">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-secondary mb-1">
          <span>{category.icon} {category.title}</span>
          <strong className="text-[#0D4A2E]">{progressPct}%</strong>
        </div>
        <div className="w-full h-2 rounded-full bg-[#DEDCCF] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0D4A2E] to-[#358C44] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card rounded-[22px] p-4 space-y-3 border border-white/90">
        <span className="badge-pill">
          {currentQ.tag || 'Knowledge Check'}
        </span>

        <h3 className="font-serif text-[18.5px] font-semibold text-primary leading-snug">
          {currentQ.question}
        </h3>

        {/* Optional Pure Arabic Script Prompt (Zero Roman Transliteration) */}
        {currentQ.arabic && (
          <div className="rounded-2xl bg-gradient-to-br from-[#165534] to-[#08351D] p-3.5 text-center border border-[#C99E4C]/45">
            <p
              dir="rtl"
              className="font-arabic text-[23px] leading-[1.7] text-[#F0D58C]"
            >
              {currentQ.arabic}
            </p>
          </div>
        )}

        {/* 4 Answer Options */}
        <div className="space-y-2 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isRightAnswer = idx === currentQ.correctIndex;

            let btnStyle =
              'bg-[#F5F2E8] text-primary border-[#DCD8C6] hover:bg-[#EAE8D7]';
            let badgeText = String.fromCharCode(65 + idx); // A, B, C, D

            if (isAnswered) {
              if (isRightAnswer) {
                btnStyle =
                  'bg-[#0D4A2E] text-white border-[#C99E4C] shadow-sm font-bold';
                badgeText = '✓';
              } else if (isSelected && !isRightAnswer) {
                btnStyle =
                  'bg-[#E5DEC9] text-[#6B2D26] border-[#6B2D26]/40 font-semibold';
                badgeText = '✕';
              } else {
                btnStyle = 'bg-[#F5F2E8]/60 text-secondary border-[#E2DEC9] opacity-75';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left rounded-[16px] p-3 border transition flex items-center space-x-3 ${btnStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-full text-[11.5px] font-bold flex items-center justify-center shrink-0 ${
                    isAnswered && isRightAnswer
                      ? 'bg-[#DFB75A] text-[#07361D]'
                      : isAnswered && isSelected && !isRightAnswer
                      ? 'bg-[#6B2D26] text-white'
                      : 'bg-[#EAE8D7] text-primary'
                  }`}
                >
                  {badgeText}
                </span>
                <span className="text-[13px] leading-snug flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Explanation & Evidence Card after answering */}
      {isAnswered && (
        <div className="card rounded-[20px] p-4 bg-[#EAE8D7] border border-[#0D4A2E]/30 space-y-2.5 fade-in">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isCorrect
                  ? 'bg-[#DCE3C8] text-[#0D4A2E]'
                  : 'bg-[#E5DEC9] text-[#6B2D26]'
              }`}
            >
              {isCorrect ? '✓ MashaAllah! Correct Answer' : '✕ Not Quite — Benefit & Proof'}
            </span>

            {/* Explanation Language Switcher */}
            <div className="inline-flex rounded-full p-0.5 bg-[#F5F2E8] border border-[#D5D2BE]">
              {LANG_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setExplainLang(t.id)}
                  className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition ${
                    explainLang === t.id
                      ? 'bg-[#0D4A2E] text-white'
                      : 'text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <p
            dir={explainLang === 'ur' ? 'rtl' : 'ltr'}
            className="text-[12.5px] text-primary font-medium leading-relaxed"
          >
            {getExplanationText()}
          </p>

          {currentQ.reference && (
            <div className="text-[11px] font-bold text-[#135332] pt-1 border-t border-[#D5D2BE]">
              📖 Source: {currentQ.reference}
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary w-full py-3 text-[13px] font-semibold mt-1 shadow-md"
          >
            {currentIndex + 1 < totalQuestions
              ? `Next Question (${currentIndex + 2}/${totalQuestions}) ›`
              : 'Finish Quiz & View Score ›'}
          </button>
        </div>
      )}
    </div>
  );
}