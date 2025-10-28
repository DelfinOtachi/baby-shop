import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-6 border"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item._id} className="flex justify-between">
                    <span>{item.product.name}</span>
                    <span>
                      {item.quantity} × KSh {item.price.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <p>Address: {order.address}</p>
                <p>
                  Total:{" "}
                  <span className="font-bold text-gray-800">
                    KSh {order.totalPrice.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
