import React, { useState } from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';
import { getLocalDateString, formatAnyDatePretty } from '../aamaal/DateSelector';

export default function FamilyMemberAamaal({
  member,
  aamaalList = DEFAULT_AAMAAL_LIST,
  allLogs = [],
  onUpdateMemberLog,
}) {
  const todayLocal = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [editingAamaalId, setEditingAamaalId] = useState(null);
  const [customCountInput, setCustomCountInput] = useState('');

  if (!member) return null;

  const friendlyDate =
    selectedDate === todayLocal ? 'Today' : formatAnyDatePretty(selectedDate);

  const getLoggedCount = (aamaalId) => {
    const entry = allLogs.find(
      (l) =>
        l.memberId === member.id &&
        l.aamaalId === aamaalId &&
        l.dateKey === selectedDate
    );
    return entry ? Number(entry.count || 0) : 0;
  };

  const handleQuickMark = (aamaal) => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    if (onUpdateMemberLog) {
      onUpdateMemberLog(member.id, aamaal.id, selectedDate, Number(aamaal.target || 1));
    }
  };

  const handleSaveCustom = (aamaalId) => {
    const val = Number(customCountInput);
    if (isNaN(val) || val < 0) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    if (onUpdateMemberLog) {
      onUpdateMemberLog(member.id, aamaalId, selectedDate, val);
    }
    setEditingAamaalId(null);
    setCustomCountInput('');
  };

  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Log For {member.name}
          </span>
          <h3 className="font-serif text-[16.5px] font-semibold text-primary">
            Daily Aamaal Tracker ({friendlyDate})
          </h3>
        </div>

        <div className="flex items-center space-x-1.5">
          <input
            type="date"
            value={selectedDate}
            max={todayLocal}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(e.target.value);
            }}
            className="w-auto px-2.5 py-1 rounded-lg bg-[#F5F2E8] border border-[#D5D2BE] text-primary text-[11px] font-semibold"
          />
          {selectedDate !== todayLocal && (
            <button
              type="button"
              onClick={() => setSelectedDate(todayLocal)}
              className="px-2 py-1 rounded-lg bg-[#EAE8D7] text-primary text-[10.5px] font-bold"
            >
              Today
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {aamaalList.map((aamaal) => {
          const count = getLoggedCount(aamaal.id);
          const isDone = count > 0;
          const isEditing = editingAamaalId === aamaal.id;

          return (
            <div
              key={aamaal.id}
              className={`rounded-[16px] p-3 border transition ${
                isDone
                  ? 'bg-[#0F4C2B] text-white border-[#C99E4C]/55'
                  : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4
                    className={`font-serif text-[14.5px] font-semibold ${
                      isDone ? 'text-white' : 'text-primary'
                    }`}
                  >
                    {aamaal.name}
                  </h4>
                  <p
                    className={`text-[11px] ${
                      isDone ? 'text-[#F0D58C]' : 'text-secondary'
                    }`}
                  >
                    {isDone
                      ? `✓ Logged: ${count.toLocaleString('en-US')} (Target: ${aamaal.target})`
                      : `Daily Target: ${aamaal.target.toLocaleString('en-US')}`}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {!isDone ? (
                    <button
                      type="button"
                      onClick={() => handleQuickMark(aamaal)}
                      className="px-3 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold shadow-sm"
                    >
                      ✓ Mark ({aamaal.target})
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditing) {
                            setEditingAamaalId(null);
                          } else {
                            setEditingAamaalId(aamaal.id);
                            setCustomCountInput(String(count));
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[11px] font-semibold"
                      >
                        {isEditing ? 'Close' : 'Edit'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateMemberLog &&
                          onUpdateMemberLog(member.id, aamaal.id, selectedDate, 0)
                        }
                        className="px-2.5 py-1 rounded-full bg-[#6B2D26]/70 text-[#fecaca] text-[11px] font-semibold"
                      >
                        Undo
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-2.5 pt-2.5 border-t border-white/15 flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={customCountInput}
                    onChange={(e) => setCustomCountInput(e.target.value)}
                    placeholder="Enter count"
                    className="flex-1 bg-[#F5F2E8] text-primary text-[12.5px] font-semibold py-1.5 px-2.5 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveCustom(aamaal.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#DFB75A] text-[#07361D] text-[12px] font-bold"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}