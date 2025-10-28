// src/pages/NewArrivalsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/new-arrivals")
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🆕 All New Arrivals
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <img
              src={p.images?.[0] || "/placeholder.png"}
              alt={p.name}
              className="w-full h-44 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-gray-700">{p.name}</h3>
            <p className="text-pink-600 font-bold mt-1">KSh {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
