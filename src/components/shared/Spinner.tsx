import { useAppSelector } from "src/redux/hooks";

type SpinnerProps = {
  md?: boolean;
  lg?: boolean;
  white?: boolean;
  sm?: boolean;
  withText?: boolean;
  text?: string;
};

export const SpinnerInline = ({
  md,
  lg,
  sm,
  white,
  withText,
  text,
}: SpinnerProps) => {
  const customColor = useAppSelector(
    (state ) => state.payment.customColor
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  return (
    <div className="text-center w-fit mx-auto">
      <div
        className={` border-solid animate-spin mx-auto rounded-[50%]  border-[3px]  ${
          sm ? "w-8 h-8" : md ? "w-16 h-16" : lg ? "w-36 h-36" : "w-6 h-6"
        } `}
        style={{
          borderColor: white
            ? "white"
            : button_color
            ? button_color.value
            : "#27AE60",
          borderTopColor: "transparent",
        }}
      ></div>
      {withText && (
        <p className="text-[13px] text-center switch:text-base text-text w-[200px] max-w-[200px] mx-auto mt-4">
          {text}
        </p>
      )}
    </div>
  );
};
const Spinner = ({ md, lg, white, withText, text }: SpinnerProps) => {
  const customColor = useAppSelector(
    (state ) => state.payment.customColor
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="text-center">
        <div
          className={` border-solid animate-spin mx-auto rounded-[50%]  border-[3px]  ${
            md ? "w-16 h-16" : lg ? "w-36 h-36" : "w-6 h-6"
          } `}
          style={{
            borderColor: white
              ? "white"
              : button_color
              ? button_color.value
              : "#27AE60",
            borderTopColor: "transparent",
          }}
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
