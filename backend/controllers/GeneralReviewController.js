// POST /api/reviews/general
import GeneralReview from "../models/GeneralReview.js";

export const createGeneralReview = async (req, res) => {
  try {
    const { rating, comment, order } = req.body;
    const review = new GeneralReview({
      user: req.user._id, // assuming user is authenticated
      rating,
      comment,
      order,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/reviews/general
export const getGeneralReviews  = async (req, res) => {
  try {
    const reviews = await GeneralReview.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyGeneralReviews = async (req, res) => {
  try {
    const reviews = await GeneralReview.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateGeneralReview = async (req, res) => {
  try {
    const review = await GeneralReview.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;

    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteGeneralReview = async (req, res) => {
  try {
    const review = await GeneralReview.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

