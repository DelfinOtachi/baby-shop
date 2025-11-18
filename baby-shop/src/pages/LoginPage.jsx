import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async credentialResponse => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        { credential: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      window.dispatchEvent(new Event("userUpdated"));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => setError("Google login was unsuccessful.");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-500">Log In</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          autoComplete="email"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          autoComplete="current-password"
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"}`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Google Login */}
        <div className="mt-6 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        {/* Register link */}
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
