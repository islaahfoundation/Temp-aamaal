/* Combines the full list of Circle Aamaals with AamaalAvailability 
(Pause/Resume), EditAamaal, AddAamaal, AamaalTargets, and Delete 
actions.*/

import React, { useState } from 'react';
import AamaalAvailability from './AamaalAvailability';
import AddAamaal from './AddAamaal';
import EditAamaal from './EditAamaal';
import AamaalTargets from './AamaalTargets';

export default function AamaalManagement({
  aamaalList = [],
  onAddAamaal,
  onUpdateAamaal,
  onDeleteAamaal,
}) {
  const [editingAamaal, setEditingAamaal] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-3.5">
      {/* Header & Add Button */}
      <div className="card rounded-[20px] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Aamaal Catalog
            </span>
            <h3 className="font-serif text-[17.5px] font-semibold text-primary">
              Manage Daily Aamaal
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingAamaal(null);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold shadow-sm"
          >
            {showAddForm ? 'Close Form' : '+ Add Aamaal'}
          </button>
        </div>

        {/* List of Aamaals */}
        <div className="divide-y divide-[#E2DEC9]">
          {aamaalList.map((item) => (
            <div key={item.id} className="py-3 first:pt-1 last:pb-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-[15px] font-bold text-primary">
                    {item.name}{' '}
                    <span className="text-[11.5px] font-normal text-secondary">
                      (Target: {Number(item.target).toLocaleString('en-US')})
                    </span>
                  </h4>
                  <p className="font-arabic text-[18px] text-[#135332] mt-0.5" dir="rtl">
                    {item.arabic}
                  </p>
                </div>

                <AamaalAvailability
                  aamaal={item}
                  onToggleActive={(id, nextActive) => {
                    if (onUpdateAamaal) onUpdateAamaal(id, { active: nextActive });
                  }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAamaal(item);
                    setShowAddForm(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#EAE8D7] text-primary text-[11px] font-semibold border border-[#D5D2BE]"
                >
                  ✏️ Edit
                </button>

                {aamaalList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onDeleteAamaal) onDeleteAamaal(item.id);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#E5DEC9] text-[#6B2D26] text-[11px] font-semibold"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingAamaal && (
        <EditAamaal
          aamaal={editingAamaal}
          onSaveAamaal={(id, updates) => {
            if (onUpdateAamaal) onUpdateAamaal(id, updates);
            setEditingAamaal(null);
          }}
          onCancel={() => setEditingAamaal(null)}
        />
      )}

      {showAddForm && (
        <AddAamaal
          onAddAamaal={(newItem) => {
            if (onAddAamaal) onAddAamaal(newItem);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <AamaalTargets
        aamaalList={aamaalList}
        onUpdateTarget={(id, newTarget) => {
          if (onUpdateAamaal) onUpdateAamaal(id, { target: newTarget });
        }}
      />
    </div>
  );
}