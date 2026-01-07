import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../utils/auth';
import { useAuthStore } from '../../store/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import InputPassword from '../../components/InputPassword';
import AuthWrapper from './AuthWrapper';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  console.log(email);
  console.log(password);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  });

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await login(email, password);
    if (error) {
      alert(error);
    } else {
      navigate('/');
      resetForm();
    }
    setIsLoading(false);
  };
  return (
    <AuthWrapper>
      <form onSubmit={handleLogin} className="space-y-6 min-w-full">
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

        <div className="mb-md"></div>

        <Button type="submit">ورود</Button>

        <div className="flex justify-between mb-xl mt-lg">
          <Link
            to="/register"
            className="text-sm text-black-20 underline underline-offset-6"
          >
            ثبت نام
          </Link>
          <Link
            to="/forgot-password"
            className="text-sm text-black-20 underline underline-offset-6 "
          >
            فراموشی رمزعبور
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
}

export default Login;
