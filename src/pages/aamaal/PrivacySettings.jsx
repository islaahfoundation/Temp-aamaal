import React, { useState, useEffect } from 'react';
import { COUNTRY_FLAGS } from './WeeklySummary';

const PRIVACY_MODES = [
  {
    id: 'public',
    title: '🌍 Public',
    desc: 'Name and recitation counts appear on the group leaderboard.',
  },
  {
    id: 'private',
    title: '🔒 Private',
    desc: 'Counted on the leaderboard, but name is hidden as "Hidden Member".',
  },
  {
    id: 'anonymous',
    title: '🕵️ Anonymous',
    desc: 'Hidden from leaderboard. Only added to the circle’s total recitations.',
  },
];

export default function PrivacySettings({
  isOpen,
  activeProfile,
  onSaveProfileSettings,
  onAddFamilyMember,
  onClose,
}) {
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('India');
  const [privacy, setPrivacy] = useState('public');
  const [newFamilyName, setNewFamilyName] = useState('');

  useEffect(() => {
    if (activeProfile) {
      setDisplayName(activeProfile.name || '');
      setCountry(activeProfile.country || 'India');
      setPrivacy(activeProfile.privacy || 'public');
    }
  }, [activeProfile, isOpen]);

  if (!isOpen || !activeProfile) return null;

  const handleSaveAll = (e) => {
    e.preventDefault();
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    if (onSaveProfileSettings) {
      onSaveProfileSettings({
        name: displayName.trim() || activeProfile.name,
        country,
        flag: COUNTRY_FLAGS[country] || '🇮🇳',
        privacy,
      });
    }
    if (onClose) onClose();
  };

  const handleAddFamily = () => {
    if (!newFamilyName.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    if (onAddFamilyMember) {
      onAddFamilyMember(newFamilyName.trim());
    }
    setNewFamilyName('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[#C9C5B1] mx-auto mb-3" />

        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif text-[20px] font-semibold text-primary">
            Profile, Family &amp; Privacy
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EAE8D7] flex items-center justify-center text-primary font-bold"
          >
            ✕
          </button>
        </div>
        <p className="text-[11.5px] text-secondary mb-3.5">
          Update display name, country flag, family members, or leaderboard privacy.
        </p>

        <form onSubmit={handleSaveAll} className="space-y-3.5">
          {/* 1. Display Name & Country Flag */}
          <div className="card-soft p-3 space-y-2">
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-primary">
              ✏️ Display Name &amp; Country Flag
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter preferred display name"
              className="bg-[#F5F2E8] text-[13px]"
            />
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

          {/* 2. Add Family Member */}
          <div className="card-soft p-3 space-y-2">
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-primary">
              👨‍👩‍👧‍👦 Add Family Member Profile
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                placeholder="e.g., Mom, Wife, or Ubaid's Mom"
                className="flex-1 bg-[#F5F2E8] text-[12.5px]"
              />
              <button
                type="button"
                onClick={handleAddFamily}
                className="btn-secondary px-3.5 py-1.5 text-[12px] font-bold shrink-0"
              >
                + Add
              </button>
            </div>
          </div>

          {/* 3. Leaderboard Privacy Options */}
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-2">
              Leaderboard Privacy for{' '}
              <strong className="text-primary">{displayName || activeProfile.name}</strong>:
            </label>
            <div className="space-y-2">
              {PRIVACY_MODES.map((opt) => {
                const isSelected = privacy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPrivacy(opt.id)}
                    className={`w-full text-left p-3 rounded-[14px] border transition ${
                      isSelected
                        ? 'bg-[#0F4C2B] text-white border-[#C99E4C]'
                        : 'bg-[#F3EFE2] text-primary border-white/90'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-[14px] font-semibold">
                        {opt.title}
                      </span>
                      <span className="text-[12px] font-bold text-[#F0D58C]">
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-secondary'
                      }`}
                    >
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-[13.5px] font-semibold shadow-md"
          >
            Save All Settings
          </button>
        </form>
      </div>
    </div>
  );
}