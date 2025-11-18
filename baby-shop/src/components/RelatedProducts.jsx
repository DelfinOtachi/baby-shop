import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RelatedProducts({ productId, categoryId, currentSlug }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    const fetchRelated = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${productId}/related`
        );
        // Filter out current product in case it appears
        const filtered = data.filter((p) => p.slug !== currentSlug);
        setRelated(filtered);
      } catch (err) {
        console.error("Failed to load related products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [productId, categoryId, currentSlug]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading related products...</p>;
  if (!related.length) return null;

  return (
    <section className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Related Items</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {related.map((item) => (
          <div
            key={item._id}
            onClick={() => (window.location.href = `/product/${item.slug}`)}
            className="cursor-pointer bg-white rounded-2xl border hover:shadow-md transition p-3"
          >
            <img
              src={item.images?.[0] || "/placeholder.png"}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <p className="font-semibold text-gray-700 truncate">{item.name}</p>
            <p className="text-pink-600 font-bold">
              KSh {item.price?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
