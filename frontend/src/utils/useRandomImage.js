import { useState, useEffect } from 'react';

/**
 * Custom hook to select a random image path from a provided array.
 *
 * @param {string[]} imagePaths
 * @param {string} [fallback=null]
 * @returns {string|null}
 */
const useRandomImage = (imagePaths, fallback = null) => {
  const [image, setImage] = useState(fallback);

  useEffect(() => {
    if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
      setImage(fallback);
      return;
    }

    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    setImage(imagePaths[randomIndex]);
  }, []);

  return image;
};

export default useRandomImage;
