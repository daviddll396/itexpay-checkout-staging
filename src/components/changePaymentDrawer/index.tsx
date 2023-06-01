import React from "react";
import { paymentChannels } from "../../data";
// import { ReactSVG } from "react-svg";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import CaretRight from "../../assets/icons/caret-right.svg";

const ChangePaymentDrawer = (props: {
  setActive: (arg0: any) => void;
  setSelectState: (arg0: boolean) => void;
  active: any;
  selectState: boolean;
  changePaymentOption: any
}) => {
  const drawerRef = useOutsideClick(() => {
    props.setSelectState(false);
  });

  return (
    <div
      ref={drawerRef}
      className={` absolute z-[10] h-fit  bottom-0 left-0 right-0 switch:rounded-bl-theme switch:rounded-br-theme max-[400px]:rounded-tl-3xl max-[400px]:rounded-tlr-3xl transition-all duration-500 ease-in-out duration-3000`}
    >
      <div className="bg-white   border border-theme py-6  switch:rounded-bl-theme switch:rounded-br-theme rounded-t-theme ">
        <div>
          <p className="text-[#555555]/70 mb-4 ml-6">Make payment with:</p>

          <ul className="grid grid-cols-1   divide-y divide-[#c9c8c5] text-[#89B4CF] w-full ">
            {paymentChannels.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  props.setActive(item);
                  props.setSelectState(false);
                  props.changePaymentOption('selectedOption',item.id)
                }}
                className={`col-span-1 flex items-center justify-between  text-sm py-5 px-6 cursor-pointer font-medium text-[#22242e] hover:bg-theme/10 ${
                  props.active === item.id ? "bg-theme/10 " : "bg-white"
                }`}
              >
                <div className="flex items-center">
                  <img src={item.icon} alt="" className="w-6 h-6" />
                  <span className="ml-3">{item.name}</span>
                </div>
                <img src={CaretRight} alt="" className="w-4" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePaymentDrawer;
