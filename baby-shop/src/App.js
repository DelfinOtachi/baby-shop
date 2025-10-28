import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";

import CategoryPage from "./pages/CategoryPage";
import BlogListPage from "./pages/BlogListPage";
import CategoryCreate from "./pages/admin/CategoryCreate";
import ProductCreate from "./pages/admin/ProductCreate";
import CreateBlogPage from "./pages/admin/CreateBlogPage";
import SubCategoriesPage from "./pages/admin/SubCategoriesPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import AllFeaturedProducts from "./components/AllFeaturedProducts"; 

import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import AllTopDeals from "./components/AllTopDeals";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import OrderSuccess from "./pages/OrderSuccess";


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/category/:category" element={<CategoryPage />} />
   <Route path="/blog" element={<BlogListPage />} />
   <Route path="/new-arrivals" element={<NewArrivalsPage />} />
           <Route path="/featured" element={<AllFeaturedProducts />} /> 
             <Route path="/top-deals" element={<AllTopDeals />} />
              <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
<Route path="/order-success" element={<OrderSuccess />} />



   <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
   <Route path="/payment/success" element={<PaymentSuccess />} />
  <Route path="/payment/failed" element={<PaymentFailed />} />
  
  <Route path="/admin/create-product" element={<ProductCreate />} />
            <Route path="/admin/create-category" element={<CategoryCreate />} />
            <Route path="/admin/create-blog" element={<CreateBlogPage />} />
            <Route path="/admin/subcategories" element={<SubCategoriesPage />} />



      </Routes>
      <Footer />
    </Router>
  );
}
