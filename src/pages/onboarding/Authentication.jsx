import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Authentication() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const finishOnboarding = (exitAction = 'Get Started') => {
    try {
      if (navigator.vibrate) navigator.vibrate(25);
      localStorage.setItem('aamaal_onboarded', 'true');
      localStorage.setItem(
        'aamaal_onboarding_meta',
        JSON.stringify({
          completedAt: new Date().toISOString(),
          exitAction,
        })
      );
    } catch (_) {}
    navigate('/home', { replace: true });
  };

  const handleQuickLogin = (e) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('aamaal_user_email', email.trim());
    }
    finishOnboarding('Logged In');
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      <div>
        {/* Top Brand Header */}
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
          <span className="badge-pill">Assalamu Alaikum</span>
        </div>

        {/* Welcome Back Heading */}
        <div className="text-center mt-4">
          <h1 className="font-serif text-[30px] font-semibold text-primary">
            Welcome Back
          </h1>
          <p className="text-[12.5px] text-secondary mt-1 max-w-[310px] mx-auto">
            Ready to continue your spiritual journey? Jump straight into your dashboard or sync your cloud backup.
          </p>
        </div>

        {/* Center Preview Card */}
        <div className="card-progress p-4 mt-5 text-center">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
            Your Daily Companion
          </span>
          <h3 className="font-serif text-[19px] font-semibold text-white mt-1.5">
            313 Durood • Surah Mulk • 100 Istighfar
          </h3>
          <p className="text-[11.5px] text-white/80 mt-1">
            Your streaks, saved duas, and Tasbih counts are saved automatically on your device.
          </p>

          <button
            type="button"
            onClick={() => finishOnboarding('Go to Home Card')}
            className="mt-3.5 px-5 py-2 rounded-full bg-[#DFB75A] text-[#07361D] text-[12.5px] font-bold shadow-md"
          >
            Go to Home Dashboard ›
          </button>
        </div>

        {/* Optional Sign-In Box when Log In is toggled */}
        {showLoginForm && (
          <form onSubmit={handleQuickLogin} className="card-soft mt-3.5 p-3.5 space-y-2">
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-primary">
              Sync with Email (Optional)
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-[#F5F2E8] text-[12.5px]"
              />
              <button type="submit" className="btn-primary px-4 py-1.5 text-[12px]">
                Sync
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Action Stack & Bottom Controls */}
      <footer className="space-y-2.5 pt-4 shrink-0">
        <button
          type="button"
          onClick={() => finishOnboarding('Get Started')}
          className="btn-primary w-full py-3.5 text-[14px] font-semibold shadow-md"
        >
          <span>Get Started</span>
          <span>›</span>
        </button>

        <button
          type="button"
          onClick={() => finishOnboarding('Skip Intro & Go to App')}
          className="btn-secondary w-full py-3 text-[13px] font-semibold"
        >
          Skip Intro &amp; Go to App
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => navigate('/welcome')}
            className="text-[12px] font-semibold text-primary underline"
          >
            Take the Intro Tour
          </button>
        </div>

        {/* Bottom Bar: [Log In | Restore] · Dots · Bypass */}
        <div className="pt-2 flex items-center justify-between">
          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            <button
              type="button"
              onClick={() => setShowLoginForm(!showLoginForm)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                showLoginForm ? 'bg-[#0D4A2E] text-white' : 'text-primary'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => navigate('/onboarding/recovery')}
              className="px-3 py-1 rounded-full text-[11px] font-medium text-secondary hover:text-primary transition"
            >
              Restore
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
            <span className="w-5 h-2 rounded-full bg-[#0D4A2E]" />
            <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          </div>

          <button
            type="button"
            onClick={() => finishOnboarding('Bypass')}
            className="text-[12.5px] font-medium text-muted hover:text-primary px-1"
          >
            Bypass
          </button>
        </div>
      </footer>
    </section>
  );
}