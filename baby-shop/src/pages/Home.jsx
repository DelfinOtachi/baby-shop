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
import GeneralReviewsSection from "../components/GeneralReviewsSection";

export default function Home() {
  return (
    <div className="bg-gray-50">
              <HeroSlider />

      <FeaturedProducts />
      <FeaturedCategories />
      <NewArrivals />
      <ShortsToShop />
      <TopDeals />
            <Reviews />
                  <GeneralReviewsSection />



      {/* ========== CATEGORY HIGHLIGHTS ========== */}

    </div>
  );
}
