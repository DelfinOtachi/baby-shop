import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MyGeneralReviews() {
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    const fetchMyReviews = async () => {
      const res = await axios.get("http://localhost:5000/api/generalReview/my-reviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    };
    fetchMyReviews();
  }, [token]);

  const startEdit = (review) => {
    setEditing(review._id);
    setNewComment(review.comment);
    setNewRating(review.rating);
  };

  const saveEdit = async (id) => {
    const res = await axios.put(
      `http://localhost:5000/api/generalReview/${id}`,
      { rating: newRating, comment: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setReviews((prev) =>
      prev.map((r) => (r._id === id ? res.data : r))
    );

    setEditing(null);
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await axios.delete(`http://localhost:5000/api/generalReview/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't written any reviews yet.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev._id} className="bg-white p-4 rounded-lg shadow mb-4">
            {editing === rev._id ? (
              <>
                {/* Edit rating */}
                <div className="flex mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl ${
                        star <= newRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setNewRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Edit comment */}
                <textarea
                  className="w-full border p-2 rounded"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => saveEdit(rev._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex text-yellow-400 text-lg">
                  {"★".repeat(rev.rating)}
                  {"★".repeat(5 - rev.rating).replace(/★/g, "☆")}
                </div>
                <p className="mt-1">{rev.comment}</p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => startEdit(rev)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReview(rev._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
