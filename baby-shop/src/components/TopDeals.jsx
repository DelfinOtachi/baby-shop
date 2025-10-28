import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TopDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products/top-deals");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching top deals:", err);
        setError("Failed to load top deals.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  if (loading) return <p className="text-center">Loading top deals...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!products.length) return <p className="text-center text-gray-500">No top deals available.</p>;

  const visibleDeals = products.slice(0, 4);

  return (
    <section className="py-10 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🔥 Top Deals
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {visibleDeals.map((p) => (
            <div key={p._id} className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
              <img
                src={p.images?.[0] || "/placeholder.png"}
                alt={p.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-700 truncate">{p.name}</h3>
              <p className="text-pink-600 font-bold mt-1">KSh {p.price}</p>
              {p.oldPrice && (
                <p className="text-gray-400 line-through text-sm">
                  KSh {p.oldPrice}
                </p>
              )}
            </div>
          ))}
        </div>

        {products.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/top-deals")}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
