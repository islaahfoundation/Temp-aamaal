import React, { useState } from 'react';
import {
  ScreenHeader,
  AamaalIcon,
  AAMAAL_ICON_OPTIONS,
  resolveAamaalIconKey,
  resolveAamaalStatus,
} from './adminShared';

export default function AddEditAamaal({ aamaal, onSave, onBack }) {
  const isEdit = Boolean(aamaal);

  const [name, setName] = useState(aamaal?.name || '');
  const [aamaalType, setAamaalType] = useState(
    aamaal?.type || (Number(aamaal?.target) === 1 ? 'completion' : 'count')
  );
  const [target, setTarget] = useState(aamaal ? String(aamaal.target || 1) : '');
  const [description, setDescription] = useState(aamaal?.translation || aamaal?.description || '');
  const [arabic, setArabic] = useState(aamaal?.arabic || '');
  const [iconKey, setIconKey] = useState(aamaal ? resolveAamaalIconKey(aamaal) : 'tasbih');
  const [status, setStatus] = useState(aamaal ? resolveAamaalStatus(aamaal) : 'active');

  const handleTypeSelect = (nextType) => {
    setAamaalType(nextType);
    if (nextType === 'completion') setTarget('1');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericTarget = Math.max(1, Number(target) || 1);
    if (!name.trim()) return;
    try { if (navigator.vibrate) navigator.vibrate(15); } catch (_) {}

    onSave?.({
      name: name.trim(),
      type: aamaalType,
      target: numericTarget,
      translation: description.trim(),
      description: description.trim(),
      arabic: arabic.trim(),
      iconKey,
      status,
      active: status === 'active',
    });
  };

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-8 select-none">
      <ScreenHeader title={isEdit ? 'Edit Aamaal' : 'Add New Aamaal'} onBack={onBack} />

      <form onSubmit={handleSubmit} className="px-4 pt-2 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Aamaal Name */}
          <div>
            <label className="block text-[13px] font-bold text-[#14261C] mb-1.5">
              Aamaal Name <span className="text-[#B93A32]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter aamaal name"
              className="w-full h-[46px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[14px] text-[#14261C] placeholder:text-[#969D98] focus:outline-none focus:border-[#0D4A2E]"
            />
          </div>

          {/* Aamaal Type */}
          <div>
            <label className="block text-[13px] font-bold text-[#14261C] mb-2">
              Aamaal Type <span className="text-[#B93A32]">*</span>
            </label>
            <div className="space-y-2.5">
              {[
                { id: 'count', label: 'Count based (e.g. 313 Durood)' },
                { id: 'completion', label: 'Completion based (e.g. Surah Mulk)' },
                { id: 'custom', label: 'Custom target' },
              ].map((opt) => {
                const selected = aamaalType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTypeSelect(opt.id)}
                    className="w-full flex items-center space-x-2.5 text-left"
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${selected ? 'border-[#0D4A2E]' : 'border-[#B8B4A4]'}`}>
                      {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#0D4A2E]" />}
                    </span>
                    <span className="text-[13.5px] font-medium text-[#1F3528]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Target */}
          <div>
            <label className="block text-[13px] font-bold text-[#14261C] mb-1.5">
              Daily Target <span className="text-[#B93A32]">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter target count"
              className="w-full h-[46px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[14px] text-[#14261C] placeholder:text-[#969D98] focus:outline-none focus:border-[#0D4A2E]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-bold text-[#14261C] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add instructions or details..."
              className="w-full p-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13.5px] text-[#14261C] placeholder:text-[#969D98] focus:outline-none focus:border-[#0D4A2E]"
            />
          </div>

          {/* Optional Arabic Text (RTL) */}
          <div>
            <label className="block text-[12px] font-semibold text-[#55615A] mb-1">
              Arabic Text (Optional)
            </label>
            <input
              type="text"
              dir="rtl"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              placeholder="أَسْتَغْفِرُ اللَّهَ"
              className="w-full h-[44px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] font-arabic text-[18px] text-[#0D4A2E] focus:outline-none focus:border-[#0D4A2E]"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-[13px] font-bold text-[#14261C] mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {AAMAAL_ICON_OPTIONS.map((opt) => {
                const selected = iconKey === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-label={opt.label}
                    onClick={() => setIconKey(opt.id)}
                    className={`aspect-square rounded-[14px] flex items-center justify-center transition ${
                      selected
                        ? 'bg-[#E6F1E8] border-2 border-[#0D4A2E] shadow-sm'
                        : 'bg-[#FCFBF7] border border-[#E6E2D5]'
                    }`}
                  >
                    <AamaalIcon iconKey={opt.id} className="w-6 h-6" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-[13px] font-bold text-[#14261C] mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-[46px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[14px] font-medium text-[#14261C] focus:outline-none focus:border-[#0D4A2E]"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>

        {/* Save CTA */}
        <button
          type="submit"
          className="w-full h-[50px] rounded-full bg-gradient-to-r from-[#0B462B] via-[#135B39] to-[#083B23] text-white text-[15px] font-semibold shadow-md active:scale-[0.98] transition"
        >
          {isEdit ? 'Update Aamaal' : 'Save Aamaal'}
        </button>
      </form>
    </section>
  );
}