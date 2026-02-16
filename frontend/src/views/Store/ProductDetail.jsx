import React, { useContext, useEffect, useState } from 'react';
import { useProductStore } from '../../store/product';
import { useParams } from 'react-router-dom';
import Gallery from '../../components/store/Gallery';
import fetchProductById from '../../api/getProductById';
import ColorSelector from '../../components/store/ColorSelector';
import SizeSelector from '../../components/store/SizeSelector';
import Dropdown from '../../components/store/Dropdown';
import PriceSeparator from '../../components/store/PriceSeparator';
import Button from '../../components/Button';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import OFFBadge from '../../components/OFFBadge';
import DetailsTable from '../../components/detailsTable';
import RelatedProducts from '../../components/store/RelatedProducts';
import useUserData from '../plugin/UserData';
import CartId from '../plugin/CartId';
import { addToCart } from '../plugin/AddToCart';
import { toast, ToastContainer } from 'react-toastify';
import { CartContext } from '../plugin/Context';
import apiInstance from '../../utils/axios';
import { ToastOptions } from '../../utils/toastOption';

function ProductDetail() {
  const { slug } = useParams();
  let [cartCount, setCartCount] = useContext(CartContext);
  let cart_id = CartId();

  const product = useProductStore(s => s.getProductById(slug));

  const [loadedImgId, setLoadImgId] = useState(0);
  const [sizeValue, setSizeValue] = useState('بدون اندازه');
  const [qtyValue, setQtyValue] = useState(1);
  const [colorValue, setColorValue] = useState('بدون رنگ');
  const userData = useUserData();
  const cartId = CartId();

  const handleQtyChange = e => {
    let value = Number(e.target.value);

    if (value < 1) value = 1;

    if (value > product.stock_qty) value = product.stock_qty;
    setQtyValue(value);
  };
  const goToPreviousImage = () => {
    setLoadImgId(prevIndex =>
      prevIndex === 0 ? product.gallery.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setLoadImgId(prevIndex =>
      prevIndex === product.gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleColorInfo = color => {
    setColorValue(color);
  };

  const handleSizeInfo = size => {
    setSizeValue(size);
  };

  useEffect(() => {
    if (!product) {
      fetchProductById(slug);
    } else {
      if (product.color && product.color.length > 0) {
        setColorValue(product.color[0].name);
      }
      if (product.size && product.size.length > 0) {
        setSizeValue(product.size[0].name);
      }
    }
  }, [slug, product, colorValue, sizeValue]);

  const handleAddToCart = async () => {
    const url = userData?.user_id
      ? `cart-list/${cart_id}/${userData?.user_id}/`
      : `cart-list/${cart_id}/`;
    const response = await apiInstance.get(url);
    addToCart(
      product.id,
      userData?.user_id,
      qtyValue,
      product.price,
      product.shipping_amount,
      'تهران',
      colorValue,
      sizeValue,
      cartId
    ).then(() => {
      toast.success('محصول به سبد خرید اضافه شد', ToastOptions);

      setCartCount(response.data.length);
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ToastContainer />
      <section
        className="grid grid-cols-1 gap-8
        sm:grid-cols-2
        sm:grid-rows-[auto_1fr_auto]     
        sm:items-stretch
      "
      >
        {/* Image + Gallery */}
        <div className="w-full sm:p-md sm:row-span-3 order-2  ">
          <div className="relative">
            <img
              className="w-full object-cover aspect-square overflow-hidden sm:rounded-md "
              src={product.gallery[loadedImgId]?.image || ''}
              alt="تصویر محصول"
            />

            <div className="select-none">
              <span
                onClick={goToNextImage}
                className="img_controller  absolute left-0 top-1/2 bg-neutral-400/60 rounded-r-[4px] "
              >
                <ChevronLeft className="mr-[2px] my-1 ml-sm md:my-sm md:ml-md md:mr-sm  text-black-20"></ChevronLeft>
              </span>
              <span
                onClick={goToPreviousImage}
                className="img_controller absolute right-0 top-1/2 bg-neutral-400/60 rounded-l-[4px]"
              >
                <ChevronRight className="ml-[2px] my-1 mr-sm  md:my-sm md:mr-md md:ml-sm   text-black-20"></ChevronRight>
              </span>
            </div>
          </div>

          <div className="mt-md select-none">
            <Gallery images={product.gallery} />
          </div>
        </div>
        {/* Title */}
        <h2 className=" h-fit order-1 sm:order-0 text-lg sm:text-xl font-black p-md">
          {product.title}
        </h2>
        {/* Size selector */}
        <div
          className="flex flex-col gap-md items-start p-md order-3
         "
        >
          <SizeSelector
            product={product}
            onSizeChange={size => {
              handleSizeInfo(size);
            }}
          />
          <ColorSelector
            product={product}
            onColorChange={color => {
              handleColorInfo(color);
            }}
          />

          {/* Pricing */}
          <div className="flex flex-row gap-md justify-end items-center w-full ">
            <div className="ml-auto flex gap-sm items-center">
              <span className="text-black-40">تعداد :</span>

              <input
                type="number"
                className="w-xl border-2 border-neutral-400 rounded-sm"
                value={qtyValue}
                onChange={handleQtyChange}
                min={1}
                max={product.stock_qty}
              />
            </div>
            {product.get_percentage !== 0 ? (
              <PriceSeparator
                className=" text-sm! mb-1 sm:mt-sm mt-1  text-neutral-400/80 line-through decoration-1"
                price={product.old_price}
              ></PriceSeparator>
            ) : (
              ''
            )}
            <PriceSeparator
              className="text-black!  text-md"
              price={product.price || 0}
            ></PriceSeparator>

            {product.get_percentage !== 0 ? (
              <OFFBadge>
                <span className="hidden md:inline">OFF</span>
                {product.get_percentage}%
              </OFFBadge>
            ) : (
              ''
            )}
          </div>

          <div
            className="mt-md w-full
          "
          >
            <Button onClick={() => handleAddToCart()}>
              افزودن به سبد خرید
              <ShoppingBag strokeWidth={2} size={16}></ShoppingBag>
            </Button>
          </div>

          {/* Details */}

          <div className="flex flex-col gap-lg w-full">
            <Dropdown
              title={'توضیحات'}
              description={product.description}
            ></Dropdown>
            <Dropdown title={'مشخصات'} description="">
              <DetailsTable product={product}></DetailsTable>
            </Dropdown>
          </div>
        </div>

        {/* RelatedProducts */}
      </section>
      <RelatedProducts></RelatedProducts>
    </div>
  );
}

export default ProductDetail;
