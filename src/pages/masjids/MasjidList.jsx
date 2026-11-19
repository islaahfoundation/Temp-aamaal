/*Renders the complete Masjid directory with:

Live GPS "Find Nearest Masjids" button (navigator.geolocation + Haversine distance calculation in km)

"🔍 Explore All Nearby Masjids on Google Maps" overview map iframe

"+ Add Local Masjid" form so users can add their neighborhood Masjid with its address and Jamaat times

One-tap "🧭 Navigate" button on every Masjid card + click-to-open MasjidDetails.jsx*/

import React, { useState, useEffect } from 'react';
import MasjidDetails from './MasjidDetails';

const MASJIDS_STORAGE_KEY = 'aamaal_masjids_directory_v1';
const PRIMARY_MASJID_KEY = 'aamaal_primary_masjid_id_v1';
const JAMAAT_REQUESTS_KEY = 'aamaal_jamaat_change_requests_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';

export const DEFAULT_MASJIDS = [
  {
    id: 'jama-masjid-mumbai',
    name: 'Jama Masjid Mumbai',
    area: 'Kalbadevi / Crawford Market, Mumbai',
    address: 'Sheikh Memon St, Zaveri Bazaar, Kalbadevi, Mumbai, Maharashtra 400002',
    lat: 18.9476,
    lng: 72.8332,
    facilities: ['Wudu Khana', 'Jumu’ah Khutbah', '24/7 Access', 'Library'],
    timings: {
      fajr: { azan: '05:20 AM', jamat: '05:45 AM' },
      dhuhr: { azan: '12:35 PM', jamat: '01:15 PM' },
      asr: { azan: '04:10 PM', jamat: '04:35 PM' },
      maghrib: { azan: '06:04 PM', jamat: '06:09 PM' },
      isha: { azan: '07:45 PM', jamat: '08:15 PM' },
      jumuah: { azan: '12:45 PM', jamat: '01:30 PM' },
    },
  },
  {
    id: 'minara-masjid-mumbai',
    name: 'Minara Masjid',
    area: 'Mohammed Ali Road, Mumbai',
    address: 'Ibrahim Merchant Rd, Mandvi, Mumbai, Maharashtra 400003',
    lat: 18.9539,
    lng: 72.8371,
    facilities: ['Wudu Khana', 'Jumu’ah Congregation', 'Wheelchair Ramp'],
    timings: {
      fajr: { azan: '05:18 AM', jamat: '05:40 AM' },
      dhuhr: { azan: '12:30 PM', jamat: '01:15 PM' },
      asr: { azan: '04:05 PM', jamat: '04:30 PM' },
      maghrib: { azan: '06:04 PM', jamat: '06:08 PM' },
      isha: { azan: '07:40 PM', jamat: '08:10 PM' },
      jumuah: { azan: '12:40 PM', jamat: '01:25 PM' },
    },
  },
  {
    id: 'haji-ali-masjid',
    name: 'Haji Ali Dargah Masjid',
    area: 'Worli Coast, Mumbai',
    address: 'Dargah Rd, Haji Ali, Mumbai, Maharashtra 400026',
    lat: 18.9827,
    lng: 72.8089,
    facilities: ['Wudu Khana', 'Ladies Prayer Area', 'Seafront Walkway'],
    timings: {
      fajr: { azan: '05:22 AM', jamat: '05:45 AM' },
      dhuhr: { azan: '12:35 PM', jamat: '01:20 PM' },
      asr: { azan: '04:10 PM', jamat: '04:35 PM' },
      maghrib: { azan: '06:05 PM', jamat: '06:10 PM' },
      isha: { azan: '07:45 PM', jamat: '08:15 PM' },
      jumuah: { azan: '12:50 PM', jamat: '01:35 PM' },
    },
  },
  {
    id: 'masjid-e-noor',
    name: 'Masjid-e-Noor (Community Markaz)',
    area: 'Bandra West, Mumbai',
    address: 'SV Road, Bandra West, Mumbai, Maharashtra 400050',
    lat: 19.0544,
    lng: 72.8406,
    facilities: ['Wudu Khana', 'Parking', 'Evening Halqah'],
    timings: {
      fajr: { azan: '05:20 AM', jamat: '05:45 AM' },
      dhuhr: { azan: '12:30 PM', jamat: '01:10 PM' },
      asr: { azan: '04:05 PM', jamat: '04:30 PM' },
      maghrib: { azan: '06:04 PM', jamat: '06:09 PM' },
      isha: { azan: '07:40 PM', jamat: '08:10 PM' },
      jumuah: { azan: '12:45 PM', jamat: '01:30 PM' },
    },
  },
];

// Haversine formula to calculate distance in km between user GPS and Masjid
function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function checkIsAdmin() {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || '[]');
    if (Array.isArray(profiles) && profiles.length > 0) {
      const primary = profiles.find((p) => p.isPrimary) || profiles[0];
      return primary?.role === 'admin';
    }
  } catch (_) {}
  return false;
}

export default function MasjidList({
  onShowToast,
  onBack,
}) {
  const isAdmin = checkIsAdmin();

  const [masjids, setMasjids] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MASJIDS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return DEFAULT_MASJIDS;
  });

  const [primaryMasjidId, setPrimaryMasjidId] = useState(() => {
    return localStorage.getItem(PRIMARY_MASJID_KEY) || DEFAULT_MASJIDS[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMasjidId, setSelectedMasjidId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Near Me GPS Area Filter State
  const [userCoords, setUserCoords] = useState(null);
  const [nearMeActive, setNearMeActive] = useState(false);
  const [locating, setLocating] = useState(false);

  // New Masjid Form State
  const [newName, setNewName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(MASJIDS_STORAGE_KEY, JSON.stringify(masjids));
    } catch (_) {}
  }, [masjids]);

  const handleToggleNearMe = () => {
    if (nearMeActive) {
      setNearMeActive(false);
      if (onShowToast) onShowToast('Showing all Masjids');
      return;
    }

    if (!navigator.geolocation) {
      if (onShowToast) onShowToast('Geolocation not supported on this device');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setNearMeActive(true);
        setLocating(false);
        if (onShowToast) {
          onShowToast('📍 Filtered Masjids near your current area (within 15 km)');
        }
      },
      () => {
        setLocating(false);
        if (onShowToast) {
          onShowToast('Please allow location access to filter Masjids near you');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleAddMasjid = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const created = {
      id: `masjid_${Date.now()}`,
      name: newName.trim(),
      area: newArea.trim() || 'Local Area',
      address: newAddress.trim(),
      lat: userCoords?.lat || null,
      lng: userCoords?.lng || null,
      facilities: ['Wudu Khana', 'Daily Jamaat'],
      timings: DEFAULT_MASJIDS[0].timings,
    };

    setMasjids((prev) => [created, ...prev]);
    setNewName('');
    setNewArea('');
    setNewAddress('');
    setShowAddForm(false);
    setSelectedMasjidId(created.id);
    if (onShowToast) onShowToast(`Added ${created.name} to directory`);
  };

  const handleUpdateJamatTimes = (masjidId, newTimings) => {
    if (!isAdmin) return;
    setMasjids((prev) =>
      prev.map((m) => (m.id === masjidId ? { ...m, timings: newTimings } : m))
    );
    if (onShowToast) onShowToast('Jamaat timings updated');
  };

  const handleSubmitChangeRequest = (requestPayload) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(JAMAAT_REQUESTS_KEY) || '[]'
      );
      const next = [requestPayload, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem(JAMAAT_REQUESTS_KEY, JSON.stringify(next));
    } catch (_) {}
    if (onShowToast) {
      onShowToast('✓ Jamaat change request & clock photo sent to Admin for review!');
    }
  };

  const handleSetPrimary = (id) => {
    setPrimaryMasjidId(id);
    localStorage.setItem(PRIMARY_MASJID_KEY, id);
    if (onShowToast) onShowToast('Set as your Home Masjid');
  };

  // Enrich with live distance if userCoords available
  const enrichedMasjids = masjids
    .map((m) => {
      const distKm =
        userCoords && m.lat && m.lng
          ? getDistanceKm(userCoords.lat, userCoords.lng, m.lat, m.lng)
          : null;
      return {
        ...m,
        distanceKm: distKm,
        distanceText: distKm !== null ? `${distKm.toFixed(1)} km` : null,
      };
    })
    .sort((a, b) => {
      if (nearMeActive && a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.id === primaryMasjidId) return -1;
      if (b.id === primaryMasjidId) return 1;
      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });

  const selectedMasjid = enrichedMasjids.find(
    (m) => m.id === selectedMasjidId
  );

  if (selectedMasjid) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <MasjidDetails
          masjid={selectedMasjid}
          userCoords={userCoords}
          isAdmin={isAdmin}
          isPrimaryMasjid={selectedMasjid.id === primaryMasjidId}
          onSetPrimaryMasjid={handleSetPrimary}
          onUpdateJamatTimes={handleUpdateJamatTimes}
          onSubmitChangeRequest={handleSubmitChangeRequest}
          onBack={() => setSelectedMasjidId(null)}
        />
      </section>
    );
  }

  // Filter by Search Query AND Near Me Area Radius (15 km)
  const filteredMasjids = enrichedMasjids.filter((m) => {
    if (nearMeActive && userCoords) {
      if (m.distanceKm === null || m.distanceKm > 15) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.area || '').toLowerCase().includes(q) ||
      (m.address || '').toLowerCase().includes(q)
    );
  });

  // 6a: Only show Live Map when user searches and no Masjid is found in the list
  const showFallbackLiveMap =
    Boolean(searchQuery.trim()) && filteredMasjids.length === 0;

  const fallbackMapQuery = encodeURIComponent(
    `Masjid ${searchQuery.trim()}`
  );

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary px-3 py-1 text-[11.5px]"
            >
              ‹ Back
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Congregation &amp; Directions
            </span>
            <h2 className="font-serif text-[23px] font-semibold text-primary leading-tight">
              Nearby Masjids
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold shadow-sm"
        >
          {showAddForm ? 'Close' : '+ Add Masjid'}
        </button>
      </div>

      {/* Search + GPS Near Me Area Filter Bar */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Masjid or area..."
          className="flex-1 py-2.5 px-3.5 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] text-primary text-[12.5px] font-medium shadow-soft-card"
        />

        <button
          type="button"
          onClick={handleToggleNearMe}
          className={`px-3.5 py-2.5 rounded-full text-[11.5px] font-bold shrink-0 border transition ${
            nearMeActive
              ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
              : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
          }`}
        >
          {locating
            ? 'Locating...'
            : nearMeActive
            ? '📍 Near Me ✓'
            : '📍 Near Me'}
        </button>
      </div>

      {/* Add Any Custom Local Masjid Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddMasjid}
          className="card rounded-[20px] p-4 space-y-3 bg-[#EAE8D7] border border-[#0D4A2E]/30 fade-in"
        >
          <span className="badge-pill">Add to Directory</span>
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            + Add Your Neighborhood Masjid
          </h3>

          <div>
            <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
              Masjid Name
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Masjid-e-Aqsa"
              className="bg-[#F5F2E8] text-[12.5px] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
              Neighborhood / Area
            </label>
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="e.g., Andheri West, Mumbai"
              className="bg-[#F5F2E8] text-[12.5px]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
              Full Address or Landmark
            </label>
            <input
              type="text"
              required
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Street, Landmark, City, Pin Code"
              className="bg-[#F5F2E8] text-[12.5px]"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-[12.5px] font-semibold"
          >
            Save Masjid &amp; Open Map
          </button>
        </form>
      )}

      {/* 6a: Live Google Map ONLY appears if search yields 0 directory results */}
      {showFallbackLiveMap && (
        <div className="card rounded-[22px] p-4 bg-[#F3EFE2] border border-[#C99E4C]/50 space-y-3 fade-in">
          <div>
            <span className="badge-pill">Live Google Maps Search</span>
            <h3 className="font-serif text-[17px] font-semibold text-primary mt-1">
              &ldquo;{searchQuery}&rdquo; not in directory yet
            </h3>
            <p className="text-[11.5px] text-secondary mt-0.5">
              Here is the live Google Map result for your search:
            </p>
          </div>

          <div className="w-full h-52 rounded-[14px] overflow-hidden border border-[#DCD8C6]">
            <iframe
              title="Search Masjid on Google Maps"
              src={`https://maps.google.com/maps?q=${fallbackMapQuery}&t=m&z=14&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setNewName(searchQuery.trim());
              setShowAddForm(true);
            }}
            className="btn-primary w-full py-2.5 text-[12px] font-semibold"
          >
            + Add &ldquo;{searchQuery.trim()}&rdquo; to Directory
          </button>
        </div>
      )}

      {/* Empty state if Near Me found nothing within 15 km */}
      {nearMeActive && !searchQuery.trim() && filteredMasjids.length === 0 && (
        <div className="card rounded-[20px] p-5 text-center space-y-2">
          <p className="font-serif text-[16px] font-semibold text-primary">
            No Masjids Found Within 15 km
          </p>
          <p className="text-[11.5px] text-secondary">
            Try searching for your area name above or add your local Masjid.
          </p>
          <button
            type="button"
            onClick={() => setNearMeActive(false)}
            className="btn-secondary px-4 py-1.5 text-[11.5px] font-semibold"
          >
            Show All Masjids
          </button>
        </div>
      )}

      {/* Masjid Cards List */}
      <div className="space-y-2.5">
        {filteredMasjids.map((m) => {
          const isPrimary = m.id === primaryMasjidId;
          const destParam =
            m.lat && m.lng
              ? `${m.lat},${m.lng}`
              : encodeURIComponent(`${m.name}, ${m.address}`);
          const quickNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${destParam}&travelmode=walking`;

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMasjidId(m.id)}
              className={`card rounded-[20px] p-4 cursor-pointer active:scale-[0.99] transition space-y-2.5 ${
                isPrimary
                  ? 'border-2 border-[#0D4A2E] bg-[#F3EFE2]'
                  : 'bg-[#F5F2E8]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    {isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[9px] font-bold uppercase">
                        ★ Home Masjid
                      </span>
                    )}
                    <span className="text-[10.5px] font-bold text-gold truncate">
                      {m.area}
                    </span>
                  </div>
                  <h3 className="font-serif text-[17px] font-semibold text-primary mt-0.5 truncate">
                    🕌 {m.name}
                  </h3>
                  <p className="text-[11.5px] text-secondary line-clamp-1 mt-0.5">
                    📍 {m.address}
                  </p>
                </div>

                {m.distanceText && (
                  <span className="px-2.5 py-1 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[10.5px] font-bold shrink-0">
                    {m.distanceText}
                  </span>
                )}
              </div>

              {/* Quick Jamaat Preview Pills */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <div className="rounded-xl bg-[#EAE8D7] px-2.5 py-1.5 text-center">
                  <span className="text-[9.5px] text-secondary block">Fajr</span>
                  <strong className="text-[11.5px] text-primary">
                    {m.timings?.fajr?.jamat || '05:45 AM'}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#EAE8D7] px-2.5 py-1.5 text-center">
                  <span className="text-[9.5px] text-secondary block">Maghrib</span>
                  <strong className="text-[11.5px] text-primary">
                    {m.timings?.maghrib?.jamat || '06:09 PM'}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#EAE8D7] px-2.5 py-1.5 text-center">
                  <span className="text-[9.5px] text-secondary block">Isha</span>
                  <strong className="text-[11.5px] text-primary">
                    {m.timings?.isha?.jamat || '08:15 PM'}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMasjidId(m.id);
                  }}
                  className="flex-1 py-2 rounded-full bg-[#EAE8D7] text-primary text-[11.5px] font-bold border border-[#D5D2BE]"
                >
                  🗺️ Map &amp; Jamaat Times ›
                </button>

                <a
                  href={quickNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11.5px] font-bold no-underline shrink-0 shadow-sm"
                >
                  🧭 Navigate ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}