import React from "react";
import { Heart, ShoppingCart } from "lucide-react";

const deals = [
  {
    id: 1,
    name: "Baby Romper Set",
    image: "/images/products/romper-set3.jpeg",
    price: 1800,
    oldPrice: 2500,
  },
  {
    id: 2,
    name: "Soft Plush Toy",
    image: "/images/products/blush-toy6.jpg",
    price: 900,
    oldPrice: 1300,
  },
  {
    id: 3,
    name: "Baby Feeding Bottle",
    image: "/images/products/feeding-bottle.jpeg",
    price: 650,
    oldPrice: 950,
  },
  {
    id: 4,
    name: "Stroller Deluxe",
    image: "/images/products/stroller.jpeg",
    price: 14500,
    oldPrice: 18000,
  },
  {
    id: 5,
    name: "Baby Blanket",
    image: "/images/products/baby-blanket2.jpg",
    price: 1200,
    oldPrice: 1600,
  },
];

export default function DealsForYou() {
  return (
    <section className="py-16 bg-blue-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Deals For You 💖
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {deals.map((item) => {
            const discount = Math.round(
              ((item.oldPrice - item.price) / item.oldPrice) * 100
            );

            return (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-babyPink text-white text-xs font-semibold px-2 py-1 rounded-md">
                  -{discount}%
                </div>

                {/* Product Image */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col items-center text-center">
                  <p className="text-gray-700 font-medium mb-1">{item.name}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      Ksh {item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      Ksh {item.oldPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3">
                    <button className="bg-babyBlue hover:bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 transition">
                      <ShoppingCart size={16} /> Add
                    </button>
                    <button className="bg-white border border-gray-200 hover:border-babyPink hover:text-babyPink p-2 rounded-full transition">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
