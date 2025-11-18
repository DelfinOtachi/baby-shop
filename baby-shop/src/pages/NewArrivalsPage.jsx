import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { addToCart as addToLocalCart } from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products/new-arrivals");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        setError("Failed to load new arrivals.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleAddToCart = (product) => {
    setAdding(product._id);
    setTimeout(() => {
      addToLocalCart(product, 1);
      alert(`✅ ${product.name} added to cart!`);
      setAdding(null);
    }, 300);
  };

  if (loading) return <p className="text-center text-gray-500 py-10">Loading new arrivals...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!products.length) return <p className="text-center text-gray-500 py-10">No new arrivals available.</p>;

  const visibleProducts = products.slice(0, 4); // Show 4 on homepage

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          ✨ New Arrivals
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {visibleProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div
                onClick={() => navigate(`/product/${p.slug}`)}
                className="w-full h-48 overflow-hidden cursor-pointer"
              >
                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col items-center text-center">
                <h3
                  onClick={() => navigate(`/product/${p.slug}`)}
                  className="font-semibold text-gray-700 truncate mb-1 cursor-pointer hover:text-blue-500 transition"
                >
                  {p.name}
                </h3>
                <p className="text-babyPink font-bold">
                  KSh {p.price.toLocaleString()}
                </p>
                {p.oldPrice && (
                  <p className="text-gray-400 line-through text-sm">
                    KSh {p.oldPrice.toLocaleString()}
                  </p>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={adding === p._id}
                  className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition text-white ${
                    adding === p._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-babyBlue hover:bg-blue-600"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {adding === p._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length > 4 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/new-arrivals")}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
