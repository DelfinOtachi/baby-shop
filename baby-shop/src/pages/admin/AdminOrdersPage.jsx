import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await axios.get("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    await axios.put(
      `http://localhost:5000/api/orders/${id}`,
      { orderStatus: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchOrders();
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🧾 All Orders</h1>

      <table className="w-full border border-gray-200 bg-white rounded-xl shadow-md">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border">User</th>
            <th className="p-3 border">Items</th>
            <th className="p-3 border">Total</th>
            <th className="p-3 border">Payment</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center border-t">
              <td className="p-3 border">{order.user?.name}</td>
              <td className="p-3 border">
                {order.items.map((i) => (
                  <div key={i._id}>
                    {i.product.name} × {i.quantity}
                  </div>
                ))}
              </td>
              <td className="p-3 border">KSh {order.totalPrice.toLocaleString()}</td>
              <td className="p-3 border">{order.paymentStatus}</td>
              <td className="p-3 border">{order.orderStatus}</td>
              <td className="p-3 border space-x-2">
                {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order._id, s)}
                    className="px-2 py-1 text-xs bg-purple-100 rounded hover:bg-purple-200"
                  >
                    {s}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
