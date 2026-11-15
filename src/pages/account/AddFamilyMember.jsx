import React, { useState } from 'react';
import { COUNTRY_FLAGS } from '../aamaal/WeeklySummary';

const QUICK_RELATIONS = ['Mom', 'Dad', 'Wife', 'Sister', 'Brother', 'Son', 'Daughter', 'Grandmother'];

export default function AddFamilyMember({
  primaryMemberName = 'Member',
  defaultCountry = 'India',
  onAddMember,
  onCancel,
}) {
  const [rawName, setRawName] = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const [privacy, setPrivacy] = useState('public');
  const [autoPrefixParentName, setAutoPrefixParentName] = useState(true);

  const givenName = (primaryMemberName || 'Member').trim().split(/\s+/)[0];

  const computeFormattedName = (inputName) => {
    const clean = inputName.trim();
    if (!clean) return '';
    if (
      !autoPrefixParentName ||
      clean.includes("'s") ||
      clean.includes('’s') ||
      clean.toLowerCase().includes(givenName.toLowerCase())
    ) {
      return clean;
    }
    return `${givenName}'s ${clean}`;
  };

  const previewName = computeFormattedName(rawName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!previewName) return;
    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } catch (_) {}

    if (onAddMember) {
      onAddMember({
        id: `fam_${Date.now()}`,
        name: previewName,
        country,
        flag: COUNTRY_FLAGS[country] || '🇮🇳',
        privacy,
        isPrimary: false,
        customNameLocked: true,
        createdAt: Date.now(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card rounded-[20px] p-4 space-y-3.5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">New Family Profile</span>
          <h3 className="font-serif text-[18px] font-semibold text-primary mt-1">
            Add Family Member
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-[#EAE8D7] flex items-center justify-center text-primary font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Relation Chips */}
      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1.5">
          Quick Select Relation or Type Name Below
        </label>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_RELATIONS.map((rel) => (
            <button
              key={rel}
              type="button"
              onClick={() => setRawName(rel)}
              className={`px-3 py-1 rounded-full text-[11.5px] font-semibold transition ${
                rawName === rel
                  ? 'bg-[#0D4A2E] text-white'
                  : 'bg-[#EAE8D7] text-primary border border-[#D5D2BE]'
              }`}
            >
              {rel}
            </button>
          ))}
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
          Family Member Name or Relation
        </label>
        <input
          type="text"
          required
          value={rawName}
          onChange={(e) => setRawName(e.target.value)}
          placeholder={`e.g., Mom, Wife, or ${givenName}'s Mom`}
          className="bg-[#F5F2E8] text-[13px] font-semibold"
        />
      </div>

      {/* Auto-prefix toggle */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#EAE8D7]">
        <div className="text-[11.5px] text-primary">
          Display as:{' '}
          <strong className="text-[#135332]">
            {previewName || `${givenName}'s Mom`}
          </strong>
        </div>
        <button
          type="button"
          onClick={() => setAutoPrefixParentName(!autoPrefixParentName)}
          className="text-[11px] font-semibold text-primary underline"
        >
          {autoPrefixParentName ? 'Use Exact Text' : `Prefix "${givenName}'s"`}
        </button>
      </div>

      {/* Country & Privacy */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
            Country Flag
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-[#F5F2E8] text-[12px] font-semibold"
          >
            {Object.keys(COUNTRY_FLAGS).map((c) => (
              <option key={c} value={c}>
                {COUNTRY_FLAGS[c]} {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
            Leaderboard Privacy
          </label>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="bg-[#F5F2E8] text-[12px] font-semibold"
          >
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
            <option value="anonymous">🕵️ Anonymous</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="submit"
          className="btn-primary flex-1 py-3 text-[13px] font-semibold shadow-sm"
        >
          + Add to Family Circle
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary px-4 py-3 text-[12.5px] font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}