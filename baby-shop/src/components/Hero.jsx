import React from "react";
import { Baby, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-gradient-to-r from-babyPink to-babyPurple text-white py-20 text-center"
    >
      <div className="flex justify-center mb-4">
        <Baby size={48} className="text-white drop-shadow-md" />
      </div>
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
        Welcome to Narya Baby
      </h2>
      <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
        Kenya’s home for adorable baby clothes, toys, and essentials —
        <br /> made with <Heart className="inline text-babyBlue" size={20} /> for your little one.
      </p>
      <button className="bg-white text-babyPurple font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition">
        Shop Now
      </button>
    </section>
  );
}
