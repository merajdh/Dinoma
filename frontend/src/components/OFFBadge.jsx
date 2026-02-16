function OFFBadge({ children }) {
  return (
    <span className=" rounded-sm flex justify-center items-center gap-[3px]  bg-neutral-400/50  text-black-20 px-sm py-1 pt-1">
      {children}
    </span>
  );
}

export default OFFBadge;
