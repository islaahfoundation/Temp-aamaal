//Displays the final score percentage ring, spiritual rank badge, question-by-question review with pure Arabic & references, and one-tap Share Quiz Score on WhatsApp or Retry Quiz.

import React, { useState } from 'react';

export default function QuizResult({
  result,
  onRetryQuiz,
  onBackToHome,
}) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const { categoryTitle, score = 0, total = 1, answers = [] } = result;
  const pct = Math.round((score / Math.max(total, 1)) * 100);

  const getBadgeTitle = () => {
    if (pct === 100) return '🏆 Master of Sunnah Knowledge';
    if (pct >= 75) return '🌟 Steadfast Seeker of Knowledge';
    if (pct >= 50) return '🌿 Growing in Wisdom';
    return '📖 Keep Studying & Reflecting';
  };

  const handleShareResult = async () => {
    const shareText = [
      `🕌 *Aamaal Circle • Islamic Knowledge Quiz*`,
      `📚 Topic: *${categoryTitle}*`,
      `✅ Score: *${score}/${total} (${pct}%)*`,
      `🏅 Badge: ${getBadgeTitle()}`,
      `— Islaah Foundation's Aamaal Circle`,
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Aamaal Circle Quiz Result',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {}
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Hero Score Card */}
      <div className="card-progress rounded-[24px] p-5 text-center border border-[#C99E4C]/50 shadow-progress-card space-y-3">
        <span className="px-3 py-1 rounded-full bg-white/15 text-[#F0D58C] text-[10px] font-bold uppercase tracking-wider">
          {getBadgeTitle()}
        </span>

        <h2 className="font-serif text-[23px] font-semibold text-white">
          {categoryTitle}
        </h2>

        {/* Score Circle */}
        <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-[#DFB75A] flex flex-col items-center justify-center mx-auto shadow-md">
          <span className="font-serif text-[26px] font-bold text-[#F0D58C] leading-none">
            {score}/{total}
          </span>
          <span className="text-[11px] text-white/85 font-semibold mt-1">
            {pct}% Score
          </span>
        </div>

        <p className="text-[12px] text-white/85 max-w-[260px] mx-auto leading-relaxed">
          {pct === 100
            ? 'MashaAllah! You answered every single question accurately. May Allah increase you in beneficial knowledge.'
            : 'Every question reviewed is a step closer to understanding the Prophetic Sunnah and daily Aamaal.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={onRetryQuiz}
            className="flex-1 py-2.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[12.5px] font-bold shadow-sm"
          >
            ↻ Retry Quiz
          </button>
          <button
            type="button"
            onClick={handleShareResult}
            className="flex-1 py-2.5 rounded-full bg-white/15 text-white border border-white/25 text-[12px] font-semibold"
          >
            {copied ? '✓ Copied Score' : '📲 Share Score'}
          </button>
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="space-y-2.5">
        <h3 className="font-serif text-[17px] font-semibold text-primary px-0.5">
          📋 Question &amp; Answer Review
        </h3>

        {answers.map((item, idx) => (
          <div
            key={item.questionId || idx}
            className="card rounded-[18px] p-3.5 space-y-2 border border-[#D5D2BE]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold text-secondary">
                Question {idx + 1}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                  item.isCorrect
                    ? 'bg-[#DCE3C8] text-[#0D4A2E]'
                    : 'bg-[#E5DEC9] text-[#6B2D26]'
                }`}
              >
                {item.isCorrect ? '✓ Correct' : '✕ Incorrect'}
              </span>
            </div>

            <h4 className="font-serif text-[14.5px] font-semibold text-primary leading-snug">
              {item.questionText}
            </h4>

            {item.arabic && (
              <p
                dir="rtl"
                className="font-arabic text-[19px] text-[#0D4A2E] text-right bg-[#EAE8D7] px-3 py-1.5 rounded-xl"
              >
                {item.arabic}
              </p>
            )}

            <div className="text-[12px] space-y-1 pt-0.5">
              {!item.isCorrect && (
                <p className="text-[#6B2D26]">
                  <strong>Your Answer:</strong> {item.options[item.chosenIndex]}
                </p>
              )}
              <p className="text-[#135332]">
                <strong>Correct Answer:</strong>{' '}
                {item.options[item.correctIndex]}
              </p>
            </div>

            {item.reference && (
              <p className="text-[10.5px] text-secondary pt-1 border-t border-[#E2DEC9]">
                📖 {item.reference}
              </p>
            )}
          </div>
        ))}
      </div>

      {onBackToHome && (
        <button
          type="button"
          onClick={onBackToHome}
          className="btn-secondary w-full py-3 text-[13px] font-semibold"
        >
          ‹ Back to All Quiz Topics
        </button>
      )}
    </div>
  );
}