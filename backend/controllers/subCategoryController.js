import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";

// ✅ Create a new subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, slug, category, image, featured } = req.body;

    if (!name || !slug || !category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    const subCategory = await SubCategory.create({
      name,
      slug,
      category,
      image: image || "",
      featured: featured || false,
    });

    res.status(201).json(subCategory);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all subcategories
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get subcategories by category
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ category: categoryId })
      .populate("category", "name");
    res.json(subCategories);
  } catch (error) {
    console.error("Error fetching by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, category, image, featured } = req.body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    subCategory.name = name ?? subCategory.name;
    subCategory.slug = slug ?? subCategory.slug;
    subCategory.category = category ?? subCategory.category;
    subCategory.image = image ?? subCategory.image;
    subCategory.featured = typeof featured === "boolean" ? featured : subCategory.featured;

    const updated = await subCategory.save();
    res.json(updated);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.json({ message: "SubCategory deleted" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get featured subcategories
export const getFeaturedSubcategories = async (req, res) => {
  try {
    const featured = await SubCategory.find({ featured: true })
      .populate("category", "name");
    res.json(featured);
  } catch (error) {
    console.error("Error fetching featured subcategories:", error);
    res.status(500).json({ message: "Server error" });
  }
};
