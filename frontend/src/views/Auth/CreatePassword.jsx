import {  useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import Swal from 'sweetalert2';
import AuthWrapper from './AuthWrapper';
import InputPassword from '../../components/InputPassword';
import Button from '../../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react';

function CreatePassword() {
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [error, setError] = useState(null);

  const axios = apiInstance;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const otp = searchParams.get('otp');
  const uidb64 = searchParams.get('uidb64');
  const reset_token = searchParams.get('reset_token');

  const options = {
    onOpen: () => console.log('open'),
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  };
  const handleNewPasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleNewPasswordConfirmChange = event => {
    setPasswordRepeat(event.target.value);
  };

  const handlePasswordSubmit = e => {
    e.preventDefault();

    if (password !== passwordRepeat) {
      setError(true);
      console.log('Password Does Not Match');
    } else {
      setError(false);

      console.log('otp ======', otp);
      console.log('uidb64 ======', uidb64);
      console.log('reset_token ======', reset_token);
      console.log('password ======', password);

      const formdata = new FormData();

      formdata.append('otp', otp);
      formdata.append('uidb64', uidb64);
      formdata.append('reset_token', reset_token);
      formdata.append('password', password);

      try {
        axios
          .post(`user/password-change/`, {
            otp,
            uidb64,
            reset_token,
            password,
          })
          .then(res => {
            console.log(res.data.code);
            toast.info('success', options);

            navigate('/login');
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
            toast.error(msg, options);
          });
      } catch (error) {
        // console.log(error);
      }
    }
  };
  return (
    <section>
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
          <Button type="submit">تغییر رمزعبور</Button>
        </form>
        <ToastContainer />
      </AuthWrapper>
    </section>
  );
}

export default CreatePassword;
