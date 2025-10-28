import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

// @desc Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, slug, subCategories } = req.body;
    const category = new Category({ name, slug, subCategories });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // Fetch subcategories for each category
    const categoriesWithSubs = await Promise.all(
      categories.map(async (cat) => {
        const subs = await SubCategory.find({ category: cat._id });
        return { ...cat._doc, subCategories: subs };
      })
    );

    res.json(categoriesWithSubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get featured categories with up to 4 subcategories
export const getFeaturedCategoriesWithSubs = async (req, res) => {
  try {
    // find featured categories
    const featured = await Category.find({ featured: true });

    // attach up to 4 subcategories for each
    const categoriesWithSubs = await Promise.all(
      featured.map(async (cat) => {
        const subs = await SubCategory.find({ category: cat._id })
          .limit(4)
          .select("name slug image");
        return { ...cat._doc, subCategories: subs };
      })
    );

    res.json(categoriesWithSubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


