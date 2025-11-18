import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // assuming you have this

export default function GeneralReviewForm({ onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // for hover effect
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useContext(AuthContext);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to leave a review.");
    if (!rating) return alert("Please select a star rating.");
    
    setLoading(true);
    try {
      const res = await axios.post(
  "http://localhost:5000/api/generalReview",
  { rating, comment },
  {
    headers: {
      Authorization: `Bearer ${token}`, // from AuthContext
    },
  }
);

      setRating(0);
      setComment("");
      if (onReviewAdded) {
  onReviewAdded(res.data);
}

    } catch (err) {
      console.error(err);
      alert("Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto text-center">
        <p className="mb-4 text-gray-600">Please login to leave a review.</p>
        <button
          onClick={() => window.location.href = "/login"} // navigate to login
          className="bg-pink-400 text-white px-4 py-2 rounded-full hover:bg-pink-500 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submitReview} className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Share your feedback</h3>

      {/* Star rating */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`text-2xl focus:outline-none ${
              star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment (optional)"
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-pink-400 text-white px-4 py-2 rounded-full hover:bg-pink-500 transition w-full"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
