import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reviews", {
        productId,
        name,
        rating,
        comment,
      });
      alert("✅ Review submitted!");
      setRating(5);
      setComment("");
      setName("");
      const { data } = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
      setReviews(data);
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-sm text-gray-500">{r.name}</span>
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-3 bg-blue-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-700">Leave a Review</h4>
        <input
          type="text"
          placeholder="Your name"
          className="w-full border rounded-md p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="w-full border rounded-md p-2"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} Star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Your review"
          className="w-full border rounded-md p-2 h-24"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-babyBlue hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
