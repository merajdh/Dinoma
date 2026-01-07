import React from 'react';

function PriceSeparator({ price, className = '' }) {
  return (
    <div>
      <span
        className={`sm:text-md text-neutral-200 mb-sm  line-clamp-1 ${className} `}
      >
        {Number(price).toLocaleString('fa-IR')} تومان
      </span>
    </div>
  );
}

export default PriceSeparator;
