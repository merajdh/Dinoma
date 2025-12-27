import React, { useState } from 'react';
import Button from '../../components/Button';
import apiInstance from '../../utils/axios';
import Input from '../../components/Input';
import { Link } from 'react-router-dom';
import useRandomImage from '../../utils/useRandomImage';
import AuthWrapper from './AuthWrapper';
function ForgotPassword() {
  const [email, setEmail] = useState('');

  const loginImages = ['images/login1.png', 'images/login2.png'];
  const backgroundImg = useRandomImage(loginImages);

  const handleSubmit = async () => {
    try {
      await apiInstance.get(`user/password-reset/${email}/`).then(res => {
        alert('یک ایمیل به شما ارسال شد.');
      });
    } catch (error) {
      alert('کاربری با این ایمیل وجود ندارد');

      console.log('ERROR === ', error);
    }
  };
  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit} className="space-y-6 min-w-full">
        <Input
          type={'email'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={'نام ایمیل'}
        />

        <div className="mb-md"></div>

        <Button type="submit">تغییر رمزعبور</Button>

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
