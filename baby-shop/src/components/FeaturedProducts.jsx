import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { addToCart as addToLocalCart } from "../utils/cartUtils";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get(
  `${process.env.REACT_APP_API_URL}/api/products/featured`
);

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

  const handleAddToCart = (product) => {
    setAdding(product._id);
    setTimeout(() => {
      addToLocalCart(product, 1);
      alert(`✅ ${product.name} added to cart!`);
      setAdding(null);
    }, 500);
  };

  if (loading) return <p className="text-center">Loading featured products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!products.length)
    return <p className="text-center text-gray-500">No featured products available.</p>;

  const visibleProducts = products.slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-white via-sky-50 to-indigo-100 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌟 Top Selling Products
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleProducts.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 120, rotate: -2 }}
              animate={{
                opacity: 1,
                y: [0, -6, 0], // floating motion
                rotate: [0, 1, -1, 0], // subtle rotation
              }}
              transition={{
                opacity: { duration: 0.8, delay: index * 0.15 },
                y: {
                  delay: index * 0.15,
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  type: "tween", // use tween for multi-keyframes
                },
                rotate: {
                  delay: index * 0.15,
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  type: "tween",
                },
              }}
              whileHover={{
                scale: 1.1,
                rotate: 2,
                y: -10,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.2)",
              }}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-500"
            >
              <div onClick={() => navigate(`/product/${p.slug}`)}>
                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="p-4 text-center">
                <h3
                  onClick={() => navigate(`/product/${p.slug}`)}
                  className="text-lg font-semibold text-gray-800 truncate cursor-pointer hover:text-blue-500 transition"
                >
                  {p.name}
                </h3>

                <p className="text-pink-500 font-bold mt-2">KSh {p.price}</p>
                {p.oldPrice && (
                  <p className="text-gray-400 line-through text-sm">
                    KSh {p.oldPrice}
                  </p>
                )}

                <motion.button
                  onClick={() => handleAddToCart(p)}
                  disabled={adding === p._id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-4 flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition mx-auto text-white ${
                    adding === p._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 shadow-md"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {adding === p._id ? "Adding..." : "Add to Cart"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length > 4 && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate("/featured")}
              whileHover={{
                scale: 1.08,
                boxShadow: "0px 8px 20px rgba(99,102,241,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium transition"
            >
              Show More
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
