import React, { useState, useEffect } from 'react';
import { COUNTRY_FLAGS } from '../aamaal/WeeklySummary';

const PRIVACY_OPTIONS = [
  { id: 'public', label: '🌍 Public', desc: 'Visible on circle leaderboard' },
  { id: 'private', label: '🔒 Private', desc: 'Shown as "Hidden Member"' },
  { id: 'anonymous', label: '🕵️ Anonymous', desc: 'Only added to group total' },
];

export default function PersonalProfile({
  primaryProfile,
  onSavePrimaryProfile,
  onBack,
}) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    if (primaryProfile) {
      setName(primaryProfile.name || '');
      setCountry(primaryProfile.country || 'India');
      setPhone(primaryProfile.phone || localStorage.getItem('aamaal_user_phone') || '');
      setEmail(primaryProfile.email || localStorage.getItem('aamaal_user_email') || '');
      setPrivacy(primaryProfile.privacy || 'public');
    }
  }, [primaryProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const flag = COUNTRY_FLAGS[country] || '🇮🇳';
    if (email.trim()) localStorage.setItem('aamaal_user_email', email.trim());
    if (phone.trim()) localStorage.setItem('aamaal_user_phone', phone.trim());

    if (onSavePrimaryProfile) {
      onSavePrimaryProfile({
        name: name.trim(),
        country,
        flag,
        phone: phone.trim(),
        email: email.trim(),
        privacy,
        customNameLocked: true,
        countryLocked: true,
      });
    }

    setSavedNotice('✓ Personal profile saved!');
    setTimeout(() => setSavedNotice(''), 2200);
  };

  return (
    <div className="space-y-3.5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary px-3 py-1 text-[11.5px]"
        >
          ‹ Back to Account
        </button>
      )}

      <form onSubmit={handleSubmit} className="card rounded-[20px] p-4 space-y-3.5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#165534] to-[#08351D] border border-[#C99E4C]/50 flex items-center justify-center text-[22px] shadow-sm shrink-0">
            {COUNTRY_FLAGS[country] || '🇮🇳'}
          </div>
          <div>
            <span className="badge-pill">Core Circle Member</span>
            <h3 className="font-serif text-[18px] font-semibold text-primary mt-0.5">
              {name || 'Your Personal Profile'}
            </h3>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
            Full Name / Display Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Ubaid, Yusuf..."
            className="bg-[#F5F2E8] text-[13px] font-semibold"
          />
        </div>

        {/* Country & Flag */}
        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
            Country &amp; Leaderboard Flag
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-[#F5F2E8] text-[12.5px] font-semibold"
          >
            {Object.keys(COUNTRY_FLAGS).map((c) => (
              <option key={c} value={c}>
                {COUNTRY_FLAGS[c]} {c}
              </option>
            ))}
          </select>
        </div>

        {/* WhatsApp / Mobile Number & Email */}
        <div className="grid grid-cols-1 gap-2.5">
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
              Mobile / WhatsApp Number (With Country Code)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="bg-[#F5F2E8] text-[12.5px]"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
              Email Address (For Cloud Sync &amp; Recovery)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-[#F5F2E8] text-[12.5px]"
            />
          </div>
        </div>

        {/* Leaderboard Privacy */}
        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1.5">
            Leaderboard Privacy
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {PRIVACY_OPTIONS.map((opt) => {
              const active = privacy === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrivacy(opt.id)}
                  className={`p-2 rounded-xl border text-center transition ${
                    active
                      ? 'bg-[#0F4C2B] text-white border-[#C99E4C]'
                      : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
                  }`}
                >
                  <div className="text-[11.5px] font-bold">{opt.label}</div>
                  <div
                    className={`text-[9.5px] mt-0.5 leading-tight ${
                      active ? 'text-[#F0D58C]' : 'text-secondary'
                    }`}
                  >
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {savedNotice && (
          <p className="text-center text-[12px] font-semibold text-[#135332]">
            {savedNotice}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full py-3 text-[13px] font-semibold shadow-sm"
        >
          Save Personal Profile
        </button>
      </form>
    </div>
  );
}