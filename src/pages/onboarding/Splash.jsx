import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash({
  nextPath,
  onComplete,
  duration = 2600,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (onComplete) {
        onComplete();
        return;
      }
      if (nextPath) {
        navigate(nextPath, { replace: true });
        return;
      }
      const isReturnee = localStorage.getItem('aamaal_onboarded') === 'true';
      navigate(isReturnee ? '/onboarding/authentication' : '/welcome', { replace: true });
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [duration, navigate, nextPath, onComplete]);

  return (
    <section
      className="screen-section no-scrollbar relative flex flex-col items-center justify-between overflow-hidden px-6 py-8"
      style={{
        background:
          'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.9) 0%, rgba(245,242,232,0.4) 45%, transparent 70%), linear-gradient(180deg, var(--color-cream-50) 0%, var(--color-background) 60%, var(--color-cream-300) 100%)',
      }}
      aria-label="Aamaal app loading"
    >
      {/* Top / Center Brand Emblem */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full max-w-[360px] fade-in">
        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
          <div
            className="absolute inset-1 rounded-full border"
            style={{ borderColor: 'rgba(201, 158, 76, 0.45)' }}
          />
          <div
            className="absolute inset-3 rounded-full border"
            style={{ borderColor: 'rgba(13, 74, 46, 0.12)' }}
          />
          <svg
            className="w-24 h-24"
            viewBox="0 0 180 180"
            role="img"
            aria-label="Aamaal mosque emblem"
          >
            <defs>
              <linearGradient id="aamaalMarkGreen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#165534" />
                <stop offset="100%" stopColor="#07361D" />
              </linearGradient>
            </defs>
            <path
              d="M25 145V78c0-4 2-7 6-9l54-36c3-2 7-2 10 0l54 36c4 2 6 5 6 9v67"
              fill="none"
              stroke="url(#aamaalMarkGreen)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M48 145V91c0-24 18-44 42-44s42 20 42 44v54"
              fill="none"
              stroke="url(#aamaalMarkGreen)"
              strokeWidth="5"
            />
            <path
              d="M61 145v-31c0-16 13-29 29-29s29 13 29 29v31"
              fill="url(#aamaalMarkGreen)"
            />
            <path d="M80 145v-19a10 10 0 0 1 20 0v19" fill="#F5F2E8" />
            <path d="M90 19c-5 8-5 13 0 17 5-4 5-9 0-17Z" fill="#C99E4C" />
            <path
              d="M19 145h142"
              stroke="#C99E4C"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M32 91V69l-8 8v14M148 91V69l8 8v14"
              fill="none"
              stroke="#135332"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="90" cy="68" r="3" fill="#C99E4C" />
          </svg>
        </div>

        <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-gold">
          Islaah Foundation’s
        </span>
        <h1 className="font-serif text-[42px] font-semibold text-primary tracking-tight mt-1">
          Aamaal
        </h1>
        <p className="text-[11.5px] font-semibold tracking-[0.18em] uppercase text-secondary mt-1">
          Aamaal Circle • Live with Purpose
        </p>

        {/* Gold Diamond Divider */}
        <div className="flex items-center justify-center w-40 my-5">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C99E4C] to-[#C99E4C]" />
          <div className="mx-2 w-2 h-2 rotate-45 border-[1.5px] border-[#C99E4C] bg-[#F5F2E8]" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C99E4C] to-[#C99E4C]" />
        </div>

        <p className="font-serif italic text-[16px] text-secondary leading-relaxed">
          A spiritual companion<br />
          for a more meaningful life
        </p>
      </div>

      {/* Bottom Mosque Skyline Silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-0 opacity-45">
        <svg
          className="w-full h-full"
          viewBox="0 0 430 230"
          preserveAspectRatio="xMidYMax slice"
        >
          <path d="M0 170h430v60H0Z" fill="#DFDEC9" />
          <g fill="#0D4A2E" opacity="0.22">
            <path d="M0 190v-47h18v47h-4v-60h3l-8-16-8 16h3v60Z" />
            <path d="M24 190v-67h8v67Z" />
            <path d="M78 190v-75c0-23 18-41 40-41s40 18 40 41v75Z" />
            <path d="M170 190v-53h13v53Z" />
            <path d="M205 190v-63c0-16 13-29 29-29s29 13 29 29v63Z" />
            <path d="M300 190v-72h7v72Z" />
            <path d="M330 190v-63c0-20 15-36 35-36s35 16 35 36v63Z" />
            <path d="M405 190v-54h12v54Z" />
          </g>
        </svg>
      </div>

      {/* Loading Indicator & Quick Dev Dots */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-2">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE8D7]/90 border border-white">
          <span className="w-2 h-2 rounded-full bg-[#C99E4C] animate-pulse" />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary">
            Connecting to Aamaal Circle...
          </span>
        </div>
      </div>
    </section>
  );
}