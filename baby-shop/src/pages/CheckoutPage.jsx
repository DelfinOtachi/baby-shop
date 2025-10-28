import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");
  const [loading, setLoading] = useState(false);

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || { items: [], totalPrice: 0 };
    setCart(storedCart);
  }, []);

  const itemsPrice = cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 300;
  const totalPrice = itemsPrice + shippingPrice;

  // Create order in DB
  const createOrder = async (paymentResult = {}) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart.items.map((i) => ({
            product: i.product._id,
            name: i.product.name,
            qty: i.quantity,
            price: i.price,
            image: i.product.images?.[0] || "",
          })),
          shippingAddress: shipping,
          paymentMethod,
          paymentResult,
          itemsPrice,
          shippingPrice,
          totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      alert("✅ Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save order");
    }
  };

  const handlePay = async () => {
    if (!shipping.fullName || !shipping.phone || !shipping.address) {
      alert("⚠️ Please fill in all shipping details.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (paymentMethod === "M-Pesa") {
        const { data } = await axios.post(
          "http://localhost:5000/api/payments/stkpush",
          { phone: shipping.phone, totalPrice, items: cart.items, address: shipping },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(data.message || "📱 STK Push sent!");
        await createOrder({ id: data.mpesaResponse?.CheckoutRequestID || "", status: "Pending Payment" });

      } else if (paymentMethod === "Cash on Delivery") {
        await createOrder({ id: "COD-" + Date.now(), status: "Cash on Delivery - Pending" });

      } else if (paymentMethod === "Card") {
        const { data } = await axios.post(
          "http://localhost:5000/api/payments/stripe-intent",
          { amount: totalPrice },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;

      } else if (paymentMethod === "PayPal") {
        const { data } = await axios.post(
          "http://localhost:5000/api/payments/paypal-create",
          { amount: totalPrice },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Redirect to PayPal approval
        window.location.href = data.approvalUrl;
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">🧾 Checkout</h1>

      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
        <ul>
          {cart.items.map((item) => (
            <li key={item.product._id} className="flex justify-between mb-1">
              <span>{item.product.name} x {item.quantity}</span>
              <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <p>Items: KSh {itemsPrice.toLocaleString()}</p>
        <p>Shipping: KSh {shippingPrice.toLocaleString()}</p>
        <p>Total: KSh {totalPrice.toLocaleString()}</p>
      </div>

      <div className="space-y-3 mb-6">
        <h2 className="font-semibold text-lg">Shipping Address</h2>
        {["fullName","phone","address","city","postalCode"].map((f) => (
          <input
            key={f}
            type="text"
            placeholder={f === "phone" ? "Phone (07...)" : f}
            value={shipping[f]}
            onChange={(e) => setShipping({ ...shipping, [f]: e.target.value })}
            className="w-full border rounded p-2"
          />
        ))}
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Payment Method</h2>
        {["M-Pesa","Cash on Delivery","Card","PayPal"].map((method) => (
          <label key={method} className="flex items-center gap-2 mr-4">
            <input
              type="radio"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {method}
          </label>
        ))}
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Pay / Place Order"}
      </button>
    </div>
  );
}
