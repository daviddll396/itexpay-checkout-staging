import React from "react";
import { ReactComponent as Cancel } from "../../assets/icons/cancel2.svg";
import { ReactComponent as InvalidIcon } from "../../assets/icons/invalid.svg";
import { useDispatch } from "react-redux";
import { close_modal } from "src/redux/PaymentReducer";
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
  const dispatch = useDispatch();
  const onCloseFrame = () => {
    dispatch(close_modal());
  };
  return (
    <div className="relative w-full  h-screen switch:h-[500px] switch:mt-16 bg-white switch:rounded-theme pb-12 pt-20">
      <Cancel
        className="absolute top-5 right-5 cursor-pointer"
        onClick={onCloseFrame}
      />
      <div className="w-4/5 switch:w-4/6 mx-auto flex flex-col items-center  gap-y-8 ">
        <div className="max-w-[128px] max-h-[128px] mb-4">
          <InvalidIcon className="w-32 h-32" />
        </div>
        <div className="text-center">
          <h3 className="text-3xl mb-2 font-semibold ">{title}</h3>
          <p className=" mx-auto text-center text-lg md:text-2xl font-semibold">{description}</p>
        </div>
        <div className="my-3">
          {go && (
            <button className="bg-transparent px-12 font-medium" onClick={onGo}>
              Go back to merchant site
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invalid;
