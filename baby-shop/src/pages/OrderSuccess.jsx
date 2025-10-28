import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🧾 Get order details passed from Checkout
  const order = location.state?.order || {};

  useEffect(() => {
    if (!order || !order.totalPrice) {
      // If no order data (e.g. direct visit), redirect to home
      navigate("/");
    }
  }, [order, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us! Your order has been received and is
          being processed.
        </p>

        <div className="border-t border-gray-200 pt-4 text-left">
          <p className="text-gray-700">
            <strong>Order ID:</strong> {order.id || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Total Paid:</strong> KSh{" "}
            {order.totalPrice?.toLocaleString() || "0"}
          </p>
          <p className="text-gray-700">
            <strong>Status:</strong>{" "}
            <span
              className={`${
                order.paymentResult?.status?.includes("Pending")
                  ? "text-yellow-500"
                  : "text-green-600"
              } font-medium`}
            >
              {order.paymentResult?.status || "Confirmed"}
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-8 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
