//Displays the Islaah Foundation's Aamaal Circle mission statement, core daily anchors (313 Durood Shareef, Surah Al-Mulk, 100 Istighfar), and app version details.

import React from 'react';

export default function About({ onBack }) {
  return (
    <div className="space-y-3.5 fade-in">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
        >
          ‹ Back to Settings
        </button>
      )}

      <div className="card-progress rounded-[24px] p-5 text-center border border-[#C99E4C]/50 space-y-3">
        <span className="px-3 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[10px] font-bold uppercase tracking-wider">
          Islaah Foundation Initiative
        </span>

        <h2 className="font-serif text-[25px] font-bold text-white leading-tight">
          Aamaal Circle
        </h2>
        <p className="text-[12px] text-[#F0D58C] font-medium">
          Live with Purpose • Consistency in Remembrance
        </p>

        <p className="text-[12px] text-white/85 leading-relaxed">
          Aamaal Circle unites believers and families across the world in consistent, heart-centered daily remembrance—anchored by 313 Durood Shareef, nightly Surah Al-Mulk, and 100 daily Istighfar.
        </p>

        <div className="pt-2 border-t border-white/15 text-[11px] text-white/75">
          Version 2.4.0 • Built with Sincerity &amp; Excellence (Ihsan)
        </div>
      </div>

      <div className="card rounded-[20px] p-4 space-y-2">
        <h4 className="font-serif text-[16px] font-semibold text-primary">
          🌟 Our Three Daily Pillars
        </h4>
        <ul className="text-[12px] text-secondary space-y-1.5 pl-4 list-disc">
          <li>
            <strong className="text-primary">313 Durood Shareef:</strong> Daily Salawat upon the Prophet ﷺ for peace, mercy, and closeness.
          </li>
          <li>
            <strong className="text-primary">Surah Al-Mulk (30 Verses):</strong> Nightly Quranic shield and intercessor before sleep.
          </li>
          <li>
            <strong className="text-primary">100x Daily Istighfar:</strong> Following the Prophetic Sunnah of continual repentance and renewal.
          </li>
        </ul>
      </div>
    </div>
  );
}