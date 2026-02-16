import apiInstance from '../../utils/axios';
import { toast } from 'react-toastify';
import { ToastOptions } from '../../utils/toastOption';

export const addToCart = async (
  product_id,
  user_id,
  qty,
  price,
  shipping_amount,
  city,
  color,
  size,
  cart_id
) => {
  const axios = apiInstance;

  try {
    // Create a new FormData object to send product information to the server
    const formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('user_id', user_id);
    formData.append('qty', qty);
    formData.append('price', price);
    formData.append('shipping_amount', shipping_amount);
    formData.append('city', city);
    formData.append('size', size);
    formData.append('color', color);
    formData.append('cart_id', cart_id);

    // setCartCount((prevCount) => prevCount - 1);

    // Send a POST request to the server's 'cart-view/' endpoint with the product information
    const response = await axios.post('cart-view/', formData);

    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
  }
};
