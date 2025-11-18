import express from "express";
import { initiateSTKPush, mpesaCallback } from "../controllers/mpesaController.js";
import { createStripePaymentIntent, stripeWebhook } from "../controllers/stripeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Initiate payment
router.post("/stkpush", protect, initiateSTKPush);

// Safaricom callback URL (must be accessible publicly)
router.post("/callback", mpesaCallback);

router.post("/stripe/create-intent", protect, createStripePaymentIntent);

// Stripe webhook (no auth middleware!)
router.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
