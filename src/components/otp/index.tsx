import { useState } from "react";
import { validateOTP } from "src/utils";

const OTP = () => {
  const [value, setValue] = useState("");
  const handleChange = (e: any) => {
    setValue(validateOTP(e.target.value));
  };
  const handlePay = () => {
    alert(value);
  };
  return (
    <div>
    <div className="text-center">
      <label className="block mb-4 pl-3">
        Enter your <strong className="text-theme">OTP</strong> below:
      </label>
      <input
        className="bg-theme/10 rounded-[60px] text-2xl py-3 px-6 focus:outline-none text-theme font-bold  caret-theme text-center"
        value={value}
        onChange={handleChange}
      />

      <div className=" my-8">
        <button onClick={handlePay} className="button w-full">
          Pay Now
        </button>
      </div>
    </div></div>
  );
};

export default OTP;
