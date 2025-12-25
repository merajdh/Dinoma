import React, { useState } from 'react';
import apiInstance from '../../utils/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');

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
    <div>
      <h1>فراموشی رمزعبور</h1>
      <input
        onChange={e => setEmail(e.target.value)}
        type="email"
        placeholder="ایمیل خود را وارد کنید"
        name=""
        id=""
      />

      <button onClick={handleSubmit}>بازیابی رمزعبور</button>
    </div>
  );
}

export default ForgotPassword;
