import { useEffect, useState } from 'react';
import apiInstance from '../../utils/axios';
import Product from '../../components/store/Product';
import { useParams } from 'react-router-dom';

const ClothingTypeList = () => {
  const [products, setProducts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiInstance.get(`/clothing-type/${id}/products/`);

      setProducts(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Product product={product}></Product>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={!prevPage}
          onClick={() => fetchProducts(prevPage)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        >
          قبلی
        </button>

        <button
          disabled={!nextPage}
          onClick={() => fetchProducts(nextPage)}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-40"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default ClothingTypeList;
