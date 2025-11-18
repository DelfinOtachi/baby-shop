import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      const token = user?.token || storedUser?.token;
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/orders/myorders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();
}, [user, navigate]);


  const handleCancel = async (orderId) => {
  if (!window.confirm("Are you sure you want to cancel this order?")) return;

  try {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    const token = user?.token || storedUser?.token;
    if (!token) {
      navigate("/login");
      return;
    }

    await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders((prev) => prev.filter((order) => order._id !== orderId));
    alert("Order canceled successfully.");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to cancel order.");
  }
};


  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
  {orders.map((order) => (
    <li key={order._id} className="border p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <p className="font-medium">Order #{order._id.slice(-6)}</p>
        <p>Total: KES {order.totalPrice.toFixed(2)}</p>
        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
        <p>Current Status: {order.deliveryStatus}</p>
{order.statusTimestamps.atStore && <p>At Store: {new Date(order.statusTimestamps.atStore).toLocaleString()}</p>}
{order.statusTimestamps.picked && <p>Picked Up: {new Date(order.statusTimestamps.picked).toLocaleString()}</p>}
{order.statusTimestamps.outForDelivery && <p>Out for Delivery: {new Date(order.statusTimestamps.outForDelivery).toLocaleString()}</p>}
{order.statusTimestamps.delivered && <p>Delivered: {new Date(order.statusTimestamps.delivered).toLocaleString()}</p>}

        <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      {!order.isPaid && order.deliveryStatus !== "Cancelled" && (
        <button
          onClick={() => handleCancel(order._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2 sm:mt-0"
        >
          Cancel
        </button>
      )}
    </li>
  ))}
</ul>

      )}
    </div>
  );
}
