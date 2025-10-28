import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-6">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-gray-700 mb-8">
        Your payment has been received successfully! Thank you for shopping
        with <strong>Narya Baby Store</strong>.
      </p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
