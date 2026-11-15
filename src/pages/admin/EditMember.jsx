//Allows an administrator to rename any member (✏️ Rename), update their country flag, WhatsApp phone number, leaderboard privacy, or admin role.

import React, { useState, useEffect } from 'react';
import { COUNTRY_FLAGS } from '../aamaal/WeeklySummary';

export default function EditMember({ member, onSaveMember, onCancel }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [role, setRole] = useState('member');

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setCountry(member.country || 'India');
      setPhone(member.phone || '');
      setPrivacy(member.privacy || 'public');
      setRole(member.role || 'member');
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
        customNameLocked: true,
        country,
        flag: COUNTRY_FLAGS[country] || '🇮🇳',
        countryLocked: true,
        phone: phone.trim(),
        privacy,
        role: member.isPrimary ? role : 'family',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card rounded-[20px] p-4 space-y-3 bg-[#EAE8D7] border border-[#0D4A2E]/30 fade-in"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Admin Edit Member</span>
          <h3 className="font-serif text-[17px] font-semibold text-primary mt-1">
            ✏️ Rename &amp; Edit: {member.name}
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-[#F5F2E8] flex items-center justify-center text-primary font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
          Exact Display Name (e.g., Afzal&apos;s Mom)
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
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
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
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
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

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="bg-[#F5F2E8] text-[12px]"
          />
        </div>

        {member.isPrimary && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
              Circle Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-[#F5F2E8] text-[12px] font-semibold"
            >
              <option value="member">Member</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>
        )}
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