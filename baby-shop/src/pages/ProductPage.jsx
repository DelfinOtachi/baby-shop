import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import axios from "axios";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState([]);
  const [sizes] = useState(["0-3M", "3-6M", "6-12M", "12-18M"]);
  const [selectedSize, setSelectedSize] = useState("");

  // 🟢 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
        if (data.length > 0) {
          const firstProduct = data[0];
          setImages(firstProduct.images || [firstProduct.image]);
          setSelectedImage(firstProduct.images?.[0] || firstProduct.image);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    console.log(`Added to cart: ${selectedSize || "No size selected"}`);
    // You can integrate your addToCart util here
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left - Image Gallery */}
      <div>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Product"
            className="w-full h-[500px] object-cover rounded-2xl shadow-md"
          />
        ) : (
          <div className="w-full h-[500px] bg-gray-100 animate-pulse rounded-2xl"></div>
        )}

        <div className="flex mt-4 gap-3">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Thumbnail"
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                selectedImage === img
                  ? "border-pink-400"
                  : "border-transparent hover:border-pink-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right - Details */}
      <div className="flex flex-col justify-center space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Floral Baby Dress
          </h1>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-gray-500">(124 reviews)</span>
          </div>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-800">KES 2,499</p>
          <p className="text-sm text-gray-500 mt-1">VAT included</p>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Select Size</h3>
          <div className="flex gap-3 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                  selectedSize === size
                    ? "bg-pink-400 text-white border-pink-400"
                    : "border-gray-300 text-gray-700 hover:border-pink-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart & Wishlist */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center bg-pink-400 hover:bg-pink-500 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </button>
          <button className="p-3 border border-gray-300 rounded-full hover:text-pink-400 hover:border-pink-400 transition">
            <Heart size={20} />
          </button>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Keep your baby stylish and comfortable with our floral cotton dress.
            Soft, breathable, and perfect for every season — crafted with love
            for your little one’s comfort.
          </p>
        </div>
      </div>
    </section>
  );
}
