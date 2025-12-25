import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';

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
    <>
      <div>Register</div>
      <br />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="full_name"
          name="full_name"
          placeholder="نام و نام خانوادگی"
          onChange={e => setFullname(e.target.value)}
        />
        <br />
        <br />

        <input
          type="email"
          id="email"
          name="email"
          placeholder="ایمیل "
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <br />

        <input
          type="number"
          id="phone"
          name="phone"
          placeholder="شماره تلفن "
          onChange={e => setPhone(e.target.value)}
        />
        <br />
        <br />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="رمزعبور"
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <br />

        <input
          type="password"
          id="password_repeat"
          name="password_repeat"
          placeholder="تکرار رمزعبور"
          onChange={e => setPasswordRepeat(e.target.value)}
        />
        <br />
        <br />

        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default Register;
