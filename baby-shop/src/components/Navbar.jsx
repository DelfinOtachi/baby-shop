import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Search, Heart, ShoppingCart, User, ChevronDown, LogOut, Package, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories/with-subs");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Cart count
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

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-babyPink shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Narya Baby" className="h-8 w-8 rounded-full object-cover" />
          <h1 className="text-xl font-bold text-blue-800 tracking-tight">Narya Baby</h1>
        </div>

        {/* Search */}
        <div className="flex-1 mx-4 max-w-md hidden sm:flex">
          <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm w-full">
            <input type="text" placeholder="Search for baby products..." className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400" />
            <Search size={18} className="text-[#F9A8D4]" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 relative">
          {/* Mobile menu toggle */}
          <button className="sm:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <img src="https://flagcdn.com/w20/ke.png" alt="Kenya Flag" className="h-4 w-6 rounded-sm hidden sm:block" />
          <Heart className="text-gray-700 hover:text-[#F9A8D4] cursor-pointer transition hidden sm:block" />

          {/* Cart */}
          <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <ShoppingCart className="text-gray-700 hover:text-[#F9A8D4] transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C084FC] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* User */}
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen((prev) => !prev)} className="flex items-center text-blue-800 font-medium hover:text-[#F9A8D4] transition">
                <User className="mr-1" size={18} />
                {user.name?.split(" ")[0] || "User"}
                <ChevronDown size={16} className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-pink-50 cursor-pointer" onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>
                      <User size={16} /> Profile
                    </li>
                    <li
  className="flex items-center gap-2 px-4 py-2 hover:bg-pink-50 cursor-pointer"
  onClick={() => { navigate("/myorders"); setDropdownOpen(false); }}
>
  <Package size={16} /> My Orders
</li>

                    <hr className="my-1" />
                    <li className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="flex items-center text-blue-800 font-medium hover:text-[#F9A8D4] transition">
              <User className="mr-1" size={18} />
              Login / Register
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-pink-100 border-t border-gray-200">
          <ul className="flex flex-col px-4 py-2 text-gray-700 space-y-1">
            {categories.map((cat) => (
              <li key={cat._id} className="relative">
                <button onClick={() => setHovered(hovered === cat._id ? null : cat._id)} className="w-full flex justify-between items-center py-2 px-2 text-left hover:bg-pink-50 rounded-md">
                  {cat.name}
                  {cat.subCategories.length > 0 && <ChevronDown size={14} className={`${hovered === cat._id ? "rotate-180" : ""} transition`} />}
                </button>
                {hovered === cat._id && cat.subCategories.length > 0 && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {cat.subCategories.map((sub) => (
                      <li key={sub._id} className="py-1 px-2 hover:bg-pink-100 rounded cursor-pointer" onClick={() => navigate(`/subcategory/${sub.slug}`)}>
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Navigation for larger screens */}
      <nav className="hidden sm:block bg-pink-100">
        <ul className="flex justify-center space-x-6 py-2 text-sm font-medium text-babyBlue relative max-w-7xl mx-auto">
          {categories.map((cat) => (
            <li key={cat._id} className="relative group" onMouseEnter={() => setHovered(cat._id)} onMouseLeave={() => setHovered(null)}>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-[#C084FC] transition">
                <span>{cat.name}</span>
                {cat.subCategories.length > 0 && <ChevronDown size={14} />}
              </div>

              {hovered === cat._id && cat.subCategories.length > 0 && (
                <ul className="absolute left-0 top-full mt-2 bg-white text-gray-700 rounded-lg shadow-md min-w-[180px] py-2 z-50">
                  {cat.subCategories.map((sub) => (
                    <li key={sub._id} className="px-4 py-2 hover:bg-pink-100 hover:text-pink-600 cursor-pointer">
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
