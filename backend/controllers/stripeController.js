// controllers/stripeController.js
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🟢 1️⃣ Create PaymentIntent
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // amount in cents
      currency: "kes", // or "usd" if KES isn’t supported in your region
      description: `Order #${order._id}`,
      metadata: { orderId: order._id.toString() },
      automatic_payment_methods: { enabled: true },
    });

    // Save PaymentIntent ID
    order.paymentResult = {
      id: paymentIntent.id,
      status: "Pending",
    };
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Stripe create intent error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 🔵 2️⃣ Stripe Webhook (Stripe → your backend)
export const stripeWebhook = async (req, res) => {
  console.log("🚀 Stripe webhook received");

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(`✅ Verified event: ${event.type}`);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    console.log("💰 Payment succeeded for order:", orderId);

    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        email: paymentIntent.receipt_email || "none",
      };
      await order.save();
      console.log(`✅ Order ${orderId} updated as paid.`);
    }
  }

  res.json({ received: true });
};
