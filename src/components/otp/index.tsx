import { validateOTP } from "src/utils";

type OTPProps = {
  value: any;
  setValue: any;
  onVerifyOTP: () => void;
  message: string;
};

const OTP = ({ value, setValue, onVerifyOTP, message }: OTPProps) => {
  // handle otp value change
  const handleChange = (e: any) => {
    setValue(validateOTP(e.target.value));
  };
  // call otp verification endpoint
  const handlePay = () => {
    onVerifyOTP();
  };

  return (
    <div>
      <div className="text-center">
        <label className="block mb-4 pl-3 font-semibold text-text/80">{message}</label>
        <input
          className="input text-center placeholder:text-center text-xl"
          value={value}
          onChange={handleChange}
          autoFocus
          placeholder="0 0 0 0 0 0"
          // ref={inputRef}
        />
        {/* <input
          className="bg-theme/10 rounded-[60px] text-2xl py-3 px-6 focus:outline-none text-theme font-bold  caret-theme text-center"
          value={value}
          onChange={handleChange}
        /> */}

        <div className=" my-8">
          <button onClick={handlePay} className="button w-full">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTP;
