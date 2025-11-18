import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, ShoppingCart } from "lucide-react";
import { addToCart as addToLocalCart } from "../utils/cartUtils";
import { AuthContext } from "../context/AuthContext";
import RelatedProducts from "../components/RelatedProducts";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { user, token, loadingUser } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [filteredRating, setFilteredRating] = useState(null);
  const [hoverDropdown, setHoverDropdown] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Selected color & main image
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState("");

  // Color variants
  const [colorVariants, setColorVariants] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/slug/${slug}`
        );
        setProduct(data);

        // Get color variants from array
        const colors = data.variants?.filter((v) => v.type === "color") || [];
        setColorVariants(colors);

        // Set default color & main image
        if (colors.length) {
          setSelectedColor(colors[0].value);
          setMainImage(colors[0].images[0] || data.images[0]);
        } else {
          setMainImage(data.images[0]);
        }

        // Fetch reviews
        const { data: reviewRes } = await axios.get(
          `http://localhost:5000/api/reviews/${data._id}`
        );
        setReviews(reviewRes);
      } catch (err) {
        console.error(err);
        setError("Failed to load product details or reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Update main image when selected color changes
  useEffect(() => {
    if (!product || !colorVariants.length || !selectedColor) return;
    const variant = colorVariants.find((c) => c.value === selectedColor);
    if (variant && variant.images.length) setMainImage(variant.images[0]);
    else setMainImage(product.images[0]);
  }, [selectedColor, colorVariants, product]);

  const handleAddToCart = () => {
    if (!product || product.countInStock <= 0) return;
    setAdding(true);
    setTimeout(() => {
      addToLocalCart(product, 1);
      alert(`✅ ${product.name} added to cart!`);
      setAdding(false);
    }, 300);
  };

  const handleSubmitReview = async () => {
    if (!reviewData.comment.trim()) return alert("Please add a comment");
    if (!token) return alert("You must be logged in to submit a review");

    setReviewSubmitting(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          productId: product._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews([data, ...reviews]);
      setReviewData({ rating: 5, comment: "" });
      setShowReviewForm(false);
      alert("✅ Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading || loadingUser) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return <p className="text-center py-10">Product not found.</p>;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  const displayedReviews = filteredRating
    ? reviews.filter((r) => r.rating === filteredRating)
    : reviews;

  const maxCount = Math.max(...ratingCounts.map((r) => r.count), 1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        {/* Product Images */}
<div className="flex gap-4">
  {/* Left-side thumbnails (main product images only) */}
  <div className="flex flex-col gap-2">
    {product.images.map((img, i) => (
      <img
        key={i}
        src={img}
        alt={`thumb-${i}`}
        onClick={() => setMainImage(img)}
        className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition
          ${mainImage === img ? "border-pink-500 scale-105" : "border-gray-300"}
        `}
      />
    ))}
  </div>

  {/* Main image */}
  <div className="flex-1">
    <img
      src={mainImage || "/placeholder.png"}
      alt={product.name}
      className="w-full h-[450px] object-cover rounded-2xl shadow"
    />
  </div>
</div>


        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

          {/* Color Selector */}
          {colorVariants.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold mb-1">Colors:</p>
              <div className="flex gap-2">
                {colorVariants.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200
                      ${selectedColor === c.value ? "border-pink-500 scale-110" : "border-gray-300"}
                    `}
                    style={{ backgroundColor: c.colorCode }}
                    title={c.value}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stars + Rating Breakdown */}
          <div
            className="flex items-center mb-4 relative"
            onMouseEnter={() => setHoverDropdown(true)}
            onMouseLeave={() => setHoverDropdown(false)}
          >
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              if (avgRating >= starValue) {
                return <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />;
              } else if (avgRating >= starValue - 0.5) {
                return (
                  <div key={i} className="relative w-[18px] h-[18px]">
                    <Star
                      size={18}
                      className="text-gray-300 fill-gray-300 absolute top-0 left-0"
                    />
                    <Star
                      size={18}
                      className="text-yellow-400 fill-yellow-400 absolute top-0 left-0"
                      style={{ clipPath: "inset(0 50% 0 0)" }}
                    />
                  </div>
                );
              } else {
                return <Star key={i} size={18} className="text-gray-300 fill-gray-300" />;
              }
            })}

            <span className="ml-2 text-sm text-gray-600 cursor-pointer relative">
              ({reviews.length} review{reviews.length !== 1 && "s"})
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white border rounded shadow-lg p-4 z-10
                  transition-opacity duration-200 ease-in-out
                  ${hoverDropdown || showReviews ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              >
                <h4 className="font-semibold mb-2">Rating Breakdown</h4>
                {ratingCounts.map((r) => (
                  <div
                    key={r.star}
                    className="flex items-center gap-2 mb-1 cursor-pointer"
                    onClick={() => {
                      setFilteredRating(r.star);
                      setShowReviews(true);
                    }}
                  >
                    <span className="w-4">{r.star}★</span>
                    <div className="flex-1 bg-gray-200 h-3 rounded">
                      <div
                        className="bg-yellow-400 h-3 rounded transition-all duration-300"
                        style={{ width: `${(r.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm">{r.count}</span>
                  </div>
                ))}
                <button
                  className="px-4 py-1 mt-2 text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                  onClick={() => {
                    setFilteredRating(null);
                    setShowReviews(true);
                  }}
                >
                  Show all reviews
                </button>
              </div>
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-2xl font-bold text-pink-600">
              KSh {product.price.toLocaleString()}
            </p>
            {product.oldPrice && (
              <p className="text-gray-400 line-through">
                KSh {product.oldPrice.toLocaleString()}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Category: <span className="font-semibold text-gray-700">{product.category?.name}</span>
          </p>
          {product.subCategory && (
            <p className="text-sm text-gray-500 mb-4">
              Subcategory: <span className="font-semibold text-gray-700">{product.subCategory?.name}</span>
            </p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.countInStock <= 0}
            className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-full transition ${
              adding ? "bg-gray-400 cursor-not-allowed text-white" : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            <ShoppingCart size={18} />
            {adding ? "Adding..." : "Add to Cart"}
          </button>

          <p className={`mt-4 text-sm ${product.countInStock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      {/* 🧾 Reviews Section */}
<section className="mt-14 border-t pt-10">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>

  {/* ✅ Add Review Button (always visible for logged-in users) */}
  {user ? (
    <button
      className="mb-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition"
      onClick={() => setShowReviewForm(!showReviewForm)}
    >
      {showReviewForm ? "Cancel" : "Add Review"}
    </button>
  ) : (
    <p className="mb-4 text-gray-600 text-sm">
      Please <span className="text-pink-500 font-semibold">log in</span> to leave a review.
    </p>
  )}

  {/* ✅ Review Form */}
  {showReviewForm && user && (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Write Your Review</h3>
      <select
        className="border rounded p-2 mb-2"
        value={reviewData.rating}
        onChange={(e) =>
          setReviewData({ ...reviewData, rating: Number(e.target.value) })
        }
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} Star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <textarea
        rows="3"
        className="w-full border rounded p-2 mb-2"
        placeholder="Write your review..."
        value={reviewData.comment}
        onChange={(e) =>
          setReviewData({ ...reviewData, comment: e.target.value })
        }
      />
      <button
        onClick={handleSubmitReview}
        disabled={reviewSubmitting}
        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition"
      >
        {reviewSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  )}

  {/* ✅ Reviews List */}
  <div className="space-y-4 mt-4">
    {displayedReviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
    {displayedReviews.map((r) => (
      <div key={r._id} className="bg-gray-50 p-4 rounded-xl border">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Number(r.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-700">
            {r.user?.name || "Anonymous"}
          </span>
        </div>
        <p className="text-gray-700 text-sm">{r.comment}</p>
      </div>
    ))}
  </div>
</section>
{/* Related Products */}
{product && (
  <RelatedProducts
    productId={product._id}
    categoryId={product.category?._id}
    currentSlug={product.slug}
  />
)}

    </div>
  );
  

}
