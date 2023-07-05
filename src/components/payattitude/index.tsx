/* eslint-disable react-hooks/exhaustive-deps */
import { useState, Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  hide_error,
  setProcessing,
  setTransactionErrorMessage,
  show_error,
} from "src/redux/PaymentReducer";
import { create_payattitude_transaction, encrypt_data } from "src/api/utility";
import { charge } from "src/api";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import { SpinnerInline } from "../shared/Spinner";
import { validatePhone } from "src/utils";

const PayAttitude = () => {
  const dispatch = useAppDispatch();
  const transaction_data = useAppSelector((state) => state.payment.userPayload);
  const references = useAppSelector((state) => state.payment.references);
  const customer = useAppSelector(
    (state) => state.payment.userPayload?.source?.customer
  );
  const customColor = useAppSelector((state) => state.payment.customColor);
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  const { runTransaction } = useCustomFunctions();
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [err, setErr] = useState("");

  // handles phone input change
  const handleChangePhone = (e: any) => {
    const val = e.target.value;
    setPhoneNumber(validatePhone(val));
    setErr("");
  };
  // to get the transaction ussd code after selecting the bank
  const onGetPhoneAuth = () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      setErr("Please input a valid phone number");
      return;
    } else {
      setLoading(true);
      handleTransaction();
    }
  };
  // get transaction status at intervals
  const runInterval = () => {
    dispatch(setProcessing(true));
    setPaymentMade(true);
    const statusCheck = setInterval(async () => {
      try {
        await runTransaction();
      } catch {
        clearInterval(statusCheck);
      }
    }, 5000);
  };
  const handleTransaction = () => {
    dispatch(setProcessing(true));
    const {
      reference,
      redirecturl,
      amount,
      currency,
      country,
      paymentid,
      callbackurl,
      publickey,
      encryptpublickey,
    } = transaction_data;
    const { firstname, lastname, email, phone } = customer;
    const { fingerprint, modalref, paymentlinkref } = references;

    try {
      let data = create_payattitude_transaction(
        reference,
        callbackurl,
        redirecturl,
        amount,
        currency,
        country,
        firstname,
        lastname,
        email,
        phone,
        fingerprint,
        modalref,
        paymentlinkref,
        paymentid,
        phoneNumber
      );
      if (data === null || data === undefined) return;
      console.log({data})
      let request = encrypt_data(JSON.stringify(data), encryptpublickey);

      charge(transaction_data.paymentid, publickey, request)
        .then((response: any) => {
          console.log({ response });
          if (response.code === "09") {
            setShowCode(true);
            setLoading(false);
            return;
          }
          // dispatch(
          //   show_error({
          //     message: response?.data?.message || response?.message,
          //   })
          // );

          dispatch(
            setTransactionErrorMessage({
              message: response?.data?.message || response?.message,
            })
          );
          setLoading(false);
          dispatch(setProcessing(false));
        })
        .catch((error: any) => {
          console.log({ error });
          dispatch(
            show_error({
              message: error?.response?.data?.message || error?.message,
            })
          );
          setLoading(false);
          dispatch(setProcessing(false));
        });
    } catch (err: any) {
      console.log(err?.message);
      dispatch(setProcessing(false));
      setLoading(false);
    }
  };
  // hides all errors on load
  useEffect(() => {
    dispatch(hide_error());
  }, []);

  return (
    <>
      {/* {loading && <SpinnerInline lg />} */}
      {!showCode && (
        <div className="px-1 w-full">
          <p className="mb-5 text-sm font-semibold text-text/80">
            Please input your phone number to pay with phone
          </p>
          <div className="my-8">
            <input
              className="input w-full"
              value={phoneNumber}
              onChange={handleChangePhone}
            />
            {err && <p className="text-[10px] text-[#FF0000]">{err}</p>}
          </div>
          <div className=" my-6">
            <button
              onClick={onGetPhoneAuth}
              className="button w-full"
              disabled={loading}
              style={{
                backgroundColor: button_color ? button_color.value : "#27AE60",
              }}
            >
              {loading ? <SpinnerInline white /> : "Continue"}
            </button>
          </div>
        </div>
      )}
      {showCode && (
        <div className="">
          <p className="text-base  text-center mb-6 text-text/80 font-semibold">
            Please authenticate the payment with either your PayAttitude app,
            Bank app or USSD.
          </p>

          <div className=" my-8">
            <button
              className="button-outline w-full"
              onClick={runInterval}
              disabled={paymentMade}
              style={{
                borderColor: button_color ? button_color.value : "#27AE60",
                color: button_color ? button_color.value : "#27AE60",
              }}
            >
              {paymentMade ? <SpinnerInline /> : " I have made this payment"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PayAttitude;
