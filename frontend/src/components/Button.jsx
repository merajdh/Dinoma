function Button({ isLoading = false, children, ...props }) {
  return (
    <button
      disabled={isLoading}
      {...props}
      className=" text-md font-light w-full bg-black px-lg py-4 btn-wide rounded-sm text-white btn-block hover:bg-black-90 active:animate-pop flex flex-row justify-center gap-sm"
    >
      {children}
    </button>
  );
}

export default Button;
