import React from "react";
import { ReactComponent as Cancel } from "../../assets/icons/cancel2.svg";
import InvalidIcon from "../../assets/icons/invalid.svg";

const InvalidPayment = () => {
  return (
    <div className="relative w-full max-w-[500px] h-screen switch:h-[500px] switch:mt-16 bg-white rounded-theme pb-12 pt-20">
      <Cancel className="absolute top-5 right-5" />
      <div className="w-4/5 switch:w-4/6 mx-auto flex flex-col items-center  gap-y-8 ">
        <div className="max-w-[115px] max-h-[115px] mb-4">
          <img src={InvalidIcon} alt="" className="w-full h-full" />
        </div>
        <div className="text-center">
          <h3 className="text-3xl mb-2 font-semibold">Payment Successful</h3>
          <p className=" mx-auto text-center">
            Your Reciept is on its way to your mail, you can also view it below.
          </p>
        </div>
        <div className="my-3">
          <button className="button px-12">View Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default InvalidPayment;
