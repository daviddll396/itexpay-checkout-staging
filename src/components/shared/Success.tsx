import React from "react";
import CirceCheck from "../../assets/images/circle-check.png";
import { useAppSelector } from "src/redux/hooks";

const Success = ({ go }: { go?: () => void }) => {
  const onGo = () => {
    if (go) go();
  };
  const customColor = useAppSelector((state) => state.payment.customColor);
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );

  return (
    <div className="relative w-full max-w-[500px] mx-auto h-screen switch:h-[500px] switch:mt-16 bg-white rounded-theme pb-12 pt-20">
      {/* <Cancel
        className="absolute top-5 right-5 cursor-pointer"
        onClick={onCloseFrame}
      /> */}
      <div className="w-4/5 switch:w-4/6 mx-auto flex flex-col items-center  gap-y-8 ">
        <div className="max-w-[80px] max-h-[80px] mb-4">
          <img src={CirceCheck} alt="" className="w-full h-full" />
        </div>
        <div className="text-center">
          <h3 className="text-3xl mb-2 font-semibold">Payment Successful</h3>
          <p className=" mx-auto text-center">
            You will be redirected back to the merchant site.
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

export default Success;
