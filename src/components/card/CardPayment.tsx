import React, { useState } from "react";
import { ReactComponent as CardEmptyIcon } from "../../assets/icons/card-empty.svg";
import { ReactComponent as ExpiryIcon } from "../../assets/icons/expiry.svg";
import { ReactComponent as CVVIcon } from "../../assets/icons/cvv.svg";
import { formatAndSetCcNumber, validateCVVNumber } from "../../utils";

const CardPayment = () => {
  const [ccNumber, setCcNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const handleChange = (e: any) => {
    let val = e.target.value;

    setCcNumber(formatAndSetCcNumber(val));
  };

  const handlerChange2 = (e: any) => {
    let val = e.target.value;
    setExpiry(val);
  };
  const handlerChange3 = (e: any) => {
    let val = e.target.value;
    setCvv(val);
  };
  return (
    <div className="  ">
      <h4 className="font-medium text-base text-title mb-6">
        Enter Payment Details
      </h4>

      <div className="grid grid-cols-2 gap-5 ">
        <div className="col-span-2">
          <label className="label">Card Number</label>
          <div className="relative z-[1]">
            <CardEmptyIcon className="icon h-6" stroke="#B9B9B9" />
            <input
              className="input_icon w-full"
              placeholder="1234  5789  1234  5472"
              value={ccNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-span-1">
          <label className="label">Expiry Date</label>
          <div className="relative z-[1]">
            <ExpiryIcon
              className="icon h-6"
              stroke={expiry === "" ? "#B9B9B9" : " #041926"}
              strokeWidth={0.7}
            />
            <input
              className="input_icon w-full"
              placeholder="12/24"
              value={expiry}
              onChange={handlerChange2}
            />
          </div>
        </div>
        <div className="col-span-1">
          <label className="label">CVV</label>
          <div className="relative z-[1]">
            <CVVIcon
              className="icon h-6"
              stroke={cvv !== "" ? "#041926" : "#B9B9B9"}
              strokeWidth={0.7}
            />
            <input
              className="input_icon w-full"
              placeholder="123"
              value={cvv}
              onChange={handlerChange3}
            />
          </div>
        </div>
        <div className="col-span-2 my-8">
          <button className="button w-full">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;
