// router.jsx (or App.jsx)
import { createBrowserRouter, Outlet } from 'react-router-dom';

import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import Logout from './views/Auth/Logout';
import ForgotPassword from './views/Auth/ForgotPassword';
import CreatePassword from './views/Auth/CreatePassword';
import Products from './views/Store/Products';

import MainWrapper from './layout/MainWrapper';
import Navbar from './components/Navbar';
import Home from './views/base/home';

const router = createBrowserRouter([
  {
    path: '/',
    handle: { name: 'خانه' },

    element: (
      <MainWrapper>
        <Navbar />,
      </MainWrapper>
    ),

    children: [
      {
        index: true,
        element: <Home />,
        handle: { name: 'خانه' },
      },
      {
        path: 'login',
        element: <Login />,
        handle: { name: 'ورود' },
      },
      {
        path: 'register',
        element: <Register />,
        handle: { name: 'ثبت نام' },
      },
      {
        path: 'logout',
        element: <Logout />,
        handle: { name: 'خروج' },
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
        handle: { name: 'فراموشی رمز عبور' },
      },
      {
        path: 'create-new-password',
        element: <CreatePassword />,
        handle: { name: 'ایجاد رمز جدید' },
      },
      {
        path: 'products',
        element: <Products />,
        handle: { name: 'محصولات' },
      },
    ],
  },
]);

export default router;
