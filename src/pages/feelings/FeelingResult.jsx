//Displays the tailored Prophetic prescription for the user's selected feeling: Pure Arabic Calligraphy, Language Switcher (English, Roman Urdu, Urdu, Hindi), Heart Reflection, Recommended Aamaal, and an interactive recitation counter.

import React, { useState } from 'react';

const LANG_OPTIONS = [
  { id: 'en', label: 'English' },
  { id: 'ur-roman', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function FeelingResult({
  feeling,
  onCompleteRecitation,
  onOpenHistory,
  onNavigateTab,
  onBack,
}) {
  const [lang, setLang] = useState(
    localStorage.getItem('aamaal_language') || 'en'
  );
  const [count, setCount] = useState(0);

  if (!feeling) return null;

  const target = Number(feeling.targetCount || 3);
  const isCompleted = count >= target;

  const getTranslatedText = () => {
    if (lang === 'ur-roman' && feeling.romanUrdu) return feeling.romanUrdu;
    if (lang === 'ur' && feeling.urdu) return feeling.urdu;
    if (lang === 'hi' && feeling.hindi) return feeling.hindi;
    return feeling.translation;
  };

  const handleReciteTap = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    const next = count + 1;
    setCount(next);
    if (next === target && onCompleteRecitation) {
      onCompleteRecitation();
    }
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-3.5 fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ Change Feeling
          </button>
        )}

        {onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-bold"
          >
            📜 My Check-Ins
          </button>
        )}
      </div>

      {/* Emotion Title Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-[#0F4C2B] text-[#F0D58C] flex items-center justify-center text-[24px] shadow-sm shrink-0">
          {feeling.icon}
        </div>
        <div>
          <span className="badge-pill">{feeling.tag}</span>
          <h2 className="font-serif text-[22px] font-semibold text-primary mt-0.5">
            {feeling.label}
          </h2>
        </div>
      </div>

      {/* Pure Arabic Calligraphy Card */}
      <div className="card-progress rounded-[22px] p-5 text-center border border-[#C99E4C]/50 shadow-progress-card">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider mb-2">
          Recite {target}x with Presence of Heart
        </span>
        <p
          dir="rtl"
          className="font-arabic text-[26px] leading-[1.75] text-[#F0D58C] my-2"
        >
          {feeling.arabic}
        </p>
      </div>

      {/* Multi-Language Translation Card (No Arabic Transliteration) */}
      <div className="card rounded-[18px] p-3.5 space-y-2 bg-white/85 border border-[#E2DFCE]">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Translation &amp; Meaning
          </span>

          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLang(opt.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                  lang === opt.id
                    ? 'bg-[#0D4A2E] text-white'
                    : 'text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p
          dir={lang === 'ur' ? 'rtl' : 'ltr'}
          className="text-[13.5px] text-[#1A3826] font-medium leading-relaxed"
        >
          {getTranslatedText()}
        </p>

        {lang === 'en' && feeling.romanUrdu && (
          <p className="text-[12px] text-primary pt-2 border-t border-[#E2DFCE] leading-relaxed">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gold block mb-0.5">
              Roman Urdu
            </span>
            {feeling.romanUrdu}
          </p>
        )}
      </div>

      {/* Spiritual Reflection & Prescribed Aamaal */}
      <div className="card-soft rounded-[18px] p-3.5 space-y-2 border border-[#D5D2BE]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332] block">
          🌿 Reflection for Your Heart
        </span>
        <p className="text-[12.5px] text-primary leading-relaxed">
          {feeling.reflection}
        </p>
        <div className="pt-2 border-t border-[#D5D2BE] flex items-center justify-between text-[11.5px]">
          <span className="text-secondary font-medium">Prescription:</span>
          <strong className="text-[#0D4A2E] text-right">
            {feeling.recommendedAamaal}
          </strong>
        </div>
      </div>

      {/* Interactive Recitation Counter + Quick Aamaal Link */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleReciteTap}
          className="btn-primary w-full py-3.5 text-[14px] font-semibold shadow-md"
        >
          <span>
            {isCompleted
              ? `✓ Completed (${count}/${target}) — Tap to Add More`
              : `Tap to Recite Now (${count}/${target})`}
          </span>
        </button>

        {onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('aamaal')}
            className="btn-secondary w-full py-2.5 text-[12.5px] font-semibold"
          >
            Open Daily Aamaal Tracker ›
          </button>
        )}
      </div>
    </section>
  );
}