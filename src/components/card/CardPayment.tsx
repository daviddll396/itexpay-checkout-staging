import { useState, useEffect } from "react";
import { ReactComponent as CardEmptyIcon } from "../../assets/icons/card-empty.svg";
import { ReactComponent as ExpiryIcon } from "../../assets/icons/expiry.svg";
import { ReactComponent as CVVIcon } from "../../assets/icons/cvv.svg";
import {
  formatAndSetCcNumber,
  validateCVVNumber,
  validateExpiryDate,
} from "../../utils";
import PIN from "../pin";
import ThreeDS from "../3ds";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { encrypt_data } from "src/api/utility";
import { charge_options } from "src/api";
import { create_card_transaction } from "src/api/utility";
import { charge } from "src/api";
import OTP from "../otp";
import useCustomFunctions from "../../hooks/useCustomFunctions";
import {
  hide_error,
  setProcessing,
  setTransactionErrorMessage,
  show_error,
} from "src/redux/PaymentReducer";
import { SpinnerInline } from "../shared/Spinner";
import { create_otp_transaction } from "src/api/utility";
import { validate_otp } from "src/api";
import ThreeDSModal from "./3ds-modal";
import Enroll from "../enroll";

const CardPayment = () => {
  const transaction_data = useAppSelector((state) => state.payment.userPayload);
  const customer = useAppSelector(
    (state) => state.payment.userPayload?.source?.customer
  );
  const references = useAppSelector((state) => state.payment.references);
  const customColor = useAppSelector((state) => state.payment.customColor);
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  // const processing =  useAppSelector((state ) => state.payment.inProcess);
  const dispatch = useAppDispatch();
  const { sendEvent, runTransaction, success, openUrl } = useCustomFunctions();
  const [ccNumber, setCcNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [authOption, setAuthOption] = useState("3DS");
  const [expiry, setExpiry] = useState("");
  const [cardImg, setCardImg] = useState("");
  const [cardLogoUrl, setCardLogoUrl] = useState("");
  const [logo, setLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("card");
  const [pin, setPin] = useState<any>({
    one: "",
    two: "",
    three: "",
    four: "",
  });
  const [otp, setOtp] = useState("");
  const [server, setServer] = useState({
    message: "",
    otp: "",
    linkingreference: "",
    reference: "",
    redirecturl: "",
    code: "",
    note: "",
    card_type: "",
    bank: "",
  });

  const handleChange = (e: any, change: string) => {
    let val = e.target.value;
    if (change === "cc") {
      setCcNumber(formatAndSetCcNumber(val));
    }
    if (change === "expiry") {
      setExpiry(validateExpiryDate(val));
    }
    if (change === "cvv") {
      setCvv(validateCVVNumber(val));
    }
  };
  const getCardImg = (ccNumber: string) => {
    const cardNumber = ccNumber.replace(/ /g, "");
    if (cardNumber === "") {
      setCardImg("");
    }
    let amex = new RegExp("^3[0-9]{17}$");
    let visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
    let verve = /^(?:50[067][180]|6500)(?:[0-9]{15})$/;
    let mastercard = new RegExp("^5[1-5][0-9]{14}$");
    let mastercard2 = new RegExp("^2[2-7][0-9]{14}$");
    let afrigo = new RegExp("^564[0-9]{18}$");

    if (visa.test(cardNumber)) {
      setCardImg("visa");
      setLogo(true);
      return;
    }
    if (amex.test(cardNumber)) {
      setCardImg("amex");
      setLogo(true);
      return;
    }
    if (verve.test(cardNumber)) {
      setCardImg("verve");
      setLogo(true);
      return;
    }
    if (afrigo.test(cardNumber)) {
      setCardImg("afrigo");
      setLogo(true);
      return;
    }
    if (mastercard.test(cardNumber) || mastercard2.test(cardNumber)) {
      // console.log("mchere");
      setCardImg("mc");
      setLogo(true);
      return;
    } else {
      setCardImg("");
      setLogo(false);
    }
  };
  const handleCardDetails = () => {
    if (!ccNumber || !expiry || !cvv) {
      alert("Please input all fields");
      return;
    }
    const cardNumberCorrect = /^\d+$/.test(ccNumber.replace(/\s/g, ""));
    if (!cardNumberCorrect) {
      //error message
      // this.$store.commit("show_error", { message: "Invalid card number" });
      return;
    }
    const expiryCorrect = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry);
    if (!expiryCorrect) {
      //error message
      // this.$store.commit("show_error", { message: "Invalid expiry date" });
      return;
    }
    const cvvCorrect = /^[0-9]{3}$/.test(cvv);
    if (!cvvCorrect) {
      //error message
      // this.$store.commit("show_error", { message: "Invalid CVV" });

      return;
    }
    // handleRedirect();
    onVerifyCardDetails();
  };
  const onVerifyCardDetails = () => {
    dispatch(hide_error());
    dispatch(setProcessing(true));
    setLoading(true);
    const chargeOptionsReq = {
      transaction: {
        paymentmethod: "card",
      },
      source: {
        customer: {
          card: {
            first6: ccNumber.replace(/\s/g, ""),
          },
        },
      },
    };
    let request = encrypt_data(
      JSON.stringify(chargeOptionsReq),
      transaction_data?.encryptpublickey
    );
    charge_options({
      paymentid: transaction_data.paymentid,
      key: transaction_data.publickey,
      request,
    })
      .then((response: any) => {
        const { label = null } = response.config.formfields[0];
        if (!label) {
          dispatch(show_error({ message: "Invalid card number" }));
          setCvv("");
          setExpiry("");
          setLoading(false);
          dispatch(setProcessing(false));
          return;
        }
        // decide this.stage based on response 3ds or pin
        setAuthOption(label);
        if (label && ["3DS", "NOAUTH"].includes(label)) {
          main_charge_card();
        } else if (label && label === "PIN") {
          setStage("pin");
          setLoading(false);
        } else {
          dispatch(
            show_error({ message: "Invalid card number, try a different card" })
          );
          setCvv("");
          setExpiry("");
          setLoading(false);
          dispatch(setProcessing(false));
          setLoading(false);
        }
      })
      .catch((error) => {
        let errMsg = error?.response?.data?.message || error?.message;
        console.log({ errMsg });
        dispatch(
          show_error({ message: "Invalid card number, try a different card" })
        );
        setCvv("");
        setExpiry("");
        setLoading(false);
        dispatch(setProcessing(false));
        setLoading(false);
      });
  };
  const main_charge_card = () => {
    setLoading(true);
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
      // customer: { firstname, lastname, email, phone },
    } = transaction_data;
    const { firstname, lastname, email, phone } = customer;
    const { fingerprint, modalref, paymentlinkref } = references;
    try {
      let data = create_card_transaction(
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
        {
          pan: ccNumber.replace(/\s/g, ""),
          cvv: cvv,
          expiry: expiry,
          pin: {
            one: pin.one === "" ? null : pin.one,
            two: pin.two === "" ? null : pin.two,
            three: pin.three === "" ? null : pin.three,
            four: pin.four === "" ? null : pin.four,
          },
        },
        fingerprint,
        modalref,
        paymentlinkref,
        paymentid,
        authOption
      );
      if (data === null || data === undefined) return;
      let request = encrypt_data(JSON.stringify(data), encryptpublickey);

      charge(transaction_data.paymentid, publickey, request)
        .then((response: any) => {
          if (response.code === "00") {
            success(response, "success");
            setStage("card");
            setCcNumber("");
            setCvv("");
            setExpiry("");
            setPin({
              one: "",
              two: "",
              three: "",
              four: "",
            });
            setLoading(false);
            dispatch(setProcessing(false));
          }

          if (
            response.code === "09" &&
            response.message ===
            "Payment option unavailable, kindly try another payment option"
          ) {
            dispatch(
              show_error({
                message: response?.message || response.message,
              })
            );
            setStage("card");
            setCvv("");
            setExpiry("");
            setPin({
              one: "",
              two: "",
              three: "",
              four: "",
            });
            setLoading(false);
            dispatch(setProcessing(false));
            return;
          }

          setServer({
            ...server,
            message: response?.message,
            linkingreference: response.transaction.linkingreference,
            reference: response?.transaction?.reference,
            redirecturl: response?.transaction?.redirecturl,
            card_type: response?.source?.customer?.card?.bindata?.cardtype,
            bank: response?.source?.customer?.card?.bindata?.coyname,
          });

          if (response.code === "09") {
            if (response.note !== null && response.note !== undefined && response.note === "OTPENROLL") {
              setStage("enroll");
            } else {
              setStage("otp");
            }
            setLoading(false);
            return;
          }
          if (response.code === "09-REDIRECT") {
            setStage("3ds");
            setLoading(false);
            return;
          }
          setStage("card");
          setCvv("");
          setExpiry("");
          setPin({
            one: "",
            two: "",
            three: "",
            four: "",
          });
          dispatch(
            setTransactionErrorMessage({
              message: response?.data?.message || response?.message,
            })
          );
          setLoading(false);
          dispatch(setProcessing(false));
        })
        .catch((error: any) => {
          setStage("card");
          setCvv("");
          setExpiry("");
          setPin({
            one: "",
            two: "",
            three: "",
            four: "",
          });
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
  // handle redirect to 3ds
  const handleRedirect = async () => {
    // send redirect event
    sendEvent({
      type: "redirect",
      activity: "3DS redirect initialized",
    });
    setStage("processing");
    // dispatch(setThreeDSModal(true));
    // start polling
    openUrl(server.redirecturl);
    runInterval();
  };
  const start_card_otp_enrollment = () => {
    // console.log(otp);
    // send otp event
    sendEvent({ type: "otp", activity: "OTP sent" });
    const { paymentid, publickey, encryptpublickey } = transaction_data;
    // evt.preventDefault();
    dispatch(hide_error());
    setLoading(true);
    let data = create_otp_transaction(otp, paymentid);
    let request = encrypt_data(JSON.stringify(data), encryptpublickey);
    validate_otp(transaction_data.paymentid, publickey, request)
      .then((response: any) => {
        const { code } = response;
        // if response is palatable, update success state
        if (code !== "09") {
          if (code === "00") {
            success(response, "success");
          } else {
            success(response, "failed");
            setStage("card");
            setCcNumber("");
            setCvv("");
            setExpiry("");
            setPin({
              one: "",
              two: "",
              three: "",
              four: "",
            });
            setLoading(false);
            dispatch(setProcessing(false));
          }
          setLoading(false);
          return;
        }
      })
      .catch((error) => {
        setStage("card");
        setCvv("");
        setPin({
          one: "",
          two: "",
          three: "",
          four: "",
        });
        setLoading(false);
        dispatch(setProcessing(false));
        console.log(error);
      });
  };
  // start card otp verification
  const start_card_otp_verification = () => {
    // console.log(otp);
    // send otp event
    sendEvent({ type: "otp", activity: "OTP sent" });
    const { paymentid, publickey, encryptpublickey } = transaction_data;
    // evt.preventDefault();
    dispatch(hide_error());
    setLoading(true);
    let data = create_otp_transaction(otp, paymentid);
    let request = encrypt_data(JSON.stringify(data), encryptpublickey);
    validate_otp(transaction_data.paymentid, publickey, request)
      .then((response: any) => {
        const { code } = response;
        // if response is palatable, update success state
        if (code !== "09") {
          if (code === "00") {
            success(response, "success");
          } else {
            success(response, "failed");
            setStage("card");
            setCcNumber("");
            setCvv("");
            setExpiry("");
            setPin({
              one: "",
              two: "",
              three: "",
              four: "",
            });
            setLoading(false);
            dispatch(setProcessing(false));
          }
          setLoading(false);
          return;
        }
      })
      .catch((error) => {
        setStage("card");
        setCvv("");
        setPin({
          one: "",
          two: "",
          three: "",
          four: "",
        });
        setLoading(false);
        dispatch(setProcessing(false));
        console.log(error);
      });
  };
  // start polling
  const runInterval = () => {
    const statusCheck = setInterval(async () => {
      try {
        const result = await runTransaction();
        if (result === "success") {
          clearInterval(statusCheck);
        }
      } catch {
        clearInterval(statusCheck);
      }
    }, 5000);
  };
  useEffect(() => {
    getCardImg(ccNumber);
  }, [ccNumber]);

  useEffect(() => {
    setCardLogoUrl(`cards/${cardImg}.svg`);
  }, [cardImg]);

  return (
    <>
      <div className="relative w-full">
        {stage === "processing" && (
          <div className="w-full flex justify-center">
            <SpinnerInline md withText text="Transaction processing...." />
          </div>
        )}
        {stage === "card" && (
          <div className="switch:px-5">
            <h4 className="font-bold text-base text-title mb-6">
              Enter Payment Details
            </h4>
            <div className="grid grid-cols-2 gap-5 ">
              <div className="col-span-2">
                <label className="label">Card Number</label>
                <div className="relative z-[1]">
                  {cardImg && logo ? (
                    <img src={cardLogoUrl || ""} alt=" " className="icon h-6" />
                  ) : (
                    <CardEmptyIcon className="icon h-6" stroke="#B9B9B9" />
                  )}
                  <input
                    className="input_icon w-full"
                    placeholder="1234  5789  1234  5472"
                    value={ccNumber}
                    onChange={(e) => handleChange(e, "cc")}
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
                    onChange={(e) => {
                      handleChange(e, "expiry");
                    }}
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
                    onChange={(e) => {
                      handleChange(e, "cvv");
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2 my-8">
                <button
                  className="button w-full"
                  onClick={handleCardDetails}
                  style={{
                    backgroundColor: button_color
                      ? button_color.value
                      : "#27AE60",
                  }}
                  disabled={loading}
                >
                  {loading ? <SpinnerInline white /> : " Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
        {stage === "pin" && (
          <PIN
            pin={pin}
            setPin={setPin}
            onContinue={main_charge_card}
            message="Enter your 4-digit card PIN to complete this transaction"
            loading={loading}
          />
        )}
        {stage === "otp" && (
          <OTP
            message={server.message}
            value={otp}
            setValue={setOtp}
            onVerifyOTP={start_card_otp_verification}
            buttonText="Pay Now"
            loading={loading}
          />
        )}
        {stage === "enroll" && (
          <Enroll
            message={server.message}
            value={otp}
            setValue={setOtp}
            onVerifyEnroll={start_card_otp_verification}
            buttonText="Continue"
            loading={loading}
          />
        )}
        {stage === "3ds" && (
          <ThreeDS
            onRedirect={handleRedirect}
            cardType={server.card_type}
            bank={server.bank}
          />
        )}
      </div>
      <ThreeDSModal src={server.redirecturl} />
    </>
  );
};

export default CardPayment;
