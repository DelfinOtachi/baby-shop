import React from "react";

const shorts = [
  { id: 1, name: "Baby Gear", image: "/images/shorts/gear.jpg" },
  { id: 2, name: "Bath Time", image: "/images/shorts/bath.jpg" },
  { id: 3, name: "Feeding", image: "/images/shorts/feed.jpg" },
  { id: 4, name: "Nursery", image: "/images/shorts/nursery.jpg" },
  { id: 5, name: "Toys", image: "/images/shorts/toys.jpg" },
];

export default function ShortsToShop() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Shorts To Shop
        </h2>

        <div className="flex justify-center flex-wrap gap-8">
          {shorts.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center group cursor-pointer">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-md group-hover:scale-105 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-gray-700 font-medium group-hover:text-babyBlue transition-colors">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
