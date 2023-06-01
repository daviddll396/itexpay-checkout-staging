import { useState } from "react";

const PIN = () => {
  const [otpValue, setOtpValue] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
  });
  const [pin, setPin] = useState<any>("");
  const { one, two, three, four } = otpValue;
  function getCodeBoxElement(index: number) {
    return document.getElementById("codeBox" + index) as HTMLInputElement;
  }
  function onKeyUpEvent(index: number, event: any) {
    const eventCode = event.which || event.keyCode;
    const eventValue = event.target.value;
    console.log(eventCode, eventValue);
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
    setOtpValue({
      ...otpValue,
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
  return (
    <div className="">
      <p className="mb-12">
        Enter your 4-digit card PIN to complete this transaction
      </p>
      <div className=" flex items-center justify-center px-8 place-content-center">
        <input
          id="codeBox1"
          type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(1, e)}
          onFocus={() => onFocusEvent(1)}
          onChange={(e) => handleOTPChange(e)}
          name="one"
          value={one}
          className="otp-input mr-3"
        />
        <input
          id="codeBox2"
          type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(2, e)}
          onFocus={() => onFocusEvent(2)}
          className="otp-input mr-3"
          value={two}
          name="two"
          onChange={(e) => handleOTPChange(e)}
        />
        <input
          id="codeBox3"
          type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(3, e)}
          onFocus={() => onFocusEvent(3)}
          className="otp-input mr-3"
          value={three}
          name="three"
          onChange={(e) => handleOTPChange(e)}
        />
        <input
          id="codeBox4"
          type="password"
          maxLength={1}
          onKeyUp={(e) => onKeyUpEvent(4, e)}
          onFocus={() => onFocusEvent(4)}
          className="otp-input mr-0"
          value={four}
          name="four"
          onChange={(e) => handleOTPChange(e)}
        />
        {/* <input id="codeBox2" type="password" maxLength={1} @keyup="onKeyUpEvent(2, $event)" @focus="onFocusEvent(2)"
            v-model="card.pin.two" />
          <input id="codeBox3" type="password" maxLength={1} @keyup="onKeyUpEvent(3, $event)" @focus="onFocusEvent(3)"
            v-model="card.pin.three" />
          <input id="codeBox4" type="password" maxLength={1} @keyup="onKeyUpEvent(4, $event)" @focus="onFocusEvent(4)"
            v-model="card.pin.four" /> */}
      </div>
    </div>
  );
};

export default PIN;
