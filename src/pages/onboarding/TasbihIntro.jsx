import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TasbihIntro() {
  const navigate = useNavigate();
  const [demoCount, setDemoCount] = useState(17);
  const [isPopping, setIsPopping] = useState(false);
  const target = 313;

  const handleDemoTap = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(14);
    } catch (_) {}
    setIsPopping(false);
    setTimeout(() => setIsPopping(true), 10);
    setDemoCount((prev) => (prev >= target ? 1 : prev + 1));
  };

  const circumference = 339.3;
  const ratio = Math.min(1, demoCount / target);
  const dashOffset = circumference - ratio * circumference;

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="./img/logo.png"
              alt="Aamaal"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-9 h-8 object-contain"
            />
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-gold leading-none">
                Islaah Foundation’s
              </p>
              <p className="font-serif text-[14px] font-semibold text-primary leading-tight">
                Aamaal Circle
              </p>
            </div>
          </div>
          <span className="badge-pill">Step 1 of 5</span>
        </div>

        {/* Title & Description */}
        <div className="text-center mt-4">
          <h2 className="font-serif text-[26px] font-semibold text-primary">
            Digital Tasbih
          </h2>
          <p className="text-[12.5px] text-secondary mt-1 max-w-[300px] mx-auto">
            Tap the orb below to count your Durood Shareef, Istighfar, and daily Dhikr with gentle haptic pulse.
          </p>
        </div>

        {/* Interactive Tasbih Orb Preview */}
        <div className="mt-5 flex flex-col items-center">
          <div className="relative">
            {/* Callout Badge */}
            <div className="absolute -top-2 -right-10 z-20 px-2.5 py-1 rounded-full bg-[#0F4C2B] text-[#F0D58C] text-[10px] font-semibold shadow-md border border-[#C99E4C]/40">
              Tap to try ✨
            </div>

            <button
              type="button"
              onClick={handleDemoTap}
              className={`tasbih-orb select-none ${isPopping ? 'bead-active' : ''}`}
            >
              <svg className="absolute inset-2 w-[176px] h-[176px]" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#D5D2BE"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="6 6"
                />
                <circle
                  className="progress-ring-circle"
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#0D4A2E"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-muted">
                Durood Shareef
              </span>
              <span className="font-serif text-[44px] font-bold text-primary leading-none my-1">
                {demoCount}
              </span>
              <span className="text-[11.5px] font-medium text-secondary">
                / {target} Target
              </span>
            </button>
          </div>
        </div>

        {/* 3 Feature Highlight Pillars from Screen 3 */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5 text-[13px] font-bold">
              1
            </div>
            <h4 className="font-serif text-[12.5px] font-semibold text-primary">
              Tap to Count
            </h4>
            <p className="text-[10.5px] text-secondary mt-0.5 leading-tight">
              Each tap adds one count with pulse.
            </p>
          </div>

          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5 text-[11px] font-bold">
              313
            </div>
            <h4 className="font-serif text-[12.5px] font-semibold text-primary">
              Track Progress
            </h4>
            <p className="text-[10.5px] text-secondary mt-0.5 leading-tight">
              See your count in real time.
            </p>
          </div>

          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5 text-[13px] font-bold">
              ⇄
            </div>
            <h4 className="font-serif text-[12.5px] font-semibold text-primary">
              Switch Aamaal
            </h4>
            <p className="text-[10.5px] text-secondary mt-0.5 leading-tight">
              Move between Durood & Dhikr.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/onboarding/authentication')}
          className="text-[13px] font-medium text-muted px-2 py-2"
        >
          Skip
        </button>

        <div className="flex items-center gap-1.5">
          <span className="w-5 h-2 rounded-full bg-[#0D4A2E]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
        </div>

        <button
          onClick={() => navigate('/onboarding/duas')}
          className="btn-primary px-6 py-2.5 text-[13.5px]"
        >
          <span>Next</span>
          <span>›</span>
        </button>
      </footer>
    </section>
  );
}