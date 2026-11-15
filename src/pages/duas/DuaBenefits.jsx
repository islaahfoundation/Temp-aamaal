//Displays the spiritual virtues (Fada'il), reflection, and recommended times to recite the Dua.

import React from 'react';

export default function DuaBenefits({
  benefits = '',
  reflection = '',
  recommendedTime = 'Morning, Evening & After Obligatory Prayers',
}) {
  const mainVirtue = benefits || reflection;
  if (!mainVirtue) return null;

  return (
    <div className="rounded-[16px] bg-[#EAE8D7] p-3.5 border border-[#D5D2BE] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332] flex items-center space-x-1">
          <span>✨</span>
          <span>Virtues &amp; Spiritual Benefits (Fada&apos;il)</span>
        </span>
      </div>

      <p className="text-[12.5px] text-primary leading-relaxed">
        {mainVirtue}
      </p>

      {recommendedTime && (
        <div className="pt-2 border-t border-[#D5D2BE] flex items-center justify-between text-[11px]">
          <span className="text-secondary font-medium">Best Time to Recite:</span>
          <strong className="text-[#0D4A2E]">{recommendedTime}</strong>
        </div>
      )}
    </div>
  );
}