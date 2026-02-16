import React, { useState } from 'react';
import Button from '../../components/Button';
import apiInstance from '../../utils/axios';
import Input from '../../components/Input';
import { Link } from 'react-router-dom';
import AuthWrapper from './AuthWrapper';
import { toast } from 'react-toastify';
import { ToastOptions } from '../../utils/toastOption';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUserInfo = () => {
    if (!email.trim()) return 'ایمیل الزامی است';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'ایمیل معتبر نیست';

    return null;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const error = validateUserInfo();

    if (error) {
      toast.warning(error, ToastOptions);
      return;
    }
    if (email) {
      setIsLoading(true);
      await apiInstance
        .get(`user/password-reset/${email}/`)
        .then(res => {
          console.log(res);

          toast.success(
            'لینک بازیابی رمزعبور به ایمیل شما ارسال شد',
            ToastOptions
          );
        })
        .catch(error => {
          console.log(error);

          toast.error(
            error.response.data.detail || 'مشکلی رخ داده است',
            ToastOptions
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit} className="space-y-6 min-w-full">
        <Input
          type={'email'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={'ایمیل'}
        />

        <div className="mb-md"></div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'در حال بررسی...' : 'ارسال کد بازیابی'}
        </Button>

        <div className="text-center mb-xl mt-lg">
          <Link
            to="/login"
            className="text-sm text-black-20 underline underline-offset-6"
          >
            برگشت به صفحه ورود
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
}

export default ForgotPassword;
