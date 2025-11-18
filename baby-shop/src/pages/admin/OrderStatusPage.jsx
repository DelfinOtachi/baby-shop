import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// push helpers
import { subscribeUserToPush } from "../../utils/notifications";

// FIXED transitions
const allowedTransitions = {
  Pending: ["On The Way To Store", "Cancelled"],
  "On The Way To Store": ["At Store", "Cancelled"],
  "At Store": ["Picked", "Cancelled"],
  Picked: ["Delivered"],
  Delivered: [],
  Cancelled: []
};

const allStages = ["Pending", "On The Way To Store", "At Store", "Picked", "Delivered"];
const stageLabels = ["Pending", "On Way", "At Store", "Picked", "Delivered"];

export default function OrderStatusPage() {
  const { user, token, loadingUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // --- Notifications ---
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [vapidKey, setVapidKey] = useState(null);

  // auth check
  useEffect(() => {
    if (!loadingUser && (!user || !user.isAdmin)) {
      alert("You are not authorized as admin");
      navigate("/");
    }
  }, [user, loadingUser, navigate]);

  // load orders
  useEffect(() => {
    if (!token || !user?.isAdmin) return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token, user]);

  // load VAPID key
  useEffect(() => {
    const loadKey = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications/vapidPublicKey");
        setVapidKey(res.data.publicKey);
      } catch (e) {
        console.warn("No VAPID key available", e);
      }
    };
    loadKey();
  }, []);

  // update status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? res.data : order))
      );
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  if (loadingUser || loadingOrders) return <p>Loading...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      
      {/* ---- Header ---- */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Update Order Status</h1>

        <button
          onClick={async () => {
            try {
              if (!vapidKey) return alert("Push notifications not set on server.");

              const subscription = await subscribeUserToPush(vapidKey);

              await axios.post(
                "http://localhost:5000/api/notifications/subscribe",
                { subscription },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              setNotifEnabled(true);
              alert("Push notifications enabled!");
            } catch (err) {
              console.error(err);
              alert("Subscription failed.");
            }
          }}
          className={`ml-4 px-3 py-1 rounded text-white font-medium transition 
          ${notifEnabled ? "bg-green-600" : "bg-sky-500 hover:bg-sky-600"}`}
        >
          {notifEnabled ? "Notifications Enabled" : "Enable Notifications"}
        </button>
      </div>

      {/* ---- ORDERS ---- */}
      {orders.map((order) => {
        const possibleUpdates = allowedTransitions[order.deliveryStatus] || [];

        return (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 hover:shadow-lg transition"
          >
            
            {/* --- Top Section --- */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

              {/* Order Info */}
              <div className="flex-1 space-y-2">
                <p>
                  <span className="font-semibold">Order ID:</span> {order._id.slice(-6)}
                </p>
                <p>
                  <span className="font-semibold">User:</span>{" "}
                  {order.user?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Total:</span> KES{" "}
                  {order.totalPrice.toFixed(2)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 md:w-64">
                {possibleUpdates.length ? (
                  possibleUpdates.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order._id, status)}
                      className={`px-4 py-2 rounded-lg text-white font-medium shadow-md 
                      transition-all duration-200 hover:scale-[1.04]
                      ${
                        status === "On The Way To Store"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : status === "At Store"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : status === "Picked"
                          ? "bg-green-600 hover:bg-green-700"
                          : status === "Delivered"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : status === "Cancelled"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-500">No actions</span>
                )}
              </div>
            </div>

            {/* ---- Timeline ---- */}
            <div className="mt-4">
              <div className="flex items-center justify-between w-full">

                {allStages.map((stage, index) => {
                  const completed =
                    allStages.indexOf(order.deliveryStatus) >= index;

                  const clickable =
                    allowedTransitions[order.deliveryStatus]?.includes(stage);

                  return (
                    <div key={stage} className="flex-1 flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition
                          ${
                            completed
                              ? "bg-green-600 border-green-600"
                              : "bg-white border-gray-300"
                          }
                          ${
                            clickable
                              ? "cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-blue-500"
                              : ""
                          }
                        `}
                        title={stageLabels[index]}
                        onClick={() => clickable && updateStatus(order._id, stage)}
                      >
                        {completed && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>

                      {index < allStages.length - 1 && (
                        <div
                          className={`flex-1 h-1 ${
                            completed ? "bg-green-600" : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Timeline labels */}
              <div className="flex justify-between text-xs mt-1 text-gray-600">
                {stageLabels.map((label) => (
                  <span key={label} className="text-center w-[20%]">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ---- Timestamps ---- */}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {order.statusTimestamps?.onTheWayToStore && (
                <p>
                  <span className="font-semibold">On Way:</span>{" "}
                  {new Date(order.statusTimestamps.onTheWayToStore).toLocaleString()}
                </p>
              )}
              {order.statusTimestamps?.atStore && (
                <p>
                  <span className="font-semibold">At Store:</span>{" "}
                  {new Date(order.statusTimestamps.atStore).toLocaleString()}
                </p>
              )}
              {order.statusTimestamps?.picked && (
                <p>
                  <span className="font-semibold">Picked:</span>{" "}
                  {new Date(order.statusTimestamps.picked).toLocaleString()}
                </p>
              )}
              {order.statusTimestamps?.delivered && (
                <p>
                  <span className="font-semibold">Delivered:</span>{" "}
                  {new Date(order.statusTimestamps.delivered).toLocaleString()}
                </p>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
