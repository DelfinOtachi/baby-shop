// src/utils/cartUtils.js

// ✅ Get cart safely
export const getCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (saved && Array.isArray(saved.items)) return saved;
  } catch {
    // ignore malformed JSON
  }
  return { items: [], totalPrice: 0 };
};

// ✅ Save cart + trigger update event for Navbar
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ Add to cart (even if no cart exists yet)
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();

  if (!Array.isArray(cart.items)) cart.items = [];

  const existing = cart.items.find(
    (item) => item.product._id === product._id
  );

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

  saveCart(cart);
  return cart;
};

// ✅ Remove item from cart
export const removeFromCart = (productId) => {
  const cart = getCart();

  if (!Array.isArray(cart.items)) cart.items = [];

  cart.items = cart.items.filter((i) => i.product._id !== productId);
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  saveCart(cart);
  return cart;
};

// ✅ Clear cart
export const clearCart = () => {
  const emptyCart = { items: [], totalPrice: 0 };
  saveCart(emptyCart);
  return emptyCart;
};
