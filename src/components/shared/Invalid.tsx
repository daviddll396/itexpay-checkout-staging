import React from "react";
// import { ReactComponent as Cancel } from "../../assets/icons/cancel2.svg";
import { ReactComponent as InvalidIcon } from "../../assets/icons/invalid.svg";
import { useAppSelector } from "src/redux/hooks";
const Invalid = ({
  title,
  description,
  go,
}: {
  title?: string | null;
  description?: string;
  go?: () => void;
}) => {
  const onGo = () => {
    if (go) go();
  };
  const customColor = useAppSelector((state) => state.payment.customColor);
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  return (
    <div className="relative w-full  h-screen switch:h-[500px] switch:mt-16 bg-white switch:rounded-theme pb-12 pt-20">
      {/* <Cancel
        className="absolute top-5 right-5 cursor-pointer"
        onClick={onCloseFrame}
      /> */}
      <div className="w-4/5 switch:w-4/6 mx-auto flex flex-col items-center  gap-y-8 ">
        <div className="max-w-[128px] max-h-[128px] mb-4">
          <InvalidIcon className="w-32 h-32" />
        </div>
        <div className="text-center">
          <h3 className="text-3xl mb-2 font-semibold ">{title}</h3>
          <p className=" mx-auto text-center text-lg md:text-2xl font-semibold">
            {description}
          </p>
        </div>
        <div className="my-3">
          {go && (
            <button
              className="button  px-12 font-medium"
              onClick={onGo}
              style={{
                backgroundColor: button_color ? button_color.value : "#27AE60",
              }}
            >
              Go back to merchant site
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invalid;
