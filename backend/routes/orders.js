import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/orders - create new order
router.post("/", protect, createOrder);

// GET /api/orders/myorders - get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// GET /api/orders/:id - get single order
router.get("/:id", protect, getOrderById);

// PUT /api/orders/:id/pay - mark as paid
router.put("/:id/pay", protect, updateOrderToPaid);

export default router;
