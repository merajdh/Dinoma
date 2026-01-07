import React, { useState } from 'react';

function ColorSelector({ product }) {
  const [expandedId, setExpandedId] = useState(() => {
    return product.color && product.color.length > 0
      ? product.color[0].id
      : null;
  });
  return (
    <div className="w-full flex flex-row flex-wrap-reverse justify-center gap-sm">
      {product.color.map(item => (
        <div
          key={item.id}
          onClick={() => setExpandedId(item.id)}
          style={{ backgroundColor: item.color_code }}
          className={`rounded-sm text-center p-2  min-w-15 min-h-15 bg-[${item.color_code}]   `}
        >
          {
            <span
              className={`t-5  ${expandedId === item.id && 'px-lg'}`}
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
