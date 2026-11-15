//Renders Section 3 of Admin Panel: Circle Weekly & Monthly Totals Table (7-Day Total and 30-Day Total for every Aamaal) plus overall circle health metrics

import React from 'react';
import { getLocalDaysList } from '../aamaal/CalendarHistory';

export default function CircleStatistics({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
}) {
  const keys7 = new Set(getLocalDaysList(7).map((d) => d.dateKey));
  const keys30 = new Set(getLocalDaysList(30).map((d) => d.dateKey));

  const grandTotalAllTime = allLogs.reduce(
    (sum, l) => sum + Number(l.count || 0),
    0
  );

  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Aggregate Metrics
          </span>
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            📈 Circle Weekly &amp; Monthly Totals
          </h3>
        </div>
        <span className="badge-pill">{allMembers.length} Members</span>
      </div>

      {/* Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b-2 border-[#DCD8C6] text-secondary text-[11px] uppercase tracking-wider">
              <th className="py-2 pr-2 font-bold">Aamaal</th>
              <th className="py-2 px-2 font-bold text-right">7-Day Total</th>
              <th className="py-2 pl-2 font-bold text-right">30-Day Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DEC9]">
            {aamaalList.map((a) => {
              const logsForA = allLogs.filter((l) => l.aamaalId === a.id);
              const sum7 = logsForA
                .filter((l) => keys7.has(l.dateKey))
                .reduce((s, l) => s + Number(l.count || 0), 0);
              const sum30 = logsForA
                .filter((l) => keys30.has(l.dateKey))
                .reduce((s, l) => s + Number(l.count || 0), 0);

              return (
                <tr key={a.id} className="text-primary font-semibold">
                  <td className="py-2.5 pr-2">
                    <div>{a.name}</div>
                    <div className="text-[10px] font-normal text-secondary">
                      Target: {Number(a.target).toLocaleString('en-US')}/day
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right font-serif text-[14px] text-[#135332]">
                    {sum7.toLocaleString('en-US')}
                  </td>
                  <td className="py-2.5 pl-2 text-right font-serif text-[14px] text-primary">
                    {sum30.toLocaleString('en-US')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* All-Time Combined Banner */}
      <div className="rounded-xl bg-[#EAE8D7] px-3.5 py-2.5 flex items-center justify-between text-[12px]">
        <span className="font-semibold text-secondary">
          Cumulative All-Aamaal Recitations:
        </span>
        <strong className="font-serif text-[15px] text-primary">
          {grandTotalAllTime.toLocaleString('en-US')}
        </strong>
      </div>
    </div>
  );
}