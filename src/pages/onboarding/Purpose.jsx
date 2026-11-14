import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'aamaal_circle_compact_v3';

const PURPOSE_GOALS = [
  { id: '313 Durood Shareef', title: '313 Durood Shareef', desc: 'Daily abundant blessings upon the Prophet ﷺ' },
  { id: 'Surah Mulk Nightly', title: 'Surah Mulk Before Sleep', desc: 'Nightly protection and light in the grave' },
  { id: '100 Istighfar', title: '100 Daily Istighfar', desc: 'Seek forgiveness and open doors of relief' },
  { id: 'Ease in Affairs', title: 'Ease in Affairs', desc: 'Prophetic duas for difficulties & peace of heart' },
  { id: 'Quranic Stories', title: 'Quranic & Seerah Reflections', desc: 'Daily bite-sized lessons from Makkah & Madinah' },
  { id: 'Thursday Salawat', title: 'Thursday Night Sunnah', desc: 'Special weekly Salawat reminders' },
];

export default function Purpose() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([
    '313 Durood Shareef',
    'Surah Mulk Nightly',
    '100 Istighfar',
  ]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.userName) setUserName(saved.userName);
      if (Array.isArray(saved.focusChips) && saved.focusChips.length > 0) {
        setSelectedGoals(saved.focusChips);
      }
    } catch (_) {}
  }, []);

  const toggleGoal = (id) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...existing,
          userName: userName.trim(),
          focusChips: selectedGoals,
        })
      );
    } catch (_) {}
    navigate('/onboarding/tasbih');
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/welcome')}
            className="btn-secondary px-3 py-1 text-[11.5px]"
          >
            ‹ Back
          </button>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-gold">
            Live With Purpose
          </span>
          <button
            onClick={() => navigate('/onboarding/tasbih')}
            className="text-[12px] font-medium text-muted"
          >
            Skip
          </button>
        </div>

        <div className="mt-4">
          <h2 className="font-serif text-[25px] font-semibold text-primary">
            Set Your Intention
          </h2>
          <p className="text-[12.5px] text-secondary mt-1">
            “Actions are judged by intentions.” Personalize your circle and choose the habits you wish to nurture.
          </p>
        </div>

        {/* Name / Kunya Input Card */}
        <div className="card-soft mt-4 p-3.5">
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-primary">
            Your Name or Kunya (Optional)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g., Ubaid, Yusuf, Umm Amina..."
            className="mt-1.5 bg-[#F5F2E8] text-[13px]"
          />
        </div>

        {/* Spiritual Focus Selection */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-[15.5px] font-semibold text-primary">
              Your Daily Aamaal Goals
            </h3>
            <span className="text-[11px] font-medium text-secondary">
              {selectedGoals.length} selected
            </span>
          </div>

          <div className="space-y-2">
            {PURPOSE_GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full text-left rounded-[16px] p-3 border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0F4C2B] text-white border-[#C99E4C]/60 shadow-md'
                      : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
                  }`}
                >
                  <div className="pr-3">
                    <h4
                      className={`font-serif text-[14.5px] font-semibold ${
                        isSelected ? 'text-white' : 'text-primary'
                      }`}
                    >
                      {goal.title}
                    </h4>
                    <p
                      className={`text-[11.5px] mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-secondary'
                      }`}
                    >
                      {goal.desc}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold ${
                      isSelected
                        ? 'bg-[#DFB75A] text-[#07361D]'
                        : 'bg-[#EAE8D7] text-primary border border-[#D5D2BE]'
                    }`}
                  >
                    {isSelected ? '✓' : '+'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="pt-4 mt-4 shrink-0">
        <button
          onClick={handleContinue}
          className="btn-primary w-full py-3.5 text-[14px] font-semibold shadow-md"
        >
          <span>Continue to Step 1</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </footer>
    </section>
  );
}