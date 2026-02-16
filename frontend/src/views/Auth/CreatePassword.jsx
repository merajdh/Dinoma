import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import AuthWrapper from './AuthWrapper';
import InputPassword from '../../components/InputPassword';
import Button from '../../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react';
import { ToastOptions } from '../../utils/toastOption';

function CreatePassword() {
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUserInfo = () => {
    if (!password.trim()) return 'رمزعبور الزامی است';
    if (!passwordRepeat.trim()) return 'تکرار رمزعبور الزامی است';

    return null;
  };
  const axios = apiInstance;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const otp = searchParams.get('otp');
  const uidb64 = searchParams.get('uidb64');
  const reset_token = searchParams.get('reset_token');

  const handleNewPasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleNewPasswordConfirmChange = event => {
    setPasswordRepeat(event.target.value);
  };

  const handlePasswordSubmit = e => {
    e.preventDefault();
    const error = validateUserInfo();

    if (error) {
      toast.warning(error, ToastOptions);
      return;
    }
    if (password !== passwordRepeat) {
      toast.warning('رمز عبور وارد شده باهم هماهنگ نیستند');
    } else {
      const formdata = new FormData();
      setIsLoading(false);
      formdata.append('otp', otp);
      formdata.append('uidb64', uidb64);
      formdata.append('reset_token', reset_token);
      formdata.append('password', password);

      try {
        setIsLoading(true);
        if ((password, passwordRepeat)) {
          axios
            .post(`user/password-change/`, {
              otp,
              uidb64,
              reset_token,
              password,
            })
            .then(res => {
              console.log(res.data.code);
              toast.info('رمزعبور شما با موفقیت نغییر کرد', ToastOptions);

              setTimeout(() => {
                navigate('/login');
              }, 1500);
            })
            .catch(error => {
              console.log(
                error.response.data.password[1],
                error.response.data.password[2],
                error.response.data.password
              );

              const passwordErrors = error.response?.data?.password;
              let msg = '';

              if (Array.isArray(passwordErrors)) {
                if (passwordErrors.length > 1) {
                  msg = passwordErrors.slice(1).join(' ');
                } else if (passwordErrors.length === 1) {
                  msg = passwordErrors[0];
                }
              } else {
                msg = error.response?.data?.message || 'Something went wrong';
              }
              toast.error(msg, ToastOptions);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      } catch (error) {
        // console.log(error);
      }
    }
  };
  return (
    <AuthWrapper>
      <form onSubmit={handlePasswordSubmit} className="space-y-6 min-w-full">
        <InputPassword
          value={password}
          onChange={handleNewPasswordChange}
          placeholder={'رمزعبور جدید'}
        ></InputPassword>
        <InputPassword
          value={passwordRepeat}
          onChange={handleNewPasswordConfirmChange}
          placeholder={'تکرار رمزعبور جدید'}
        ></InputPassword>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'در حال بررسی...' : 'تغییر رمز'}
        </Button>
      </form>
    </AuthWrapper>
  );
}

export default CreatePassword;
