import React from 'react';
import { useNavigate } from 'react-router-dom';

const THREE_BLESSED_AAMAALS = [
  {
    id: 'durood',
    title: '313 Durood',
    subtitle: 'Shareef',
    desc: 'Send blessings',
    icon: (
      <svg className="w-7 h-7 text-[#DFB75A]" viewBox="0 0 28 28" fill="currentColor">
        <circle cx="14" cy="4.5" r="2" />
        <circle cx="19" cy="6.5" r="2" />
        <circle cx="21.5" cy="11" r="2" />
        <circle cx="20.5" cy="16.5" r="2" />
        <circle cx="16.5" cy="20" r="2" />
        <circle cx="11.5" cy="20" r="2" />
        <circle cx="7.5" cy="16.5" r="2" />
        <circle cx="6.5" cy="11" r="2" />
        <circle cx="9" cy="6.5" r="2" />
        <path d="M14 22v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'mulk',
    title: 'Surah Mulk',
    subtitle: 'Nightly Recitation',
    desc: 'Protection, peace & light',
    icon: (
      <svg className="w-7 h-7 text-[#DFB75A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 'istighfar',
    title: '100 Istighfar',
    subtitle: 'Daily Repentance',
    desc: 'Purify your heart, bring ease',
    icon: (
      <svg className="w-7 h-7 text-[#DFB75A]" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 19V9.5a1.5 1.5 0 0 0-3 0V15" />
        <path d="M10 11.5V8a1.5 1.5 0 0 0-3 0v8.5c0 3 2.5 5.5 5.5 5.5h1" />
        <path d="M15 19V9.5a1.5 1.5 0 0 1 3 0V15" />
        <path d="M18 11.5V8a1.5 1.5 0 0 1 3 0v8.5c0 3-2.5 5.5-5.5 5.5h-1" />
      </svg>
    ),
  },
];

export default function Welcome() {
  const navigate = useNavigate();

  const triggerHaptic = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
  };

  const handleNext = () => {
    triggerHaptic();
    navigate('/onboarding/purpose');
  };

  const handleSkip = () => {
    triggerHaptic();
    navigate('/onboarding/authentication');
  };

  return (
    <section className="screen-section no-scrollbar flex flex-col justify-between pb-6">
      {/* Top Sunrise Mosque Banner */}
      <div className="relative w-full shrink-0 pt-7 pb-5 px-5 overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="./img/header.png"
            alt="Sunrise Mosque Header"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="w-full h-full object-cover object-right-top opacity-85"
          />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F5F2E8] via-[#F5F2E8]/85 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-14 flex items-center justify-center rounded-xl bg-[#F5F2E8]/80 backdrop-blur-sm border border-white shadow-sm p-1.5">
            <img
              src="./img/logo.png"
              alt="Aamaal Logo"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gold mt-2">
            Islaah Foundation’s
          </p>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-primary">
            Aamaal Circle
          </p>
        </div>
      </div>

      {/* Main Welcome Content & 3 Aamaals Circles */}
      <div className="px-5 flex-1 flex flex-col items-center justify-center text-center">
        <span className="badge-pill">Assalamu Alaikum</span>
        <h1 className="font-serif text-[32px] leading-tight font-semibold text-primary mt-2">
          Welcome to <span className="text-[#135332]">Aamaal</span>
        </h1>

        {/* Gold Divider */}
        <div className="flex items-center justify-center w-36 my-3">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C99E4C] to-[#C99E4C]" />
          <div className="mx-1.5 w-2 h-2 rotate-45 border-[1.5px] border-[#C99E4C] bg-[#F5F2E8]" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C99E4C] to-[#C99E4C]" />
        </div>

        <p className="text-[13px] text-secondary leading-relaxed max-w-[330px]">
          Aamaal is your daily companion to stay consistent with the three blessed aamaals —{' '}
          <strong className="text-primary font-semibold">Durood Shareef</strong>,{' '}
          <strong className="text-primary font-semibold">Surah Mulk</strong>, and{' '}
          <strong className="text-primary font-semibold">Istighfar</strong>.
        </p>

        {/* 3 Blessed Aamaal Cards / Circles */}
        <div className="grid grid-cols-3 gap-2.5 w-full mt-6">
          {THREE_BLESSED_AAMAALS.map((item) => (
            <div
              key={item.id}
              className="card flex flex-col items-center text-center p-3 bg-[#F3EFE2]"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#165534] to-[#08351D] border-2 border-[#C99E4C]/50 shadow-md flex items-center justify-center mb-2">
                {item.icon}
              </div>
              <h4 className="font-serif text-[13.5px] font-bold text-primary leading-tight">
                {item.title}
              </h4>
              <span className="text-[10.5px] font-semibold text-[#135332]">
                {item.subtitle}
              </span>
              <p className="text-[10.5px] text-secondary mt-1 leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <footer className="px-5 pt-4 flex flex-col items-center gap-3.5 shrink-0">
        <button
          onClick={handleNext}
          className="btn-primary w-full py-3.5 text-[14px] font-semibold shadow-md"
        >
          <span>Get Started</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="flex items-center justify-between w-full px-1">
          <button
            onClick={handleSkip}
            className="text-[12px] font-medium text-muted hover:text-primary"
          >
            Skip Intro
          </button>

          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-2 rounded-full bg-[#0D4A2E]" />
            <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
            <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
            <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          </div>

          <button
            onClick={() => navigate('/onboarding/tasbih')}
            className="text-[12px] font-semibold text-primary"
          >
            Tour ›
          </button>
        </div>
      </footer>
    </section>
  );
}