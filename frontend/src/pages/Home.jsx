import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api/product";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  console.log("Products:", products);

  return (
    <div className="min-h-screen bg-white p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-emerald-900">
        Explore Our Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-slate-600">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <Link key={p._id} to={`/product/${p.slug}`}>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-emerald-900 transition duration-200 flex flex-col items-center text-center">
                <div className="w-full h-64 rounded-lg overflow-hidden mb-3 border border-slate-100 flex items-center justify-center bg-white">
                  <img
                    src={p.variants[0]?.images[0] || p.images[0] || '/placeholder-product.png'}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>


                <h3 className="text-lg font-semibold text-slate-900">
                  {p.name}
                </h3>


                <button className="mt-3 px-4 py-2 bg-emerald-900 text-white text-sm rounded-md shadow hover:bg-emerald-800 transition">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
