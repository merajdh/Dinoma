import React, { useState } from 'react';
import useRandomImage from '../../utils/useRandomImage';
import { Link } from 'react-router-dom';

function AuthWrapper({ children }) {
  const loginImages = ['images/login1.png', 'images/login2.png'];
  const backgroundImg = useRandomImage(loginImages);

  const [loaded, setLoaded] = useState(false);
  const handleLoad = () => {
    setLoaded(true);
  };
  return (
    <div className="relative min-h-screen  flex flex-col md:flex-row ">
      <div className=" m-auto w-full md:w-1/2 flex  min-h-fit z-999 md:h-screen justify-center  bg-white px-md  md:px-sm md:shadow-neutral-600  shadow-2xl ">
        <div className="w-full min-w-md  m-auto md:px-[10%]">
          <Link
            to="/"
            className=" left-md md:px-sm text-neutral-600 underline underline-offset-3 mx-auto"
          >
          </Link>
          <h2 className="text-3xl font-peyda-bold text-center font-black  text-black mb-lg mt-xl">
            دینوما
          </h2>
          {children}
        </div>
      </div>

      <img
        src={backgroundImg}
        className=" absolute left-0 top-0 md:hidden block  min-h-screen bg-fill object-cover bg-center bg-no-repeat z-[-1] shadow-2xl"
        loading="lazy"
      />
      <img
        src={backgroundImg}
        className={`hidden md:block md:w-5/8 max-h-screen md:inset-y-0 object-cover bg-no-repeat -order-1 transition-opacity duration-100 ease-in ${
          loaded ? 'opacity-1000' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={handleLoad}
        alt="Background"
      />
    </div>
  );
}

export default AuthWrapper;
