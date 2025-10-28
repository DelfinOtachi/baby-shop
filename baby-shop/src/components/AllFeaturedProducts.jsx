import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products/featured");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🌟 All Featured Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No featured products found.</p>
      ) : (
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
              {p.oldPrice && (
                <p className="text-gray-400 line-through text-sm">
                  KSh {p.oldPrice}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
