import React from 'react';

function Register() {
  return (
    <>
      <div>Register</div>
      <form>
        <input
          type="text"
          id="full_name"
          name="full_name"
          placeholder="نام و نام خانوادگی"
        />

        <input type="email" id="email" name="email" placeholder="ایمیل " />
        <input
          type="number"
          id="phone"
          name="phone"
          placeholder="شماره تلفن "
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="رمزعبور"
        />
        <input
          type="password"
          id="password_repeat"
          name="password_repeat"
          placeholder="تکرار رمزعبور"
        />
      </form>
    </>
  );
}

export default Register;
