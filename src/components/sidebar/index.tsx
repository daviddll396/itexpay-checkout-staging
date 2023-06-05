// import { useState } from "react";
import { paymentChannels } from "../../data";
// import Logo from "../../assets/images/merchantlogo.png";
import { ReactSVG } from "react-svg";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";

const Sidebar = (props: {
  setActive: React.Dispatch<React.SetStateAction<any>>;
  changePaymentOption: React.Dispatch<React.SetStateAction<any>>;
  active: any;
}) => {
  const { active, setActive, changePaymentOption } = props;
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const processing = useSelector((state: RootState) => state.payment.inProcess);
  return (
    <div
      className={`absolute left-0 bottom-0 top-0 rounded-tl-theme rounded-bl-theme  bg-dark  w-[30%] flex flex-col   pl-3 py-6 text-white ${
        processing ? "cursor-not-allowed" : ""
      }`}
    >
      <div className=" flex items-center gap-x-2 mt-5 mb-10 ml-5">
        <img
          src={transaction_data?.merchant_logo}
          alt="logo"
          className="w-12"
        />
        <h3 className="text-sm font-bold">{transaction_data?.tradingname}</h3>
      </div>

      <div className="pl-3">
        <p className="text-white/60 font-semibold text-sm mb-3 ml-2">
          Make payment with:
        </p>

        <ul className="flex flex-col gap-y-4 pl-2 text-[#89B4CF] w-full ">
          {paymentChannels.map((paymentItem) => (
            <li
              key={paymentItem.id}
              onClick={() => {
                setActive(paymentItem);
                changePaymentOption(paymentItem.id);
              }}
              className={`flex paymentItems-center text-sm py-2 pl-6 cursor-pointer ${
                active.id === paymentItem.id
                  ? "bg-white/10 border-y border-l border-theme rounded-tl-theme rounded-bl-theme text-theme font-bold"
                  : "font-medium text-white"
              }`}
            >
              <ReactSVG
                src={paymentItem.icon}
                className="w-4"
                stroke={active === paymentItem.id ? "#27AE60" : ""}
              />
              <span className="ml-4">{paymentItem.name}</span>
            </li>
          ))}
          {/* {transaction_data?.paymentmethods?.map((item: string) => {
            const paymentItem = paymentChannels.find(({ id }) => id === item);
            if (paymentItem) {
              return (
                <li
                  key={paymentItem.id}
                  onClick={() => {
                    setActive(paymentItem);
                    changePaymentOption(paymentItem.id);
                  }}
                  className={`flex paymentItems-center text-sm py-2 pl-6 cursor-pointer ${
                    active.id === paymentItem.id
                      ? "bg-white/10 border-y border-l border-theme rounded-tl-theme rounded-bl-theme text-theme font-bold"
                      : "font-medium text-dark/50"
                  }`}
                >
                  <ReactSVG
                    src={paymentItem.icon}
                    className="w-4"
                    stroke={active === paymentItem.id ? "#27AE60" : ""}
                  />
                  <span className="ml-4">{paymentItem.name}</span>
                </li>
              );
            } else {
              return null;
            }
          })} */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
