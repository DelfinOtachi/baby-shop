// src/utils/cartUtils.js

// ✅ Get cart safely (per user if logged in)
export const getCart = (userId = null) => {
  const key = userId ? `cart_${userId}` : "cart";

  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Array.isArray(saved.items)) return saved;
  } catch {
    // ignore malformed JSON
  }
  return { items: [], totalPrice: 0 };
};

// ✅ Save cart + trigger update event for Navbar
export const saveCart = (cart, userId = null) => {
  const key = userId ? `cart_${userId}` : "cart";
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ Add to cart
export const addToCart = (product, quantity = 1, userId = null) => {
  const cart = getCart(userId);

  if (!Array.isArray(cart.items)) cart.items = [];

  const existing = cart.items.find((item) => item.product._id === product._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product,
      quantity,
      price: product.price,
    });
  }

  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  saveCart(cart, userId);
  return cart;
};

// ✅ Remove item from cart
export const removeFromCart = (productId, userId = null) => {
  const cart = getCart(userId);

  if (!Array.isArray(cart.items)) cart.items = [];

  cart.items = cart.items.filter((i) => i.product._id !== productId);
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  saveCart(cart, userId);
  return cart;
};

// ✅ Clear cart
export const clearCart = (userId = null) => {
  const emptyCart = { items: [], totalPrice: 0 };
  saveCart(emptyCart, userId);
  return emptyCart;
};
