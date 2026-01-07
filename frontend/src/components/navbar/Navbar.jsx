import { LineChart, MenuIcon, SearchIcon, ShoppingCart, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

import Search from './search';
import Breadcrumb from './Breadcrumb';
import { useAuthStore } from '../../store/auth';

const Navbar = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const user = useAuthStore(state => state.user);

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const cartCount = 2;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="bg-white flex flex-col">
        {/* Top View  */}
        <div className="hidden  md:flex flex-row gap-[2px] h-[24px] ">
          <div className="bg-neutral-200  w-full pr-8 place-content-center text-black-20">
            <Link className="text-sm" to="contact-us">
              تماس باما
            </Link>
            <Link className="mr-4 text-sm" to="about-us">
              درباره ما
            </Link>
          </div>

          <div className=" bg-neutral-200   text-black-20 w-35 text-center place-content-center text-sm">
            <Link className="flex flex-row justify-center" to="cart">
              {cartCount && (
                <div className=" w-4 h-4 ml-1 bg-amber-200 ">
                  <span className="  text-black-20  text-[8px] text-center  ">
                    {cartCount}
                  </span>
                </div>
              )}
              <div>سبد خرید</div>
            </Link>
          </div>
          <div className="relative bg-neutral-200 w-35  text-black-20 text-center place-content-center text-sm">
            <Link
              onClick={() => setProfileOpen(prev => !prev)}
              to={!isLoggedIn && '/login'}
              className="relative"
            >
              {isLoggedIn ? 'پروفایل من' : 'ورود / ثبت نام'}
            </Link>
            {profileOpen && (
              <ul className="absolute top-12  left-0 min-h-fit pb-lg   flex flex-col justify-between bg-neutral-200  text-black-40 shadow-sm rounded-sm w-80 h-fit items-start border border-neutral-600  z-999 ">
                <span className="rounded-t-sm pt-20 pb-4 mb-sm bg-neutral-300 text-black w-full place-self-start      z-999 ">
                  <li className="px-md">سلام,{user?.username}</li>
                </span>

                <li className=" px-md hover:cursor-pointer w-full  pt-lg">
                  سفارش ها
                </li>
                <li className=" px-md hover:cursor-pointer w-full  pt-lg">
                  تغییر رمزعبور
                </li>
                <li className="text-error px-md hover:cursor-pointer w-full pt-lg">
                  خروج
                </li>
              </ul>
            )}
          </div>
          <div className="bg-neutral-200  w-md"></div>
        </div>

        {/* Bottom View */}
        <div className="max-w-[1300px] mx-auto px-md flex items-center justify-between h-20 gap-sm w-full ">
          {/* Search */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                setSearchOpen(prev => !prev);
              }}
              className="hidden md:flex items-center hover:cursor-pointer  rounded-sm border-neutral-200 border px-3 py-1 w-[80px]"
            >
              <SearchIcon className="w-4 h-4 text-neutral-600 mr-2" />
              <span className="bg-transparent outline-none text-md flex-1 text-neutral-600">
                جستجو
              </span>
            </button>

            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-md hover:bg-neutral-100 md:hidden"
              aria-label="menu"
            >
              <MenuIcon size={18} className="text-neutral-800" />
            </button>

            <button
              className="p-2 rounded-md hover:bg-neutral-100 md:hidden"
              aria-label="search"
            >
              <SearchIcon size={18} className="w-5 h-5 text-neutral-800" />
            </button>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-lg flex-1 justify-center">
            <Link
              className="text-md text-neutral-800 hover:text-black"
              to={'/products'}
            >
              پیراهن
            </Link>
            <Link
              className="text-md text-neutral-800 hover:text-black"
              href="#"
            >
              تیشرت
            </Link>
            <a className="text-md text-neutral-800 hover:text-black" href="#">
              کت و شلوار
            </a>
            <Link
              className="text-md text-neutral-800 hover:text-black"
              href="#"
            >
              راک
            </Link>
            <Link
              className="text-md text-neutral-800 hover:text-black"
              href="#"
            >
              کاپشن
            </Link>
          </nav>

          {/* Brand */}
          <div className="flex  justify-end gap-4 shrink-0 md:w-[80px] text-lg ">
            <Link to="/" className="sm:text-xl text-lg mt-sm font-bold">
              DINOMA
            </Link>
          </div>
        </div>
      </header>

      {searchOpen && <Search onClose={() => setSearchOpen(false)}></Search>}
      <Breadcrumb></Breadcrumb>
      {/* Mobile View */}
      {open && (
        <div className="fixed inset-0 z-50 w-full transition-all ease-in duration-100">
          <button
            type="button"
            aria-label="close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside
            dir="rtl"
            className="fixed top-0 right-0 h-full w-[85%] max-w-[420px] z-50 bg-white shadow-lg p-4 overflow-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">منو</div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-neutral-100"
                aria-label="close"
              >
                <X className="w-6 h-6 text-neutral-800" />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <Link
                className="text-sm text-neutral-800 py-2 border-b border-neutral-100"
                href="#"
              >
                پیراهن
              </Link>
              <Link
                className="text-sm text-neutral-800 py-2 border-b border-neutral-100"
                href="#"
              >
                تی‌شرت
              </Link>
              <Link
                className="text-sm text-neutral-800 py-2 border-b border-neutral-100"
                href="#"
              >
                کت و شلوار
              </Link>
              <Link
                className="text-sm text-neutral-800 py-2 border-b border-neutral-100"
                to="/"
              >
                راک
              </Link>
              <Link
                className="text-sm text-neutral-800 py-2 border-b border-neutral-100"
                to="/"
              >
                کاپشن
              </Link>
            </nav>

            <div className="mt-6">
              <button className="w-full flex items-center justify-center gap-2 py-2 border rounded-md">
                <ShoppingCart className="w-5 h-5" />
                <span>سبد خرید ({cartCount})</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
