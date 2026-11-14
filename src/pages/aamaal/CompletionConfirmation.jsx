import React from 'react';

export default function CompletionConfirmation({ dateLabel = 'Today', count = 0 }) {
  return (
    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#DFB75A]/20 border border-[#F0D58C]/60 text-[#F0D58C] text-[13.5px] font-bold shadow-sm">
      <span>✓</span>
      <span>
        Completed ({dateLabel}):{' '}
        <strong className="text-white">{Number(count).toLocaleString('en-US')}</strong>
      </span>
    </div>
  );
}