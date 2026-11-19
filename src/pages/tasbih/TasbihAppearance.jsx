//Implements the temporary Image Button background selector (letting users pick from peaceful prayer beads & mosque wallpapers) and the Bead Material Theme selector (Olivewood & Amber, Black Onyx & Gold, Mother of Pearl, Imperial Emerald).

// src/pages/tasbih/TasbihAppearance.jsx
import React from 'react';

const BACKGROUND_WALLPAPERS = [
  {
    id: 'sanctuary',
    name: 'Madinah Sanctuary Dusk',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mosque_arch',
    name: 'Marble Archway Golden Hour',
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'minimal_cream',
    name: 'Minimal Clean Madinah Cream',
    url: '',
  },
];

export default function TasbihAppearance({
  currentBgUrl = '',
  onSelectBackground,
  onClose,
}) {
  return (
    <div className="absolute right-5 top-20 z-50 rounded-[24px] bg-[#F5F2E8] border border-[#C99E4C] shadow-2xl p-4 w-72 space-y-3 fade-in">
      <div className="flex items-center justify-between pb-1 border-b border-[#DCD8C6]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332]">
          Background Wallpaper (Temporary)
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#EAE8D7] text-primary font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {BACKGROUND_WALLPAPERS.map((bg) => {
          const isSelected = currentBgUrl === bg.url;
          return (
            <button
              key={bg.id}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(8);
                } catch (_) {}
                if (onSelectBackground) onSelectBackground(bg.url);
              }}
              className={`h-14 rounded-xl overflow-hidden border-2 relative transition ${
                isSelected
                  ? 'border-[#0D4A2E] ring-2 ring-[#C99E4C]'
                  : 'border-[#DCD8C6]'
              }`}
            >
              {bg.url ? (
                <img
                  src={bg.url}
                  alt={bg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F5F2E8] flex items-center justify-center text-[10.5px] font-bold text-[#0D4A2E]">
                  Clean
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}