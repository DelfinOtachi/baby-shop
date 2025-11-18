import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function GeneralReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGeneralReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/generalReview");
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch general reviews:", err);
      }
    };

    fetchGeneralReviews();
  }, []);

  return (
    <section className="bg-gradient-to-r from-babyPink/20 via-babyPurple/20 to-babyBlue/20 py-16">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
        Loved by Kenyan Parents 💕
      </h2>

      <div className="max-w-3xl mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop
          className="pb-16" // adds bottom space for dots
        >
          {reviews.length === 0 && (
            <SwiperSlide>
              <div className="text-center text-gray-600">
                No reviews yet. Be the first to leave one!
              </div>
            </SwiperSlide>
          )}

          {reviews.map((rev) => (
            <SwiperSlide key={rev._id}>
              <div className="flex flex-col items-center text-center px-6">

                {/* User Image */}
                <img
                  src="/images/defaultUser.png"
                  alt={rev.user?.name || "User"}
                  className="w-20 h-20 rounded-full object-cover mb-4 shadow-md"
                />

                {/* Review Comment */}
                <p className="text-gray-700 italic max-w-xl">
                  {`"${rev.comment || "No comment provided"}"`}
                </p>

                {/* User Name */}
                <h4 className="mt-3 font-semibold text-gray-800">
                  {rev.user?.name || "Anonymous User"}
                </h4>

                {/* Star Rating */}
                <div className="flex mt-2 text-yellow-400 text-lg">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                    <span key={i} className="text-gray-300">
                      ★
                    </span>
                  ))}
                </div>

                {/* Pagination dots BELOW stars */}
                <div className="mt-6">
                  {/* Swiper pagination container (position override) */}
                  <div className="swiper-pagination"></div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Position dots manually */}
        <style>{`
          .swiper-pagination {
            position: relative !important;
            margin-top: 20px;
          }
        `}</style>
      </div>
    </section>
  );
}
