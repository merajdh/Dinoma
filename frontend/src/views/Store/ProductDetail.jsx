import React, { useEffect } from 'react';
import { useProductStore } from '../../store/product';
import { useParams } from 'react-router-dom';
import Gallery from '../../components/store/Gallery';
import fetchProductById from '../../api/getProductById';
import ColorSelector from '../../components/store/ColorSelector';
import SizeSelector from '../../components/store/SizeSelector';

function ProductDetail() {
  const { slug } = useParams();
  const product = useProductStore(s => s.getProductById(slug));

  useEffect(() => {
    if (!product) {
      fetchProductById(slug);
    }
  }, [slug, product]);

  console.log('PRODUCTTT', product);
  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <section
        className="grid grid-cols-1 gap-8
        sm:grid-cols-2
        sm:grid-rows-[auto_1fr_auto]     
        sm:items-stretch
      "
      >
        {/* Image + Gallery */}
        <div className="w-full sm:p-md sm:row-span-3 order-2">
          <img
            className="w-full object-cover aspect-square overflow-hidden sm:rounded-md"
            src={product.image}
            alt="تصویر محصول"
          />

          <div className="mt-md">
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
          <SizeSelector product={product} />
          <ColorSelector product={product} />
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
