/* Combines the full list of Circle Aamaals with AamaalAvailability 
(Pause/Resume), EditAamaal, AddAamaal, AamaalTargets, and Delete 
actions.*/

import React, { useState, useMemo } from 'react';
import {
  ScreenHeader,
  AamaalIcon,
  StatusBadge,
  resolveAamaalStatus,
} from './adminShared';
import AddEditAamaal from './AddEditAamaal';

export default function AamaalManagement({
  aamaalList = [],
  onAddAamaal,
  onUpdateAamaal,
  onDeleteAamaal,
  onBack,
}) {
  const [statusFilter, setStatusFilter] = useState('active'); // 'all' | 'active' | 'paused' | 'deleted'
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formState, setFormState] = useState(null); // null | { mode: 'add' } | { mode: 'edit', aamaal }
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const counts = useMemo(() => {
    const c = { all: aamaalList.length, active: 0, paused: 0, deleted: 0 };
    aamaalList.forEach((a) => {
      const st = resolveAamaalStatus(a);
      if (c[st] !== undefined) c[st] += 1;
    });
    return c;
  }, [aamaalList]);

  // Screen 5: Full-screen Add / Edit Aamaal
  if (formState) {
    return (
      <AddEditAamaal
        aamaal={formState.mode === 'edit' ? formState.aamaal : null}
        onSave={(payload) => {
          if (formState.mode === 'edit') {
            onUpdateAamaal?.(formState.aamaal.id, payload);
          } else {
            onAddAamaal?.({ id: `aamaal_${Date.now()}`, ...payload });
          }
          setFormState(null);
        }}
        onBack={() => setFormState(null)}
      />
    );
  }

  const filteredList = aamaalList.filter((item) => {
    if (statusFilter === 'all') return true;
    return resolveAamaalStatus(item) === statusFilter;
  });

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-24 select-none">
      <ScreenHeader
        title="Manage Aamaal"
        onBack={onBack}
        rightSlot={
          <button
            type="button"
            onClick={() => setFormState({ mode: 'add' })}
            className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[12.5px] font-semibold shadow-sm active:scale-95 transition flex items-center space-x-1"
          >
            <span className="text-[15px] leading-none">+</span>
            <span>Add</span>
          </button>
        }
      />

      <div className="px-4 flex-1 space-y-3.5">
        {/* 4-Pill Filter Bar */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'active', label: `Active (${counts.active})` },
            { id: 'paused', label: `Paused (${counts.paused})` },
            { id: 'deleted', label: `Deleted (${counts.deleted})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`py-2 px-1 rounded-full text-[11.5px] font-semibold transition truncate ${
                statusFilter === tab.id
                  ? 'bg-[#0D4A2E] text-white shadow-sm'
                  : 'bg-[#EFECE1] text-[#4E5953] border border-[#E5E1D3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Aamaal Cards */}
        <div className="space-y-2.5">
          {filteredList.length === 0 ? (
            <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] p-8 text-center text-[13px] text-[#55615A]">
              No Aamaal in this category.
            </div>
          ) : (
            filteredList.map((item) => {
              const status = resolveAamaalStatus(item);
              const isMenuOpen = openMenuId === item.id;
              const isConfirmingDel = confirmDeleteId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_10px_rgba(20,38,28,0.04)] p-4 space-y-2.5"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#F3F5EF] flex items-center justify-center shrink-0">
                      <AamaalIcon aamaal={item} className="w-7 h-7" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormState({ mode: 'edit', aamaal: item })}
                      className="flex-1 min-w-0 text-left"
                    >
                      <h3 className="text-[15px] font-bold text-[#14261C] leading-snug truncate">
                        {item.name}
                      </h3>
                      <p className="text-[12px] text-[#55615A] mt-0.5">
                        Daily target: {Number(item.target || 1).toLocaleString('en-US')}
                      </p>
                      <div className="mt-1.5">
                        <StatusBadge status={status} />
                      </div>
                    </button>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(isMenuOpen ? null : item.id);
                          setConfirmDeleteId(null);
                        }}
                        aria-label="Aamaal options"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#3C4B42] hover:bg-[#EFECE1]"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormState({ mode: 'edit', aamaal: item })}
                        aria-label="Edit Aamaal"
                        className="w-7 h-8 rounded-full flex items-center justify-center text-[#55615A]"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Quick Inline Actions */}
                  {isMenuOpen && (
                    <div className="pt-2.5 border-t border-[#EDE9DC] flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setFormState({ mode: 'edit', aamaal: item });
                          setOpenMenuId(null);
                        }}
                        className="px-3 py-1 rounded-full bg-[#EFECE1] text-[#14261C] text-[11.5px] font-semibold"
                      >
                        Edit Details
                      </button>

                      {status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateAamaal?.(item.id, { status: 'paused', active: false });
                            setOpenMenuId(null);
                          }}
                          className="px-3 py-1 rounded-full bg-[#FBF0CC] text-[#9A6B11] text-[11.5px] font-semibold"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateAamaal?.(item.id, { status: 'active', active: true });
                            setOpenMenuId(null);
                          }}
                          className="px-3 py-1 rounded-full bg-[#E0F3E5] text-[#15693B] text-[11.5px] font-semibold"
                        >
                          {status === 'deleted' ? 'Restore' : 'Resume'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="px-3 py-1 rounded-full bg-[#FBF0EE] text-[#B93A32] text-[11.5px] font-semibold"
                      >
                        {status === 'deleted' ? 'Delete Permanently' : 'Delete'}
                      </button>
                    </div>
                  )}

                  {isConfirmingDel && (
                    <div className="p-2.5 rounded-xl bg-[#FBF0EE] border border-[#E5B8B4] flex items-center justify-between gap-2">
                      <span className="text-[11.5px] font-semibold text-[#6B2D26]">
                        {status === 'deleted' ? 'Permanently delete?' : 'Move to Deleted?'}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteAamaal?.(item.id, status === 'deleted');
                            setConfirmDeleteId(null);
                            setOpenMenuId(null);
                          }}
                          className="px-3 py-1 rounded-full bg-[#B93A32] text-white text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 rounded-full bg-white text-[#14261C] text-[11px] font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}