import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentFailed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-6">
      <XCircle size={80} className="text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        Payment Failed ❌
      </h1>
      <p className="text-gray-700 mb-8">
        Oops! Something went wrong while processing your payment.
        Please try again or use a different M-Pesa number.
      </p>
      <Link
        to="/checkout"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
      >
        Try Again
      </Link>
    </div>
  );
}
