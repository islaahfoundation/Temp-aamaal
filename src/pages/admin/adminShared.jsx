import React from 'react';

export const STORAGE_KEYS = {
  AAMAAL: 'aamaal_circle_catalog_v1',
  LOGS: 'aamaal_circle_logs_v1',
  PROFILES: 'aamaal_circle_profiles_v1',
  BROADCASTS: 'aamaal_broadcast_alerts_v1',
  JAMAAT_REQUESTS: 'aamaal_jamaat_change_requests_v1',
  MASJIDS: 'aamaal_masjids_directory_v1',
  SETTINGS: 'aamaal_circle_admin_settings_v1',
};

export const DEFAULT_CIRCLE_SETTINGS = {
  circleName: "Islaah Foundation's Aamaal Circle",
  tagline: 'Live with Purpose',
  shareUrl: 'https://islaahfoundation.github.io/aamaal-circle/',
  allowFamilyProfiles: true,
  defaultPrivacy: 'public',
  notifyNewMember: true,
  notifyJamaatRequests: true,
  notifyBroadcasts: true,
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const AAMAAL_ICON_OPTIONS = [
  { id: 'tasbih', label: 'Tasbih' },
  { id: 'quran', label: 'Quran' },
  { id: 'dua', label: 'Dua' },
  { id: 'mosque', label: 'Mosque' },
  { id: 'leaf', label: 'Leaf' },
  { id: 'star', label: 'Star' },
];

export function resolveAamaalStatus(item) {
  if (item?.status) return item.status; // 'active' | 'paused' | 'deleted'
  return item?.active === false ? 'paused' : 'active';
}

export function resolveAamaalIconKey(aamaal) {
  if (aamaal?.iconKey) return aamaal.iconKey;
  const name = (aamaal?.name || '').toLowerCase();
  if (name.includes('durood') || name.includes('salawat') || name.includes('tasbih')) return 'tasbih';
  if (name.includes('mulk') || name.includes('surah') || name.includes('quran') || name.includes('yaseen')) return 'quran';
  if (name.includes('istighfar') || name.includes('astaghfar') || name.includes('dua')) return 'dua';
  if (name.includes('salah') || name.includes('fajr') || name.includes('evening') || name.includes('masjid')) return 'mosque';
  if (name.includes('morning')) return 'leaf';
  return 'star';
}

export function AamaalIcon({ aamaal, iconKey, className = 'w-6 h-6' }) {
  const key = iconKey || resolveAamaalIconKey(aamaal);

  if (key === 'tasbih') {
    return (
      <svg className={`${className} text-[#0D4A2E]`} viewBox="0 0 28 28" fill="currentColor">
        <circle cx="14" cy="4.5" r="2.1" />
        <circle cx="19.2" cy="6.8" r="2.1" />
        <circle cx="21.5" cy="12" r="2.1" />
        <circle cx="19.5" cy="17.2" r="2.1" />
        <circle cx="15" cy="20" r="2.1" />
        <circle cx="10.2" cy="19.2" r="2.1" />
        <circle cx="6.8" cy="15.2" r="2.1" />
        <circle cx="6.5" cy="10" r="2.1" />
        <circle cx="9.5" cy="6" r="2.1" />
        <path d="M13 21.5h2v4l-1-1-1 1v-4z" />
      </svg>
    );
  }
  if (key === 'quran') {
    return (
      <svg className={`${className} text-[#0D4A2E]`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H11v16H4.5A2.5 2.5 0 0 1 2 16.5v-11zm11-2.5h6.5A2.5 2.5 0 0 1 22 5.5v11a2.5 2.5 0 0 1-2.5 2.5H13V3z" />
      </svg>
    );
  }
  if (key === 'dua') {
    return (
      <svg className={`${className} text-[#C99E4C]`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.5 4.5c.8 0 1.5.7 1.5 1.5v7.5H7.2c-1.1 0-2-.9-2-2V7.2c0-.7.6-1.2 1.2-1.2.4 0 .8.2 1 .5V6c0-.8.7-1.5 1.5-1.5h.6zm5 0c.8 0 1.5.7 1.5 1.5v.5c.2-.3.6-.5 1-.5.6 0 1.2.5 1.2 1.2v4.3c0 1.1-.9 2-2 2H13V6c0-.8.7-1.5 1.5-1.5zM6 15h12l-1.2 4.2c-.2.5-.7.8-1.2.8H8.4c-.5 0-1-.3-1.2-.8L6 15z" />
      </svg>
    );
  }
  if (key === 'mosque') {
    return (
      <svg className={`${className} text-[#0D4A2E]`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5c-.6 0-1 .5-1 1v1.2C8.3 5.5 6.5 7.9 6.5 10.5V12h11v-1.5c0-2.6-1.8-5-4.5-5.8V3.5c0-.5-.4-1-1-1zM5 13.5V20h4.5v-3.5a2.5 2.5 0 0 1 5 0V20H19v-6.5H5z" />
      </svg>
    );
  }
  if (key === 'leaf') {
    return (
      <svg className={`${className} text-[#1A7A49]`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 4.5C13 4.5 7.5 8 5.5 14.5c-.5 1.6-.7 3.2-.7 4.8l1.8.2c.2-1.7.7-3.4 1.6-4.9 1.6 1 3.7 1.4 5.9.9 3.6-.8 6-4.2 5.4-11z" />
      </svg>
    );
  }
  return (
    <svg className={`${className} text-[#E3A82B]`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />
    </svg>
  );
}

export function MemberAvatar({ member, size = 'md' }) {
  const sizes = {
    sm: 'w-9 h-9 text-[13px]',
    md: 'w-10 h-10 text-[15px]',
    lg: 'w-11 h-11 text-[16px]',
    xl: 'w-[72px] h-[72px] text-[26px]',
  };
  const cls = sizes[size] || sizes.md;
  if (member?.avatar) {
    return (
      <img
        src={member.avatar}
        alt={member.name || 'Member'}
        className={`${cls} rounded-full object-cover bg-[#DCE5DD] border border-[#C6D5C8] shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${cls} rounded-full bg-[#DCE8DF] border border-[#C6D5C8] flex items-center justify-center font-serif font-bold text-[#0D4A2E] shrink-0`}
    >
      {(member?.name || 'M').trim()[0]?.toUpperCase()}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', cls: 'bg-[#E0F3E5] text-[#15693B]' },
    private: { label: 'Private', cls: 'bg-[#EDE5F8] text-[#5B3E96]' },
    paused: { label: 'Paused', cls: 'bg-[#FBF0CC] text-[#9A6B11]' },
    inactive: { label: 'Inactive', cls: 'bg-[#EAE8E1] text-[#666C68]' },
    deleted: { label: 'Deleted', cls: 'bg-[#EAE8E1] text-[#666C68]' },
  };
  const badge = map[status] || map.inactive;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${badge.cls}`}>
      {badge.label}
    </span>
  );
}

export function ScreenHeader({ title, onBack, rightSlot }) {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F5EE]/95 backdrop-blur-md px-4 pt-3.5 pb-2.5 flex items-center justify-between gap-2 shrink-0">
      <div className="flex items-center space-x-2.5 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go Back"
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h2 className="font-serif text-[22px] font-bold text-[#14261C] leading-none truncate">
          {title}
        </h2>
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </header>
  );
}

export function MonthSwitcher({ year, month, onShift, compact = false }) {
  return (
    <div
      className={`${
        compact ? 'max-w-[270px] mx-auto rounded-full px-3 py-2' : 'w-full rounded-[16px] px-4 py-2.5'
      } bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] flex items-center justify-between`}
    >
      <button
        type="button"
        onClick={() => onShift(-1)}
        aria-label="Previous Month"
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#14261C] hover:bg-[#EAE8D7] active:scale-90 transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span className="text-[14.5px] font-bold text-[#14261C] tracking-tight">
        {MONTH_NAMES[month]} {year}
      </span>
      <button
        type="button"
        onClick={() => onShift(1)}
        aria-label="Next Month"
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#14261C] hover:bg-[#EAE8D7] active:scale-90 transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Recently';
  const diffMs = Math.max(0, Date.now() - Number(timestamp));
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function downloadCsv(rows, filename) {
  const csvContent = rows
    .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}