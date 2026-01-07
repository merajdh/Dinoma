import React from 'react';

function Gallery({ images }) {
  return (
    <div className="flex flex-row gap-sm overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      {images.map(image => (
        <img
          className="w-50 h-50  sm-w-100 sm-h-100  rounded-md "
          key={image.id}
          loading="lazy"
          alt="عکس محصول"
          src={image.image}
        />
      ))}
    </div>
  );
}

export default Gallery;
