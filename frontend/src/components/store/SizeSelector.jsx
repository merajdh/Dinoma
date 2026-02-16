import React, { useState } from 'react';

function SizeSelector({ product, onSizeChange }) {
  const [selectedId, setSelectedId] = useState(() => {
    return product.size && product.size.length > 0 ? product.size[0].id : null;
  });

  const handleSizeChange = item => {
    setSelectedId(item.id);
    if (onSizeChange) {
      onSizeChange(item);
    }
  };
  return (
    <div className="w-full flex flex-row flex-wrap justify-center gap-md">
      {product.size.map(item => (
        <button
          key={item.id}
          onClick={() => handleSizeChange(item)}
          style={{ backgroundColor: item.color_code }}
          className={` rounded-sm text-center place-content-center flex items-center justify-center   min-w-15 min-h-15 ${
            selectedId === item.id
              ? 'bg-black'
              : 'bg-white border-neutral-400 border'
          }   `}
        >
          {
            <span
              className={`translate-y-1 ${
                selectedId === item.id ? 'text-white' : 'text-black'
              }`}
            >
              {item.name}
            </span>
          }
        </button>
      ))}
    </div>
  );
}

export default SizeSelector;
