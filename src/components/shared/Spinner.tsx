import React from "react";

type SpinnerProps = {
  md?: boolean;
  lg?: boolean;
  white?: boolean;
};

const Spinner = ({ md, lg,  white }: SpinnerProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div
        className={`border-t-transparent border-solid animate-spin  rounded-[50%] border-theme ${
          white ? "border-white" : "border-theme"
        } border-4 h-8 w-8  ${
          md ? "w-16 h-16" : lg ? "w-36 h-36"  : "w-8 h-8"
        } `}
      ></div>
    </div>
  );
};

export default Spinner;
