import React, { useState } from 'react';

export default function AamaalDetails({ aamaal }) {
  const [showMeaning, setShowMeaning] = useState(false);

  if (!aamaal) return null;

  return (
    <div className="text-center mt-2 mb-3 px-1">
      <div className="flex items-center justify-center space-x-2">
        <h2 className="font-serif text-[21px] font-semibold text-primary">
          {aamaal.name}
        </h2>
        {(aamaal.translation || aamaal.romanUrdu) && (
          <button
            type="button"
            onClick={() => setShowMeaning(!showMeaning)}
            className="px-2 py-0.5 rounded-full bg-[#EAE8D7] text-primary text-[10px] font-semibold border border-[#D5D2BE]"
          >
            {showMeaning ? 'Hide Meaning' : 'Meaning'}
          </button>
        )}
      </div>

      {/* Arabic Banner */}
      <p
        className="font-arabic text-[26px] leading-[1.55] text-[#0D4A2E] mt-1.5 px-2"
        dir="rtl"
      >
        {aamaal.arabic}
      </p>

      {/* Expandable Translation (English + Roman Urdu, No Arabic Transliteration) */}
      {showMeaning && (
        <div className="card-soft mt-2 p-3 text-left fade-in">
          {aamaal.translation && (
            <p className="text-[12px] text-[#1A3826] leading-relaxed">
              {aamaal.translation}
            </p>
          )}
          {aamaal.romanUrdu && (
            <p className="text-[11.5px] text-primary mt-1.5 pt-1.5 border-t border-[#D5D2BE] leading-relaxed">
              {aamaal.romanUrdu}
            </p>
          )}
        </div>
      )}
    </div>
  );
}