import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // 🟢 Fetch order details
  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Refresh every 5s until paid
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !order)
    return <p className="p-6 text-center">Loading order...</p>;

  const {
    _id,
    isPaid,
    paymentMethod,
    totalPrice,
    paymentResult,
    shippingAddress,
    items,
  } = order;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h1 className="text-2xl font-bold mb-4">🧾 Order Details</h1>

      <p><strong>Order ID:</strong> {_id}</p>
      <p><strong>Payment Method:</strong> {paymentMethod}</p>
      <p><strong>Total:</strong> KSh {totalPrice.toLocaleString()}</p>

      <div className="mt-4 border-t pt-4">
        <h2 className="font-semibold">Shipping</h2>
        <p>{shippingAddress.fullName}</p>
        <p>{shippingAddress.address}, {shippingAddress.city}</p>
        <p>{shippingAddress.phone}</p>
      </div>

      <div className="mt-4 border-t pt-4">
        <h2 className="font-semibold mb-2">Items</h2>
        {items.map((i) => (
          <div key={i.product} className="flex justify-between mb-1">
            <span>{i.name} x {i.qty}</span>
            <span>KSh {(i.qty * i.price).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-6 text-center">
        {isPaid ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-green-100 text-green-700 p-4 rounded-lg font-semibold"
          >
            ✅ Payment Confirmed! <br />
            Receipt: {paymentResult?.mpesaReceipt || "N/A"}
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="bg-yellow-100 text-yellow-800 p-4 rounded-lg font-semibold"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-700 border-t-transparent rounded-full animate-spin"></div>
              <span>Waiting for M-Pesa confirmation...</span>
            </div>
            <p className="text-sm mt-1">This page auto-refreshes every 5 seconds</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
