//Displays the live inbox of recent Circle & Sunnah notifications (e.g., Thursday Salawat Reminder, Nightly Surah Al-Mulk Shield, Circle Milestone Alerts) with unread badges and one-tap inspection.

import React from 'react';

export default function NotificationCenter({
  notifications = [],
  onSelectNotification,
  onMarkAllRead,
}) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center space-x-2">
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            📬 Notification Inbox
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[9.5px] font-bold">
              {unreadCount} New
            </span>
          )}
        </div>

        {unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[11px] font-bold text-[#135332] underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card rounded-[20px] p-5 text-center">
          <p className="font-serif text-[15.5px] font-semibold text-primary">
            All Caught Up!
          </p>
          <p className="text-[11.5px] text-secondary mt-0.5">
            Your scheduled Sunnah alerts and Circle updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                onSelectNotification && onSelectNotification(item)
              }
              className={`rounded-[18px] p-3.5 border cursor-pointer transition flex items-start justify-between gap-2.5 active:scale-[0.99] ${
                !item.read
                  ? 'bg-[#F3EFE2] border-[#0D4A2E]/40 shadow-soft-card'
                  : 'bg-[#F5F2E8]/80 border-white/80'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-[16px] shrink-0 ${
                    !item.read
                      ? 'bg-[#0D4A2E] text-[#F0D58C]'
                      : 'bg-[#EAE8D7] text-primary'
                  }`}
                >
                  {item.icon || '🔔'}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                      {item.category || 'Reminder'} • {item.time}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#135332] inline-block" />
                    )}
                  </div>
                  <h4 className="font-serif text-[15px] font-semibold text-primary truncate mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] text-secondary line-clamp-1 mt-0.5">
                    {item.translation}
                  </p>
                </div>
              </div>

              <span className="text-primary font-bold text-[15px] shrink-0">
                ›
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}