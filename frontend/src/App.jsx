import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import Logout from './views/Auth/Logout';
import ForgotPassword from './views/Auth/ForgotPassword';
import CreatePassword from './views/Auth/CreatePassword';
import Products from './views/Store/Products';

import MainWrapper from './layout/MainWrapper';
import Navbar from './components/navbar/Navbar';
import Home from './views/base/home';
import SpecialOffer from './views/Store/SpecialOffer';
import PrivateRoute from './layout/PrivateRoute';
import { MainLayout } from './layout/MainLayout';
import { AuthLayout } from './layout/AuthLayout';
import { useEffect, useState } from 'react';
import { initAuth } from './utils/auth';
import ProductDetail from './views/Store/ProductDetail';
import CartView from './views/Store/CartView';
import apiInstance from './utils/axios';
import CartId from './views/plugin/CartId';
import UserData from './views/plugin/UserData';
import { CartContext } from './views/plugin/Context';
import RegisterOTP from './views/Auth/RegisterOTP';
import ProductList from './views/Store/ClothingTypeList';
import ClothingTypeList from './views/Store/ClothingTypeList';

const router = createBrowserRouter([
  {
    // WITH NAV
    element: <MainLayout />,
    handle: { name: 'خانه' },

    children: [
      { index: true, element: <Home />, handle: { name: '' } },
      { path: 'products', element: <Products />, handle: { name: 'محصولات' } },
      {
        path: 'special-offer',
        element: <SpecialOffer />,
        handle: { name: 'محصول ویژه' },
      },
      {
        path: 'products/:slug',
        element: <ProductDetail />,
        handle: { name: 'محصول' },
      },
      {
        path: 'clothing-type/:id',
        element: <ClothingTypeList />,
        handle: { name: 'محصولات' },
      },
      {
        path: 'cart',
        element: <CartView />,
        handle: { name: 'سبد خرید' },
      },
    ],
  },
  {
    // WITHOUT NAV
    element: <AuthLayout />,
    children: [
      {
        index: true,
        path: 'login',
        element: <Login />,
        handle: { name: 'ورود' },
      },
      { path: 'register', element: <Register />, handle: { name: 'ثبت نام' } },
      { path: 'logout', element: <Logout />, handle: { name: 'خروج' } },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
        handle: { name: 'فراموشی رمز عبور' },
      },
      {
        path: 'create-new-password',
        element: <CreatePassword />,
        handle: { name: 'ساخت رمز عبور' },
      },
      {
        path: 'verify-otp',
        element: <RegisterOTP />,
        handle: { name: 'کد تایید' },
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    initAuth();
  }, []);

  const [cartCount, setCartCount] = useState();
  const userData = UserData();
  let cart_id = CartId();
  const axios = apiInstance;

  useEffect(() => {
    const url = userData?.user_id
      ? `cart-list/${cart_id}/${userData?.user_id}/`
      : `cart-list/${cart_id}/`;
    axios.get(url).then(res => {
      setCartCount(res.data.length);
    });
  }, []);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      <RouterProvider router={router} />
    </CartContext.Provider>
  );
}

export default App;
