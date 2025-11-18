import express from "express";
import { createStripePaymentIntent } from "../controllers/stripeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Secure route for creating PaymentIntent
router.post("/create-intent", protect, createStripePaymentIntent);

export default router;
