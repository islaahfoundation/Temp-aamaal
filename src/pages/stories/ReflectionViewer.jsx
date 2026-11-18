//Renders a full-screen deep-dive view for any selected Quranic or Hadith reflection, complete with personal journaling notes and WhatsApp/clipboard sharing.

import React, { useState } from 'react';

const LANG_TABS = [
  { id: 'en', label: 'English' },
  { id: 'romanUrdu', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function ReflectionViewer({
  reflection,
  onSavePersonalNote,
  onBack,
}) {
  const [lang, setLang] = useState('en');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  if (!reflection) return null;

  const handleShare = async () => {
    const text = [
      `🕌 *Aamaal Circle • ${reflection.type}*`,
      `📖 *${reflection.title}* (${reflection.subtitle || ''})`,
      '',
      reflection.arabic,
      '',
      reflection[lang] || reflection.en,
      '',
      `✨ Reflection: ${reflection.insight}`,
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: reflection.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {}
  };

  return (
    <div className="space-y-3.5 fade-in">
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ Back to Stories
          </button>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11.5px] font-bold"
        >
          {copied ? '✓ Copied' : '📲 Share Reflection'}
        </button>
      </div>

      <div>
        <span className="badge-pill">{reflection.type}</span>
        <h2 className="font-serif text-[22px] font-semibold text-primary mt-1">
          {reflection.title}
        </h2>
        {reflection.subtitle && (
          <p className="text-[12px] text-secondary">{reflection.subtitle}</p>
        )}
      </div>

      <div className="card-progress rounded-[22px] p-5 text-center border border-[#C99E4C]/50">
        <p
          dir="rtl"
          className="font-arabic text-[25px] leading-[1.8] text-[#F0D58C]"
        >
          {reflection.arabic}
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-2.5 bg-white/85">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Translation
          </span>
          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            {LANG_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setLang(t.id)}
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition ${
                  lang === t.id
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
          dir={lang === 'ur' ? 'rtl' : 'ltr'}
          className="text-[13.5px] text-[#1A3826] font-medium leading-relaxed"
        >
          {reflection[lang] || reflection.en}
        </p>
      </div>

      <div className="card-soft rounded-[20px] p-4 space-y-2 border border-[#D5D2BE]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332] block">
          🌿 Deep Heart Takeaway
        </span>
        <p className="text-[12.5px] text-primary leading-relaxed">
          {reflection.insight}
        </p>
      </div>

      {/* Personal Reflection Journal Input */}
      <div className="card rounded-[20px] p-4 space-y-2.5">
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary">
          Personal Reflection Note
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How can you apply this verse/Hadith today?"
          className="bg-[#F5F2E8] text-primary text-[12.5px] py-2 px-3 rounded-xl"
        />
        <button
          type="button"
          onClick={() => {
            if (!note.trim()) return;
            if (onSavePersonalNote) {
              onSavePersonalNote(reflection.title, note.trim());
            }
            setNote('');
          }}
          className="btn-primary w-full py-2.5 text-[12.5px] font-semibold"
        >
          Save Reflection to Reading History
        </button>
      </div>
    </div>
  );
}