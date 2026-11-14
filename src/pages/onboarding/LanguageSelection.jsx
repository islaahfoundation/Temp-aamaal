import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    sample: '"O Allah, make every difficulty easy for us."',
    desc: 'Arabic text with English translation & reflection',
  },
  {
    code: 'ur-roman',
    name: 'Roman Urdu',
    native: 'Roman Urdu',
    sample: '"Aye Allah! Hamare liye har mushkil ko aasan farma de."',
    desc: 'Arabic text with easy-to-read Roman Urdu translation',
  },
  {
    code: 'ur',
    name: 'Urdu',
    native: 'اردو',
    sample: 'اے اللہ! ہمارے لیے ہر مشکل کو آسان فرما دے۔',
    desc: 'عربی متن کے ساتھ اردو ترجمہ اور تشریح',
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    sample: '"ऐ अल्लाह! हमारे लिए हर मुश्किल को आसान बना दे।"',
    desc: 'अरबी दुआओं के साथ सरल हिंदी अनुवाद',
  },
];

export default function LanguageSelection() {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('aamaal_language');
    if (saved) setSelectedLang(saved);
  }, []);

  const handleSelect = (code) => {
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}
    setSelectedLang(code);
    localStorage.setItem('aamaal_language', code);
  };

  const handleContinue = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    localStorage.setItem('aamaal_language', selectedLang);
    navigate('/onboarding/preferences');
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      <div>
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/stories')}
            className="btn-secondary px-3 py-1 text-[11.5px]"
          >
            ‹ Back
          </button>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-gold">
            Make It Yours
          </span>
          <button
            onClick={() => navigate('/onboarding/preferences')}
            className="text-[12px] font-medium text-muted"
          >
            Skip
          </button>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h2 className="font-serif text-[26px] font-semibold text-primary">
            Preferred Language
          </h2>
          <p className="text-[12.5px] text-secondary mt-1">
            Choose the language for dua translations, daily reflections, and story lessons. You can change this anytime in Settings.
          </p>
        </div>

        {/* Language Cards */}
        <div className="space-y-2.5 mt-4">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left rounded-[18px] p-3 border transition ${
                  isSelected
                    ? 'bg-[#0F4C2B] text-white border-[#C99E4C]/60 shadow-progress-card'
                    : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        isSelected
                          ? 'bg-[#DFB75A] text-[#07361D]'
                          : 'bg-[#EAE8D7] text-primary'
                      }`}
                    >
                      {lang.native}
                    </span>
                    <h3
                      className={`font-serif text-[16px] font-semibold ${
                        isSelected ? 'text-white' : 'text-primary'
                      }`}
                    >
                      {lang.name}
                    </h3>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                      isSelected
                        ? 'bg-[#DFB75A] text-[#07361D]'
                        : 'bg-[#EAE8D7] text-primary border border-[#D5D2BE]'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                </div>

                <p
                  className={`text-[11px] mt-1.5 ${
                    isSelected ? 'text-white/85' : 'text-secondary'
                  }`}
                >
                  {lang.desc}
                </p>
                <div
                  className={`mt-1.5 px-3 py-1.5 rounded-xl text-[11.5px] ${
                    isSelected
                      ? 'bg-black/20 text-[#F0D58C]'
                      : 'bg-[#EAE8D7] text-primary'
                  }`}
                >
                  {lang.sample}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-4 mt-4 shrink-0">
        <button
          onClick={handleContinue}
          className="btn-primary w-full py-3.5 text-[14px] font-semibold shadow-md"
        >
          <span>Continue to Preferences</span>
          <span>›</span>
        </button>
      </footer>
    </section>
  );
}