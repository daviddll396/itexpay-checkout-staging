import React from "react";
import { ReactComponent as Shield } from "../../assets/icons/shield.svg";
import { useAppSelector } from "src/redux/hooks";

const ThreeDS = ({
  onRedirect,
  cardType,
  bank,
}: {
  onRedirect: () => void;
  bank: string;
  cardType: string;
}) => {
  const customColor = useAppSelector((state) => state.payment.customColor);
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  const handlePay = () => {
    onRedirect();
  };
  return (
    <div>
      <div className="text-center mb-4">
        <Shield className="w-12 h-12 text-theme mx-auto" />
      </div>
      <p className="mb-6 font-semibold text-text/80 leading-5">
        You will be redirected to your card issuer's verification page to
        complete this transaction
      </p>
      <div className="flex items-center gap-x-2 divide-x-[1px] divide-gray-400">
        <img
          src={`cards/${cardType.toLowerCase() || ""}.svg`}
          alt=" "
          className="w-12 "
        />
        <p className="text-sm pl-2">{bank}</p>
      </div>
      <div className=" my-6">
        <button
          onClick={handlePay}
          className="button-outline w-full text-3xl"
          style={{
            borderColor: button_color ? button_color.value : "#27AE60",
            color: button_color ? button_color.value : "#27AE60",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ThreeDS;
