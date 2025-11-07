import React from 'react';

export default function VariantSelect({ variants = [], activeIndex = 0, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <label className="text-sm text-slate-600">Choose Variant</label>
      <div className="flex gap-3 flex-wrap">
        {variants.map((v, idx) => (
          <button
            key={idx}
            onClick={() => onChange(idx)}
            className={`px-3 py-2 rounded-md border ${idx === activeIndex ? 'bg-emerald-900 text-white' : 'bg-white text-slate-700'}`}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}
