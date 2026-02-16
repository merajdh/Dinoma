import React, { useState } from 'react';

function ColorSelector({ product, onColorChange }) {
  const [expandedId, setExpandedId] = useState(() => {
    return product.color && product.color.length > 0
      ? product.color[0].id
      : null;
  });
  const handleColorChange = item => {
    setExpandedId(item.id);
    if (onColorChange) {
      onColorChange(item);
    }
  };
  return (
    <div className="w-full flex flex-row flex-wrap justify-center gap-sm ">
      {product.color.map(item => (
        <div
          key={item.id}
          onClick={() => handleColorChange(item)}
          style={{ backgroundColor: item.color_code }}
          className={`rounded-sm text-center flex justify-center p-2  min-w-15 min-h-15 cursor-pointer bg-[${item.color_code}]   `}
        >
          {
            <span
              className={`translate-y-1   ${expandedId === item.id && 'px-lg'}`}
              style={{ color: `${item.color_text}` }}
            >
              {expandedId === item.id ? item.name : item.name[0]}
            </span>
          }
        </div>
      ))}
    </div>
  );
}

export default ColorSelector;
