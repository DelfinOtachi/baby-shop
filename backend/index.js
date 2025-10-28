import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db.js";
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

import path from "path";

dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

await connectDB(process.env.MONGO_URI);

// static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/payments", paymentRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/cart", cartRoutes);
app.get("/", (req, res) => res.send({ message: "Narya Baby API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
