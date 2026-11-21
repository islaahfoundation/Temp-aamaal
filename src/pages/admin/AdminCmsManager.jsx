//Supports Add, Edit, and Delete for Duas, Feelings, Learning, Masjids & Jamaat Timetables, Quiz, and Stories, styled to match your 10-screen design.

import React, { useState, useEffect, useCallback } from 'react';
import { ScreenHeader, StatusBadge } from './adminShared';
import { cmsDb, powerSyncDb, isCloudConfigured } from '../../lib/powersync';

const MODULES = [
  { id: 'duas', label: 'Duas', icon: '🤲' },
  { id: 'feelings', label: 'Feelings', icon: '🌿' },
  { id: 'learning', label: 'Learning', icon: '🎓' },
  { id: 'masjids', label: 'Masjids & Jamaat', icon: '🕌' },
  { id: 'quiz', label: 'Quiz', icon: '❓' },
  { id: 'stories', label: 'Stories', icon: '📖' },
];

const PRAYER_SLOTS = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
  { key: 'jumuah', label: 'Jumuah' },
];

const DEFAULT_TIMINGS = {
  fajr: { azan: '05:20 AM', jamat: '05:45 AM' },
  dhuhr: { azan: '12:35 PM', jamat: '01:15 PM' },
  asr: { azan: '04:10 PM', jamat: '04:35 PM' },
  maghrib: { azan: '06:04 PM', jamat: '06:09 PM' },
  isha: { azan: '07:45 PM', jamat: '08:15 PM' },
  jumuah: { azan: '12:45 PM', jamat: '01:30 PM' },
};

function createEmptyForm(module) {
  if (module === 'masjids') {
    return {
      id: null,
      name: '',
      area: '',
      address: '',
      facilitiesText: 'Wudu Khana, Daily Jamaat',
      timings: JSON.parse(JSON.stringify(DEFAULT_TIMINGS)),
      status: 'active',
    };
  }
  return {
    id: null,
    module,
    title: '',
    category: '',
    arabic: '',
    translation: '',
    content: '',
    reference: '',
    status: 'active',
    // Module-specific metadata fields
    keywordsText: '',
    sunnahStory: '',
    repeatCount: 1,
    options: ['', '', '', ''],
    correctIndex: 0,
  };
}

export default function AdminCmsManager({ onShowToast, onBack }) {
  const [activeModule, setActiveModule] = useState('duas');
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState(isCloudConfigured ? 'syncing' : 'local');
  const [editorForm, setEditorForm] = useState(null); // null = list view, object = add/edit screen
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        activeModule === 'masjids'
          ? await cmsDb.listMasjids()
          : await cmsDb.listItems(activeModule);
      setEntries(data);
    } catch (err) {
      console.error('CMS load error:', err);
      onShowToast?.('Failed to read local SQLite database');
    } finally {
      setLoading(false);
    }
  }, [activeModule, onShowToast]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Listen to PowerSync connection status for live badge + auto-refresh when cloud sync arrives
  useEffect(() => {
    if (!isCloudConfigured) {
      setSyncState('local');
      return;
    }
    const dispose = powerSyncDb.registerListener({
      statusChanged: (status) => {
        if (status.dataFlowStatus?.uploading || status.dataFlowStatus?.downloading) {
          setSyncState('syncing');
        } else if (status.connected) {
          setSyncState('synced');
          loadEntries();
        } else {
          setSyncState('offline');
        }
      },
    });
    return () => dispose?.();
  }, [loadEntries]);

  const openEditForm = (entry) => {
    if (activeModule === 'masjids') {
      setEditorForm({
        id: entry.id,
        name: entry.name || '',
        area: entry.area || '',
        address: entry.address || '',
        facilitiesText: Array.isArray(entry.facilities) ? entry.facilities.join(', ') : '',
        timings: { ...DEFAULT_TIMINGS, ...(entry.timings || {}) },
        status: entry.status || 'active',
      });
    } else {
      const meta = entry.metadata || {};
      setEditorForm({
        id: entry.id,
        module: activeModule,
        title: entry.title || '',
        category: entry.category || '',
        arabic: entry.arabic || '',
        translation: entry.translation || '',
        content: entry.content || '',
        reference: entry.reference || '',
        status: entry.status || 'active',
        keywordsText: Array.isArray(meta.keywords) ? meta.keywords.join(', ') : '',
        sunnahStory: meta.sunnahStory || '',
        repeatCount: meta.repeatCount || 1,
        options: Array.isArray(meta.options) && meta.options.length === 4 ? meta.options : ['', '', '', ''],
        correctIndex: Number(meta.correctIndex || 0),
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editorForm) return;
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}

    try {
      if (activeModule === 'masjids') {
        if (!editorForm.name.trim()) return;
        await cmsDb.saveMasjid({
          id: editorForm.id,
          name: editorForm.name.trim(),
          area: editorForm.area.trim(),
          address: editorForm.address.trim(),
          facilities: editorForm.facilitiesText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          timings: editorForm.timings,
          status: editorForm.status,
        });
      } else {
        if (!editorForm.title.trim()) return;
        const metadata = {};
        if (activeModule === 'feelings') {
          metadata.keywords = editorForm.keywordsText
            .split(',')
            .map((k) => k.trim().toLowerCase())
            .filter(Boolean);
          metadata.sunnahStory = editorForm.sunnahStory.trim();
        } else if (activeModule === 'duas') {
          metadata.repeatCount = Math.max(1, Number(editorForm.repeatCount) || 1);
        } else if (activeModule === 'quiz') {
          metadata.options = editorForm.options.map((o) => o.trim());
          metadata.correctIndex = editorForm.correctIndex;
        }

        await cmsDb.saveItem({
          id: editorForm.id,
          module: activeModule,
          title: editorForm.title.trim(),
          category: editorForm.category.trim(),
          arabic: editorForm.arabic.trim(),
          translation: editorForm.translation.trim(),
          content: editorForm.content.trim(),
          reference: editorForm.reference.trim(),
          metadata,
          status: editorForm.status,
        });
      }

      const wasEdit = Boolean(editorForm.id);
      setEditorForm(null);
      await loadEntries();
      onShowToast?.(
        wasEdit
          ? 'Updated locally — syncing to Supabase'
          : 'Saved locally — syncing to Supabase'
      );
    } catch (err) {
      console.error('CMS save error:', err);
      onShowToast?.('Failed to save entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      if (activeModule === 'masjids') await cmsDb.deleteMasjid(id);
      else await cmsDb.deleteItem(id);
      setConfirmDeleteId(null);
      await loadEntries();
      onShowToast?.('Deleted — syncing to Supabase');
    } catch (err) {
      console.error('CMS delete error:', err);
      onShowToast?.('Failed to delete entry');
    }
  };

  const updateTimingSlot = (prayerKey, field, value) => {
    setEditorForm((prev) => ({
      ...prev,
      timings: {
        ...prev.timings,
        [prayerKey]: { ...(prev.timings[prayerKey] || {}), [field]: value },
      },
    }));
  };

  const syncBadge = {
    synced: { label: 'Synced', cls: 'bg-[#E0F3E5] text-[#15693B]' },
    syncing: { label: 'Syncing...', cls: 'bg-[#FBF0CC] text-[#9A6B11]' },
    offline: { label: 'Offline (Queued)', cls: 'bg-[#EAE8E1] text-[#55615A]' },
    local: { label: 'Local SQLite', cls: 'bg-[#E6F1E8] text-[#0D4A2E]' },
  }[syncState];

  // ADD / EDIT FULL-SCREEN EDITOR
  if (editorForm) {
    const modMeta = MODULES.find((m) => m.id === activeModule);
    const isMasjid = activeModule === 'masjids';

    return (
      <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-8 select-none">
        <ScreenHeader
          title={`${editorForm.id ? 'Edit' : 'Add'} ${modMeta?.label || 'Entry'}`}
          onBack={() => setEditorForm(null)}
        />

        <form onSubmit={handleSave} className="px-4 pt-2 flex-1 flex flex-col justify-between space-y-5">
          <div className="space-y-3.5">
            {isMasjid ? (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-[#14261C] mb-1">
                    Masjid Name <span className="text-[#B93A32]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editorForm.name}
                    onChange={(e) => setEditorForm({ ...editorForm, name: e.target.value })}
                    placeholder="e.g., Jama Masjid"
                    className="w-full h-[44px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13.5px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[12px] font-bold text-[#14261C] mb-1">Area</label>
                    <input
                      type="text"
                      value={editorForm.area}
                      onChange={(e) => setEditorForm({ ...editorForm, area: e.target.value })}
                      placeholder="e.g., Thane West"
                      className="w-full h-[42px] px-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#14261C] mb-1">Status</label>
                    <select
                      value={editorForm.status}
                      onChange={(e) => setEditorForm({ ...editorForm, status: e.target.value })}
                      className="w-full h-[42px] px-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px] font-medium"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#14261C] mb-1">Full Address</label>
                  <input
                    type="text"
                    value={editorForm.address}
                    onChange={(e) => setEditorForm({ ...editorForm, address: e.target.value })}
                    placeholder="Street, Landmark, City, PIN"
                    className="w-full h-[42px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                    Facilities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editorForm.facilitiesText}
                    onChange={(e) => setEditorForm({ ...editorForm, facilitiesText: e.target.value })}
                    placeholder="Wudu Khana, AC Hall, Ladies Section"
                    className="w-full h-[42px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                  />
                </div>

                {/* Jamaat Timetable Editor */}
                <div className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] p-3.5 space-y-2.5">
                  <h4 className="text-[13.5px] font-bold text-[#0D4A2E]">Jamaat Timetable</h4>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-[#66736B] uppercase px-1">
                    <span>Prayer</span>
                    <span>Azan</span>
                    <span>Jamaat</span>
                  </div>
                  {PRAYER_SLOTS.map(({ key, label }) => (
                    <div key={key} className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-[13px] font-semibold text-[#14261C] pl-1">{label}</span>
                      <input
                        type="text"
                        value={editorForm.timings[key]?.azan || ''}
                        onChange={(e) => updateTimingSlot(key, 'azan', e.target.value)}
                        placeholder="05:20 AM"
                        className="h-[36px] px-2.5 rounded-xl bg-[#F7F5EE] border border-[#E6E2D5] text-[12px] font-medium"
                      />
                      <input
                        type="text"
                        value={editorForm.timings[key]?.jamat || ''}
                        onChange={(e) => updateTimingSlot(key, 'jamat', e.target.value)}
                        placeholder="05:45 AM"
                        className="h-[36px] px-2.5 rounded-xl bg-[#F7F5EE] border border-[#E6E2D5] text-[12px] font-semibold text-[#0D4A2E]"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-[#14261C] mb-1">
                    {activeModule === 'quiz'
                      ? 'Quiz Question'
                      : activeModule === 'feelings'
                      ? 'Emotion Label'
                      : 'Title'}{' '}
                    <span className="text-[#B93A32]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editorForm.title}
                    onChange={(e) => setEditorForm({ ...editorForm, title: e.target.value })}
                    placeholder={activeModule === 'quiz' ? 'Enter question...' : 'Enter title...'}
                    className="w-full h-[44px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13.5px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[12px] font-bold text-[#14261C] mb-1">Category</label>
                    <input
                      type="text"
                      value={editorForm.category}
                      onChange={(e) => setEditorForm({ ...editorForm, category: e.target.value })}
                      placeholder="e.g., Daily, Seerah, Fiqh"
                      className="w-full h-[42px] px-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#14261C] mb-1">Status</label>
                    <select
                      value={editorForm.status}
                      onChange={(e) => setEditorForm({ ...editorForm, status: e.target.value })}
                      className="w-full h-[42px] px-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px] font-medium"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                {activeModule === 'feelings' && (
                  <div>
                    <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                      Trigger Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editorForm.keywordsText}
                      onChange={(e) => setEditorForm({ ...editorForm, keywordsText: e.target.value })}
                      placeholder="anxious, worried, lonely, sad"
                      className="w-full h-[42px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                    />
                  </div>
                )}

                {activeModule === 'quiz' && (
                  <div className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] p-3.5 space-y-2">
                    <label className="block text-[12px] font-bold text-[#0D4A2E]">
                      Answer Options (select correct one)
                    </label>
                    {editorForm.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={editorForm.correctIndex === idx}
                          onChange={() => setEditorForm({ ...editorForm, correctIndex: idx })}
                          className="accent-[#0D4A2E] w-4 h-4 shrink-0"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const next = [...editorForm.options];
                            next[idx] = e.target.value;
                            setEditorForm({ ...editorForm, options: next });
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 h-[38px] px-3 rounded-xl bg-[#F7F5EE] border border-[#E6E2D5] text-[12.5px]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                    Arabic Text (Optional)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editorForm.arabic}
                    onChange={(e) => setEditorForm({ ...editorForm, arabic: e.target.value })}
                    placeholder="أدخل النص العربي..."
                    className="w-full h-[44px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] font-arabic text-[18px] text-[#0D4A2E]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                    {activeModule === 'quiz' ? 'Answer Explanation' : 'English Translation'}
                  </label>
                  <textarea
                    rows={2}
                    value={editorForm.translation}
                    onChange={(e) => setEditorForm({ ...editorForm, translation: e.target.value })}
                    placeholder="Enter translation..."
                    className="w-full p-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                    {activeModule === 'feelings'
                      ? 'Quranic Guidance & Reflection'
                      : activeModule === 'duas'
                      ? 'Virtues & Benefits'
                      : 'Main Content / Lesson / Story'}
                  </label>
                  <textarea
                    rows={4}
                    value={editorForm.content}
                    onChange={(e) => setEditorForm({ ...editorForm, content: e.target.value })}
                    placeholder="Write content..."
                    className="w-full p-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                  />
                </div>

                {activeModule === 'feelings' && (
                  <div>
                    <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                      Prophetic Hadith / Sunnah Remedy
                    </label>
                    <textarea
                      rows={2}
                      value={editorForm.sunnahStory}
                      onChange={(e) => setEditorForm({ ...editorForm, sunnahStory: e.target.value })}
                      placeholder="Add authentic Hadith narration..."
                      className="w-full p-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div className={activeModule === 'duas' ? '' : 'col-span-2'}>
                    <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                      Reference / Source
                    </label>
                    <input
                      type="text"
                      value={editorForm.reference}
                      onChange={(e) => setEditorForm({ ...editorForm, reference: e.target.value })}
                      placeholder="e.g., Sahih al-Bukhari 3370"
                      className="w-full h-[42px] px-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px]"
                    />
                  </div>
                  {activeModule === 'duas' && (
                    <div>
                      <label className="block text-[12px] font-bold text-[#14261C] mb-1">
                        Repeat Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editorForm.repeatCount}
                        onChange={(e) => setEditorForm({ ...editorForm, repeatCount: e.target.value })}
                        className="w-full h-[42px] px-3 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px] font-bold"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[48px] rounded-full bg-gradient-to-r from-[#0B462B] via-[#135B39] to-[#083B23] text-white text-[14.5px] font-semibold shadow-md active:scale-[0.98] transition"
          >
            {editorForm.id ? 'Save Changes' : 'Publish Entry'}
          </button>
        </form>
      </section>
    );
  }

  // LIST VIEW
  const filteredEntries = entries.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const haystack =
      activeModule === 'masjids'
        ? `${item.name} ${item.area} ${item.address}`
        : `${item.title} ${item.category} ${item.translation}`;
    return haystack.toLowerCase().includes(q);
  });

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-24 select-none">
      <ScreenHeader
        title="Content CMS"
        onBack={onBack}
        rightSlot={
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${syncBadge.cls}`}>
              {syncBadge.label}
            </span>
            <button
              type="button"
              onClick={() => setEditorForm(createEmptyForm(activeModule))}
              className="px-3 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[12px] font-semibold shadow-sm active:scale-95 transition"
            >
              + Add
            </button>
          </div>
        }
      />

      <div className="px-4 space-y-3 flex-1">
        {/* Module Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {MODULES.map((m) => {
            const active = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setActiveModule(m.id);
                  setConfirmDeleteId(null);
                }}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition flex items-center space-x-1.5 shrink-0 ${
                  active
                    ? 'bg-[#0D4A2E] text-white shadow-sm'
                    : 'bg-[#EFECE1] text-[#4E5953] border border-[#E5E1D3]'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${MODULES.find((m) => m.id === activeModule)?.label}...`}
          className="w-full h-[40px] px-3.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13px] text-[#14261C] placeholder:text-[#8A928D] focus:outline-none focus:border-[#0D4A2E]"
        />

        {/* Entries List */}
        {loading ? (
          <div className="py-10 text-center text-[13px] text-[#55615A]">Loading local SQLite...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] p-8 text-center space-y-2">
            <p className="font-serif text-[16px] font-semibold text-[#14261C]">No entries yet</p>
            <p className="text-[12px] text-[#55615A]">
              Tap <strong>+ Add</strong> to create one. It saves offline immediately and syncs to Supabase.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredEntries.map((item) => {
              const isMasjid = activeModule === 'masjids';
              const isConfirming = confirmDeleteId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_2px_10px_rgba(20,38,28,0.04)] p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-[14.5px] font-bold text-[#14261C] truncate">
                          {isMasjid ? item.name : item.title}
                        </h4>
                        <StatusBadge status={item.status === 'draft' ? 'paused' : 'active'} />
                      </div>
                      <p className="text-[12px] text-[#55615A] truncate mt-0.5">
                        {isMasjid
                          ? `${item.area || 'Local Area'} • Fajr ${item.timings?.fajr?.jamat || '—'} • Jumuah ${item.timings?.jumuah?.jamat || '—'}`
                          : item.category || item.reference || item.translation || 'Tap Edit to view details'}
                      </p>
                    </div>
                  </div>

                  {!isConfirming ? (
                    <div className="flex items-center space-x-2 pt-1 border-t border-[#EDE9DC]">
                      <button
                        type="button"
                        onClick={() => openEditForm(item)}
                        className="flex-1 py-1.5 rounded-full bg-[#E6F1E8] text-[#0D4A2E] text-[12px] font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="px-4 py-1.5 rounded-full bg-[#FBF0EE] text-[#B93A32] text-[12px] font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[#FBF0EE] border border-[#E5B8B4] flex items-center justify-between gap-2">
                      <span className="text-[11.5px] font-semibold text-[#6B2D26]">Delete permanently?</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
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
            })}
          </div>
        )}
      </div>
    </section>
  );
}