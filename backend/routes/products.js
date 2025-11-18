import express from "express";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  getNewArrivals,
  getTopDeals,
  getFeaturedProducts,
  productDetail,
  getRelatedProducts
} from "../controllers/productController.js";


const router = express.Router();

// 🟢 CREATE a product
// POST /api/products
router.post("/", createProduct);

// 🟢 UPDATE a product
// PUT /api/products/:id
router.put("/:id", updateProduct);

// 🟢 DELETE a product
// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

//get related products
router.get("/:id/related", getRelatedProducts);

// 🟢 GET all products
// GET /api/products
router.get("/", getProducts);

// 🟢 GET single product by ID
// GET /api/products/:id
router.get("/id/:id", getProductById); // Use /id/:id to avoid conflict with slug route

// 🟢 GET product by slug
// GET /api/products/slug/:slug
router.get("/slug/:slug", productDetail);

// ✅ GET new arrivals
// GET /api/products/new-arrivals
router.get("/new-arrivals", getNewArrivals);

// ✅ GET top deals
// GET /api/products/top-deals
router.get("/top-deals", getTopDeals);

// ✅ GET featured products
// GET /api/products/featured
router.get("/featured", getFeaturedProducts);


export default router;
