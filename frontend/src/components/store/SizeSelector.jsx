import React, { useState } from 'react';

function SizeSelector({ product }) {
  const [selectedId, setSelectedId] = useState(() => {
    return product.size && product.size.length > 0 ? product.size[0].id : null;
  });
  return (
    <div className="w-full flex flex-row justify-center gap-md">
      {product.size.map(item => (
        <div
          key={item.id}
          onClick={() => setSelectedId(item.id)}
          style={{ backgroundColor: item.color_code }}
          className={`rounded-sm text-center place-content-center   min-w-15 min-h-15 ${
            selectedId === item.id
              ? 'bg-black'
              : 'bg-white border-neutral-400 border'
          }   `}
        >
          {
            <span
              className={`t-5 ${
                selectedId === item.id ? 'text-white' : 'text-black'
              }`}
            >
              {item.name}
            </span>
          }
        </div>
      ))}
    </div>
  );
}

export default SizeSelector;
