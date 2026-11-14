import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const handleSubmit = () => { if (onSearch) onSearch(query.trim()); };

  return (
    <div className="relative z-10 mt-4">
      <div className="relative flex items-center w-full h-[36px] rounded-full bg-[#F5F2E8]/95 backdrop-blur-md border border-[#DCD8C6] shadow-sm px-3.5 focus-within:ring-2 focus-within:ring-[#0D4A2E]/30 transition">
        <svg className="w-4 h-4 text-[#0D4A2E] shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Search duas, reflections..."
          className="w-full bg-transparent text-[12.5px] text-[#0D4A2E] placeholder-[#59695E] focus:outline-none"
        />
        <button onClick={handleSubmit} aria-label="Search" className="ml-1 text-[#1D3B2A] p-0.5 active:scale-90 transition">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
