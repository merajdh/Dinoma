import React from 'react';

function PriceSeparator({ price, className = '' }) {
  if (price == null) return null;

  return (
    <div>
      <span
        className={`sm:text-md text-neutral-200  line-clamp-1 ${className} `}
      >
        {Number(price.toString().slice(0, -1)).toLocaleString('fa-IR')} تومان
      </span>
    </div>
  );
}

export default PriceSeparator;
