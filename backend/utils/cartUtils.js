// src/utils/cartUtils.js

export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item._id !== productId);
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
