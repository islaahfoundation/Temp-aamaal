// authentication.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Update path if located in ../supabaseClient or ../lib/supabase

function detectLocationFromTimezone() {
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
  if (tz.includes('kolkata') || tz.includes('calcutta') || tz.includes('india')) {
    return { country: 'India', flag: '🇮🇳' };
  }
  if (
    tz.includes('toronto') ||
    tz.includes('vancouver') ||
    tz.includes('montreal') ||
    tz.includes('edmonton') ||
    tz.includes('winnipeg') ||
    tz.includes('halifax')
  ) {
    return { country: 'Canada', flag: '🇨🇦' };
  }
  if (tz.startsWith('america/') || tz.startsWith('us/')) {
    return { country: 'United States', flag: '🇺🇸' };
  }
  if (tz.includes('london') || tz.includes('europe/london') || tz.includes('belfast')) {
    return { country: 'United Kingdom', flag: '🇬🇧' };
  }
  if (tz.includes('muscat')) return { country: 'Oman', flag: '🇴🇲' };
  if (tz.includes('dubai')) return { country: 'United Arab Emirates', flag: '🇦🇪' };
  if (tz.includes('riyadh')) return { country: 'Saudi Arabia', flag: '🇸🇦' };
  if (tz.includes('qatar')) return { country: 'Qatar', flag: '🇶🇦' };
  if (tz.includes('kuwait')) return { country: 'Kuwait', flag: '🇰🇼' };
  if (tz.startsWith('australia/')) return { country: 'Australia', flag: '🇦🇺' };
  return { country: 'India', flag: '🇮🇳' };
}

export default function Authentication() {
  const navigate = useNavigate();
  const hasSyncedRef = useRef(false);

  // Detect whether this user has visited/onboarded before
  const isReturningUser = useMemo(() => {
    try {
      return Boolean(
        localStorage.getItem('aamaal_onboarded') ||
          localStorage.getItem('aamaal_user_email') ||
          localStorage.getItem('aamaal_onboarding_meta')
      );
    } catch (_) {
      return false;
    }
  }, []);

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register'
  const [identifier, setIdentifier] = useState(() => {
    try {
      return localStorage.getItem('aamaal_user_email') || '';
    } catch (_) {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Save or sync the authenticated user into public.members
  const syncMemberToSupabase = async (user) => {
    const autoLoc = detectLocationFromTimezone();
    const avatarUrl =
      user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

    const { data: existing, error: fetchError } = await supabase
      .from('members')
      .select('id, country, flag, country_locked, avatar')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!existing) {
      // Assign 'admin' only if public.members has no rows yet
      const { count } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true });

      const isFirstEver = count === 0;
      const defaultName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (user.email ? user.email.split('@')[0] : '') ||
        user.phone ||
        'Circle Member';

      const { error: insertError } = await supabase.from('members').insert({
        id: user.id,
        parent_uid: user.id,
        is_primary: true,
        name: defaultName,
        custom_name_locked: false,
        country: autoLoc.country,
        flag: autoLoc.flag,
        country_locked: false,
        phone: user.phone || '',
        avatar: avatarUrl,
        privacy: 'public',
        role: isFirstEver ? 'admin' : 'member',
      });

      if (insertError) throw insertError;
    } else {
      const updates = {};

      if (
        !existing.country_locked &&
        (existing.country !== autoLoc.country || existing.flag !== autoLoc.flag)
      ) {
        updates.country = autoLoc.country;
        updates.flag = autoLoc.flag;
      }

      if (!existing.avatar && avatarUrl) {
        updates.avatar = avatarUrl;
      }

      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString();
        const { error: updateError } = await supabase
          .from('members')
          .update(updates)
          .eq('id', user.id);

        if (updateError) throw updateError;
      }
    }
  };

  const finishAuth = (exitAction = 'Sign In', userObj = null) => {
    try {
      if (navigator.vibrate) navigator.vibrate(20);
      localStorage.setItem('aamaal_onboarded', 'true');

      const savedEmail = userObj?.email || identifier.trim();
      if (rememberMe && savedEmail) {
        localStorage.setItem('aamaal_user_email', savedEmail);
      }
      if (userObj?.id) {
        localStorage.setItem('aamaal_user_uid', userObj.id);
      }

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

  // Capture Google OAuth redirect & active session
  useEffect(() => {
    let mounted = true;

    const handleSession = async (session, sourceLabel) => {
      if (!session?.user || hasSyncedRef.current || !mounted) return;
      hasSyncedRef.current = true;
      setLoading(true);
      setErrorMessage('');
      setStatusMessage('Saving your profile...');

      try {
        await syncMemberToSupabase(session.user);
        if (mounted) finishAuth(sourceLabel, session.user);
      } catch (err) {
        hasSyncedRef.current = false;
        if (mounted) {
          setErrorMessage(
            err.message || 'Signed in, but failed to save profile to database.'
          );
          setStatusMessage('');
          setLoading(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleSession(session, 'Session Restored');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleSession(session, 'Google / Auth Sign In');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Email or Phone + Password Sign In / Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const trimmed = identifier.trim();
    if (!trimmed || !password) {
      setErrorMessage('Please enter your email/phone and password.');
      return;
    }

    const isEmail = trimmed.includes('@');
    const credentials = isEmail
      ? { email: trimmed, password }
      : { phone: trimmed, password };

    setLoading(true);
    try {
      if (authMode === 'register') {
        const { data, error } = await supabase.auth.signUp(credentials);
        if (error) throw error;

        if (data?.session?.user) {
          hasSyncedRef.current = true;
          await syncMemberToSupabase(data.session.user);
          finishAuth('Register', data.session.user);
        } else {
          setStatusMessage(
            'Account created! Check your email to confirm, then sign in.'
          );
          setAuthMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;

        if (data?.user) {
          hasSyncedRef.current = true;
          await syncMemberToSupabase(data.user);
          finishAuth('Sign In', data.user);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setStatusMessage('Redirecting to Google...');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
        },
      });
      if (error) throw error;
    } catch (err) {
      setErrorMessage(err.message || 'Google Sign-In failed.');
      setStatusMessage('');
      setLoading(false);
    }
  };

  return (
    <section className="screen-section relative overflow-hidden bg-[#FAF8F2] px-5 pt-2.5 pb-3 flex flex-col justify-between h-[100dvh] select-none">
      {/* Top Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#0D4A2E] active:scale-95 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="text-[13.5px] font-semibold text-[#0D4A2E] hover:opacity-80 transition px-1"
        >
          Help
        </button>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 w-full max-w-[360px] mx-auto my-auto">
        {/* Large Brand Logo & Tagline */}
        <div className="flex flex-col items-center text-center">
          <img
            src="./img/logo.png"
            alt="Aamaal"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-48 h-36 object-contain -mt-4 -mb-6 pointer-events-none"
          />
          <h2 className="font-serif text-[38px] font-bold text-[#0D4A2E] leading-none tracking-tight">
            Aamaal
          </h2>
          <p className="text-[14.5px] font-medium text-[#1F3528] mt-1">
            Live with Purpose
          </p>
        </div>

        {/* Dynamic Greeting */}
        <div className="text-center mt-3 mb-2.5">
          <h1 className="font-serif text-[24px] font-bold text-[#14261C] leading-tight">
            {authMode === 'register'
              ? 'Create Account'
              : isReturningUser
              ? 'Welcome Back'
              : 'Welcome'}
          </h1>
          <p className="text-[12.5px] text-[#4E5953] mt-0.5">
            {authMode === 'register'
              ? 'Register to sync your daily Aamaal'
              : 'Sign in to continue'}
          </p>
        </div>

        {/* Inline Error / Status Feedback */}
        {errorMessage && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11.5px] font-medium text-center">
            {errorMessage}
          </div>
        )}
        {statusMessage && !errorMessage && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0D4A2E] text-[11.5px] font-medium text-center">
            {statusMessage}
          </div>
        )}

        {/* Sign-In / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Email or Phone Input */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-[#4E5953] pointer-events-none">
              <svg
                className="w-[17px] h-[17px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              placeholder="Email or Phone Number"
              className="w-full h-[42px] pl-10 pr-4 rounded-[13px] bg-[#FDFCF8] border border-[#DDD9C8] text-[13px] text-[#14261C] placeholder:text-[#7A827D] focus:outline-none focus:border-[#0D4A2E] transition disabled:opacity-60"
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-[#4E5953] pointer-events-none">
              <svg
                className="w-[17px] h-[17px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Password"
              className="w-full h-[42px] pl-10 pr-10 rounded-[13px] bg-[#FDFCF8] border border-[#DDD9C8] text-[13px] text-[#14261C] placeholder:text-[#7A827D] focus:outline-none focus:border-[#0D4A2E] transition disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 text-[#4E5953] p-1"
            >
              {showPassword ? (
                <svg
                  className="w-[17px] h-[17px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  className="w-[17px] h-[17px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-0.5 pb-0.5">
            <label className="flex items-center space-x-2 cursor-pointer">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe((prev) => !prev)}
                className={`w-[17px] h-[17px] rounded-[5px] flex items-center justify-center border transition ${
                  rememberMe
                    ? 'bg-[#0D4A2E] border-[#0D4A2E] text-white'
                    : 'bg-white border-[#C9C5B4]'
                }`}
              >
                {rememberMe && (
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="text-[12px] font-medium text-[#1F3528]">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={() => navigate('/onboarding/recovery')}
              className="text-[12px] font-semibold text-[#0D4A2E] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Sign In / Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] rounded-full bg-gradient-to-r from-[#0B462B] via-[#135B39] to-[#083B23] text-white text-[14.5px] font-semibold shadow-md active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : authMode === 'register'
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-2">
          <div className="flex-1 h-[1px] bg-[#E2DEC9]" />
          <span className="px-3 text-[11.5px] font-medium text-[#4E5953]">or</span>
          <div className="flex-1 h-[1px] bg-[#E2DEC9]" />
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full h-[42px] rounded-full bg-[#FDFCF8] border border-[#DDD9C8] shadow-sm flex items-center justify-center space-x-2.5 text-[13px] font-semibold text-[#14261C] active:scale-[0.98] transition disabled:opacity-60"
        >
          <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
            />
            <path
              fill="#34A853"
              d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Bottom Register / Sign In Switch Link */}
      <footer className="relative z-10 text-center pb-1.5 pt-1 shrink-0">
        <p className="text-[12.5px] text-[#4E5953]">
          {authMode === 'register' ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setErrorMessage('');
              setStatusMessage('');
              setAuthMode((prev) => (prev === 'signin' ? 'register' : 'signin'));
            }}
            className="font-semibold text-[#0D4A2E] underline underline-offset-2"
          >
            {authMode === 'register' ? 'Sign In' : 'Register'}
          </button>
        </p>
      </footer>

      {/* Subtle Bottom Mosque Skyline Silhouette */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-14 opacity-30"
        viewBox="0 0 400 70"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="skylineGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6D5A7" stopOpacity="0" />
            <stop offset="100%" stopColor="#E6D5A7" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <rect width="400" height="70" fill="url(#skylineGlow)" />
        {/* Left Mosque & Minarets */}
        <path
          d="M0 70V52h16V26l3-10 3 10v26h8c2-12 10-18 16-18s14 6 16 18h10V36l2-7 2 7v16h18v18H0z"
          fill="#7D9B84"
        />
        {/* Right Mosque & Minarets */}
        <path
          d="M400 70V52h-16V26l-3-10-3 10v26h-8c-2-12-10-18-16-18s-14 6-16 18h-10V36l-2-7-2 7v16h-18v18h94z"
          fill="#7D9B84"
        />
      </svg>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-[22px] bg-[#FAF8F2] border border-[#D5D2BE] shadow-xl p-5 space-y-3 text-center">
            <h3 className="font-serif text-[18px] font-bold text-[#0D4A2E]">
              Need Help?
            </h3>
            <p className="text-[12.5px] text-[#4E5953] leading-relaxed">
              Sign in to sync your daily Aamaal, streaks, and saved Duas, or continue directly to the app.
            </p>
            <div className="flex flex-col space-y-2 pt-1">
              <button
                type="button"
                onClick={() => finishAuth('Guest Continue')}
                className="w-full py-2.5 rounded-full bg-[#0D4A2E] text-white text-[13px] font-semibold"
              >
                Continue as Guest
              </button>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2 rounded-full bg-[#EAE8D7] text-[#0D4A2E] text-[12.5px] font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}