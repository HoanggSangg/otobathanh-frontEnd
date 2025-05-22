import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Appbar/Header';
import Banner from './components/Home/Banner';
import News from './components/Home/News';
import Information from './components/Home/Infor';
import Footer from './components/Home/Footer';
import ChatBox from './components/Chatbox/ChatBox';
import Breadcrumb from './components/Styles/Breadcrumb';
import About from './components/Appbar/Menu/About';
import Services from './components/Detail/ServicesDetail';
import Contact from './components/Appbar/Menu/Contact';
import HomeStats from './components/Home/Stats';
import HomeServices from './components/Appbar/Menu/Services';
import NewsDetail from './components/Detail/NewsDetail';
import styled from 'styled-components';
import IndexProduct from './components/Admin/ProductsManager/indexProduct';
import IndexBooking from './components/Admin/BookingManager/indexBooking';
import IndexAccount from './components/Admin/AccountsManager/indexAccount';
import ProductPage from './components/Detail/ProductDetail';
import IndexNews from './components/Admin/NewsManager/indexNews';
import Profile from './components/AuthForm/MenuAuth/ProFile';
import UpdateAccount from './components/AuthForm/MenuAuth/UpdateAccount';
import ChangePass from './components/AuthForm/MenuAuth/ChangePass';
import HistoryOrder from './components/AuthForm/MenuAuth/HistoryOrder';
import LikeProducts from './components/AuthForm/MenuAuth/LikeProducts';
import CartDetail from './components/Detail/CartDetail';
import Order from './components/Home/Order';
import OrderDetail from './components/Detail/OrderDetail';
import Procedure from './components/Home/Procedure';
import { ToastProvider } from './components/Styles/ToastProvider';
import ProductOutstand from './components/Home/ProductOutstand';
import Products from './components/Appbar/Menu/Products';
import Partner from './components/Home/Partner';
import IndexBanner from './components/Admin/BannerManager/indexBanner';
import ProtectedRoute from './components/AuthForm/Protected/ProtectedRoute';
import IndexCategory from './components/Admin/CategoryManager/indexCategory';
import IndexOrder from './components/Admin/OrderManager/indexOrder';
import ScrollToTop from './components/Styles/ScrollToTop';
import Booking from './components/Appbar/Menu/Booking';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NewsList from './components/Appbar/Menu/NewsList';
import IndexCategoryStaff from './components/Admin/CategoryStaffManager/indexCategoryStaff';
import IndexStaff from './components/Admin/StaffManager/indexStaff';
import Staff from './components/Home/Staff';
import FloatingButtons from './components/FloatingButtons/FloatingButtons';
import UserChat from './websocket/user';
import AdminChat from './websocket/admin';

const MainContent = styled.main`
  margin-top: 80px;
`;

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

const App = () => {

  useEffect(() => {
    const isFBReady = () => {
      return window.FB && typeof window.FB.init === 'function';
    };

    if (isFBReady()) return;

    window.fbAsyncInit = function () {
      try {
        window.FB?.init({
          appId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0',
          autoLogAppEvents: true
        });
      } catch (error) {
        console.error('FB init error:', error);
      }
    };

    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => {
      const script = document.getElementById('facebook-jssdk');
      script?.remove();

      if ('FB' in window) delete (window as any).FB;
      if ('fbAsyncInit' in window) delete (window as any).fbAsyncInit;
    };
  }, []);

  return (
    <div>
      <GoogleOAuthProvider clientId="174690362633-vhh68lq31jp889ibopdb8abbi7sj4rcu.apps.googleusercontent.com">
        <ToastProvider>
          <Header />
          <MainContent>
            <Breadcrumb />
            <Routes>
              <Route path="/" element={
                <>
                  <Banner />
                  <HomeServices />
                  <ProductOutstand />
                  <News />
                  <Information />
                  <Procedure />
                  <HomeStats />
                  <Staff />
                  <Partner />
                  <FloatingButtons />
                </>
              } />
              <Route path="/productoutstand" element={<ProductOutstand />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/newslist" element={<NewsList />} />
              <Route
                path="/manager/products"
                element={
                  <ProtectedRoute>
                    <IndexProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/accounts"
                element={
                  <ProtectedRoute>
                    <IndexAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/staff"
                element={
                  <ProtectedRoute>
                    <IndexStaff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/news"
                element={
                  <ProtectedRoute>
                    <IndexNews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/banner"
                element={
                  <ProtectedRoute>
                    <IndexBanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/category"
                element={
                  <ProtectedRoute>
                    <IndexCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/category-staff"
                element={
                  <ProtectedRoute>
                    <IndexCategoryStaff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/order"
                element={
                  <ProtectedRoute>
                    <IndexOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/booking"
                element={
                  <ProtectedRoute>
                    <IndexBooking />
                  </ProtectedRoute>
                }
              />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/update" element={<UpdateAccount />} />
              <Route path="/account/changePass" element={<ChangePass />} />
              <Route path="/account/historyOrder" element={<HistoryOrder />} />
              <Route path="/account/likeProducts" element={<LikeProducts />} />
              <Route path="/cart/cartDetail" element={<CartDetail />} />
              <Route path="/order/checkout" element={<Order />} />
              <Route path="/order/orderDetail/:orderId" element={<OrderDetail />} />
              <Route path="/procedure" element={<Procedure />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/chat" element={<UserChat />} />
              <Route path="/admin-chat" element={<AdminChat />} />
            </Routes>
            <Footer />
          </MainContent>
          <ChatBox />
        </ToastProvider>
        <ScrollToTop />
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
