type SpinnerProps = {
  md?: boolean;
  lg?: boolean;
  white?: boolean;
  withText?: boolean;
  text?: string;
};

export const SpinnerInline = ({ md, lg, white, withText, text }: SpinnerProps) => {
  return (
    <div className="text-center mx-auto">
      <div
        className={`border-t-transparent border-solid animate-spin mx-auto rounded-[50%] border-theme ${
          white ? "border-white" : "border-theme"
        } border-4 h-8 w-8  ${
          md ? "w-16 h-16" : lg ? "w-36 h-36" : "w-8 h-8"
        } `}
      ></div>
      {withText && (
        <p className="text-sm switch:text-lg text-text w-[220px] max-w-[250px] mt-4">
          {text}
        </p>
      )}
    </div>
  );
};
const Spinner = ({ md, lg, white, withText, text }: SpinnerProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="text-center">
        <div
          className={`border-t-transparent border-solid animate-spin mx-auto rounded-[50%] border-theme ${
            white ? "border-white" : "border-theme"
          } border-4 h-8 w-8  ${
            md ? "w-16 h-16" : lg ? "w-36 h-36" : "w-8 h-8"
          } `}
        ></div>
        {withText && (
          <p className="text-sm switch:text-lg text-text w-[220px] max-w-[250px] mt-4">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
