import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function InputPassword({ value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative ">
      <input
        className="w-full bg-neutral-200 text-black placeholder-neutral-600 px-10 py-4 btn-wide rounded-sm text-md pl-10"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer border-none text-neutral-400 "
        onClick={() => setShowPassword(prev => !prev)}
      >
        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
}

export default InputPassword;
