import React from 'react';

export default function DailyHistory({
  aamaalName = 'Durood Shareef',
  weekTotal = 0,
  todayTotal = 0,
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-3.5">
      <div className="card-soft rounded-[20px] p-3.5 border border-[#C9CDAC]/80 bg-gradient-to-br from-[#EAE8D7] to-[#DFDEC9]">
        <p className="text-[11px] font-semibold text-secondary">
          Recited by you this week
        </p>
        <p className="font-serif text-[25px] font-bold text-primary leading-tight my-1">
          {Number(weekTotal).toLocaleString('en-US')}
        </p>
        <p className="text-[11px] font-medium text-[#135332] truncate">
          {aamaalName}
        </p>
      </div>

      <div className="card-soft rounded-[20px] p-3.5 border border-[#C9CDAC]/80 bg-gradient-to-br from-[#EAE8D7] to-[#DFDEC9]">
        <p className="text-[11px] font-semibold text-secondary">
          Recited by you today
        </p>
        <p className="font-serif text-[25px] font-bold text-primary leading-tight my-1">
          {Number(todayTotal).toLocaleString('en-US')}
        </p>
        <p className="text-[11px] font-medium text-[#135332] truncate">
          {aamaalName}
        </p>
      </div>
    </div>
  );
}