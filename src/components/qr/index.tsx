import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useCustomFunctions from "src/hooks/useCustomFunctions";
import {
  hide_error,
  setProcessing,
  show_error,
} from "src/redux/PaymentReducer";
import { RootState } from "src/redux";
import { create_qr_transaction, encrypt_data } from "src/api/utility";
import { initiate_charge } from "src/api";
import QRCode from "react-qr-code";
import { SpinnerInline } from "../shared/Spinner";

const QRPayment = () => {
  const dispatch = useDispatch();
  const transaction_data = useSelector(
    (state: RootState) => state.payment.userPayload
  );
  const references = useSelector(
    (state: RootState) => state.payment.references
  );
  const customer = useSelector(
    (state: RootState) => state.payment.userPayload?.source?.customer
  );
  const customColor = useSelector(
    (state: RootState) => state.payment.customColor
  );
  const button_color = customColor.find(
    (item: any) => item.name === "button_color"
  );
  const { runTransaction } = useCustomFunctions();
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeAvailable, setQrCodeAvailable] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [paymentMade, setPaymentMade] = useState(false);

  // const [server, setServer] = useState({
  //   message: "",
  //   otp: "",
  //   linkingreference: "",
  //   reference: "",
  //   redirecturl: "",
  //   code: "",
  //   note: "",
  // });
  let statusCheck: any;

  // get transaction status at intervals
  const runInterval = () => {
    statusCheck = setInterval(async () => {
      try {
        await runTransaction();
      } catch {
        clearInterval(statusCheck);
      }
    }, 5000);
  };
  const onHandlePayment = () => {
    // clearInterval(timer.current);
    setPaymentMade(true);
    dispatch(setProcessing(true));
    runInterval();
  };

  const get_qr_code = () => {
    // setQrCode("nmjachbhufyfjgygfhejbavkygaydghbgdac");
    // setIsLoading(false);
    // setQrCodeAvailable(true);
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
    let data = create_qr_transaction(
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
      paymentid
    );
    let request = encrypt_data(JSON.stringify(data), encryptpublickey);
    initiate_charge(transaction_data.paymentid, publickey, request)
      .then((response: any) => {
        if (response.code === "09") {
          setQrCode(response.transaction.redirecturl);
          setQrCodeAvailable(true);
          setIsLoading(false);
          runInterval();
          return;
        }
        dispatch(show_error({ message: response.message }));
        setQrCodeAvailable(false);
        setIsLoading(false);
        // clearInterval(statusCheck);
      })
      .catch((err) => {
        let errMsg = err?.response?.data?.message || err?.message;
        console.log(err?.response);

        dispatch(show_error({ message: errMsg }));
        setQrCodeAvailable(false);
        setIsLoading(false);
        clearInterval(statusCheck);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(hide_error());
    setTimeout(() => {
      get_qr_code();
    }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isLoading && <SpinnerInline lg />}
      {!isLoading && !qrCodeAvailable && (
        <div>
          <h3 className="font-semibold text-text/80">
            Unable to get Qr Code, please try a different method
          </h3>
        </div>
      )}
      {!isLoading && qrCodeAvailable && (
        <div>
          <p className="text-sm text-center w-10/12 mx-auto font-semibold text-text/80 leading-5">
            Scan the QR Code below on your Bank’s mobile app to complete the
            payment
          </p>

          <div
            className={`max-w-[250px] max-h-[250px] w-[250px] h-[250px] mx-auto ${
              paymentMade ? "flex items-center justify-center" : "bg-theme/5"
            } rounded-theme p-3 mt-6 mb-11`}
          >
            {qrCode && !paymentMade && (
              <div className="bg-white rounded-theme ">
                <QRCode
                  value={qrCode}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                  size={225}
                  className="p-3 "
                />
              </div>
            )}

            {paymentMade === true && (
              <SpinnerInline
                lg
                withText
                text="Checking Transaction. Please wait ..."
              />
            )}
          </div>

          <div className=" my-8">
            {/* {paymentMade === true ? (
              <SpinnerInline
                lg
                withText
                text="Checking Transaction. Please wait ..."
              />
            ) : ( */}
            <button
              className={`button w-full `}
              onClick={onHandlePayment}
              style={{
                backgroundColor: paymentMade
                  ? "#E5E5E5"
                  : button_color
                  ? button_color.value
                  : "#27AE60",
              }}
              disabled={paymentMade}
            >
              I have made this payment
            </button>
            {/* )} */}
          </div>
        </div>
      )}
    </>
  );
};

export default QRPayment;
