import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { addToCart as addToLocalCart } from "../utils/cartUtils";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    setAdding(product._id);
    setTimeout(() => {
      addToLocalCart(product, 1);
      alert(`✅ ${product.name} added to cart!`);
      setAdding(null);
    }, 500);
  };

  if (loading) return <section className="py-16 text-center text-gray-500">Loading products...</section>;
  if (error) return <section className="py-16 text-center text-red-600">{error}</section>;

  return (
    <section id="products" className="py-16 bg-gray-50">
      <h3 className="text-3xl font-bold text-center text-babyBlue mb-10">🛍️ Products</h3>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition">
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
                <p className="text-babyPink font-medium mb-3">
                  KES {product.price.toLocaleString()}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={adding === product._id}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full transition ${
                    adding === product._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-babyBlue hover:bg-babyPurple text-white"
                  }`}
                >
                  <ShoppingCart size={18} />
                  {adding === product._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
