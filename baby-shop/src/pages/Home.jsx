import React from "react";
import { Baby, Shirt, ToyBrick, Bed, ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import FeaturedProducts from "../components/FeaturedProducts";
import FeaturedCategories from "../components/FeaturedCategories";
import DealsForYou from "../components/DealsForYou";
import NewArrivals from "../components/NewArrivals";
import ShortsToShop from "../components/ShortsToShop";
import Reviews from "../components/Reviews";
import PromoBanner from "../components/PromoBanner";
import ProductGrid from "../components/ProductGrid";
import HeroSlider from "../components/HeroSlider";
import TopDeals from "../components/TopDeals";

export default function Home() {
  return (
    <div className="bg-gray-50">
              <HeroSlider />

         <ProductGrid />
      <FeaturedProducts />
      <FeaturedCategories />
      <DealsForYou />
      <NewArrivals />
      <ShortsToShop />
      <Reviews />
      <TopDeals />

      {/* ========== CATEGORY HIGHLIGHTS ========== */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {[
            { name: "Clothing", icon: <Shirt size={32} />, color: "bg-babyPink/30" },
            { name: "Toys", icon: <ToyBrick size={32} />, color: "bg-babyPurple/30" },
            { name: "Essentials", icon: <ShoppingBag size={32} />, color: "bg-babyBlue/30" },
            { name: "Baby Gear", icon: <Baby size={32} />, color: "bg-babyPink/30" },
            { name: "Nursery", icon: <Bed size={32} />, color: "bg-babyPurple/30" },
          ].map((cat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center text-center rounded-2xl p-6 ${cat.color} hover:scale-105 transition-transform duration-300 cursor-pointer`}
            >
              <div className="text-gray-800 mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-gray-700">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Shop Now →</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== REVIEWS SECTION ========== */}
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
            className="pb-10"
          >
            {[
              {
                name: "Wanjiku M.",
                review:
                  "The clothes I bought for my newborn are so soft and cute! Delivery was quick too.",
                image: "/images/review1.jpg",
              },
              {
                name: "Brian K.",
                review:
                  "Excellent quality! The stroller is sturdy and comfortable. Highly recommend Narya Baby.",
                image: "/images/review2.jpg",
              },
              {
                name: "Aisha L.",
                review:
                  "Love the toys section! My baby can’t stop playing with her new plush set.",
                image: "/images/review3.jpg",
              },
            ].map((rev, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col items-center text-center px-6">
                  <img
                    src={rev.image}
                    alt={rev.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 shadow-md"
                  />
                  <p className="text-gray-700 italic max-w-xl">{`"${rev.review}"`}</p>
                  <h4 className="mt-3 font-semibold text-gray-800">{rev.name}</h4>
                  <div className="flex mt-2 text-yellow-400">
                    {"★★★★★".split("").map((s, idx) => (
                      <span key={idx}>{s}</span>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>
    </div>
  );
}
