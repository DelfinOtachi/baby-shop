import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Create review (authenticated users only)
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Populate user info
    const populatedReview = await Review.findById(savedReview._id).populate("user", "name");

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to update this review" });

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    const updated = await review.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this review" });

    await review.remove();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
      .populate("user", "name"); // <-- populate name

    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

