import { SearchIcon, X } from 'lucide-react';

function search({ onClose, submitSearch }) {
  return (
    <div className="mb-4 px-lg mt-md">
      <div className="flex items-center bg-neutral-100 rounded-sm px-3 py-2">
        <SearchIcon
          size={16}
          className="hover:cursor-pointer text-neutral-600 ml-2"
          onClick={submitSearch}
        />
        <input
          placeholder="...جستجو"
          className="bg-transparent outline-none text-md flex-1 placeholder:text-neutral-600"
        />
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-neutral-100"
          aria-label="close"
        >
          <X className="hover:cursor-pointer text-neutral-400/60" size={16}></X>{' '}
        </button>
      </div>
    </div>
  );
}

export default search;
