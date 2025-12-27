import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useRandomImage from '../../utils/useRandomImage';
import InputPassword from '../../components/InputPassword';
import AuthWrapper from './AuthWrapper';
import { Loader } from 'lucide-react';

function Register() {
  const [fullName, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await register(
      fullName,
      email,
      phone,
      password,
      passwordRepeat
    );
    if (error) {
      alert(JSON.stringify(error));
    } else {
      navigate('/');
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
          type={'text'}
          value={fullName}
          onChange={e => setFullname(e.target.value)}
          placeholder={'نام کاربری'}
        />

        <Input
          type={'email'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={'ایمیل'}
        />

        <InputPassword
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={'رمزعبور'}
        />
        <InputPassword
          value={passwordRepeat}
          onChange={e => setPasswordRepeat(e.target.value)}
          placeholder={'تکرار رمزعبور'}
        />

        <div className="mb-md"></div>

        <Button type="submit">ورود</Button>

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
