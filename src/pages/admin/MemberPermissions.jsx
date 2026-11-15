//Renders the role badge and the Make Admin / Remove Admin toggle button for any core member

import React from 'react';

export default function MemberPermissions({ member, onToggleRole }) {
  if (!member) return null;

  const isAdmin = member.role === 'admin';

  return (
    <button
      type="button"
      onClick={() => {
        try {
          if (navigator.vibrate) navigator.vibrate(12);
        } catch (_) {}
        if (onToggleRole) onToggleRole(member.id, isAdmin ? 'member' : 'admin');
      }}
      className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition shrink-0 ${
        isAdmin
          ? 'bg-[#E5DEC9] text-[#6B2D26] border-[#c45d55]/30'
          : 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
      }`}
    >
      {isAdmin ? 'Remove Admin' : '👑 Make Admin'}
    </button>
  );
}