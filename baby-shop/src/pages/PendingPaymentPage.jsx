import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PendingPaymentPage() {
  const { id: orderId } = useParams();
  const [status, setStatus] = useState("Waiting for payment confirmation...");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.isPaid) {
          clearInterval(interval);
          setStatus("✅ Payment received! Redirecting...");
          setPaid(true);

          // 🧹 Clear cart
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));

          // Redirect after short delay
          setTimeout(() => {
            window.location.href = `/order/${orderId}/confirmed`;
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      {!paid ? (
        <>
          <div className="animate-pulse text-3xl mb-6">📱</div>
          <h1 className="text-xl font-semibold mb-3">{status}</h1>
          <p className="text-gray-600">Please approve the payment on your phone...</p>
        </>
      ) : (
        <h1 className="text-green-600 text-2xl font-bold mt-4">{status}</h1>
      )}
    </div>
  );
}
