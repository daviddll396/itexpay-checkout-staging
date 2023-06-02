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
// import Spinner from "../shared/Spinner";
import ThreeDS from "../3ds";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/redux";
import { encrypt_data } from "src/api/utility";
import { charge_options } from "src/api";
import { create_card_transaction } from "src/api/utility";
import { charge } from "src/api";
import OTP from "../otp";
import useCustomFunctions from "../../hooks/useCustomFunctions";
import { hide_error } from "src/redux/PaymentReducer";
import Spinner from "../shared/Spinner";

const CardPayment = () => {
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const references = useSelector(
    (state: RootState) => state.payment.references
  );
  const dispatch = useDispatch();
  const { sendEvent, runTransaction, openUrl } = useCustomFunctions();

  const [ccNumber, setCcNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardImg, setCardImg] = useState("");
  const [cardLogoUrl, setCardLogoUrl] = useState("");
  const [logo, setLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState("card");
  const [server, setServer] = useState({
    message: "",
    otp: "",
    linkingreference: "",
    reference: "",
    redirecturl: "",
    code: "",
    note: "",
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
    let afrigo = new RegExp("^564[0-9]{13}$");

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
      console.log("mchere");
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

    onVerifyCardDetails();
  };
  const onVerifyCardDetails = () => {
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
        const { label } = response.config.formfields[0];
        // decide this.stage based on response 3ds or pin
        if (label === "3DS") {
          main_charge_card();
        } else {
          setStage("pin");
        }
      })
      .catch((error) => {
        console.log(error.response);
        // const { message } = error;
        // this.$store.commit("show_error", { message: message });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const main_charge_card = () => {
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
      customer: { firstname, lastname, email, phone },
    } = transaction_data;
    // const { firstname, lastname, email, phone } = this.customer;
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
            one: null,
            two: null,
            three: null,
            four: null,
          },
        },
        fingerprint,
        modalref,
        paymentlinkref,
        paymentid
      );
      console.log(data, "card data");
      if (data === null || data === undefined) return;
      setLoading(true);
      //get the card type
      // let cardType = card_type(this.card.pan);
      let request = encrypt_data(JSON.stringify(data), encryptpublickey);

      charge(transaction_data.paymentid, publickey, request)
        .then((response: any) => {
          setLoading(false);
          setServer({
            ...server,
            message: response?.message,
            linkingreference: response.transaction.linkingreference,
            reference: response?.transaction?.reference,
            redirecturl: response?.transaction?.redirecturl,
          });

          if (response.code === "09") {
            setStage("otp");
            return;
          }
          if (response.code === "09-REDIRECT") {
            // this.stage = "3ds";
            setStage("3ds");
            return;
          }
          setStage("card");
          setCvv("");
          setExpiry("");
          //     this.$store.commit("show_error", { message: response.message });
        })
        .catch((error) => {
          setStage("card");
          setCvv("");
          setExpiry("");
          //     this.$store.commit("show_error", { message: message });
        });
    } catch (err) {
      setLoading(false);
    }
  };
  const handleRedirect = async () => {
    // send redirect event
    sendEvent({
      type: "redirect",
      activity: "3DS redirect initialized",
    });
    setStage("3dsProcessing");
    // start polling
    openUrl(server.redirecturl);
    window.open(server.redirecturl, "_blank");
    // runInterval();
    setProcessing(true);
  };
  // const runInterval = () => {
  //   statusCheck = setInterval(async () => {
  //     try {
  //       await runTransaction();
  //     } catch (error) {
  //       setLoading(false);
  //       clearInterval();
  //       setStage("card");
  //     }
  //   }, 5000);
  // };

  const isProcessing = processing === true;

  useEffect(() => {
    const statusCheck = setInterval(async () => {
      try {
        await runTransaction();
      } catch (error) {
        setLoading(false);
        clearInterval(statusCheck);
        setStage("card");
      }
    }, 5000);

    return () => {
      clearInterval(statusCheck);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing]);
  useEffect(() => {
    dispatch(hide_error())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  useEffect(() => {
    getCardImg(ccNumber);
  }, [ccNumber]);

  useEffect(() => {
    setCardLogoUrl(`cards/${cardImg}.svg`);
  }, [cardImg]);

  return (
    <div className="">
      {loading && <Spinner lg/>}
      {(stage === "card" || stage === "processing") && (
        <div className="switch:px-5">
          <h4 className="font-bold text-base text-title mb-6">
            Enter Payment Details
          </h4>
          <div className="grid grid-cols-2 gap-5 ">
            <div className="col-span-2">
              <label className="label">Card Number</label>
              <div className="relative z-[1]">
                {cardImg && logo ? (
                  <img src={cardLogoUrl || ""} alt="" className="icon h-6" />
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
              <button onClick={handleCardDetails} className="button w-full">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {stage === "pin" && <PIN />}
      {stage === "otp" && <OTP />}
      {stage === "3ds" && <ThreeDS onRedirect={handleRedirect} />}
    </div>
  );
};

export default CardPayment;
