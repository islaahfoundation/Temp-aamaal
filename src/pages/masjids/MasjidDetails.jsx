/*Displays the full Masjid view with:
Free Embedded Interactive Google Map (iframe centered on the Masjid's coordinates or address)
One-Tap Google Maps Turn-by-Turn Navigation (Walking, Driving, or Transit)
JamatTimetable.jsx
Sunnah Duas for Entering & Leaving the Masjid (Pure Arabic calligraphy + English, Roman Urdu, Urdu, and Hindi translations—zero Roman Arabic transliteration) */

import React, { useState } from 'react';
import JamatTimetable from './JamatTimetable';

const MASJID_DUAS = [
  {
    id: 'entering',
    badge: 'STEPPING IN WITH RIGHT FOOT',
    title: 'Sunnah Dua When Entering the Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    en: 'O Allah, open for me the doors of Your mercy.',
    romanUrdu: 'Aye Allah! Mere liye apni rehmat ke darwaze khol de.',
    ur: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔',
    hi: 'ऐ अल्लाह! मेरे लिए अपनी रहमत के दरवाज़े खोल दे।',
    reference: 'Sahih Muslim 713',
  },
  {
    id: 'leaving',
    badge: 'STEPPING OUT WITH LEFT FOOT',
    title: 'Sunnah Dua When Leaving the Masjid',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    en: 'O Allah, I ask You from Your immense bounty and grace.',
    romanUrdu: 'Aye Allah! Main Tujhse Tere fazl aur karam ka sawal karta hoon.',
    ur: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔',
    hi: 'ऐ अल्लाह! मैं तुझसे तेरे फ़ज़्ल का सवाल करता हूँ।',
    reference: 'Sahih Muslim 713',
  },
];

const LANG_TABS = [
  { id: 'en', label: 'EN' },
  { id: 'romanUrdu', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function MasjidDetails({
  masjid,
  userCoords,
  isAdmin = false,
  isPrimaryMasjid = false,
  onSetPrimaryMasjid,
  onUpdateJamatTimes,
  onSubmitChangeRequest,
  onBack,
}) {
  const [travelMode, setTravelMode] = useState('walking'); // 'walking' | 'driving'
  const [duaLang, setDuaLang] = useState('en');

  if (!masjid) return null;

  const mapQuery =
    masjid.lat && masjid.lng
      ? `${masjid.lat},${masjid.lng}`
      : encodeURIComponent(`${masjid.name} ${masjid.address || ''}`);

  const freeEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=m&z=16&output=embed&iwloc=Near`;

  const destinationParam =
    masjid.lat && masjid.lng
      ? `${masjid.lat},${masjid.lng}`
      : encodeURIComponent(`${masjid.name}, ${masjid.address || ''}`);

  const originParam =
    userCoords?.lat && userCoords?.lng
      ? `&origin=${userCoords.lat},${userCoords.lng}`
      : '';

  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destinationParam}&travelmode=${travelMode}`;

  return (
    <div className="space-y-3.5 fade-in">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ All Masjids
          </button>
        )}

        {onSetPrimaryMasjid && (
          <button
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(12);
              } catch (_) {}
              onSetPrimaryMasjid(masjid.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
              isPrimaryMasjid
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
            }`}
          >
            {isPrimaryMasjid ? '★ My Home Masjid' : '☆ Set as Home Masjid'}
          </button>
        )}
      </div>

      {/* Masjid Header Card */}
      <div className="card-progress rounded-[22px] p-4 border border-[#C99E4C]/50 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
              {masjid.area || 'Local Congregation'}
            </span>
            <h2 className="font-serif text-[21px] font-semibold text-white mt-1 leading-snug">
              🕌 {masjid.name}
            </h2>
            <p className="text-[11.5px] text-white/85 mt-0.5">
              📍 {masjid.address}
            </p>
          </div>

          {masjid.distanceText && (
            <span className="px-2.5 py-1 rounded-xl bg-[#DFB75A] text-[#07361D] text-[11px] font-bold shrink-0">
              {masjid.distanceText}
            </span>
          )}
        </div>

        {/* Facilities Badges */}
        {Array.isArray(masjid.facilities) && masjid.facilities.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 pt-1">
            {masjid.facilities.map((fac) => (
              <span
                key={fac}
                className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-semibold border border-white/15"
              >
                ✓ {fac}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Free Live Interactive Google Map + Turn-by-Turn Navigation Card */}
      <div className="card rounded-[22px] p-3.5 space-y-3 border border-[#D5D2BE]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Live Google Map &amp; Route
            </span>
            <h3 className="font-serif text-[16.5px] font-semibold text-primary">
              🧭 Navigate to {masjid.name}
            </h3>
          </div>

          {/* Walking vs Driving Mode Selector */}
          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            <button
              type="button"
              onClick={() => setTravelMode('walking')}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition ${
                travelMode === 'walking'
                  ? 'bg-[#0D4A2E] text-white'
                  : 'text-primary'
              }`}
            >
              🚶 Walk
            </button>
            <button
              type="button"
              onClick={() => setTravelMode('driving')}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition ${
                travelMode === 'driving'
                  ? 'bg-[#0D4A2E] text-white'
                  : 'text-primary'
              }`}
            >
              🚗 Drive
            </button>
          </div>
        </div>

        {/* Embedded Interactive Google Map */}
        <div className="w-full h-52 rounded-[16px] overflow-hidden border border-[#DCD8C6] bg-[#EAE8D7] relative shadow-inner">
          <iframe
            title={`Google Map for ${masjid.name}`}
            src={freeEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* One-Tap Launch Turn-by-Turn Google Maps Navigation */}
        <a
          href={googleDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate(15);
            } catch (_) {}
          }}
          className="btn-primary w-full py-3 rounded-full text-[13px] font-bold flex items-center justify-center space-x-2 shadow-md no-underline"
        >
          <span>🗺️ Start Google Maps Turn-by-Turn Navigation</span>
          <span>↗</span>
        </a>
      </div>

      {/* Jamaat Timetable Component */}
      <JamatTimetable
        masjid={masjid}
        isAdmin={isAdmin}
        onUpdateJamatTimes={onUpdateJamatTimes}
        onSubmitChangeRequest={onSubmitChangeRequest}
      />

      {/* Sunnah Duas for Entering & Leaving the Masjid */}
      <div className="card rounded-[22px] p-4 space-y-3 border border-[#D5D2BE]">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Masjid Etiquette (Adab)
            </span>
            <h3 className="font-serif text-[16.5px] font-semibold text-primary">
              🤲 Duas for Entering &amp; Leaving
            </h3>
          </div>

          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            {LANG_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDuaLang(t.id)}
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition ${
                  duaLang === t.id
                    ? 'bg-[#0D4A2E] text-white'
                    : 'text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {MASJID_DUAS.map((item) => (
            <div
              key={item.id}
              className="rounded-[16px] bg-[#F5F2E8] p-3 border border-[#DCD8C6] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#DCE3C8] text-[#0D4A2E] text-[9px] font-bold uppercase">
                  {item.badge}
                </span>
                <span className="text-[10px] text-secondary font-medium">
                  {item.reference}
                </span>
              </div>

              <h4 className="font-serif text-[14px] font-semibold text-primary">
                {item.title}
              </h4>

              <div className="rounded-xl bg-[#0F4C2B] px-3 py-2 text-center border border-[#C99E4C]/40">
                <p
                  dir="rtl"
                  className="font-arabic text-[21px] leading-[1.65] text-[#F0D58C]"
                >
                  {item.arabic}
                </p>
              </div>

              <p
                dir={duaLang === 'ur' ? 'rtl' : 'ltr'}
                className="text-[12px] text-[#1A3826] font-medium pt-0.5"
              >
                {item[duaLang] || item.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}