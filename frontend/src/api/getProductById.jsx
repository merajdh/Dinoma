import apiInstance from '../utils/axios';
import { useProductStore } from '../store/product';

const fetchProductById = async slug => {
  const { setProduct } = useProductStore.getState();

  try {
    const { data } = await apiInstance.get(`/product/${slug}`);
    setProduct(data);
    return data;
  } catch (error) {
    console.error('Fetch product failed:', error);
    throw error;
  }
};

export default fetchProductById;
