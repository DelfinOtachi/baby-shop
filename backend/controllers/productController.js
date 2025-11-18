import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

// 🟢 CREATE Product
// variants example: { colors: ["red","blue"], sizes: ["S","M"], ages: [3,4,5] 

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
      newArrival,
      topDeal,
      variants, // { colors: [], sizes: [], ages: [] }
    } = req.body;

    // ✅ Basic field validation
    if (!name || !slug || !price || !category) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // ✅ Check category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category." });
    }

    // ✅ Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Please upload at least one main image." });
    }

    // ✅ Validate variants (if provided)
    const variantErrors = [];
    if (variants) {
      const checkArray = (arr, type) => {
        if (!Array.isArray(arr)) return;
        arr.forEach((item, idx) => {
          if (!item.value) {
            variantErrors.push(`${type} variant #${idx + 1} is missing a value.`);
          }
          if (!item.images || item.images.length === 0) {
            variantErrors.push(`${type} variant "${item.value || `#${idx + 1}`}" must have at least one image.`);
          }
        });
      };

      checkArray(variants.colors, "Color");
      checkArray(variants.sizes, "Size");
      checkArray(variants.ages, "Age");
    }

    if (variantErrors.length > 0) {
      return res.status(400).json({ message: "Variant validation failed.", errors: variantErrors });
    }

    // ✅ Create product
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
      newArrival,
      topDeal,
      variants: variants || {},
    });

    const saved = await product.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error("Create product error:", error);

    // 🧠 Friendly validation message for Mongoose errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation failed.", errors: messages });
    }

    res.status(500).json({ message: "Server error" });
  }
};


// 🟢 UPDATE Product
// 🟢 UPDATE Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // ✅ Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    // ✅ Validate images
    if (updatedData.images) {
      if (!Array.isArray(updatedData.images) || updatedData.images.length === 0) {
        return res.status(400).json({ message: "Please include at least one main image." });
      }
    }

    // ✅ Validate variants (if provided)
    const variantErrors = [];
    if (updatedData.variants) {
      const checkArray = (arr, type) => {
        if (!Array.isArray(arr)) return;
        arr.forEach((item, idx) => {
          if (!item.value) {
            variantErrors.push(`${type} variant #${idx + 1} is missing a value.`);
          }
          if (!item.images || item.images.length === 0) {
            variantErrors.push(`${type} variant "${item.value || `#${idx + 1}`}" must have at least one image.`);
          }
        });
      };

      checkArray(updatedData.variants.colors, "Color");
      checkArray(updatedData.variants.sizes, "Size");
      checkArray(updatedData.variants.ages, "Age");
    }

    if (variantErrors.length > 0) {
      return res.status(400).json({ message: "Variant validation failed.", errors: variantErrors });
    }

    // ✅ Ensure numeric fields are properly cast
    if (updatedData.price) updatedData.price = Number(updatedData.price);
    if (updatedData.oldPrice) updatedData.oldPrice = Number(updatedData.oldPrice);
    if (updatedData.countInStock) updatedData.countInStock = Number(updatedData.countInStock);

    // ✅ Ensure variants always exist as an object
    if (!updatedData.variants) updatedData.variants = {};

    // ✅ Perform update
    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true, // 🔥 ensures Mongoose schema validation also runs
    });
    if (updatedData.name && !updatedData.slug) {
  updatedData.slug = updatedData.name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") + "-" + Date.now();
}

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);

    // 🧠 Friendly message for validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation failed.", errors: messages });
    }

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
// ✅ Top Deals with fallback to highest discounts
export const getTopDeals = async (req, res) => {
  try {
    // 1️⃣ Get manually flagged top deals
    let topDeals = await Product.find({ topDeal: true })
      .sort({ createdAt: -1 })
      .limit(8);

    const topDealCount = topDeals.length;

    // 2️⃣ If fewer than 5, add highest discount products
    if (topDealCount < 5) {
      // Get additional products sorted by discount
      const needed = 8 - topDealCount;

      // Only include products not already in topDeals
      const excludeIds = topDeals.map((p) => p._id);

      const additionalDeals = await Product.aggregate([
        {
          $match: {
            _id: { $nin: excludeIds },
            oldPrice: { $gt: 0 }, // ensure discountable
            $expr: { $gt: ["$oldPrice", "$price"] }, // ensure discounted
          },
        },
        {
          $addFields: {
            discountAmount: { $subtract: ["$oldPrice", "$price"] },
          },
        },
        { $sort: { discountAmount: -1 } },
        { $limit: needed },
      ]);

      // Merge manually flagged + additional
      topDeals = [...topDeals, ...additionalDeals];
    }

    res.json(topDeals);
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


// GET product by slug
export const productDetail = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    
      .populate("category")
      .populate("subCategory");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// 🟢 Get related products
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const current = await Product.findById(id);
    if (!current) {
      return res.status(404).json({ message: "Product not found" });
    }

    const related = await Product.find({
      category: current.category,
      _id: { $ne: current._id },
    })
      .limit(6)
      .populate("category", "name");

    res.json(related);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Server error" });
  }
};



