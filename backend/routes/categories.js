import express from "express";
const router = express.Router();

import {
  getCategories,
  createCategory,
  getCategoryBySlug,
  getCategoriesWithSubcategories,
  getFeaturedCategoriesWithSubs, // <-- add this
} from "../controllers/categoryController.js";

// ✅ add new route
router.get("/featured-with-subs", getFeaturedCategoriesWithSubs);

router.get("/with-subs", getCategoriesWithSubcategories);
router.route("/").get(getCategories).post(createCategory);
router.route("/:slug").get(getCategoryBySlug);

export default router;

