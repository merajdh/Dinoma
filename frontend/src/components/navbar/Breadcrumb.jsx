import { Link, useMatches, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

export default function Breadcrumb() {
  const matches = useMatches();
  const navigate = useNavigate();
  return (
    <div className="bg-neutral-100  ">
      <ul className=" flex flex-row mx-lg align-bottom text-sm text-black-20 items-center h-15">
        {matches
          .filter(m => m.handle?.name)
          .map((m, i, e) => (
            <li
              key={m.pathname}
              onClick={
                i !== e.length - 1 ? () => navigate(m.pathname) : undefined
              }
              className={`flex items-center ${
                i === e.length - 1 ? 'text-black text-md' : ''
              }`}
            >
              {i > 0 && (
                <ChevronLeft size={16} className="mx-2 text-neutral-400" />
              )}
              {m.handle.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
