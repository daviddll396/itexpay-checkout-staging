import React from "react";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy-icon.svg";

const BankTransfer = () => {
  return (
    <div>
      <p className="mb-4 text-sm font-medium" >Transfer directly from your bank</p>

      <div className="px-2">
        <div>
          <p className="text-[11px] text-center">Account number</p>
          <div className="bg-theme/10 w-fit mx-auto py-1.5 px-5 rounded-3xl flex items-center gap-x-2 my-2">
            <p className="text-theme font-extrabold text-2xl ">78747574675</p>
            <CopyIcon className=" text-theme" />
          </div>
          <div className="bg-[#B9B9B9]/[0.13] rounded-[10px] grid grid-cols-2 divide-x divide-[#B1B1B1]/50 py-3 my-4">
            <div className="col-span-1 px-3">
              <p className="text-[10px] text-center mb-1">Bank Name</p>
              <h5 className="text-center font-medium">Sterling Bank</h5>
            </div>
            <div className="col-span-1 px-3">
              <p className="text-[10px] text-center mb-1">Beneficiary Name</p>
              <h5 className="text-center font-medium">Testmy Perfait</h5>
            </div>
          </div>
          <p className="text-[10px] w-4/6 mx-auto text-center mb-8">The account details is only valid for this specific transaction and it'll expire by 11:46AM (today)</p>
        </div>
        <div className=" my-8">
        <button className="button w-full">I have made this payment</button>
      </div>
      </div>

     
    </div>
  );
};

export default BankTransfer;
