import React from "react";

export default function PromoBanner() {
  return (
    <section className="py-20 bg-babyBlue text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">Join the Narya Baby Family 💕</h2>
        <p className="text-lg mb-8">
          Get exclusive discounts, parenting tips, and early access to new collections.
        </p>
        <form className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-5 py-3 rounded-full text-gray-700 w-full sm:w-2/3 focus:outline-none"
          />
          <button className="bg-babyPink hover:bg-pink-500 px-6 py-3 rounded-full font-semibold transition">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
