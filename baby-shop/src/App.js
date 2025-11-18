import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePage from "./components/ProfilePage";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import BlogListPage from "./pages/BlogListPage";
import CategoryCreate from "./pages/admin/CategoryCreate";
import ProductCreate from "./pages/admin/ProductCreate";
import CreateBlogPage from "./pages/admin/CreateBlogPage";
import OrderStatusPage from "./pages/admin/OrderStatusPage.jsx";
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
import PendingPaymentPage from "./pages/PendingPaymentPage.jsx";  
import ProductDetailPage from "./pages/ProductDetailPage";
import HandleOAuthRedirect from "./components/HandleOAuthRedirect.jsx";
import GeneralReviewForm from "./pages/GeneralReviewForm";
import GeneralReviewList from "./pages/OrderSuccess";
import MyGeneralReviews from "./pages/MyGeneralReviews";
import MyOrdersPage from "./pages/MyOrdersPage";


//GeneralReviewForm adds a review
//GeneralReviewList shows all reviews

export default function App() {
  return (

    
   <GoogleOAuthProvider clientId="689231547251-tfvha0d348oi5bsapjblqjgmkcdqr4u4.apps.googleusercontent.com">

    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/featured" element={<AllFeaturedProducts />} /> 
          <Route path="/top-deals" element={<AllTopDeals />} />       
          <Route path="/add-general-review" element={<GeneralReviewForm />} />
          <Route path="/general-reviews" element={<GeneralReviewList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth-redirect" element={<HandleOAuthRedirect />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/order/:id/pending" element={<PendingPaymentPage />} />
          <Route path="/admin/create-product" element={<ProductCreate />} />
          <Route path="/admin/create-category" element={<CategoryCreate />} />
          <Route path="/admin/create-blog" element={<CreateBlogPage />} />
                    <Route path="/admin/order-status" element={<OrderStatusPage />} />

          <Route path="/admin/subcategories" element={<SubCategoriesPage />} />
          <Route path="/my-reviews" element={<MyGeneralReviews />} /> 
          <Route path="/profile" element={<ProfilePage />} /> 
<Route path="/myorders" element={<MyOrdersPage />} />


        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  </GoogleOAuthProvider>

  );
}
