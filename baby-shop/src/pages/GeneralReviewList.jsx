import { useEffect, useState } from "react";
import axios from "axios";

export default function GeneralReviewList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await axios.get("/api/reviews/general");
      setReviews(res.data);
    };
    fetchReviews();
  }, []);

  if (!reviews.length) return <p className="text-center py-6 text-gray-500">No feedback yet.</p>;

  return (
    <div className="space-y-4 max-w-3xl mx-auto mt-6">
      {reviews.map((r) => (
        <div key={r._id} className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700">{r.user.name}</span>
            <span className="text-yellow-400">
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </span>
          </div>
          {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
          <p className="text-gray-400 text-xs mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
