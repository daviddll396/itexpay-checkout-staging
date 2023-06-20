// import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";

type PinProps = {
  pin: any;
  setPin: any;
  onContinue: () => void;
  message: string;
  back?: boolean;
  onGoBack?: () => void;
};
const PIN = ({
  pin,
  setPin,
  onContinue,
  message,
  back,
  onGoBack,
}: PinProps) => {
  const customColor = useSelector(
    (state: RootState) => state.payment.customColor
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  const { one, two, three, four } = pin;
  function getCodeBoxElement(index: number) {
    return document.getElementById("codeBox" + index) as HTMLInputElement;
  }
  function onKeyUpEvent(index: number, event: any) {
    const eventCode = event.which || event.keyCode;
    // const eventValue = event.target.value;
    // console.log(eventCode, eventValue);
    console.log(getCodeBoxElement(index).value, "val");
    if (getCodeBoxElement(index).value.length === 1) {
      if (index !== 4) {
        getCodeBoxElement(index + 1).focus();
      } else {
        getCodeBoxElement(index).blur();

        // Submit code
        // require_pin_change = false;
        // isLoading = true
        // main_charge_card();
      }
    }
    if (eventCode === 8 && index !== 1) {
      getCodeBoxElement(index - 1).focus();
    }
  }
  const handleOTPChange = (e: any) => {
    setPin({
      ...pin,
      [e.target.name]: e.target.value,
    });
  };
  function onFocusEvent(index: number) {
    for (let item = 1; item < index; item++) {
      const currentElement = getCodeBoxElement(item);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  const onCharge = () => {
    onContinue();
  };
  return (
    <div className="">
      {back && (
        <div
          onClick={onGoBack}
          className="flex items-center w-fit gap-x-1 text-[#979797] text-[11px] mb-4 cursor-pointer"
        >
          <ArrowLeft /> <span>Go back</span>
        </div>
      )}
      <p className="mb-12  font-semibold text-text/80">{message}</p>
      <div className=" flex items-center justify-center px-8 place-content-center">
        <input
          id="codeBox1"
          // type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(1, e)}
          onFocus={() => onFocusEvent(1)}
          onChange={(e) => handleOTPChange(e)}
          name="one"
          value={one}
          className="otp-input mr-3"
          placeholder="*"
        />
        <input
          id="codeBox2"
          // type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(2, e)}
          onFocus={() => onFocusEvent(2)}
          className="otp-input mr-3"
          value={two}
          name="two"
          onChange={(e) => handleOTPChange(e)}
          placeholder="*"
        />
        <input
          id="codeBox3"
          // type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(3, e)}
          onFocus={() => onFocusEvent(3)}
          className="otp-input mr-3"
          value={three}
          name="three"
          onChange={(e) => handleOTPChange(e)}
          placeholder="*"
        />
        <input
          id="codeBox4"
          // type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(4, e)}
          placeholder="*"
          onFocus={() => onFocusEvent(4)}
          className="otp-input mr-0"
          value={four}
          name="four"
          onChange={(e) => handleOTPChange(e)}
        />
      </div>

      <div className=" my-8">
        <button
          onClick={onCharge}
          className="button w-full"
          style={{
            backgroundColor: button_color ? button_color.value : "#27AE60",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PIN;
