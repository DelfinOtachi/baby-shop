import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51SP1eDLpagoMqocIicotoyF3yci1wn4laWn3RuvuJobSseLjPnGZxw4rJ2zXY8x7kiATRbE0h3TasJx2MLDECAn100dfO7s88E"
);

// --- Inner Component handles payment ---
function CheckoutInner() {
  const stripe = useStripe();
  const elements = useElements();

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
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {
      items: [],
      totalPrice: 0,
    };
    setCart(storedCart);
  }, []);

  const itemsPrice = cart.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 5000 ? 0 : 0;
  const totalPrice = itemsPrice + shippingPrice;

  // 🧾 Create new order in DB
  const createOrder = async (paymentResult = {}) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;

    const { data } = await axios.post(
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

    return data; // should include _id
  };

  // 💳 Handle payment
  const handlePay = async () => {
    if (!shipping.fullName || !shipping.phone || !shipping.address) {
      alert("⚠️ Please fill in all shipping details.");
      return;
    }

    setLoading(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;

    try {
      const order = await createOrder({ status: "Pending Payment" });
      console.log("🧾 Order created:", order);
      const orderId = order?._id || order?.id;
      if (!orderId) throw new Error("Order ID missing in response");

      // --- M-Pesa ---
      if (paymentMethod === "M-Pesa") {
        const { data: stk } = await axios.post(
          "http://localhost:5000/api/payments/stkpush",
          { phone: shipping.phone, totalPrice, orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const checkoutId = stk.mpesaResponse?.CheckoutRequestID;
        if (checkoutId) {
          await axios.put(
            `http://localhost:5000/api/orders/${orderId}/mpesa-id`,
            { checkoutId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        alert("📱 STK Push sent! Please complete payment on your phone.");
        setTimeout(() => pollPaymentStatus(orderId), 5000);
      }

      // --- Cash on Delivery ---
      else if (paymentMethod === "Cash on Delivery") {
        alert("✅ Order placed successfully! Pay upon delivery.");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        window.location.href = `/order/${orderId}`;
      }

      // --- Card / Stripe ---
      else if (paymentMethod === "Card") {
        const { data } = await axios.post(
          "http://localhost:5000/api/payments/stripe/create-intent",
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: { card: elements.getElement(CardElement) },
          }
        );

        if (error) {
          alert("❌ Card payment failed: " + error.message);
        } else if (paymentIntent.status === "succeeded") {
          alert("✅ Card payment successful!");
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
          window.location.href = `/order/${orderId}/confirmed`;
        }
      }

      // --- Bitcoin (via Coinbase) ---
      else if (paymentMethod === "Bitcoin") {
        const { data } = await axios.post(
          "http://localhost:5000/api/crypto/create-charge",
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!data?.hosted_url) throw new Error("No hosted URL returned");
        window.location.href = data.hosted_url; // Redirect to Coinbase Checkout
      }

      // --- PayPal (optional future) ---
      else if (paymentMethod === "PayPal") {
        alert("💳 PayPal not yet implemented.");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Poll for MPesa payments
 const pollPaymentStatus = (orderId) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  let attempts = 0;
  const maxAttempts = 12; // 12 * 5s = 1 min

  const interval = setInterval(async () => {
    attempts++;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.isPaid) {
        clearInterval(interval);
        setPaymentStatus("✅ Payment received! Cart cleared.");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        window.location.href = `/order/${orderId}/confirmed`;
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPaymentStatus(
          "⚠️ Payment pending. Please complete payment on your phone."
        );
      }
    } catch (err) {
      console.error("Error fetching order status:", err);
      if (attempts >= maxAttempts) clearInterval(interval);
    }
  }, 5000);
};


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">🧾 Checkout</h1>

      {/* Order Summary */}
      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
        <ul>
          {cart.items.map((item) => (
            <li key={item.product._id} className="flex justify-between mb-1">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <p>Items: KSh {itemsPrice.toLocaleString()}</p>
        <p>Shipping: KSh {shippingPrice.toLocaleString()}</p>
        <p className="font-bold">Total: KSh {totalPrice.toLocaleString()}</p>
      </div>

      {/* Shipping */}
      <div className="space-y-3 mb-6">
        <h2 className="font-semibold text-lg">Shipping Address</h2>
        {["fullName", "phone", "address", "city", "postalCode"].map((f) => (
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

      {/* Payment Method */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Payment Method</h2>
        {["M-Pesa", "Cash on Delivery", "Card", "Bitcoin"].map((method) => (
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

      {/* Stripe Card Input */}
      {paymentMethod === "Card" && (
        <div className="border rounded p-3 mb-4">
          <CardElement />
        </div>
      )}

      {paymentStatus && (
        <p className="mb-4 text-green-600 font-semibold">{paymentStatus}</p>
      )}

      <button
        onClick={handlePay}
        disabled={loading || (paymentMethod === "Card" && !stripe)}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Pay / Place Order"}
      </button>
    </div>
  );
}

// --- Wrap with Elements ---
export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}
//after payment, the cart isnt cleared and it does not show success. orders are created in the db tho and they are paid