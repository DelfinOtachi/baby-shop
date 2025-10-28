import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// 🛒 Get user cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart || { items: [], totalPrice: 0 });
};

// ➕ Add to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) existingItem.quantity += quantity;
  else cart.items.push({ product: productId, quantity, price: product.price });

  cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  await cart.save();

  res.status(200).json(cart);
};

// 🗑️ Remove from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  await cart.save();

  res.json(cart);
};

// 🧹 Clear cart
export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: "Cart cleared" });
};
