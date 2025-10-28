import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  getNewArrivals,
  getTopDeals,
  deleteProduct,
  getFeaturedProducts, // ✅ import
} from "../controllers/productController.js";

const router = express.Router();

// CRUD routes
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/top-deals", getTopDeals);
router.get("/featured", getFeaturedProducts); // ✅ new route
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);



export default router;
