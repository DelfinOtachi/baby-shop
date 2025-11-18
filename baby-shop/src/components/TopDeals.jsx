import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart as addToLocalCart } from "../utils/cartUtils";
import { motion } from "framer-motion";

export default function TopDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null);
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

  const handleAddToCart = (product) => {
    setAdding(product._id);
    setTimeout(() => {
      addToLocalCart(product, 1);
      alert(`✅ ${product.name} added to cart!`);
      setAdding(null);
    }, 300);
  };

  if (loading) return <p className="text-center py-10">Loading top deals...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!products.length) return <p className="text-center text-gray-500 py-10">No top deals available.</p>;

  const visibleDeals = products.slice(0, 5);

  return (
    <section className="py-16 bg-blue-100 w-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Deals For You
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {visibleDeals.map((item) => {
            const discount = item.oldPrice
              ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
              : null;

            return (
              <motion.div
                key={item._id}
                className="relative bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  y: -6,
                  boxShadow: "0px 15px 35px rgba(0,0,0,0.2)"
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Discount Badge */}
                {discount && (
                  <div className="absolute top-3 left-3 bg-babyPink text-white text-xs font-semibold px-2 py-1 rounded-md">
                    -{discount}%
                  </div>
                )}

                {/* Product Image */}
                <div
                  onClick={() => navigate(`/product/${item.slug}`)}
                  className="w-full h-48 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col items-center text-center">
                  <p
                    onClick={() => navigate(`/product/${item.slug}`)}
                    className="text-gray-700 font-medium mb-1 cursor-pointer hover:text-blue-500 transition"
                  >
                    {item.name}
                  </p>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      KSh {item.price.toLocaleString()}
                    </span>
                    {item.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        KSh {item.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => handleAddToCart(item)}
                      disabled={adding === item._id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${
                        adding === item._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-babyBlue hover:bg-blue-600"
                      } text-white px-4 py-2 rounded-full flex items-center gap-2 transition`}
                    >
                      <ShoppingCart size={16} />
                      {adding === item._id ? "Adding..." : "Add"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border border-gray-200 hover:border-pink-500 hover:text-pink-500 p-2 rounded-full transition"
                    >
                      <Heart size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {products.length > 4 && (
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={() => navigate("/top-deals")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-purple-300 text-white rounded-full hover:bg-blue-600 transition"
            >
              Show More
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
