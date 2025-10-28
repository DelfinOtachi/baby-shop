import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

// 🟢 CREATE Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      images,
      price,
      oldPrice,
      category,
      subCategory,
      countInStock,
      featured,
    } = req.body;

    if (!name || !slug || !price || !category) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Optional validation
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(400).json({ message: "Invalid category." });

    if (subCategory) {
      const subExists = await SubCategory.findById(subCategory);
      if (!subExists)
        return res.status(400).json({ message: "Invalid subcategory." });
    }

    const product = new Product({
      name,
      slug,
      description,
      images,
      price,
      oldPrice,
      category,
      subCategory,
      countInStock,
      featured,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subCategory", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ New Arrivals
export const getNewArrivals = async (req, res) => {
  try {
    let arrivals = await Product.find({ newArrival: true })
      .sort({ createdAt: -1 })
      .limit(8);

    // ✅ Fallback: if no manually flagged new arrivals, show latest products
    if (!arrivals.length) {
      arrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    }

    res.json(arrivals);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Top Deals
export const getTopDeals = async (req, res) => {
  try {
    // 1️⃣ Get manually flagged top deals
    let deals = await Product.find({ topDeal: true })
      .sort({ createdAt: -1 })
      .limit(8);

    // 2️⃣ If no deals flagged, fallback to biggest discounts
    if (!deals.length) {
      deals = await Product.aggregate([
        {
          $addFields: {
            discount: { $subtract: ["$oldPrice", "$price"] },
          },
        },
        { $match: { discount: { $gt: 0 } } }, // ensure discounted
        { $sort: { discount: -1 } },
        { $limit: 8 },
      ]);
    }

    res.json(deals);
  } catch (err) {
    console.error("Error fetching top deals:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ featured: true })
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });

    res.json(featured);
  } catch (err) {
    console.error("Error fetching featured products:", err);
    res.status(500).json({ message: "Server error" });
  }
};
