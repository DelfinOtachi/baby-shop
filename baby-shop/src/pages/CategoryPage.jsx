import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Baby Romper Set",
    price: 1999,
    image: "/images/products/romper1.jpg",
  },
  {
    id: 2,
    name: "Baby Shoes",
    price: 1499,
    image: "/images/products/shoes1.jpg",
  },
  {
    id: 3,
    name: "Baby Blanket",
    price: 1899,
    image: "/images/products/blanket1.jpg",
  },
  {
    id: 4,
    name: "Baby Hat",
    price: 899,
    image: "/images/products/hat1.jpg",
  },
];

export default function CategoryPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Baby Clothing</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="bg-white shadow hover:shadow-md rounded-xl overflow-hidden transition"
          >
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-gray-800 font-medium">{product.name}</h3>
              <p className="text-babyPink font-semibold">KES {product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
