// src/components/ImageGallery.jsx
import React, { useState } from 'react';

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);

  const defaultImg = '/placeholder-product.png';

  return (
    <div className="flex w-full gap-6">
      <div className="hidden md:flex flex-col gap-3 w-20">
        {((images.length ? images : [defaultImg])).map((img, idx) => (
          <button
            key={idx} 
            onClick={() => setActive(idx)}
            className={`w-16 h-16 p-2 rounded-lg border ${idx === active ? 'ring-2 ring-emerald-400' : 'border-slate-200'} bg-white`}
          >
            <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center bg-white rounded-2xl p-10">
        <img
          src={images.length ? images[active] : defaultImg}
          alt="product-large"
          className="h-[500px] w-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

    </div>
  );
}
