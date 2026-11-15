import React, { useState, useEffect } from 'react';
import { COUNTRY_FLAGS } from '../aamaal/WeeklySummary';

export default function EditFamilyMember({
  member,
  onSaveMember,
  onCancel,
}) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [privacy, setPrivacy] = useState('public');

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setCountry(member.country || 'India');
      setPhone(member.phone || '');
      setPrivacy(member.privacy || 'public');
    }
  }, [member]);

  if (!member) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    if (onSaveMember) {
      onSaveMember(member.id, {
        name: name.trim(),
        country,
        flag: COUNTRY_FLAGS[country] || '🇮🇳',
        phone: phone.trim(),
        privacy,
        customNameLocked: true,
        countryLocked: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card rounded-[20px] p-4 space-y-3 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Edit Profile</span>
          <h3 className="font-serif text-[18px] font-semibold text-primary mt-1">
            Edit {member.name}
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

      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
          Display Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#F5F2E8] text-[13px] font-semibold"
        />
      </div>

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

      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
          WhatsApp Number (Optional — for Monthly Report Share)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 9876543210"
          className="bg-[#F5F2E8] text-[12.5px]"
        />
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="submit"
          className="btn-primary flex-1 py-2.5 text-[13px] font-semibold"
        >
          Save Changes
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary px-4 py-2.5 text-[12.5px] font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}