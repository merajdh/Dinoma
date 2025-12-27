function Button({ children, ...props  }) {
  return (
    <button
      {...props}
      className=" text-btn w-full bg-black px-10 py-4 btn-wide rounded-sm text-white btn-block hover:bg-black-90 active:animate-pop"
    >
      {children}
    </button>
  );
}

export default Button;
