import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FeaturedCategories() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/subcategories/featured"
        );
        setSubs(data);
      } catch (err) {
        console.error("Failed to fetch featured subcategories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (!subs.length) return null;

  return (
    <section className="py-12 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          🛍️ Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {subs.map((sub) => (
            <motion.div
              key={sub._id}
              onClick={() => navigate(`/subcategory/${sub.slug}`)}
              className="cursor-pointer bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center text-center"
              whileHover={{ scale: 1.05, y: -4, boxShadow: "0px 10px 30px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="w-24 h-24 mb-3 overflow-hidden rounded-full border border-gray-200">
                <img
                  src={sub.image || "/placeholder.png"}
                  alt={sub.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-700 text-sm md:text-base">
                {sub.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
