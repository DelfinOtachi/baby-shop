import express from "express";
import {
  createGeneralReview,
  getGeneralReviews,
  getMyGeneralReviews,
  updateGeneralReview,
  deleteGeneralReview,
} from "../controllers/GeneralReviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all general reviews (public)
router.get("/", getGeneralReviews);

// Get logged-in user's reviews
router.get("/my-reviews", protect, getMyGeneralReviews);

// Add review
router.post("/", protect, createGeneralReview);

// Edit review
router.put("/:id", protect, updateGeneralReview);

// Delete review
router.delete("/:id", protect, deleteGeneralReview);

export default router;
