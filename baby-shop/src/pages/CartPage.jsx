import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart, clearCart, addToCart } from "../utils/cartUtils";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const navigate = useNavigate();

  // 🧭 Load cart on mount
  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setCart(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCart({ items: [], totalPrice: 0 });
  };

  // 🟢 Increase quantity
  const increaseQty = (product) => {
    addToCart(product, 1);
    setCart(getCart());
  };

  // 🔴 Decrease quantity
  const decreaseQty = (product) => {
    const currentCart = getCart();
    const existing = currentCart.items.find(
      (i) => i.product._id === product._id
    );

    if (existing && existing.quantity > 1) {
      existing.quantity -= 1;
      currentCart.totalPrice = currentCart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("cartUpdated"));
      setCart(currentCart);
    } else {
      handleRemove(product._id);
    }
  };

 const goToCheckout = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  console.log("🔑 Token before checkout:", token);

  if (!token) {
    console.log("🚫 No valid token — redirecting to login");
    navigate("/login", { state: { from: "/checkout" } });
  } else {
    console.log("✅ Token found — proceeding to checkout");
    navigate("/checkout");
  }
};



  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>

      {cart.items.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 divide-y">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0] || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-500">
                      KSh {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                    <button
                      onClick={() => decreaseQty(item.product)}
                      className="p-1 text-gray-700 hover:text-pink-600"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-3 font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.product)}
                      className="p-1 text-gray-700 hover:text-pink-600"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <p className="font-semibold text-gray-800 w-24 text-right">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>

                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="flex justify-between items-center bg-white shadow p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800">
              Total: <span className="text-pink-600">KSh {cart.totalPrice.toLocaleString()}</span>
            </h2>
            <div className="space-x-4">
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={goToCheckout}
                className="bg-babyBlue hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
