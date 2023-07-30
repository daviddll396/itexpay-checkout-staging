// import { useState } from "react";
import { paymentChannels } from "../../data";
import { ReactComponent as Cancel } from "../../assets/icons/cancel.svg";
import { useAppSelector } from "src/redux/hooks";
import DefaultLogo from "../../assets/images/default.png";

import { ReactComponent as CaretRight } from "../../assets/icons/caret-right.svg";

const Sidebar = (props: {
  setActive: React.Dispatch<React.SetStateAction<any>>;
  selectState: boolean;
  changePaymentOption: React.Dispatch<React.SetStateAction<any>>;
  setSelectState: React.Dispatch<React.SetStateAction<boolean>>;
  active: any;
  onClose: any;
}) => {
  const {
    active,
    setActive,
    changePaymentOption,
    selectState,
    setSelectState,
    onClose,
  } = props;
  const transaction_data = useAppSelector((state) => state.payment.userPayload);
  const processing = useAppSelector((state) => state.payment.inProcess);
  const customColor = useAppSelector((state) => state.payment.customColor);
  const sidebar_color = customColor.find(
    (item: any) => item.name === "sidebar_color"
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );

  const handleChangeOption = (paymentItem: any) => {
    setActive(paymentItem);
    changePaymentOption(paymentItem.id);
  };
  // changes the selected payment method
  const handleChangePaymentMethod = () => {
    setSelectState(true);
  };
  return (
    <>
      <div className="switch:hidden">
        <div className="bg-dark text-white">
          <div className=" flex items-center justify-between px-5 py-3">
            <div className="flex items-center ">
              <img
                // src={(transaction_data?.merchant_logo === null || transaction_data?.merchant_logo === "") ? DefaultLogo : transaction_data?.merchant_logo}
                src={DefaultLogo}

                alt="logo"
                className="w-9 h-9 mr-2 rounded-full"
              />
              <h3 className="text-sm font-bold ml-1">
                {transaction_data?.tradingname}
              </h3>
            </div>
            <div className="flex items-center" onClick={onClose && onClose}>
              <Cancel className="w-5 h-5" />
              <span className="ml-1 text-xs">Close</span>
            </div>
          </div>
        </div>
        {!selectState ? (
          <div className="border-y border-y-theme bg-theme/10 py-3 flex items-center justify-between px-4">
            <div className="flex items-center ml-3">
              {/* <ReactSVG src={active.icon} className="w-4" stroke="#001E31" /> */}
              <span className="text-text/80 font-black text-lg">
                {active.name}
              </span>
            </div>
            {!processing && (
              <button
                onClick={handleChangePaymentMethod}
                className="p-2 bg-transparent text-theme font-bold text-xs"
              >
                Change
              </button>
            )}
          </div>
        ) : null}
      </div>
      <div
        className={` hidden absolute left-0 bottom-0 top-0 rounded-tl-theme rounded-bl-theme    w-[32%] switch:flex flex-col   pl-2 py-6 text-white 
     
         `}
        style={{
          backgroundColor: sidebar_color ? sidebar_color.value : "#041926",
        }}
      >
        <div className=" flex items-center gap-x-2 mt-5 mb-10 ml-5">
          <img
            src={transaction_data?.merchant_logo}
            alt="logo"
            className="w-12 h-12 rounded-full"
          />
          <h3 className="text-sm font-bold pr-2 break-all capitalize">
            {transaction_data?.tradingname}
          </h3>
        </div>

        <div className="pl-3 max-h-[350px]  h-full overflow-y-auto">
          <p className="text-white/60 font-semibold text-sm mb-3 ml-2">
            Make payment with:
          </p>

          <ul className="flex flex-col gap-y-4 pl-2  text-[#89B4CF] w-full ">
            {transaction_data?.paymentmethods?.map((item: string) => {
              const paymentItem = paymentChannels.find(({ id }) => id === item);

              if (paymentItem) {
                return (
                  <li
                    key={paymentItem.id}
                    onClick={
                      processing
                        ? undefined
                        : () => handleChangeOption(paymentItem)
                    }
                    className={`flex items-center text-base py-2 pr-2  ${active.id === paymentItem.id
                      ? " border-y border-l rounded-tl-theme rounded-bl-theme font-black "
                      : " text-white font-semibold flex items-center justify-between"
                      } ${processing ? "cursor-not-allowed" : "cursor-pointer"}`}
                    style={{
                      borderColor:
                        button_color && active.id === paymentItem.id
                          ? button_color.value
                          : "#041926",
                      color:
                        button_color && active.id === paymentItem.id
                          ? button_color.value
                          : "white",
                      backgroundColor:
                        button_color && active.id === paymentItem.id
                          ? "white"
                          : "",
                      // opacity: button_color && active.id === paymentItem.id ? '0.3' : "",
                    }}
                  >
                    {/* <ReactSVG
                      src={paymentItem.icon}
                      className="w-4"
                      stroke={active === paymentItem.id ? "#27AE60" : ""}
                    /> */}
                    <span className="ml-4">{paymentItem.name}</span>
                    {/* <img src={CaretRight} alt="" className="w-4" /> */}
                    {active.id !== paymentItem.id && (
                      <CaretRight stroke="#FFFFFF99" className="w-4 mr-1" />
                      // <ReactSVG
                      //   src={CaretRight}
                      //   className="w-4 mr-2"
                      //   stroke={"#FFFFFF99"}
                      // />
                    )}
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
