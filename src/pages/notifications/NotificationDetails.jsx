//Displays a full-screen or modal-style view of a single notification or reminder with Pure Arabic Calligraphy, Language Switcher (English, Roman Urdu, Urdu, Hindi), "Mark Completed Now", and "Snooze 15m".

import React, { useState } from 'react';

const LANG_OPTIONS = [
  { id: 'en', label: 'English' },
  { id: 'ur-roman', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function NotificationDetails({
  notification,
  onMarkCompleted,
  onSnooze,
  onEdit,
  onBack,
}) {
  const [lang, setLang] = useState(
    localStorage.getItem('aamaal_language') || 'en'
  );

  if (!notification) return null;

  const getTranslationText = () => {
    if (lang === 'ur-roman' && notification.romanUrdu) {
      return notification.romanUrdu;
    }
    if (lang === 'ur' && notification.urdu) {
      return notification.urdu;
    }
    if (lang === 'hi' && notification.hindi) {
      return notification.hindi;
    }
    return (
      notification.translation ||
      'Pause for a moment of sincere remembrance and complete your daily Aamaal target.'
    );
  };

  return (
    <div className="space-y-3.5 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ Back to Reminders
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(notification)}
            className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-bold"
          >
            ✏️ Edit Schedule
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="card-progress rounded-[22px] p-4 border border-[#C99E4C]/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
            {notification.category || 'Sunnah Reminder'}
          </span>
          <span className="text-[12px] font-bold text-[#F0D58C]">
            🕰️ {notification.time || '07:30'}
          </span>
        </div>

        <h2 className="font-serif text-[21px] font-semibold text-white leading-snug">
          {notification.title}
        </h2>

        {Array.isArray(notification.days) && (
          <p className="text-[11px] text-white/80">
            Active Days: <strong>{notification.days.join(', ')}</strong>
          </p>
        )}
      </div>

      {/* Pure Arabic Calligraphy Box */}
      {notification.arabic && (
        <div className="card rounded-[20px] p-4 bg-[#0F4C2B] text-center border border-[#C99E4C]/45">
          <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#F0D58C]/80 block mb-1.5">
            Recommended Recitation
          </span>
          <p
            dir="rtl"
            className="font-arabic text-[24px] leading-[1.75] text-[#F0D58C]"
          >
            {notification.arabic}
          </p>
        </div>
      )}

      {/* Multi-Language Meaning Box (Zero Roman Arabic Transliteration) */}
      <div className="card rounded-[18px] p-3.5 bg-white/85 border border-[#E2DFCE] space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Meaning &amp; Reminder Note
          </span>

          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLang(opt.id)}
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition ${
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
          className="text-[13px] text-[#1A3826] font-medium leading-relaxed"
        >
          {getTranslationText()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate(15);
            } catch (_) {}
            if (onMarkCompleted) onMarkCompleted(notification);
          }}
          className="btn-primary flex-1 py-3.5 text-[13px] font-semibold shadow-md"
        >
          ✓ Mark Completed Today
        </button>

        {onSnooze && (
          <button
            type="button"
            onClick={() => onSnooze(notification)}
            className="btn-secondary px-4 py-3.5 text-[12px] font-semibold"
          >
            💤 Snooze
          </button>
        )}
      </div>
    </div>
  );
}