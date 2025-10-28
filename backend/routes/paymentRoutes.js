import express from "express";
// routes/payments.js
import Stripe from "stripe";
import Order from "../models/Order.js";
import dotenv from "dotenv";
import paypal from "paypal-rest-sdk";
import { initiateSTKPush, mpesaCallback } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Start M-Pesa STK Push
router.post("/stkpush", protect, initiateSTKPush);

// Callback URL (called by Safaricom)
router.post("/mpesa/callback", mpesaCallback);

// Create Stripe Checkout Session
router.post("/stripe-intent", async (req, res) => {
  const { amount } = req.body; // totalPrice in KSh
  const token = req.headers.authorization?.split(" ")[1];

  try {
    // Convert KSh to USD (Stripe expects USD in cents)
    const usdAmount = Math.round(amount / 140 * 100); // Example rate: 1 USD = 140 KSh

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: usdAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    res.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe payment failed" });
  }
});

paypal.configure({
  mode: "sandbox", // or "live"
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

router.post("/paypal-create", async (req, res) => {
  const { amount } = req.body;

  // Convert KSh to USD (example rate 1 USD = 140 KSh)
  const usdAmount = (amount / 140).toFixed(2);

  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    },
    transactions: [
      {
        item_list: { items: [{ name: "Order Payment", sku: "001", price: usdAmount, currency: "USD", quantity: 1 }] },
        amount: { currency: "USD", total: usdAmount },
        description: "Payment for your order",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "PayPal payment failed" });
    } else {
      const approvalUrl = payment.links.find((link) => link.rel === "approval_url").href;
      res.json({ approvalUrl });
    }
  });
});

export default router;
