import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import InputPassword from '../../components/InputPassword';
import AuthWrapper from './AuthWrapper';
import { Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastOptions } from '../../utils/toastOption';

function Register() {
  const [fullName, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateUserInfo = () => {
    if (!fullName.trim()) return 'نام و نام خانوادگی الزامی است';
    if (!email.trim()) return 'ایمیل الزامی است';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'ایمیل معتبر نیست';
    if (!phone.trim()) return 'شماره همراه الزامی است';
    if (!/^\d{10,15}$/.test(phone)) return 'شماره همراه معتبر نیست';
    if (!password.trim()) return 'رمزعبور الزامی است';
    if (!passwordRepeat.trim()) return 'تکرار رمزعبور الزامی است';

    return null;
  };
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const error = validateUserInfo();

    if (error) {
      toast.warning(error, ToastOptions);
      return;
    }
    if ((fullName, email, phone, password, passwordRepeat)) {
      setIsLoading(true);

      const { error } = await register(
        fullName,
        email,
        phone,
        password,
        passwordRepeat
      );
      if (error) {
        toast.error(error.message, ToastOptions);
        console.log(error);
      } else {
        navigate('/verify-otp', {
          state: { fullName, email, phone, password, passwordRepeat },
        });
      }
    }
  };
  const resetForm = () => {
    setFullname('');
    setEmail('');
    setPhone('');
    setPassword('');
    setPasswordRepeat('');
  };

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit} className="space-y-6 min-w-full">
        <Input
          id={'fullName'}
          type={'text'}
          value={fullName}
          onChange={e => setFullname(e.target.value)}
          placeholder={'نام کاربری'}
        />

        <Input
          id={'email'}
          type={'email'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={'ایمیل'}
        />
        <Input
          id={'phone'}
          type={'number'}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder={'موبایل'}
        />
        <InputPassword
          id={'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={'رمزعبور'}
        />
        <InputPassword
          id={'passwordRepeat'}
          value={passwordRepeat}
          onChange={e => setPasswordRepeat(e.target.value)}
          placeholder={'تکرار رمزعبور'}
        />

        <div className="mb-md"></div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'در حال بررسی...' : 'ورود'}
        </Button>

        <div className="text-center mb-xl mt-lg">
          <Link
            to="/login"
            className="text-sm text-black-20 underline underline-offset-6"
          >
            <p>
              حساب کاربری دارید؟ <strong>ورود</strong>
            </p>
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
}

export default Register;
