import { validateOTP } from "src/utils";
import { useAppSelector } from "src/redux/hooks";
import { ReactComponent as ArrowLeft } from "../../assets/icons/caret-left.svg";
import { SpinnerInline } from "../shared/Spinner";

type OTPProps = {
  value: any;
  setValue: any;
  onVerifyOTP: () => void;
  message: string;
  buttonText: string;
  back?: boolean;
  onGoBack?: () => void;
  loading: boolean;
};

const OTP = ({
  value,
  setValue,
  onVerifyOTP,
  message,
  buttonText,
  back,
  onGoBack,
  loading,
}: OTPProps) => {
  const customColor = useAppSelector((state) => state.payment.customColor);
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
      {back && !loading && (
        <div
          onClick={onGoBack}
          className="flex items-center flex-nowrap w-fit gap-x-1 text-[#979797] text-[11px] mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4" />{" "}
          <span className="whitespace-nowrap">Go back</span>
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
        />
        <div className="my-8">
          <button
            className="button w-full"
            onClick={handlePay}
            style={{
              backgroundColor: button_color ? button_color.value : "#27AE60",
            }}
            disabled={loading}
          >
            {loading ? <SpinnerInline white /> : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTP;
