import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  deleteSubCategory,getFeaturedSubcategories,updateSubCategory,
} from "../controllers/subCategoryController.js";

const router = express.Router();

router.post("/", createSubCategory);
router.get("/", getSubCategories);
router.get("/featured", getFeaturedSubcategories); // ✅ new route
router.get("/category/:categoryId", getSubCategoriesByCategory); // 🟢 used by frontend
router.put("/:id", updateSubCategory); // ✅ new route

router.delete("/:id", deleteSubCategory);

export default router;
