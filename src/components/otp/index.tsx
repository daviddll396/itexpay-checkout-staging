import { validateOTP } from "src/utils";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";

type OTPProps = {
  value: any;
  setValue: any;
  onVerifyOTP: () => void;
  message: string;
  buttonText: string;
  back?: boolean;
  onGoBack?: () => void;
};

const OTP = ({
  value,
  setValue,
  onVerifyOTP,
  message,
  buttonText,
  back,
  onGoBack,
}: OTPProps) => {
  const customColor = useSelector(
    (state: RootState) => state.payment.customColor
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );

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
      {back && (
        <div
          onClick={onGoBack}
          className="flex items-center w-fit gap-x-1 text-[#979797] text-[11px] mb-4 cursor-pointer"
        >
          <ArrowLeft /> <span>Go back</span>
        </div>
      )}
      <div className="text-center">
        <label className="block mb-4 pl-3 font-semibold text-text/80">
          {message}
        </label>
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
          <button
            onClick={handlePay}
            className="button w-full"
            style={{
              backgroundColor: button_color ? button_color.value : "#27AE60",
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTP;
