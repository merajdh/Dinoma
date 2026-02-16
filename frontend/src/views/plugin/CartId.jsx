import React from 'react';

function CartId() {
  const generateRandomString = () => {
    const length = 30;
    const characters = 'abcdefghijklmnop12345678';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    localStorage.setItem('randomString', randomString);
  };

  const existingString = localStorage.getItem('randomString');
  if (!existingString) {
    generateRandomString();
  } else {
    // you can log it here
  }
  return existingString;
}

export default CartId;
