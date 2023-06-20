/* eslint-disable react-hooks/exhaustive-deps */
import { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/redux";
import {
  hide_error,
  setProcessing,
  show_error,
} from "src/redux/PaymentReducer";
import { create_ussd_transaction, encrypt_data } from "src/api/utility";
import { charge } from "src/api";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import { SpinnerInline } from "../shared/Spinner";

const PayAttitude = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const references = useSelector(
    (state: RootState) => state.payment.references
  );
  const customColor = useSelector(
    (state: RootState) => state.payment.customColor
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  const { runTransaction } = useCustomFunctions();
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");

  // to get the transaction ussd code after selecting the bank
  const onGetPhoneAuth = () => {
    setLoading(true);
    if (!phone || phone.length < 11) {
      setErr("Please input a valid phone number");
      return;
    } else {
        setLoading(true)
    }
  };

  // get transaction status at intervals
  const runInterval = () => {
    const statusCheck = setInterval(async () => {
      try {
        await runTransaction();
      } catch {
        clearInterval(statusCheck);
      }
    }, 5000);
  };

  // hides all errors on load
  useEffect(() => {
    dispatch(hide_error());
  }, []);

  return (
    <>
      {/* {loading && <SpinnerInline lg />} */}
      {!showCode && (
        <div className="px-1">
          <p className="mb-5 text-sm font-medium text-text/80">
            Please input your phone number{}
          </p>
          <div className="">
            <input className="" value={phone} />
            {err && <p className="text-[10px] text-[#FF0000]">{err}</p>}
          </div>
          <div className=" my-6">
            <button
              onClick={onGetPhoneAuth}
              className="button w-full"
              disabled={loading}
            >
              {loading ? <SpinnerInline white /> : "Continue"}
            </button>
          </div>
        </div>
      )}
      {showCode && !paymentMade && (
        <div className="">
          <p className="text-base w-4/6 mx-auto text-center mb-6 text-text/80 font-semibold">
            Please authenticate the payment with either your PayAttitude app,
            Bank app or USSD.
          </p>
          <div className="bg-theme/10 w-fit mx-auto py-1.5 px-5 rounded-3xl flex items-center gap-x-2 mb-6"></div>

          <div className=" my-8">
            {paymentMade ? (
              <SpinnerInline
                lg
                withText
                text="Checking Transaction. Please wait ..."
              />
            ) : (
              <button
                className="button w-full"
                onClick={runInterval}
                style={{
                  borderColor: button_color ? button_color.value : "#27AE60",
                  color: button_color ? button_color.value : "#27AE60",
                }}
              >
                I have made this payment
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PayAttitude;
