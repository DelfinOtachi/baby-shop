import express from "express";
import {
  getDashboardStats,
  getUsers,
  getProducts,
  deleteProduct,
  getOrders,
  getBlogs,
} from "../controllers/adminController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, admin); // 🔐 Protect all admin routes

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getOrders);
router.get("/blogs", getBlogs);

export default router;
