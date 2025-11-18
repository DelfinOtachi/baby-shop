// index.js
import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first

import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import CoinbaseCommerce from "coinbase-commerce-node";

// ✅ Import DB connection
import { connectDB } from "./config/db.js";

// ✅ Import routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"; //generalReview
import generalReview from "./routes/generalReview.js";
import notificationsRoutes from "./routes/notifications.js";

// ✅ Import webhook handlers
import { stripeWebhook } from "./controllers/stripeController.js";
import { coinbaseWebhook } from "./controllers/cryptoController.js";

// ----------------------
// Initialize Express app
// ----------------------
const app = express();

// ----------------------
// Coinbase Commerce Setup
// ----------------------
const { Client, resources } = CoinbaseCommerce;
const { Charge } = resources;
Client.init(process.env.COINBASE_COMMERCE_API_KEY);

// ----------------------
// Middleware
// ----------------------

// Stripe Webhook (raw body for signature verification)
app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Coinbase Webhook (raw body)
app.post(
  "/api/crypto/webhook",
  express.raw({ type: "application/json" }),
  coinbaseWebhook
);

// JSON parser for all other requests
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// HTTP logger (dev mode only)
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ----------------------
// Connect to MongoDB
// ----------------------
await connectDB(process.env.MONGO_URI);

// ----------------------
// Serve static uploads
// ----------------------
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ----------------------
// Test Coinbase Charge
// ----------------------
const testCoinbaseCharge = async () => {
  try {
    const charge = await Charge.create({
      name: "Test Charge",
      local_price: { amount: 10, currency: "USD" },
      pricing_type: "fixed_price",
    });
    console.log("✅ Coinbase test charge created:", charge.id);
  } catch (err) {
    console.error("❌ Coinbase Charge Error:", err.message);
  }
};

testCoinbaseCharge().catch(console.error);

// ----------------------
// Routes
// ----------------------
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes); // includes /google-login endpoint for SPA Google login
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/generalReview", generalReview);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/notifications", notificationsRoutes);


// Health check
app.get("/", (req, res) => res.send({ message: "🍼 Narya Baby API running" }));

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
