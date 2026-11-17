//Provides an interactive FAQ accordion (How do I log 313 Durood for family members?, How do I hide my name on the leaderboard?, Why is there no Roman Arabic transliteration?) and direct contact/feedback options.

import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How do I log 313 Durood Shareef for my parents or children?',
    a: 'Tap your profile pill at the top of the Home or Aamaal screen, or open "Account & Family Profiles" in the More tab. You can add unlimited family members and switch between them with one tap.',
  },
  {
    q: 'Can my recitations count toward the Circle total anonymously?',
    a: 'Yes! Enable "Anonymous (Circle Member)" in Privacy Settings or on your Profile card. Your 313 Durood, Surah Mulk, and 100 Istighfar counts will be added to the community total while displaying your name as "Circle Member".',
  },
  {
    q: 'Why are Duas shown in pure Arabic script without Roman transliteration?',
    a: 'To preserve authentic Tajweed and pronunciation of Arabic letters, all supplications use clear vocalized Arabic script paired with built-in audio recitation and meaning translations in English, Roman Urdu, Urdu, and Hindi.',
  },
  {
    q: 'How do I share the weekly Circle report on WhatsApp?',
    a: 'Open the Aamaal tab and scroll to the bottom for the "Share Progress on WhatsApp" button, or open the Circle Admin Panel in the More tab for person-wise daily and weekly formatted WhatsApp reports.',
  },
];

export default function HelpSupport({ onBack }) {
  const [openIdx, setOpenIdx] = useState(0);

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

      <div>
        <span className="badge-pill">Guidance &amp; Answers</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          💬 Help &amp; Support FAQ
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Common questions about the Aamaal Circle, family profiles, and daily tracking.
        </p>
      </div>

      <div className="space-y-2">
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="card rounded-[18px] p-3.5 cursor-pointer transition space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-serif text-[15px] font-semibold text-primary">
                  {item.q}
                </h4>
                <span className="text-primary font-bold text-[14px] shrink-0">
                  {isOpen ? '−' : '+'}
                </span>
              </div>
              {isOpen && (
                <p className="text-[12px] text-secondary leading-relaxed pt-1 border-t border-[#E2DEC9]">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}