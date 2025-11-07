import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductBySlug } from '../api/product';
import ImageGallery from '../components/ImageGallery';
import VariantSelect from '../components/VariantSelect';
import EMIBox from '../components/EMIBox';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetchProductBySlug(slug)
      .then(p => {
        setProduct(p);
        setActiveVariantIndex(0);
      })
      .catch(err => console.error(err));
  }, [slug]);

  if (!product) {
    return <div className="p-12 text-center">Loading product...</div>;
  }

  const activeVariant = product.variants[activeVariantIndex] || product.variants[0];

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex gap-6">
          <ImageGallery
            images={(activeVariant.images && activeVariant.images.length) ? activeVariant.images : product.images || []}
          />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="bg-emerald-50 p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-800">{product.name}</h1>
            <p className="text-sm text-slate-600 mt-1">({activeVariant.name})</p>

            <div className="mt-5">
              <div className="text-3xl font-bold text-emerald-900">
                ₹{activeVariant.price.toLocaleString()}
              </div>
              {activeVariant.mrp && activeVariant.mrp > activeVariant.price && (
                <div className="text-sm text-slate-500">MRP ₹{activeVariant.mrp.toLocaleString()}</div>
              )}
            </div>

            <div className="mt-6">
              <VariantSelect
                variants={product.variants}
                activeIndex={activeVariantIndex}
                onChange={setActiveVariantIndex}
              />
            </div>

            <div className="mt-6">
              <EMIBox
                price={activeVariant.price}
                emiPlans={product.emiPlans || []}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded shadow">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-slate-700">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
