import React, { useEffect, useState } from "react";
// import { ReactComponent as Shield } from "../../assets/icons/shield.svg";
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

  const [cardName, setCardName] = useState("");
  const handlePay = () => {
    onRedirect();
  };

  const getCardType = (cardType: string) => {
    switch (true) {
      case cardType.toLowerCase().includes("mastercard"):
        setCardName("mc");
        return;
      case cardType.toLowerCase().includes("verve"):
        setCardName("verve");
        return;
      case cardType.toLowerCase().includes("visa"):
        setCardName("visa");
        return;
      case cardType.toLowerCase().includes("american express"):
        setCardName("amex");
        return;
      case cardType.toLowerCase().includes("afrigo"):
        setCardName("afrigo");
        return;

      default:
        break;
    }
  };

  useEffect(() => {
    if (cardType && typeof cardType === "string") {
      getCardType(cardType);
    }
  }, [cardType]);

  return (
    <div>
      <div className="flex items-center gap-x-2 divide-x-[1px] divide-gray-400 mb-4">
        <img
          src={`cards/${cardName.toLowerCase() || ""}.svg`}
          alt=" "
          className="w-12 "
        />
        <p className="text-sm pl-2">{bank}</p>
      </div>
      <p className="mb-6 font-semibold text-text/80 leading-5">
        You will be redirected to your card issuer's verification page to
        complete this transaction
      </p>

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
