import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const INTEREST_OPTIONS = [
  { id: 'Islamic History', label: 'Islamic History', icon: '🕌' },
  { id: 'Quran', label: 'Quran & Tafsir', icon: '📖' },
  { id: 'Spirituality', label: 'Spirituality & Tazkiyah', icon: '✨' },
  { id: 'Prophetic Duas', label: 'Prophetic Duas', icon: '🤲' },
  { id: 'Daily Sunnahs', label: 'Daily Sunnahs', icon: '🌿' },
  { id: 'Family Circle', label: 'Family Aamaal Circle', icon: '👨‍👩‍👧‍👦' },
];

const EXPERIENCE_LEVELS = [
  {
    id: 'Simple & Guided',
    title: 'Simple & Guided',
    desc: 'Step-by-step gentle daily goals with clear translations & reminders.',
  },
  {
    id: 'Focused',
    title: 'Focused',
    desc: '313 Durood, Surah Mulk & 100 Istighfar tracker right on your home screen.',
  },
  {
    id: 'Advanced',
    title: 'Advanced',
    desc: 'Full custom targets, extended litanies, and family profile tracking.',
  },
];

export default function Preferences() {
  const navigate = useNavigate();
  const [interests, setInterests] = useState(['Islamic History', 'Quran', 'Prophetic Duas']);
  const [experience, setExperience] = useState('Simple & Guided');

  useEffect(() => {
    try {
      const savedPrefs = JSON.parse(localStorage.getItem('aamaal_preferences') || '{}');
      if (Array.isArray(savedPrefs.interests) && savedPrefs.interests.length > 0) {
        setInterests(savedPrefs.interests);
      }
      if (savedPrefs.experience) {
        setExperience(savedPrefs.experience);
      }
    } catch (_) {}
  }, []);

  const toggleInterest = (id) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveAndContinue = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
      localStorage.setItem(
        'aamaal_preferences',
        JSON.stringify({ interests, experience })
      );
    } catch (_) {}
    navigate('/onboarding/notifications');
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/language')}
            className="btn-secondary px-3 py-1 text-[11.5px]"
          >
            ‹ Back
          </button>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-gold">
            Personalize
          </span>
          <button
            onClick={() => navigate('/onboarding/notifications')}
            className="text-[12px] font-medium text-muted"
          >
            Skip
          </button>
        </div>

        {/* Heading */}
        <div className="mt-4">
          <h2 className="font-serif text-[25px] font-semibold text-primary">
            Personalize Your <span className="text-[#135332]">Aamaal</span>
          </h2>
          <p className="text-[12.5px] text-secondary mt-1">
            Select your spiritual interests and preferred pace so your dashboard feels tailored to you.
          </p>
        </div>

        {/* 1. Your Interests Grid */}
        <div className="mt-4">
          <h3 className="font-serif text-[15.5px] font-semibold text-primary mb-2">
            Your Interests
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {INTEREST_OPTIONS.map((item) => {
              const active = interests.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  className={`p-3 rounded-[16px] border text-left flex items-center space-x-2.5 transition ${
                    active
                      ? 'bg-[#0F4C2B] text-white border-[#C99E4C]/60 shadow-sm'
                      : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
                  }`}
                >
                  <span className="text-[16px]">{item.icon}</span>
                  <span className="text-[12px] font-medium leading-tight flex-1">
                    {item.label}
                  </span>
                  {active && (
                    <span className="text-[11px] font-bold text-[#F0D58C]">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Preferred Experience Level */}
        <div className="mt-5">
          <h3 className="font-serif text-[15.5px] font-semibold text-primary mb-2">
            Preferred Experience
          </h3>
          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map((lvl) => {
              const active = experience === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    try {
                      if (navigator.vibrate) navigator.vibrate(10);
                    } catch (_) {}
                    setExperience(lvl.id);
                  }}
                  className={`w-full p-3 rounded-[16px] border text-left flex items-center justify-between transition ${
                    active
                      ? 'bg-[#EAE8D7] border-[#0D4A2E] shadow-sm'
                      : 'bg-[#F3EFE2] border-white/90 shadow-soft-card'
                  }`}
                >
                  <div className="pr-2">
                    <h4 className="font-serif text-[14.5px] font-semibold text-primary">
                      {lvl.title}
                    </h4>
                    <p className="text-[11.5px] text-secondary mt-0.5">
                      {lvl.desc}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      active
                        ? 'bg-[#0D4A2E] text-white'
                        : 'border border-[#C9C5B1] bg-[#F5F2E8]'
                    }`}
                  >
                    {active ? '✓' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-4 mt-4 shrink-0">
        <button
          onClick={handleSaveAndContinue}
          className="btn-primary w-full py-3.5 text-[14px] font-semibold shadow-md"
        >
          <span>Continue to Step 4</span>
          <span>›</span>
        </button>
      </footer>
    </section>
  );
}