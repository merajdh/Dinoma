import React, { useEffect, useState } from 'react';
import apiInstance from '../../utils/axios';
import Product from '../../components/store/Product';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiInstance.get('product/').then(response => {
      setProducts(response.data);
    });
  }, []);
  console.log('0000000', products);

  return (
    <div className="flex flex-row gap-md overflow-x-auto snap-x snap-mandatory scrollbar-hide  mt-lg px-sm ">
      {products?.map(product => (
        <Product key={product.id} product={product}></Product>
      ))}
    </div>
  );
}

export default Products;
