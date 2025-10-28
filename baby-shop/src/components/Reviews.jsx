import React from "react";

const reviews = [
  { id: 1, name: "Mary N.", text: "Loved the romper quality! Fast delivery too.", rating: 5 },
  { id: 2, name: "David K.", text: "Perfect baby stroller, sturdy and comfortable.", rating: 4 },
  { id: 3, name: "Joy A.", text: "My go-to store for baby essentials!", rating: 5 },
];

export default function Reviews() {
  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">What Our Customers Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow-md p-6 rounded-2xl hover:shadow-lg transition"
            >
              <p className="text-gray-600 italic mb-4">“{review.text}”</p>
              <p className="font-semibold text-gray-800">{review.name}</p>
              <div className="text-yellow-400 mt-2">
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
