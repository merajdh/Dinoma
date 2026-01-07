import { MoveUpRight } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PriceSeparator from './PriceSeparator';
import { useProductStore } from '../../store/product';

function Product({ product }) {
  const { setProduct } = useProductStore();
  const navigate = useNavigate();

  const goToDetail = () => {
    setProduct(product);
    navigate(`/products/${product.slug}`);
  };
  const submitToCart = () => {
    // Add Product To Cart
  };
  return (
    <div
      className="relative rounded-sm p-md min-w-70  min-h-100 sm:w-75 sm:h-115  bg-amber-200 overflow-hidden"
      onClick={goToDetail}
    >
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
          className=" absolute right-1.5  bottom-1 sm:right-2 sm:bottom-1.5 "
          to="/cart"
          onClick={submitToCart}
        >
          <MoveUpRight size={14} className="text-neutral-400" />
        </Link>
        <div className=" pl-sm mb-[2px] z-999 relative flex flex-row w-full justify-end gap-sm align-middle ">
          {product.get_percentage !== 0 ? (
            <PriceSeparator
              className=" text-[7px] sm:text-[8px]! sm:mt-sm mt-1  text-neutral-400/80 line-through decoration-1"
              price={product.old_price.slice(0, -1)}
            ></PriceSeparator>
          ) : (
            ''
          )}

          <PriceSeparator
            className="text-[9px] sm:text-sm"
            price={product.price.slice(0, -1)}
          ></PriceSeparator>
        </div>
      </div>
    </div>
  );
}

export default Product;
