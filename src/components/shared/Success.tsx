import React from "react";
import CirceCheck from "../../assets/images/circle-check.png";
import { ReactComponent as Cancel } from "../../assets/icons/cancel2.svg";
import { useDispatch } from "react-redux";
import { close_modal } from "src/redux/PaymentReducer";

const Success = () => {
  const dispatch = useDispatch();
  const onCloseFrame = () => {
    dispatch(close_modal());
  };
  return (
    <div className="relative w-full max-w-[500px] mx-auto h-screen switch:h-[500px] switch:mt-16 bg-white rounded-theme pb-12 pt-20">
      <Cancel
        className="absolute top-5 right-5 cursor-pointer"
        onClick={onCloseFrame}
      />
      <div className="w-4/5 switch:w-4/6 mx-auto flex flex-col items-center  gap-y-8 ">
        <div className="max-w-[115px] max-h-[115px] mb-4">
          <img src={CirceCheck} alt="" className="w-full h-full" />
        </div>
        <div className="text-center">
          <h3 className="text-3xl mb-2 font-semibold">Payment Successful</h3>
          <p className=" mx-auto text-center">
            You will be redirected back to the merchant site.
          </p>
        </div>
        {/* <div className="my-3">
          <button className="button px-12">View Receipt</button>
        </div> */}
      </div>
    </div>
  );
};

export default Success;
