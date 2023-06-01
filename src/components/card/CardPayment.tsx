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
import { encrypt_data } from "src/api/utility";

const CardPayment = () => {
  const [ccNumber, setCcNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardImg, setCardImg] = useState("");
  const [cardLogoUrl, setCardLogoUrl] = useState("");
  const [logo, setLogo] = useState(false);
  const [stage, setStage] = useState("card");

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
    // let request = encrypt_data(
    //   JSON.stringify(chargeOptionsReq),
    //   encryptpublickey
    // );
    // charge_options({
    //   paymentid: this.transaction_data.paymentid,
    //   key: publickey,
    //   request,
    // })
    //   .then((response) => {
    //     const { label } = response.config.formfields[0];
    //     // decide this.stage based on response 3ds or pin
    //     if (label === "3DS") {
    //       this.main_charge_card();
    //     } else {
    //       this.stage = "pin";
    //       this.card.pin = {
    //         one: "",
    //         two: "",
    //         three: "",
    //         four: "",
    //       };
    //     }
    //   })
    //   .catch((error) => {
    //     const { message } = error;
    //     this.$store.commit("show_error", { message: message });
    //   })
    //   .finally(() => {
    //     this.isLoading = false;
    //   });

    setStage("3ds");
  };
  useEffect(() => {
    getCardImg(ccNumber);
  }, [ccNumber]);

  useEffect(() => {
    setCardLogoUrl(`cards/${cardImg}.svg`);
  }, [cardImg]);

  return (
    <div className="">
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
      {stage === "3ds" && <ThreeDS />}
    </div>
  );
};

export default CardPayment;
