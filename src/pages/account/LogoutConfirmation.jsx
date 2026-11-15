import React from 'react';

export default function LogoutConfirmation({
  isOpen = true,
  userName = 'Member',
  onConfirmLogout,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="card rounded-[20px] p-4 bg-[#E5DEC9] border border-[#c45d55]/40 space-y-3 text-center fade-in">
      <div className="w-11 h-11 rounded-full bg-[#6B2D26] text-white flex items-center justify-center mx-auto text-[18px]">
        🔒
      </div>

      <div>
        <h3 className="font-serif text-[18px] font-semibold text-[#6B2D26]">
          Sign Out of Aamaal Circle?
        </h3>
        <p className="text-[12px] text-[#4A2520] mt-1 leading-relaxed">
          Assalamu Alaikum <strong>{userName}</strong>, your local recitation logs and family profiles will remain safely stored on this device.
        </p>
      </div>

      <div className="flex items-center space-x-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate(20);
            } catch (_) {}
            if (onConfirmLogout) onConfirmLogout();
          }}
          className="flex-1 py-2.5 rounded-full bg-[#6B2D26] text-white text-[12.5px] font-semibold shadow-sm"
        >
          Yes, Sign Out
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full bg-[#F5F2E8] text-primary text-[12.5px] font-semibold border border-[#D5D2BE]"
          >
            Stay Signed In
          </button>
        )}
      </div>
    </div>
  );
}