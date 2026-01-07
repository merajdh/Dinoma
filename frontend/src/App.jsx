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
import { useEffect } from 'react';
import { initAuth } from './utils/auth';
import ProductDetail from './views/Store/ProductDetail';

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
    ],
  },
]);

function App() {
  useEffect(() => {
    initAuth();
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
