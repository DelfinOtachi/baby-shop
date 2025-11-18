import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  attachMpesaId,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/authMiddleware.js"; // <-- import admin
import OrderLog from "../models/OrderLog.js";


const router = express.Router();

// POST /api/orders - create new order
router.post("/", protect, createOrder);

// GET /api/orders/myorders - get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

router.get("/", protect, admin, getAllOrders); // only for admin/staff

// in routes/orders.js (or a new route)
router.get("/:id/logs", protect, admin, async (req, res) => {
  try {
    const logs = await OrderLog.find({ order: req.params.id }).populate("actor", "name email").sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE /api/orders/:id - cancel order
router.delete("/:id", protect, cancelOrder);

router.put("/:id/status", protect, updateOrderStatus);


// GET /api/orders/:id - get single order
router.get("/:id", protect, getOrderById);

// PUT /api/orders/:id/pay - mark as paid
router.put("/:id/pay", protect, updateOrderToPaid);

router.put("/:id/mpesa-id", protect, attachMpesaId);


export default router;
