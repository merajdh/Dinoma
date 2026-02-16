function Input({ type, value, onChange, placeholder, id, children }) {
  return (
    <input
      id={id}
      className="w-full no-spinner bg-neutral-200 text-black placeholder-neutral-600 px-10 py-4 btn-wide rounded-sm text-md"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    >
      {children}
    </input>
  );
}

export default Input;
