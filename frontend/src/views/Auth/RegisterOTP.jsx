import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { ToastOptions } from '../../utils/toastOption';
import AuthWrapper from './AuthWrapper';
import apiInstance from '../../utils/axios';
import { register } from '../../utils/auth';

export default function RegisterOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName, email, phone, password, passwordRepeat } =
    location.state || {};

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef([]);
  const RESEND_TIME = 60;

  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) inputsRef.current[index + 1].focus();
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        inputsRef.current[index - 1].focus();
      }
      setOtp(newOtp);
    }
  };

  // handle paste
  const handlePaste = e => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split('');
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      newOtp[index] = digit;
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = digit;
      }
    });

    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    const otpCode = otp.join('');

    try {
      if (otpCode.length !== OTP_LENGTH) {
        toast.error('کد را کامل وارد کنید', ToastOptions);
        return;
      } else {
        const res = await apiInstance.post('user/verify-otp/', {
          email,
          otp: otpCode,
        });
        if (res.status === 200) {
          toast.success('حساب شما با موفقیت ساخته شد', ToastOptions);

          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      }
    } catch (err) {
      toast.error('کد وارد شده معتبر نیست', ToastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async e => {
    console.log('OTP resent 🔁');
    e.preventDefault();
    const { error } = await register(
      fullName,
      email,
      phone,
      password,
      passwordRepeat
    );
    setIsLoading(false);
    if (error) {
      toast.error(error.message, ToastOptions);
      console.log(error);
    }

    setTimeLeft(RESEND_TIME);
  };

  return (
    <AuthWrapper>
      <div className=" space-y-6 min-w-full">
        <div className="bg-white p-8 rounded-xl shadow-md w-full  text-center">
          <h2 className="text-2xl font-semibold mb-2">تایید کد OTP</h2>
          <p className="text-gray-500 mb-6">
            کد ارسال شده به ایمیل خود را وارد کنید
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div dir="ltr" className="flex justify-between gap-2 mt-md">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => (inputsRef.current[i] = el)}
                  value={digit}
                  onChange={e => handleChange(e, i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  type="tel"
                  inputMode="numeric"
                  onPaste={handlePaste}
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border rounded-sm pt-3"
                />
              ))}
            </div>
            <div className="mt-sm"></div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'در حال بررسی...' : 'تایید'}
            </Button>
          </form>

          <p className="text-gray-400 mt-4 text-sm">
            اگر کد را دریافت نکردید،
            <strong
              onClick={timeLeft === 0 ? handleResend : undefined}
              className={`cursor-pointer ${
                timeLeft > 0 ? 'text-gray-400' : 'text-black'
              }`}
            >
              {timeLeft > 0 ? `ارسال مجدد (${timeLeft})` : 'ارسال مجدد'}
            </strong>
          </p>
        </div>
      </div>
    </AuthWrapper>
  );
}
