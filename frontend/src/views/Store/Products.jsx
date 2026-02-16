import React, { useContext, useEffect, useState } from 'react';
import apiInstance from '../../utils/axios';
import Product from '../../components/store/Product';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CartId from '../plugin/CartId';
import UserData from '../plugin/UserData';
import { CartContext } from '../plugin/Context';
import { toast, ToastContainer } from 'react-toastify';
import { addToCart } from '../plugin/AddToCart';
import { ToastOptions } from '../../utils/toastOption';
import PriceSeparator from '../../components/store/PriceSeparator';
import ClothingType from '../../components/store/ClothingType';

function Products() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]); // array, not object
  const [audience, setAudience] = useState([]);
  const [clothingType, setClothingType] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const navigate = useNavigate();
  const userData = UserData();
  const cartId = CartId();
  let [cartCount, setCartCount] = useContext(CartContext);
  const goToDetail = product => {
    navigate(`/products/${product.slug}`);
  };
  const submitToCart = async product => {
    const url = userData?.user_id
      ? `cart-list/${cartId}/${userData?.user_id}/`
      : `cart-list/${cartId}/`;
    const response = await apiInstance.get(url);
    featured;
    addToCart(
      product.id,
      userData?.user_id,
      1,
      product.price,
      product.shipping_amount,
      'تهران',
      product.color[0]?.name,
      product.color[0]?.name,
      cartId
    ).then(() => {
      toast.success('محصول به سبد خرید اضافه شد', ToastOptions);

      setCartCount(response.data.length);
    });
  };

  // Load all data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [prodRes, featRes, audRes, clothType] = await Promise.all([
          apiInstance.get('product/'),
          apiInstance.get('featured-products/'),
          apiInstance.get('audience/'),
          apiInstance.get('clothing-type/'),
        ]);

        setProducts(prodRes.data.results || []);
        setFeaturedProducts(featRes.data || []);
        setAudience(audRes.data || []);
        setClothingType(clothType.data.results || []);
      } catch (err) {
        console.error('Data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  const featured = featuredProducts?.results?.[0] ?? null;

  return (
    <main>
      <ToastContainer></ToastContainer>
      {/* Product carousel */}
      <div className="flex flex-row gap-md overflow-x-auto snap-x snap-mandatory scrollbar-hide mt-lg bg-neutral-100 rounded-md p-md mx-xl">
        {products?.map(product => (
          <div
            className="relative cursor-pointer rounded-sm p-md min-w-70  min-h-100 sm:w-75 sm:h-115  bg-amber-200 overflow-hidden"
            onClick={() => goToDetail(product)}
          >
            <ToastContainer></ToastContainer>
            <img
              src={product.image}
              alt="تصویر محصول"
              loading="lazy"
              className=" absolute w-full h-full right-0 top-0 object-cover"
            />

            {product.get_percentage && (
              <div className="bg-neutral-800/50 rounded-sm p-3 absolute top-sm left-sm text-neutral-200 flex flex-col items-center">
                <span className="text-md">OFF</span>
                <span className="text-sm">{product.get_percentage}%</span>
              </div>
            )}

            <div
              className="bg-black-60/80 pt-sm h-auto 
    mask-[url('/images/card-shape.svg')] mask-no-repeat  mask-size-[100%_100%]  absolute flex flex-col justify-end gap-sm  w-full  bottom-0 right-0"
              preserveAspectRatio="none"
            >
              <p>
                <span className="text-sm text-white  pr-sm mt-sm line-clamp-1">
                  {product.title}
                </span>
              </p>
              <Link
                className="z-999 absolute right-1.5  bottom-1 sm:right-2 sm:bottom-1.5   hover:cursor-pointer  "
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  submitToCart(product);
                }}
                to="/cart"
              >
                <MoveUpRight size={14} className="text-neutral-400 " />
              </Link>

              <div className=" pl-sm mb-[2px] z-998 relative flex flex-row w-full justify-end gap-sm align-middle ">
                {product.get_percentage !== 0 ? (
                  <PriceSeparator
                    className=" text-[7px] sm:text-[8px]! sm:mt-sm mt-1  text-neutral-400/80 line-through decoration-1"
                    price={product.old_price.slice(0, -1)}
                  ></PriceSeparator>
                ) : (
                  ''
                )}

                <PriceSeparator
                  className="text-[9px] sm:text-sm mb-sm "
                  price={product.price}
                ></PriceSeparator>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ClothingType clothingTypes={clothingType}></ClothingType>

      {/* Featured / Special Offer Section */}
      {featured ? (
        <section className="relative w-full min-h-[500px]  flex flex-col sm:flex-row items-center justify-between px-16 py-10 overflow-hidden gap-md items-center">
          <div className="-z-1 flex flex-col md:flex-row ">
            <h2 className="absolute text-[120px] font-bold text-gray-200 left-10 top-10 select-none origin-left md:rotate-0 rotate-90">
              SPECIAL
            </h2>
            <h2 className="absolute text-[120px] font-bold text-gray-200 right-10 top-10 select-none origin-right md:rotate-0 rotate-270">
              OFFER
            </h2>
          </div>

          <div className="z-10 sm:w-1/3 order-2 sm:order-1">
            <h2 className="text-4xl font-bold">
              {featured.title ?? 'Featured Product'}
            </h2>
            <p className="tracking-widest text-gray-500 mt-sm">
              {featured.description ?? ''}
            </p>
          </div>
          <div className="text-black text-lg font-black h-fit  sm:grid sm:grid-cols-2  flex flex-row gap-lg  order-2  place-self-center">
            {Array.isArray(featured?.size) && featured.size.length > 0
              ? featured.size.map(sizeItem => (
                  <span
                    key={sizeItem.id}
                    className="cursor-pointer opacity-80 hover:opacity-100"
                  >
                    {sizeItem.name}
                  </span>
                ))
              : ''}
          </div>
          <div
            className="relative z-10 flex   sm:order-1 order-3 bg-black rounded-[24px] px-[12px] py-md"
            onClick={() => goToDetail(featured)}
          >
            <img
              src={processedImageUrl || featured.image}
              alt={featured.title || 'Featured product'}
              className="w-[350px] h-[400px] object-cover rounded-[22px]"
              onError={e => {
                e.target.src = '/images/placeholder.jpg'; // fallback image
              }}
            />

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black rounded-2xl px-6 py-4 flex items-center justify-center gap-6">
              <div className="flex gap-2 order-1">
                {Array.isArray(featured.color) &&
                  featured.color.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-lg h-lg rounded-sm border border-neutral-400 "
                      style={{
                        backgroundColor: color.color_code,
                        borderColor: selectedColor === color ? 'white' : '#444',
                      }}
                    />
                  ))}
              </div>

              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  submitToCart(featured);
                }}
                className="bg-neutral-100 h-lg text-black rounded-sm px-3 py-2 "
              >
                <ArrowRight className="pb-1" size={12}></ArrowRight>
              </button>
            </div>
          </div>

          <h3 className="text-xl font-thin mb-4 opacity-0 sm:opacity-100 order-1">
            DINOMA
          </h3>
        </section>
      ) : (
        <div className="text-center py-12 text-gray-500">
          فروش ویژه ای در حال حاضر در دسترس نیست ...
        </div>
      )}

      {/* Pagination */}
      <nav className="d-flex gap-1 pt-2"></nav>
    </main>
  );
}

export default Products;
