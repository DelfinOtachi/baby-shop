import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function ProfilePage() {
  const { user, token, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Populate form with user data on load
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Check password match
    if (form.password && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Build update payload
    const updateData = {
      name: form.name,
      phone: form.phone,
      address: form.address,
    };

    // Only include email if changed
    if (form.email !== user.email) updateData.email = form.email;

    // Only include password if entered
    if (form.password) updateData.password = form.password;

    setLoading(true);

    try {
  const res = await axios.put(
    "http://localhost:5000/api/users/profile",
    updateData,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // ✅ Treat successful responses
  if (res.status === 200) {
    setUser(res.data);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setMessage("Profile updated successfully!");
    setForm({ ...form, password: "", confirmPassword: "" });
  } else {
    setMessage("Update failed");
  }
} catch (err) {
  console.error(err.response || err);
  setMessage(err.response?.data?.message || "Update failed");
} finally {
  setLoading(false); // ✅ Ensure loading stops
}

  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h2>

      {message && (
        <p
          className={`mb-4 ${
            message.includes("success") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded-md"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2 rounded-md"
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2 rounded-md"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full border p-2 rounded-md"
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
          className="w-full border p-2 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-full text-white ${
            loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
