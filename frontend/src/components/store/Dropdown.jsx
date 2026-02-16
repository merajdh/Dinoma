import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function Dropdown({ title, description, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-neutral-600/80  pb-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300  ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-4 text-sm text-neutral-600 leading-7 ">
          {children}

          {description}
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
