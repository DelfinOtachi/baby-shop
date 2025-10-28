import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Blog from "../models/BlogPost.js";

// 📦 Dashboard summary
export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const blogs = await Blog.countDocuments();

    res.json({ users, products, orders, blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧍 Manage Users
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// 🧸 Manage Products
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

// 🛍 Manage Orders
export const getOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
};

// 📰 Manage Blogs
export const getBlogs = async (req, res) => {
  const blogs = await BlogPost.find().populate("author", "name email");
  res.json(blogs);
};
