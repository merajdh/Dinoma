import React, { useContext, useEffect, useState } from 'react';
import CartId from '../plugin/CartId';
import apiInstance from '../../utils/axios';
import { addToCart } from '../plugin/AddToCart';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../plugin/Context';
import useUserData from '../plugin/UserData';
import { RotateCw, ShoppingBag, Trash } from 'lucide-react';
import PriceSeparator from '../../components/store/PriceSeparator';
import Button from '../../components/Button';
import { toast, ToastContainer } from 'react-toastify';
import { ToastOptions } from '../../utils/toastOption';
import { useAuthStore } from '../../store/auth';

function CartView() {
  const validateUserInfo = () => {
    if (!fullName.trim()) return 'نام و نام خانوادگی الزامی است';
    if (!email.trim()) return 'ایمیل الزامی است';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'ایمیل معتبر نیست';
    if (!mobile.trim()) return 'شماره همراه الزامی است';
    if (!/^\d{10,15}$/.test(mobile)) return 'شماره همراه معتبر نیست';
    if (!address.trim()) return 'آدرس الزامی است';
    if (!city.trim()) return 'شهر الزامی است';
    if (!state.trim()) return 'منطقه الزامی است';

    return null;
  };
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [shippingAmount, setShippingAmount] = useState(1000000);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState({});
  const [productQuantities, setProductQuantities] = useState({});
  let [isAddingToCart, setIsAddingToCart] = useState('');
  const [count, setCount] = useState(2);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [cartCount, setCartCount] = useContext(CartContext);
  const [activeTab, setActiveTab] = useState('pending');
  const userData = useUserData();
  let cart_id = CartId();
  // const currentAddress = GetCurrentAddress();
  let navigate = useNavigate();
  // Get cart Items
  const fetchCartData = (cartId, userId) => {
    const url = userId
      ? `cart-list/${cartId}/${userId}/`
      : `cart-list/${cartId}/`;

    apiInstance.get(url).then(res => {
      setCart(res.data.results);
    });
  };

  // Get Cart Totals
  const fetchCartTotal = async (cartId, userId) => {
    const url = userId
      ? `cart-detail/${cartId}/${userId}/`
      : `cart-detail/${cartId}/`;

    const res = await apiInstance.get(url);
    setCartTotal(res.data);
  };
  const userId = userData?.user_id ?? null;

  useEffect(() => {
    if (!cart_id) {
      navigate('/');
      return;
    }

    fetchCartData(cart_id, userId);
    fetchCartTotal(cart_id, userId);
  }, [cart_id, userId]);

  useEffect(() => {
    const initialQuantities = {};
    cart.forEach(c => {
      initialQuantities[c.product.id] = c.qty;
    });
    setProductQuantities(initialQuantities);
  }, [cart]);

  console.log(cart);

  const handleQtyChange = (e, product_id, stock_qty) => {
    let value = Number(e.target.value);

    // Prevent going below 1
    if (value < 1) value = 1;

    // Prevent going above stock_qty
    if (value > stock_qty) value = stock_qty;

    setProductQuantities(prev => ({
      ...prev,
      [product_id]: value,
    }));
  };

  const UpdateCart = async (
    cart_id,
    item_id,
    product_id,
    price,
    shipping_amount,
    color,
    size
  ) => {
    const qtyValue = productQuantities[product_id];

    console.log('cart_id:', cart_id);
    console.log('item_id:', item_id);
    console.log('qtyValue:', qtyValue);
    console.log('product_id:', product_id);

    try {
      // Await the addToCart function

      await addToCart(
        product_id,
        userData?.user_id,
        qtyValue,
        price,
        shipping_amount,
        'تهران',
        color,
        size,
        cart_id,
        isAddingToCart
      ).then(() => {
        toast.dismiss();

        toast.info('سبد خرید بروز شد', ToastOptions);
      });

      // Fetch the latest cart data after addToCart is completed
      fetchCartData(cart_id, userData?.user_id);
      fetchCartTotal(cart_id, userData?.user_id);
    } catch (error) {
      console.log(error);
    }
  };

  // Remove Item From Cart
  const handleDeleteClick = async (cartId, itemId) => {
    const url = userData?.user_id
      ? `cart-delete/${cartId}/${itemId}/${userData.user_id}/`
      : `cart-delete/${cartId}/${itemId}/`;

    try {
      await apiInstance.delete(url);

      fetchCartData(cart_id, userData?.user_id);
      fetchCartTotal(cart_id, userData?.user_id);

      const cart_url = userData?.user_id
        ? `cart-list/${cart_id}/${userData?.user_id}/`
        : `cart-list/${cart_id}/`;
      const response = await apiInstance.get(cart_url);

      setCartCount(response.data.length);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Shipping Details
  const handleChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'mobile':
        setMobile(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'city':
        setCity(value);
        break;
      default:
        break;
    }
  };

  const submitOrder = async () => {
    if (isLoggedIn) {
      if (!fullName || !email || !mobile || !address || !city || !state) {
        toast.warning('بعضی از ورودی ها داده نشده ', ToastOptions);

        return;
      }

      try {
        const formData = new FormData();
        formData.append('full_name', fullName);
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('cart_id', cart_id);
        formData.append('user_id', userData ? userData.user_id : 0);

        const response = await apiInstance.post('create-order/', formData);

        toast('خرید شما با موفقیت ثبت شد ', ToastOptions);
      } catch (error) {
        console.log(error);
      } 
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[70%_30%] ">
      <section className="flex flex-col p-lg order-1">
        <h3 className="font-bold text-lg mb-lg">سبد خرید شما</h3>

        {cart.map(item => (
          <div
            key={item.product.id}
            className=" border-b border-neutral-200 p-md flex flex-row items-center gap-md justify-between mt-2 "
          >
            <div className="flex flex-row items-center gap-md">
              <img
                src={item.product.image}
                alt="تصویر محصول"
                className="object-cover w-25"
              ></img>

              <p className="">{item.product.title}</p>
            </div>

            <div className="h-10 items-center flex gap-xl place-items-end">
              <div className="flex items-center h-full border-2 border-neutral-400/50 rounded-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    handleQtyChange(
                      {
                        target: {
                          value: Math.max(
                            1,
                            (productQuantities[item.product.id] ?? item.qty) - 1
                          ),
                        },
                      },
                      item.product.id,
                      item.product.stock_qty
                    )
                  }
                  className="w-8  mt-1 h-full flex items-center justify-center  hover:bg-neutral-100 text-lg"
                >
                  −
                </button>

                <input
                  className="w-10 h-full pt-1  text-center select-none text-neutral-800"
                  type="text"
                  value={productQuantities[item.product.id] ?? item.qty}
                  min={1}
                  onChange={e =>
                    handleQtyChange(
                      Number(e.target.value),
                      item.product.id,
                      item.product.stock_qty
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    handleQtyChange(
                      {
                        target: {
                          value: Math.min(
                            item.product.stock_qty,
                            (productQuantities[item.product.id] ?? item.qty) + 1
                          ),
                        },
                      },
                      item.product.id,
                      item.product.stock_qty
                    )
                  }
                  className="w-8 mt-1 h-full flex items-center justify-center hover:bg-neutral-100 text-lg"
                >
                  +
                </button>
              </div>

              <div className="flex gap-sm">
                <button
                  onClick={() => {
                    setSelectedItem({ cartId: cart_id, itemId: item.id });
                    setOpenDelete(true);
                  }}
                  className="bg-error/80 rounded-sm p-sm h-full opacity-70 hover:opacity-100"
                >
                  <Trash className="text-neutral-100" size={'15px'}></Trash>
                </button>
                <button
                  onClick={() =>
                    UpdateCart(
                      cart_id,
                      item.id,
                      item.product.id,
                      item.product.price,
                      item.product.shipping_amount,
                      item.color,
                      item.size
                    )
                  }
                  className="bg-info/80 rounded-sm p-sm h-full opacity-70 hover:opacity-100"
                >
                  <RotateCw
                    className="text-neutral-100"
                    size={'15px'}
                  ></RotateCw>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {cart.length < 1 && (
          <div className="w-full flex flex-col mx-auto items-center gap-md mt-xl">
            <h5>سبد خرید شما خالی است</h5>
            <Link className="flex flex-row gap-sm" to="/">
              <ShoppingBag
                className="flex flex-row order-1 pb-1 "
                size={20}
              ></ShoppingBag>
              <strong> به خرید ادامه بدهید</strong>
            </Link>
          </div>
        )}
        {openDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold">حدف محصول؟</h2>

              <p className="text-sm text-gray-500 mt-2">
                این فرآیند غیرقابل بازگشت است.
              </p>

              <div className="flex justify-start gap-sm mt-6 ">
                <button
                  onClick={() => setOpenDelete(false)}
                  className="px-4 py-2 border-neutral-800 border rounded-sm"
                >
                  لغو
                </button>

                <button
                  onClick={() => {
                    handleDeleteClick(selectedItem.cartId, selectedItem.itemId);
                    setOpenDelete(false);
                  }}
                  className="px-4 py-2 bg-error text-neutral-100 rounded-sm"
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="h-100% order-2   shadow-2xs  py-lg">
        <h3 className="font-bold text-lg mb-lg text-center ">رسید محصولات</h3>
        <div className="flex flex-col gap-xl px-lg">
          <div className=" w-full flex  justify-between mt-xl">
            <p className="text-md font-semibold">جمع محصولات ({cartCount})</p>
            <PriceSeparator
              className="text-black!"
              price={cartTotal.sub_total || 0}
            ></PriceSeparator>
          </div>

          <div className=" w-full flex  justify-between ">
            <p className="text-md font-semibold">هزینه ارسال</p>
            <PriceSeparator
              className="text-black!"
              price={shippingAmount || 0}
            ></PriceSeparator>
          </div>
          <div className="w-full h-1 bg-neutral-600"></div>

          <div className=" w-full flex  justify-between mb-lg">
            <p className="text-md font-semibold">جمع کل</p>

            <PriceSeparator
              className="text-black!"
              price={cartTotal.total || 0}
            ></PriceSeparator>
          </div>
          <Button
            onClick={() => {
              submitOrder();

              const error = validateUserInfo();

              if (error) {
                toast.warning(error, ToastOptions);
                return;
              }
            }}
          >
            ثبت خرید و ادامه
          </Button>

          <ToastContainer> </ToastContainer>
        </div>
      </section>

      <section className="mt-25 order-3 col-span-2 px-lg  w-full">
        <h5 className="mb-lg mt-4 bg-black text-neutral-200 p-sm w-fit rounded-sm">
          اطلاعات شخصی
        </h5>
        <section className="rounded-md pt-lg pb-xl mb-xl px-md flex flex-row  flex-wrap  gap-xl  justify-center">
          <div className=" form-input  ">
            <label className="form-label" htmlFor="fullName">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-outline w-full"
              onChange={handleChange}
              value={fullName}
            />
          </div>

          <div className="form-input">
            <label className="form-label" htmlFor="Email">
              ایمیل
            </label>
            <input
              type="text"
              id="Email"
              className="form-outline"
              name="email"
              onChange={handleChange}
              value={email}
            />
          </div>
          <div className="form-input place-self-start">
            <label className="form-label" htmlFor="Mobile">
              شماره همراه
            </label>
            <input
              type="text"
              id="Mobile"
              className="form-outline"
              name="mobile"
              onChange={handleChange}
              value={mobile}
            />
          </div>
        </section>

        <h5 className="mb-lg mt-4 bg-black text-neutral-200 p-sm w-fit rounded-sm">
          آدرس تحویل
        </h5>
        <section className="rounded-md pt-lg pb-xl mb-xl px-md flex flex-row flex-wrap  gap-xl  justify-center">
          <div className="form-input">
            <label className="form-label" htmlFor="Address">
              آدرس
            </label>
            <input
              type="text"
              id="Address"
              className="form-outline "
              name="address"
              onChange={handleChange}
              value={address}
            />
          </div>

          <div className="form-input">
            <label className="form-label" htmlFor="City">
              شهر
            </label>
            <input
              type="text"
              id="City"
              className="form-outline"
              name="city"
              onChange={handleChange}
              value={city}
            />
          </div>

          <div className="form-input ">
            <label className="form-label" htmlFor="State">
              <p>منطقه</p>
            </label>
            <input
              type="text"
              id="State"
              className="form-outline"
              name="state"
              onChange={handleChange}
              value={state}
            />
          </div>
        </section>
      </section>
    </div>
  );
}

export default CartView;
