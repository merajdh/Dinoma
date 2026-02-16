import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClothingType = ({ clothingTypes }) => {
  const navigate = useNavigate();
  const handleTypeList = id => {
    navigate(`clothing-type/${id}`);
  };
  return (
    <div className="flex flex-nowrap sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  overflow-x-auto gap-md hide-scrollbar bg-white px-xl mt-xl scroll-smooth">
      {clothingTypes.map((category, index) => (
        <div
          key={index}
          className="shrink-0 min-w-[220px] sm:min-w-[260px] bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          onClick={() => handleTypeList(category.id)}
        >
          <div className="relative">
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-110 sm:h-120 object-cover"
            />

            <div className="absolute right-0 bg-neutral-400/20 rounded-sm top-lg origin-center rotate-270 text-center text-neutral-100 outline-text-neutral-200 outline-2 p-1 text-xl font-bold">
              {category.title}
            </div>
          </div>

          <div className="flex justify-between relative items-center p-2 bg-gray-200">
            <span className="text-lg mx-auto font-semibold">
              {category.title}
            </span>

            <button className="absolute -right-md -bottom-md bg-black-40 rounded-md p-md">
              <ArrowUpRight size={24} className="mr-md mb-md" color="#ffffff" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClothingType;
