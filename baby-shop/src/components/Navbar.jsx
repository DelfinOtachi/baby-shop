import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../utils/cartUtils";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED import

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // 🟢 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/categories/with-subs"
        );
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🟢 Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
      const totalItems = Array.isArray(cart.items)
        ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0;
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  // 🟢 Check and validate login token
  useEffect(() => {
  const checkUser = () => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    const token = userData?.token;

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired — logging out");
        handleLogout();
      } else {
        setUser(userData);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      handleLogout();
    }
  };

  checkUser();
  window.addEventListener("userUpdated", checkUser);
  return () => window.removeEventListener("userUpdated", checkUser);
}, []);

  // 🟣 Logout function
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-pink-200 shadow-sm">
      {/* Top Row */}
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Narya Baby"
            className="h-8 w-8 rounded-full object-cover"
          />
          <h1 className="text-xl font-bold text-blue-800 tracking-tight">
            Narya Baby
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 mx-6 max-w-md">
          <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search for baby products..."
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
            />
            <Search size={18} className="text-[#F9A8D4]" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 relative">
          <img
            src="https://flagcdn.com/w20/ke.png"
            alt="Kenya Flag"
            className="h-4 w-6 rounded-sm"
          />
          <Heart className="text-gray-700 hover:text-[#F9A8D4] cursor-pointer transition" />

          {/* 🛒 Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="text-gray-700 hover:text-[#F9A8D4] transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C084FC] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* 👤 User Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center text-blue-800 font-medium hover:text-[#F9A8D4] transition"
              >
                <User className="mr-1" size={18} />
                {user.name?.split(" ")[0] || "User"}
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 🔽 Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li
                      className="flex items-center gap-2 px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      <User size={16} /> Profile
                    </li>
                    <li
                      className="flex items-center gap-2 px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        navigate("/orders");
                        setDropdownOpen(false);
                      }}
                    >
                      <Package size={16} /> My Orders
                    </li>
                    <hr className="my-1" />
                    <li
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center text-blue-800 font-medium hover:text-[#F9A8D4] transition"
            >
              <User className="mr-1" size={18} />
              Login / Register
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-pink-300">
        <ul className="flex justify-center space-x-6 py-2 text-sm font-medium text-white relative max-w-7xl mx-auto">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="relative group"
              onMouseEnter={() => setHovered(cat._id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center space-x-1 cursor-pointer hover:text-[#C084FC] transition">
                <span>{cat.name}</span>
                {cat.subCategories.length > 0 && <ChevronDown size={14} />}
              </div>

              {/* Dropdown */}
              {hovered === cat._id && cat.subCategories.length > 0 && (
                <ul className="absolute left-0 top-full mt-2 bg-white text-gray-700 rounded-lg shadow-md min-w-[180px] py-2 z-50">
                  {cat.subCategories.map((sub) => (
                    <li
                      key={sub._id}
                      className="px-4 py-2 hover:bg-pink-100 hover:text-pink-600 cursor-pointer"
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
