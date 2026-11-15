//Allows an administrator to register either a new Core Circle Member or a Family Profile linked to an existing core member, including Country Flag, Mobile/WhatsApp Number, Privacy, and Role.

import React, { useState } from 'react';
import { COUNTRY_FLAGS } from '../aamaal/WeeklySummary';

export default function AddMember({
  allMembers = [],
  onAddMember,
  onCancel,
}) {
  const [name, setName] = useState('');
  const [memberType, setMemberType] = useState('primary'); // 'primary' | 'family'
  const [parentUid, setParentUid] = useState(
    allMembers.find((m) => m.isPrimary)?.id || 'primary_member'
  );
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [role, setRole] = useState('member');

  const coreMembers = allMembers.filter((m) => m.isPrimary !== false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } catch (_) {}

    const isPrimary = memberType === 'primary';
    const newId = isPrimary ? `mem_${Date.now()}` : `fam_${Date.now()}`;

    if (onAddMember) {
      onAddMember({
        id: newId,
        parentUid: isPrimary ? newId : parentUid,
        isPrimary,
        name: name.trim(),
        customNameLocked: true,
        country,
        flag: COUNTRY_FLAGS[country] || '🇮🇳',
        phone: phone.trim(),
        privacy,
        role: isPrimary ? role : 'family',
        createdAt: Date.now(),
      });
    }

    setName('');
    setPhone('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card rounded-[20px] p-4 space-y-3 bg-[#EAE8D7] border border-[#0D4A2E]/30 fade-in"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Register Member</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary mt-1">
            + Add Circle or Family Member
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

      {/* Member Type Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMemberType('primary')}
          className={`py-2 px-3 rounded-xl text-[12px] font-bold border transition ${
            memberType === 'primary'
              ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
              : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
          }`}
        >
          👤 Core Member
        </button>
        <button
          type="button"
          onClick={() => setMemberType('family')}
          className={`py-2 px-3 rounded-xl text-[12px] font-bold border transition ${
            memberType === 'family'
              ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
              : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
          }`}
        >
          👨‍👩‍👧‍👦 Family Profile
        </button>
      </div>

      {memberType === 'family' && coreMembers.length > 0 && (
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Linked Core Member
          </label>
          <select
            value={parentUid}
            onChange={(e) => setParentUid(e.target.value)}
            className="bg-[#F5F2E8] text-primary text-[12px] font-semibold py-1.5 px-2.5 rounded-xl"
          >
            {coreMembers.map((cm) => (
              <option key={cm.id} value={cm.id}>
                {cm.name} ({cm.country || 'India'})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
          Display Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            memberType === 'family' ? "e.g., Afzal's Mom" : 'e.g., Afzal Ahmed'
          }
          className="bg-[#F5F2E8] text-[13px] font-semibold"
        />
      </div>

      {/* Country + Privacy */}
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
            Privacy
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

      {/* Mobile/WhatsApp + Role */}
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

        {memberType === 'primary' && (
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
          className="btn-primary flex-1 py-2.5 text-[13px] font-semibold shadow-sm"
        >
          Save Member
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