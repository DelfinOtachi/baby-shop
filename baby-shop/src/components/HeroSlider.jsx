import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    image: "/images/hero1.jpeg",
    title: "Our Big Autumn Sale",
    subtitle: "Up to 30% off clothes, shoes & baby essentials",
    button: "Shop Now",
  },
  {
    image: "/images/hero2.jpeg",
    title: "New Arrivals for Your Little Ones",
    subtitle: "Discover cozy outfits and toys for all ages",
    button: "Explore",
  },
  {
    image: "/images/hero3.jpeg",
    title: "Baby Gear Made Easy",
    subtitle: "Shop strollers, car seats & more",
    button: "Browse Collection",
  },
];


export default function HeroSlider() {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[75vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full bg-cover bg-center flex flex-col justify-center items-center text-center text-white"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className=" p-6 rounded-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-3">
                  {slide.title}
                </h2>
                <p className="text-lg mb-6">{slide.subtitle}</p>
                <button className="bg-babyPurple hover:bg-gray-800 text-white px-6 py-3 rounded-full transition">
                  {slide.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
