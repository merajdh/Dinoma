import React from 'react';

function DetailsTable({ product }) {
  return (
    <div className="flex flex-col gap-[4px] mt-xl">
      {product.specification.map((detail, i) => (
        <div
          className={`${
            i % 2 === 0 ? 'bg-neutral-100' : 'bg-neutral-200'
          }  px-md py-[12px]  text-black-20 rounded-sm`}
        >
          <span>
            {detail.title} : {detail.content}
          </span>
        </div>
      ))}
    </div>
  );
}

export default DetailsTable;
